import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { TimeSeriesDataPoint } from '../../../types/chart';
import { Tooltip, TooltipData } from '../../base/tooltip/tooltip';

export interface LineChartConfig {
  showGrid?: boolean;
  showPoints?: boolean;
  showArea?: boolean;
  curved?: boolean;
  animated?: boolean;
  colors?: string[];
  lineWidth?: number;
  multiSeries?: boolean;
  customTooltip?: (data: { date: Date; value: number; seriesName?: string; }) => { title?: string; items: Array<{ label: string; value: string | number; color?: string; }>; };
}

@Component({
  selector: 'app-line',
  standalone: true,
  imports: [Tooltip],
  templateUrl: './line.html',
  styleUrl: './line.css',
})
export class Line implements OnInit, OnChanges {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) { }

  @Input() data: TimeSeriesDataPoint[] | Record<string, TimeSeriesDataPoint[]> = [];
  @Input() width: number = 800;
  @Input() height: number = 500;
  @Input() config: LineChartConfig = {};

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private chartGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private margin = { top: 40, right: 40, bottom: 60, left: 60 };
  private innerWidth!: number;
  private innerHeight!: number;

  tooltipData: TooltipData[] = [];
  tooltipX: number = 0;
  tooltipY: number = 0;
  tooltipVisible: boolean = false;
  tooltipTitle: string = '';

  ngOnInit(): void {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['width'] || changes['height'] || changes['config']) {
      if (this.svg) {
        this.updateChart();
      }
    }
  }

  private initializeChart(): void {
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;

    const container = d3.select(this.chartContainer.nativeElement);
    container.selectAll('*').remove();

    this.svg = container
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'line-chart-svg')
      .style('overflow', 'visible');

    this.addDefs();

    this.chartGroup = this.svg
      .append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.updateChart();
  }

  private addDefs(): void {
    const defs = this.svg.append('defs');

    const areaGradient = defs.append('linearGradient')
      .attr('id', 'line-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'var(--color-primary)')
      .attr('stop-opacity', 0.4);

    areaGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'var(--color-primary)')
      .attr('stop-opacity', 0);

    const glow = defs.append('filter')
      .attr('id', 'line-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    glow.append('feGaussianBlur')
      .attr('stdDeviation', 3)
      .attr('result', 'coloredBlur');

    const glowMerge = glow.append('feMerge');
    glowMerge.append('feMergeNode').attr('in', 'coloredBlur');
    glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  }

  private updateChart(): void {
    if (!this.data || (Array.isArray(this.data) && this.data.length === 0)) return;

    this.chartGroup.selectAll('*').remove();

    const isMultiSeries = !Array.isArray(this.data);
    const seriesData: Record<string, TimeSeriesDataPoint[]> = isMultiSeries
      ? this.data as Record<string, TimeSeriesDataPoint[]>
      : { 'Series 1': this.data as TimeSeriesDataPoint[] };

    const allData = Object.values(seriesData).flat();

    const xScale = d3.scaleTime()
      .domain(d3.extent(allData, d => d.date) as [Date, Date])
      .range([0, this.innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(allData, d => d.value) || 0])
      .nice()
      .range([this.innerHeight, 0]);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(Object.keys(seriesData))
      .range(this.config.colors || ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444']);

    if (this.config.showGrid !== false) {
      this.addGrid(xScale, yScale);
    }

    this.addAxes(xScale, yScale);

    Object.entries(seriesData).forEach(([seriesName, data], index) => {
      this.addLine(data, xScale, yScale, colorScale(seriesName), index, seriesName);
    });

    // Add hover overlay for better tooltip interaction
    this.addHoverOverlay(seriesData, xScale, yScale, colorScale);
  }

  private addGrid(
    xScale: d3.ScaleTime<number, number>,
    yScale: d3.ScaleLinear<number, number>
  ): void {
    const gridGroup = this.chartGroup.append('g').attr('class', 'grid');

    gridGroup.selectAll('.grid-line-y')
      .data(yScale.ticks(5))
      .join('line')
      .attr('class', 'grid-line-y')
      .attr('x1', 0)
      .attr('x2', this.innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.2);

    gridGroup.selectAll('.grid-line-x')
      .data(xScale.ticks(5))
      .join('line')
      .attr('class', 'grid-line-x')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', this.innerHeight)
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.2);
  }

  private addAxes(
    xScale: d3.ScaleTime<number, number>,
    yScale: d3.ScaleLinear<number, number>
  ): void {
    this.chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text')
      .attr('fill', 'var(--color-text)')
      .attr('font-size', 'var(--font-size-sm)');

    this.chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('fill', 'var(--color-text)')
      .attr('font-size', 'var(--font-size-sm)');

    this.chartGroup.selectAll('.domain')
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    this.chartGroup.selectAll('.tick line')
      .attr('stroke', 'var(--color-border)')
      .attr('opacity', 0.5);
  }

  private addLine(
    data: TimeSeriesDataPoint[],
    xScale: d3.ScaleTime<number, number>,
    yScale: d3.ScaleLinear<number, number>,
    color: string,
    index: number,
    seriesName: string
  ): void {
    const lineGroup = this.chartGroup.append('g')
      .attr('class', `line-group-${index}`);

    const lineGenerator = this.config.curved !== false
      ? d3.line<TimeSeriesDataPoint>()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX)
      : d3.line<TimeSeriesDataPoint>()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value));

    if (this.config.showArea) {
      const areaGenerator = this.config.curved !== false
        ? d3.area<TimeSeriesDataPoint>()
          .x(d => xScale(d.date))
          .y0(this.innerHeight)
          .y1(d => yScale(d.value))
          .curve(d3.curveMonotoneX)
        : d3.area<TimeSeriesDataPoint>()
          .x(d => xScale(d.date))
          .y0(this.innerHeight)
          .y1(d => yScale(d.value));

      const areaPath = lineGroup.append('path')
        .datum(data)
        .attr('class', 'line-area')
        .attr('d', areaGenerator)
        .attr('fill', color)
        .attr('opacity', 0.2);

      if (this.config.animated !== false) {
        const totalLength = (areaPath.node() as any)?.getTotalLength() || 0;
        areaPath
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(1000)
          .delay(index * 200)
          .attr('stroke-dashoffset', 0)
          .attr('stroke-dasharray', 'none');
      }
    }

    const linePath = lineGroup.append('path')
      .datum(data)
      .attr('class', 'line-path')
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', this.config.lineWidth || 3)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .style('filter', 'url(#line-glow)');

    if (this.config.animated !== false) {
      const totalLength = (linePath.node() as any)?.getTotalLength() || 0;
      linePath
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1000)
        .delay(index * 200)
        .attr('stroke-dashoffset', 0);
    }

    if (this.config.showPoints !== false) {
      lineGroup.selectAll('.line-point')
        .data(data)
        .join('circle')
        .attr('class', 'line-point')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.value))
        .attr('r', 0)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))')
        .transition()
        .duration(this.config.animated !== false ? 400 : 0)
        .delay((_, i) => (this.config.animated !== false ? index * 200 + 800 + i * 30 : 0))
        .attr('r', 5);

      lineGroup.selectAll('.line-point')
        .on('mouseenter', (event, d: any) => {
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 7)
            .attr('stroke-width', 3);

          this.ngZone.run(() => {
            this.showTooltip(event, d, seriesName, color);
          });
        })
        .on('mouseleave', (event) => {
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 5)
            .attr('stroke-width', 2);

          this.ngZone.run(() => {
            this.hideTooltip();
          });
        });
    }
  }
  private sanitizeClassName(name: string): string {
    return name.replace(/[^a-zA-Z0-9-_]/g, '-');
  }

  private addHoverOverlay(
    seriesData: Record<string, TimeSeriesDataPoint[]>,
    xScale: d3.ScaleTime<number, number>,
    yScale: d3.ScaleLinear<number, number>,
    colorScale: d3.ScaleOrdinal<string, string>
  ): void {
    const overlay = this.chartGroup
      .append('rect')
      .attr('class', 'hover-overlay')
      .attr('width', this.innerWidth)
      .attr('height', this.innerHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .style('cursor', 'crosshair');

    // Create vertical line for hover
    const hoverLine = this.chartGroup
      .append('line')
      .attr('class', 'hover-line')
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0)
      .attr('pointer-events', 'none');

    // Create hover circles for each series
    const hoverCircles = this.chartGroup
      .append('g')
      .attr('class', 'hover-circles')
      .attr('pointer-events', 'none');

    Object.entries(seriesData).forEach(([seriesName]) => {
      hoverCircles
        .append('circle')
        .attr('class', `hover-circle-${this.sanitizeClassName(seriesName)}`)
        .attr('r', 5)
        .attr('fill', colorScale(seriesName))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('opacity', 0)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))');
    });

    overlay
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event);
        const hoveredDate = xScale.invert(mouseX);

        // Find closest data points for each series
        const closestPoints: Array<{ seriesName: string; point: TimeSeriesDataPoint; distance: number; }> = [];

        Object.entries(seriesData).forEach(([seriesName, data]) => {
          const bisect = d3.bisector<TimeSeriesDataPoint, Date>(d => d.date).left;
          const index = bisect(data, hoveredDate);

          const d0 = data[index - 1];
          const d1 = data[index];

          let closest = d0;
          if (d1 && d0) {
            closest = hoveredDate.getTime() - d0.date.getTime() > d1.date.getTime() - hoveredDate.getTime() ? d1 : d0;
          } else if (d1) {
            closest = d1;
          }

          if (closest) {
            const distance = Math.abs(xScale(closest.date) - mouseX);
            closestPoints.push({ seriesName, point: closest, distance });
          }
        });

        if (closestPoints.length > 0) {
          // Sort by distance and take the closest one for positioning
          closestPoints.sort((a, b) => a.distance - b.distance);
          const mainPoint = closestPoints[0];

          // Show vertical line
          hoverLine
            .attr('x1', xScale(mainPoint.point.date))
            .attr('x2', xScale(mainPoint.point.date))
            .attr('y1', 0)
            .attr('y2', this.innerHeight)
            .attr('opacity', 0.6);

          // Show circles for all series
          closestPoints.forEach(({ seriesName, point }) => {
            hoverCircles
              .select(`.hover-circle-${this.sanitizeClassName(seriesName)}`)
              .attr('cx', xScale(point.date))
              .attr('cy', yScale(point.value))
              .attr('opacity', 1);
          });

          // Show tooltip with all series data
          this.ngZone.run(() => {
            this.showMultiSeriesTooltip(event, closestPoints, colorScale);
          });
        }
      })
      .on('mouseleave', () => {
        hoverLine.attr('opacity', 0);
        hoverCircles.selectAll('circle').attr('opacity', 0);
        this.ngZone.run(() => {
          this.hideTooltip();
        });
      });
  }

  private showTooltip(event: MouseEvent, dataPoint: TimeSeriesDataPoint, seriesName: string, color: string): void {
    if (this.config.customTooltip) {
      const customData = this.config.customTooltip({ date: dataPoint.date, value: dataPoint.value, seriesName });
      this.tooltipTitle = customData.title || '';
      this.tooltipData = customData.items.map(item => ({
        label: item.label,
        value: item.value,
        color: item.color
      }));
    } else {
      this.tooltipTitle = seriesName;
      this.tooltipData = [
        { label: 'Date', value: dataPoint.date.toLocaleDateString() },
        { label: 'Value', value: dataPoint.value.toFixed(2), color }
      ];
    }

    this.tooltipX = event.clientX;
    this.tooltipY = event.clientY;
    this.tooltipVisible = true;
  }

  private showMultiSeriesTooltip(
    event: MouseEvent,
    points: Array<{ seriesName: string; point: TimeSeriesDataPoint; distance: number; }>,
    colorScale: d3.ScaleOrdinal<string, string>
  ): void {
    if (this.config.customTooltip && points.length > 0) {
      const customData = this.config.customTooltip({
        date: points[0].point.date,
        value: points[0].point.value,
        seriesName: points[0].seriesName
      });
      this.tooltipTitle = customData.title || '';
      this.tooltipData = customData.items.map(item => ({
        label: item.label,
        value: item.value,
        color: item.color
      }));
    } else {
      this.tooltipTitle = points[0].point.date.toLocaleDateString();
      this.tooltipData = points.map(({ seriesName, point }) => ({
        label: seriesName,
        value: point.value.toFixed(2),
        color: colorScale(seriesName)
      }));
    }

    this.tooltipX = event.clientX;
    this.tooltipY = event.clientY;
    this.tooltipVisible = true;
  }

  private hideTooltip(): void {
    this.tooltipVisible = false;
    this.cdr.detectChanges();
  }
}
