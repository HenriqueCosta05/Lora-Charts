import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ThemeService } from '../../../services/theme';
import { ChartDataPoint } from '../../../types/chart';
import { calculateLabelRotation, getMaxLabelWidth } from '../../../utils/chart-helpers';
import { Tooltip, TooltipData } from '../../base/tooltip/tooltip';

export interface BarChartConfig {
  orientation?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showValues?: boolean;
  animated?: boolean;
  barRadius?: number;
  barPadding?: number;
  colors?: string[];
  customTooltip?: (data: { label: string; value: number; color?: string; }) => { title?: string; items: Array<{ label: string; value: string | number; color?: string; }>; };
}

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [Tooltip],
  templateUrl: './bar.html',
  styleUrl: './bar.css',
})
export class Bar implements OnInit, OnChanges {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef, themeService: ThemeService) {
    themeService.loadAndSetTheme('/themes/main.json');
  }

  @Input() data: ChartDataPoint[] = [];
  @Input() width: number = 800;
  @Input() height: number = 500;
  @Input() config: BarChartConfig = {};
  @Input() autoRotateLabels: boolean = true;
  @Input() labelRotationAngle?: number;

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
      .attr('class', 'bar-chart-svg')
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

    // Enhanced glass gradient with more layers
    const glassGradient = defs.append('linearGradient')
      .attr('id', 'bar-glass-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    glassGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.8)')
      .attr('stop-opacity', 1);

    glassGradient.append('stop')
      .attr('offset', '30%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.4)')
      .attr('stop-opacity', 1);

    glassGradient.append('stop')
      .attr('offset', '70%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.1)')
      .attr('stop-opacity', 1);

    glassGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(255, 255, 255, 0)')
      .attr('stop-opacity', 1);

    // Enhanced 3D shadow with multiple layers
    const shadow = defs.append('filter')
      .attr('id', 'bar-3d-shadow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%');

    shadow.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 6);

    shadow.append('feOffset')
      .attr('dx', 0)
      .attr('dy', 8)
      .attr('result', 'offsetblur');

    shadow.append('feComponentTransfer')
      .append('feFuncA')
      .attr('type', 'linear')
      .attr('slope', 0.25);

    const feMerge = shadow.append('feMerge');
    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Hover glow effect
    const hoverGlow = defs.append('filter')
      .attr('id', 'bar-hover-glow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%');

    hoverGlow.append('feGaussianBlur')
      .attr('stdDeviation', 8)
      .attr('result', 'coloredBlur');

    const glowMerge = hoverGlow.append('feMerge');
    glowMerge.append('feMergeNode').attr('in', 'coloredBlur');
    glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  }

  private updateChart(): void {
    if (!this.data || this.data.length === 0) return;

    this.chartGroup.selectAll('*').remove();

    const isVertical = this.config.orientation !== 'horizontal';
    const barRadius = this.config.barRadius ?? 8;

    const xScale = isVertical
      ? d3.scaleBand()
        .domain(this.data.map(d => d.label))
        .range([0, this.innerWidth])
        .padding(this.config.barPadding ?? 0.3)
      : d3.scaleLinear()
        .domain([0, d3.max(this.data, d => d.value) || 0])
        .range([0, this.innerWidth]);

    const yScale = isVertical
      ? d3.scaleLinear()
        .domain([0, d3.max(this.data, d => d.value) || 0])
        .range([this.innerHeight, 0])
      : d3.scaleBand()
        .domain(this.data.map(d => d.label))
        .range([0, this.innerHeight])
        .padding(this.config.barPadding ?? 0.3);

    // Modern 2026 color palette inspired by Apple design
    const modernColors = this.config.colors || [
      '#0071e3', // Apple Blue
      '#8e44ff', // Purple
      '#ff2d55', // Pink
      '#34c759', // Green
      '#ff9f0a', // Orange
      '#5ac8fa', // Cyan
      '#af52de', // Violet
      '#ff3b30'  // Red
    ];

    const colorScale = d3.scaleOrdinal<string>()
      .domain(this.data.map(d => d.label))
      .range(modernColors);

    if (this.config.showGrid !== false) {
      this.addGrid(isVertical ? yScale as any : xScale as any, isVertical);
    }

    this.addAxes(xScale as any, yScale as any, isVertical);

    this.addBars(xScale as any, yScale as any, colorScale, isVertical, barRadius);
  }

  private addGrid(scale: d3.ScaleLinear<number, number>, isVertical: boolean): void {
    const gridGroup = this.chartGroup.append('g').attr('class', 'grid');

    if (isVertical) {
      gridGroup.selectAll('.grid-line')
        .data(scale.ticks(5))
        .join('line')
        .attr('class', 'grid-line')
        .attr('x1', 0)
        .attr('x2', this.innerWidth)
        .attr('y1', d => scale(d))
        .attr('y2', d => scale(d))
        .attr('stroke', 'var(--color-border)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.2);
    } else {
      gridGroup.selectAll('.grid-line')
        .data(scale.ticks(5))
        .join('line')
        .attr('class', 'grid-line')
        .attr('x1', d => scale(d))
        .attr('x2', d => scale(d))
        .attr('y1', 0)
        .attr('y2', this.innerHeight)
        .attr('stroke', 'var(--color-border)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.2);
    }
  }

  private addAxes(
    xScale: d3.ScaleBand<string> | d3.ScaleLinear<number, number>,
    yScale: d3.ScaleBand<string> | d3.ScaleLinear<number, number>,
    isVertical: boolean
  ): void {
    const xAxis = isVertical
      ? d3.axisBottom(xScale as d3.ScaleBand<string>)
      : d3.axisBottom(xScale as d3.ScaleLinear<number, number>).ticks(5);

    this.chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.innerHeight})`)
      .call(xAxis as any)
      .selectAll('text')
      .attr('fill', 'var(--color-text)')
      .attr('font-size', 'var(--font-size-sm)')
      .style('text-anchor', isVertical ? 'middle' : 'end');

    const yAxis = isVertical
      ? d3.axisLeft(yScale as d3.ScaleLinear<number, number>).ticks(5)
      : d3.axisLeft(yScale as d3.ScaleBand<string>);

    this.chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(yAxis as any)
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

    if (isVertical) {
      const labels = this.data.map(d => String(d.label));
      const fontSize = 14;

      let rotationAngle = 0;
      if (this.labelRotationAngle !== undefined) {
        rotationAngle = this.labelRotationAngle;
      } else if (this.autoRotateLabels) {
        const maxWidth = getMaxLabelWidth(labels, fontSize);
        rotationAngle = calculateLabelRotation(this.innerWidth, labels, maxWidth);
      }

      const xAxisLabels = this.chartGroup.selectAll('.x-axis .tick text');

      if (rotationAngle === 0) {
        xAxisLabels
          .attr('transform', 'rotate(0)')
          .attr('dy', '1.2em')
          .attr('dx', '0em')
          .style('text-anchor', 'middle');
      } else if (rotationAngle === -45) {
        xAxisLabels
          .attr('transform', 'rotate(-45)')
          .attr('dy', '0.75em')
          .attr('dx', '-0.5em')
          .style('text-anchor', 'end');
      } else if (rotationAngle === -90) {
        xAxisLabels
          .attr('transform', 'rotate(-90)')
          .attr('dy', '-0.5em')
          .attr('dx', '-1.5em')
          .style('text-anchor', 'end');
      } else {
        xAxisLabels
          .attr('transform', `rotate(${rotationAngle})`)
          .attr('dy', '0.75em')
          .attr('dx', rotationAngle < 0 ? '-0.5em' : '0.5em')
          .style('text-anchor', rotationAngle < 0 ? 'end' : 'start');
      }
    }
  }

  private addBars(
    xScale: d3.ScaleBand<string> | d3.ScaleLinear<number, number>,
    yScale: d3.ScaleBand<string> | d3.ScaleLinear<number, number>,
    colorScale: d3.ScaleOrdinal<string, string>,
    isVertical: boolean,
    barRadius: number
  ): void {
    const barsGroup = this.chartGroup.append('g').attr('class', 'bars');

    const bars = barsGroup.selectAll('.bar-group')
      .data(this.data)
      .join('g')
      .attr('class', 'bar-group');

    if (isVertical) {
      const xBand = xScale as d3.ScaleBand<string>;
      const yLinear = yScale as d3.ScaleLinear<number, number>;

      bars.append('rect')
        .attr('class', 'bar-shadow')
        .attr('x', d => (xBand(d.label) || 0) + 2)
        .attr('y', d => yLinear(d.value) + 2)
        .attr('width', xBand.bandwidth())
        .attr('height', d => this.innerHeight - yLinear(d.value))
        .attr('fill', 'rgba(0, 0, 0, 0.1)')
        .attr('rx', barRadius)
        .attr('ry', barRadius);

      bars.append('rect')
        .attr('class', 'bar')
        .attr('x', d => xBand(d.label) || 0)
        .attr('y', this.innerHeight)
        .attr('width', xBand.bandwidth())
        .attr('height', 0)
        .attr('fill', d => d.color || colorScale(d.label))
        .attr('rx', barRadius)
        .attr('ry', barRadius)
        .style('filter', 'url(#bar-3d-shadow)')
        .transition()
        .duration(this.config.animated !== false ? 600 : 0)
        .delay((_, i) => i * 50)
        .attr('y', d => yLinear(d.value))
        .attr('height', d => this.innerHeight - yLinear(d.value));

      bars.append('rect')
        .attr('class', 'bar-glass')
        .attr('x', d => xBand(d.label) || 0)
        .attr('y', d => yLinear(d.value))
        .attr('width', xBand.bandwidth())
        .attr('height', d => this.innerHeight - yLinear(d.value))
        .attr('fill', 'url(#bar-glass-gradient)')
        .attr('rx', barRadius)
        .attr('ry', barRadius)
        .attr('pointer-events', 'none')
        .attr('opacity', 0)
        .transition()
        .duration(this.config.animated !== false ? 600 : 0)
        .delay((_, i) => i * 50)
        .attr('opacity', 1);

    } else {
      const xLinear = xScale as d3.ScaleLinear<number, number>;
      const yBand = yScale as d3.ScaleBand<string>;

      bars.append('rect')
        .attr('class', 'bar-shadow')
        .attr('x', 2)
        .attr('y', d => (yBand(d.label) || 0) + 2)
        .attr('width', d => xLinear(d.value))
        .attr('height', yBand.bandwidth())
        .attr('fill', 'rgba(0, 0, 0, 0.1)')
        .attr('rx', barRadius)
        .attr('ry', barRadius);

      bars.append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => yBand(d.label) || 0)
        .attr('width', 0)
        .attr('height', yBand.bandwidth())
        .attr('fill', d => d.color || colorScale(d.label))
        .attr('rx', barRadius)
        .attr('ry', barRadius)
        .style('filter', 'url(#bar-3d-shadow)')
        .transition()
        .duration(this.config.animated !== false ? 600 : 0)
        .delay((_, i) => i * 50)
        .attr('width', d => xLinear(d.value));

      bars.append('rect')
        .attr('class', 'bar-glass')
        .attr('x', 0)
        .attr('y', d => yBand(d.label) || 0)
        .attr('width', d => xLinear(d.value))
        .attr('height', yBand.bandwidth())
        .attr('fill', 'url(#bar-glass-gradient)')
        .attr('rx', barRadius)
        .attr('ry', barRadius)
        .attr('pointer-events', 'none')
        .attr('opacity', 0)
        .transition()
        .duration(this.config.animated !== false ? 600 : 0)
        .delay((_, i) => i * 50)
        .attr('opacity', 1);
    }

    bars.selectAll('.bar')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d: any) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr('opacity', 0.9)
          .style('filter', 'url(#bar-hover-glow) url(#bar-3d-shadow)')
          .attr('transform', isVertical ? 'translateY(-5) scale(1.02)' : 'translateX(5) scale(1.02)');

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
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr('opacity', 1)
          .style('filter', 'url(#bar-3d-shadow)')
          .attr('transform', 'translate(0,0) scale(1)');

        this.ngZone.run(() => {
          this.hideTooltip();
        });
      });

    if (this.config.showValues) {
      bars.append('text')
        .attr('class', 'bar-value')
        .attr('x', d => isVertical ? ((xScale as d3.ScaleBand<string>)(d.label) || 0) + (xScale as d3.ScaleBand<string>).bandwidth() / 2 : (xScale as d3.ScaleLinear<number, number>)(d.value) + 5)
        .attr('y', d => isVertical ? (yScale as d3.ScaleLinear<number, number>)(d.value) - 5 : ((yScale as d3.ScaleBand<string>)(d.label) || 0) + (yScale as d3.ScaleBand<string>).bandwidth() / 2 + 5)
        .attr('text-anchor', isVertical ? 'middle' : 'start')
        .attr('fill', 'var(--color-text)')
        .attr('font-size', 'var(--font-size-sm)')
        .attr('font-weight', '600')
        .style('text-shadow', '0 1px 2px rgba(255, 255, 255, 0.8)')
        .attr('opacity', 0)
        .text(d => d.value.toLocaleString())
        .transition()
        .duration(this.config.animated !== false ? 600 : 0)
        .delay((_, i) => i * 50 + 300)
        .attr('opacity', 1);
    }
  }

  private showTooltip(event: MouseEvent, dataPoint: ChartDataPoint, colorScale: d3.ScaleOrdinal<string, string>): void {
    if (this.config.customTooltip) {
      const customData = this.config.customTooltip({
        label: dataPoint.label,
        value: dataPoint.value,
        color: dataPoint.color || colorScale(dataPoint.label)
      });
      this.tooltipTitle = customData.title || '';
      this.tooltipData = customData.items.map(item => ({
        label: item.label,
        value: item.value,
        color: item.color
      }));
    } else {
      this.tooltipTitle = dataPoint.label;
      this.tooltipData = [
        { label: 'Value', value: dataPoint.value.toLocaleString(), color: dataPoint.color || colorScale(dataPoint.label) }
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
