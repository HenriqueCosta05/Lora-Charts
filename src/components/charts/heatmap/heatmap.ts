import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { HeatmapDataPoint } from '../../../types/chart';
import { Tooltip, TooltipData } from '../../base/tooltip/tooltip';

export interface HeatmapConfig {
  showValues?: boolean;
  animated?: boolean;
  cellRadius?: number;
  colorScheme?: 'blues' | 'greens' | 'reds' | 'purples' | 'viridis' | 'plasma';
  customTooltip?: (data: { x: string | number; y: string | number; value: number; color?: string; }) => { title?: string; items: Array<{ label: string; value: string | number; color?: string; }>; };
}

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [Tooltip],
  templateUrl: './heatmap.html',
  styleUrl: './heatmap.css',
})
export class Heatmap implements OnInit, OnChanges {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) { }

  @Input() data: HeatmapDataPoint[] = [];
  @Input() width: number = 800;
  @Input() height: number = 500;
  @Input() config: HeatmapConfig = {};

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private chartGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private margin = { top: 60, right: 40, bottom: 80, left: 80 };
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
      .attr('class', 'heatmap-svg')
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

    const glassGradient = defs.append('linearGradient')
      .attr('id', 'heatmap-glass-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    glassGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.4)')
      .attr('stop-opacity', 1);

    glassGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(255, 255, 255, 0)')
      .attr('stop-opacity', 1);

    const shadow = defs.append('filter')
      .attr('id', 'heatmap-cell-shadow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    shadow.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 2);

    shadow.append('feOffset')
      .attr('dx', 0)
      .attr('dy', 2)
      .attr('result', 'offsetblur');

    shadow.append('feComponentTransfer')
      .append('feFuncA')
      .attr('type', 'linear')
      .attr('slope', 0.3);

    const feMerge = shadow.append('feMerge');
    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  }

  private updateChart(): void {
    if (!this.data || this.data.length === 0) return;

    this.chartGroup.selectAll('*').remove();

    const xValues = Array.from(new Set(this.data.map(d => String(d.x)))).sort();
    const yValues = Array.from(new Set(this.data.map(d => String(d.y)))).sort();

    const xScale = d3.scaleBand()
      .domain(xValues)
      .range([0, this.innerWidth])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(yValues)
      .range([0, this.innerHeight])
      .padding(0.05);

    const colorScale = this.getColorScale();

    this.addAxes(xScale, yScale);

    this.addCells(xScale, yScale, colorScale);

    this.addLegend(colorScale);
  }

  private getColorScale(): d3.ScaleSequential<string> {
    const values = this.data.map(d => d.value);
    const extent = d3.extent(values) as [number, number];

    const scheme = this.config.colorScheme || 'blues';

    switch (scheme) {
      case 'blues':
        return d3.scaleSequential(d3.interpolateBlues).domain(extent);
      case 'greens':
        return d3.scaleSequential(d3.interpolateGreens).domain(extent);
      case 'reds':
        return d3.scaleSequential(d3.interpolateReds).domain(extent);
      case 'purples':
        return d3.scaleSequential(d3.interpolatePurples).domain(extent);
      case 'viridis':
        return d3.scaleSequential(d3.interpolateViridis).domain(extent);
      case 'plasma':
        return d3.scaleSequential(d3.interpolatePlasma).domain(extent);
      default:
        return d3.scaleSequential(d3.interpolateBlues).domain(extent);
    }
  }

  private addAxes(
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleBand<string>
  ): void {
    this.chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll('text')
      .attr('fill', 'var(--color-text)')
      .attr('font-size', 'var(--font-size-sm)')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em');

    this.chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).tickSize(0))
      .selectAll('text')
      .attr('fill', 'var(--color-text)')
      .attr('font-size', 'var(--font-size-sm)');

    this.chartGroup.selectAll('.domain')
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    this.chartGroup.selectAll('.tick line').remove();
  }

  private addCells(
    xScale: d3.ScaleBand<string>,
    yScale: d3.ScaleBand<string>,
    colorScale: d3.ScaleSequential<string>
  ): void {
    const cellRadius = this.config.cellRadius ?? 4;
    const cellsGroup = this.chartGroup.append('g').attr('class', 'cells');

    const cells = cellsGroup.selectAll('.cell-group')
      .data(this.data)
      .join('g')
      .attr('class', 'cell-group');

    cells.append('rect')
      .attr('class', 'cell-shadow')
      .attr('x', d => (xScale(String(d.x)) || 0) + 2)
      .attr('y', d => (yScale(String(d.y)) || 0) + 2)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', cellRadius)
      .attr('ry', cellRadius)
      .attr('fill', 'rgba(0, 0, 0, 0.1)');

    cells.append('rect')
      .attr('class', 'cell')
      .attr('x', d => xScale(String(d.x)) || 0)
      .attr('y', d => yScale(String(d.y)) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', cellRadius)
      .attr('ry', cellRadius)
      .attr('fill', d => d.color || colorScale(d.value))
      .style('filter', 'url(#heatmap-cell-shadow)')
      .attr('opacity', 0)
      .transition()
      .duration(this.config.animated !== false ? 600 : 0)
      .delay((_, i) => i * 15)
      .attr('opacity', 1);

    cells.append('rect')
      .attr('class', 'cell-glass')
      .attr('x', d => xScale(String(d.x)) || 0)
      .attr('y', d => yScale(String(d.y)) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', cellRadius)
      .attr('ry', cellRadius)
      .attr('fill', 'url(#heatmap-glass-gradient)')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)
      .transition()
      .duration(this.config.animated !== false ? 600 : 0)
      .delay((_, i) => i * 15)
      .attr('opacity', 0.3);

    cells.selectAll('.cell')
      .on('mouseenter', (event, d: any) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);

        this.ngZone.run(() => {
          this.showTooltip(event, d, colorScale);
        });
      })
      .on('mousemove', (event) => {
        this.ngZone.run(() => {
          this.tooltipX = event.clientX;
          this.tooltipY = event.clientY;
        });
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke', 'none');

        this.ngZone.run(() => {
          this.hideTooltip();
        });
      });

    if (this.config.showValues) {
      cells.append('text')
        .attr('class', 'cell-value')
        .attr('x', d => (xScale(String(d.x)) || 0) + xScale.bandwidth() / 2)
        .attr('y', d => (yScale(String(d.y)) || 0) + yScale.bandwidth() / 2 + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', d => {
          const color = d3.color(d.color || colorScale(d.value));
          const brightness = color ? (color as any).r * 0.299 + (color as any).g * 0.587 + (color as any).b * 0.114 : 128;
          return brightness > 128 ? '#000' : '#fff';
        })
        .attr('font-size', 'var(--font-size-xs)')
        .attr('font-weight', '600')
        .style('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.3)')
        .attr('opacity', 0)
        .text(d => d.value.toFixed(1))
        .transition()
        .duration(this.config.animated !== false ? 600 : 0)
        .delay((_, i) => i * 15 + 300)
        .attr('opacity', 1);
    }
  }

  private addLegend(colorScale: d3.ScaleSequential<string>): void {
    const legendWidth = 20;
    const legendHeight = 200;
    const legendX = this.innerWidth + 20;
    const legendY = (this.innerHeight - legendHeight) / 2;

    const legendGroup = this.chartGroup.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${legendX},${legendY})`);

    const defs = this.svg.select('defs');
    const legendGradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');

    const domain = colorScale.domain();
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const value = domain[0] + (domain[1] - domain[0]) * (i / steps);
      legendGradient.append('stop')
        .attr('offset', `${(i / steps) * 100}%`)
        .attr('stop-color', colorScale(value));
    }

    legendGroup.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('fill', 'url(#legend-gradient)')
      .attr('rx', 4)
      .style('filter', 'url(#heatmap-cell-shadow)');

    const legendScale = d3.scaleLinear()
      .domain(domain)
      .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5);

    legendGroup.append('g')
      .attr('transform', `translate(${legendWidth},0)`)
      .call(legendAxis)
      .selectAll('text')
      .attr('fill', 'var(--color-text)')
      .attr('font-size', 'var(--font-size-xs)');

    legendGroup.select('.domain').remove();
    legendGroup.selectAll('.tick line')
      .attr('stroke', 'var(--color-border)')
      .attr('x2', 6);
  }

  private showTooltip(event: MouseEvent, dataPoint: HeatmapDataPoint, colorScale: d3.ScaleSequential<string>): void {
    if (this.config.customTooltip) {
      const customData = this.config.customTooltip({
        x: dataPoint.x,
        y: dataPoint.y,
        value: dataPoint.value,
        color: dataPoint.color || colorScale(dataPoint.value)
      });
      this.tooltipTitle = customData.title || '';
      this.tooltipData = customData.items.map(item => ({
        label: item.label,
        value: item.value,
        color: item.color
      }));
    } else {
      this.tooltipTitle = `${dataPoint.x}, ${dataPoint.y}`;
      this.tooltipData = [
        { label: 'Value', value: dataPoint.value.toFixed(2), color: dataPoint.color || colorScale(dataPoint.value) }
      ];
    }

    this.tooltipX = event.clientX;
    this.tooltipY = event.clientY;
    this.tooltipVisible = true;
    this.cdr.detectChanges();
  }

  private hideTooltip(): void {
    this.tooltipVisible = false;
    this.cdr.detectChanges();
  }
}
