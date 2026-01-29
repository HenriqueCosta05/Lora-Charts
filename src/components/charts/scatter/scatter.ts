import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ThemeService } from '../../../services/theme';
import { Tooltip, TooltipData } from '../../base/tooltip/tooltip';

export interface ScatterDataPoint {
  x: number;
  y: number;
  size?: number;
  label?: string;
  color?: string;
  category?: string;
}

export interface ScatterChartConfig {
  showGrid?: boolean;
  animated?: boolean;
  colors?: string[];
  minBubbleSize?: number;
  maxBubbleSize?: number;
  enableZoom?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  customTooltip?: (data: ScatterDataPoint) => { title?: string; items: Array<{ label: string; value: string | number; color?: string; }>; };
}

@Component({
  selector: 'app-scatter',
  standalone: true,
  imports: [Tooltip],
  templateUrl: './scatter.html',
  styleUrl: './scatter.css',
})
export class Scatter implements OnInit, OnChanges {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef, private themeService: ThemeService) {
    themeService.loadAndSetTheme('/themes/main.json');
  }

  @Input() data: ScatterDataPoint[] = [];
  @Input() width: number = 800;
  @Input() height: number = 500;
  @Input() config: ScatterChartConfig = {};

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private chartGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private margin = { top: 40, right: 40, bottom: 60, left: 60 };
  private innerWidth!: number;
  private innerHeight!: number;
  private zoomBehavior!: d3.ZoomBehavior<SVGSVGElement, unknown>;

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
      .attr('class', 'scatter-chart-svg')
      .style('overflow', 'visible');

    this.addDefs();

    this.chartGroup = this.svg
      .append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    if (this.config.enableZoom) {
      this.setupZoom();
    }

    this.updateChart();
  }

  private addDefs(): void {
    const defs = this.svg.append('defs');

    // Glass gradient for bubbles
    const glassGradient = defs.append('radialGradient')
      .attr('id', 'scatter-glass-gradient')
      .attr('cx', '30%')
      .attr('cy', '30%')
      .attr('r', '70%');

    glassGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.9)')
      .attr('stop-opacity', 1);

    glassGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.5)')
      .attr('stop-opacity', 1);

    glassGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.1)')
      .attr('stop-opacity', 1);

    // 3D shadow filter
    const shadow = defs.append('filter')
      .attr('id', 'scatter-3d-shadow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%');

    shadow.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 4);

    shadow.append('feOffset')
      .attr('dx', 0)
      .attr('dy', 4)
      .attr('result', 'offsetblur');

    shadow.append('feComponentTransfer')
      .append('feFuncA')
      .attr('type', 'linear')
      .attr('slope', 0.3);

    const feMerge = shadow.append('feMerge');
    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Glow effect
    const glow = defs.append('filter')
      .attr('id', 'scatter-glow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%');

    glow.append('feGaussianBlur')
      .attr('stdDeviation', 6)
      .attr('result', 'coloredBlur');

    const glowMerge = glow.append('feMerge');
    glowMerge.append('feMergeNode').attr('in', 'coloredBlur');
    glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  }

  private setupZoom(): void {
    this.zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        this.chartGroup.attr('transform', event.transform);
      });

    this.svg.call(this.zoomBehavior as any);
  }

  private updateChart(): void {
    if (!this.data || this.data.length === 0) return;

    this.chartGroup.selectAll('*').remove();

    const xExtent = d3.extent(this.data, d => d.x) as [number, number];
    const yExtent = d3.extent(this.data, d => d.y) as [number, number];

    const xScale = d3.scaleLinear()
      .domain([xExtent[0] * 0.9, xExtent[1] * 1.1])
      .range([0, this.innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] * 0.9, yExtent[1] * 1.1])
      .range([this.innerHeight, 0])
      .nice();

    const sizeExtent = d3.extent(this.data, d => d.size || 1) as [number, number];
    const sizeScale = d3.scaleSqrt()
      .domain(sizeExtent)
      .range([this.config.minBubbleSize || 4, this.config.maxBubbleSize || 20]);

    const categories = Array.from(new Set(this.data.map(d => d.category || 'default')));
    const colorScale = d3.scaleOrdinal<string>()
      .domain(categories)
      .range(this.config.colors || [
        '#0071e3', '#8e44ff', '#ff2d55', '#34c759',
        '#ff9f0a', '#5ac8fa', '#af52de', '#ff3b30'
      ]);

    if (this.config.showGrid !== false) {
      this.addGrid(xScale, yScale);
    }

    this.addAxes(xScale, yScale);
    this.addBubbles(xScale, yScale, sizeScale, colorScale);
  }

  private addGrid(
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>
  ): void {
    const gridGroup = this.chartGroup.append('g').attr('class', 'grid');

    // Vertical grid lines
    gridGroup.selectAll('.grid-line-x')
      .data(xScale.ticks(10))
      .join('line')
      .attr('class', 'grid-line-x')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', this.innerHeight)
      .attr('stroke', 'rgba(0, 0, 0, 0.05)')
      .attr('stroke-width', 1);

    // Horizontal grid lines
    gridGroup.selectAll('.grid-line-y')
      .data(yScale.ticks(10))
      .join('line')
      .attr('class', 'grid-line-y')
      .attr('x1', 0)
      .attr('x2', this.innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', 'rgba(0, 0, 0, 0.05)')
      .attr('stroke-width', 1);
  }

  private addAxes(
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>
  ): void {
    // X axis
    const xAxis = d3.axisBottom(xScale).ticks(10);
    this.chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#1d1d1f')
      .attr('font-size', '13px');

    // Y axis
    const yAxis = d3.axisLeft(yScale).ticks(10);
    this.chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#1d1d1f')
      .attr('font-size', '13px');

    // Axis labels
    if (this.config.xAxisLabel) {
      this.chartGroup.append('text')
        .attr('class', 'x-axis-label')
        .attr('x', this.innerWidth / 2)
        .attr('y', this.innerHeight + 45)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1d1d1f')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(this.config.xAxisLabel);
    }

    if (this.config.yAxisLabel) {
      this.chartGroup.append('text')
        .attr('class', 'y-axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -this.innerHeight / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .attr('fill', '#1d1d1f')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(this.config.yAxisLabel);
    }

    // Style axes
    this.chartGroup.selectAll('.domain')
      .attr('stroke', 'rgba(0, 0, 0, 0.1)')
      .attr('stroke-width', 2);

    this.chartGroup.selectAll('.tick line')
      .attr('stroke', 'rgba(0, 0, 0, 0.1)');
  }

  private addBubbles(
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>,
    sizeScale: ReturnType<typeof d3.scaleSqrt<number, number>>,
    colorScale: d3.ScaleOrdinal<string, string>
  ): void {
    const bubblesGroup = this.chartGroup.append('g').attr('class', 'bubbles');

    const bubbles = bubblesGroup.selectAll('.bubble-group')
      .data(this.data)
      .join('g')
      .attr('class', 'bubble-group')
      .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`);

    // Shadow circles
    bubbles.append('circle')
      .attr('class', 'bubble-shadow')
      .attr('cx', 1)
      .attr('cy', 2)
      .attr('r', 0)
      .attr('fill', 'rgba(0, 0, 0, 0.2)')
      .transition()
      .duration(this.config.animated !== false ? 600 : 0)
      .delay((_, i) => i * 20)
      .attr('r', d => sizeScale(d.size || 1));

    // Main bubbles with glass effect
    bubbles.append('circle')
      .attr('class', 'bubble')
      .attr('r', 0)
      .attr('fill', d => d.color || colorScale(d.category || 'default'))
      .attr('fill-opacity', 0.8)
      .style('filter', 'url(#scatter-3d-shadow)')
      .style('cursor', 'pointer')
      .transition()
      .duration(this.config.animated !== false ? 600 : 0)
      .delay((_, i) => i * 20)
      .ease(d3.easeElastic)
      .attr('r', d => sizeScale(d.size || 1));

    // Glass overlay on bubbles
    bubbles.append('circle')
      .attr('class', 'bubble-glass')
      .attr('r', 0)
      .attr('fill', 'url(#scatter-glass-gradient)')
      .attr('pointer-events', 'none')
      .transition()
      .duration(this.config.animated !== false ? 600 : 0)
      .delay((_, i) => i * 20)
      .attr('r', d => sizeScale(d.size || 1));

    // Hover effects
    bubbles
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget).select('.bubble')
          .transition()
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr('r', sizeScale(d.size || 1) * 1.2)
          .attr('fill-opacity', 1)
          .style('filter', 'url(#scatter-glow) url(#scatter-3d-shadow)');

        d3.select(event.currentTarget).select('.bubble-glass')
          .transition()
          .duration(200)
          .attr('r', sizeScale(d.size || 1) * 1.2);

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
      .on('mouseleave', (event, d) => {
        d3.select(event.currentTarget).select('.bubble')
          .transition()
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr('r', sizeScale(d.size || 1))
          .attr('fill-opacity', 0.8)
          .style('filter', 'url(#scatter-3d-shadow)');

        d3.select(event.currentTarget).select('.bubble-glass')
          .transition()
          .duration(200)
          .attr('r', sizeScale(d.size || 1));

        this.ngZone.run(() => {
          this.hideTooltip();
        });
      });
  }

  private showTooltip(event: MouseEvent, dataPoint: ScatterDataPoint, colorScale: d3.ScaleOrdinal<string, string>): void {
    if (this.config.customTooltip) {
      const customData = this.config.customTooltip(dataPoint);
      this.tooltipTitle = customData.title || '';
      this.tooltipData = customData.items.map(item => ({
        label: item.label,
        value: item.value,
        color: item.color
      }));
    } else {
      this.tooltipTitle = dataPoint.label || 'Data Point';
      this.tooltipData = [
        { label: 'X', value: dataPoint.x.toFixed(2), color: dataPoint.color || colorScale(dataPoint.category || 'default') },
        { label: 'Y', value: dataPoint.y.toFixed(2) }
      ];
      if (dataPoint.size) {
        this.tooltipData.push({ label: 'Size', value: dataPoint.size.toFixed(2) });
      }
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
