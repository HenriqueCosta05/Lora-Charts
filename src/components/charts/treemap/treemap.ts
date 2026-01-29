import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ThemeService } from '../../../services/theme';
import { Tooltip, TooltipData } from '../../base/tooltip/tooltip';

export interface TreemapDataNode {
  name: string;
  value?: number;
  children?: TreemapDataNode[];
  color?: string;
}

export interface TreemapConfig {
  animated?: boolean;
  colors?: string[];
  paddingInner?: number;
  paddingOuter?: number;
  cornerRadius?: number;
  showLabels?: boolean;
  customTooltip?: (data: TreemapDataNode) => { title?: string; items: Array<{ label: string; value: string | number; color?: string; }>; };
}

@Component({
  selector: 'app-treemap',
  standalone: true,
  imports: [Tooltip],
  templateUrl: './treemap.html',
  styleUrl: './treemap.css',
})
export class Treemap implements OnInit, OnChanges {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef, private themeService: ThemeService) {
    themeService.loadAndSetTheme('/themes/main.json');
  }

  @Input() data!: TreemapDataNode;
  @Input() width: number = 800;
  @Input() height: number = 500;
  @Input() config: TreemapConfig = {};

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private chartGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;

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
    const container = d3.select(this.chartContainer.nativeElement);
    container.selectAll('*').remove();

    this.svg = container
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'treemap-svg')
      .style('overflow', 'visible');

    this.addDefs();

    this.chartGroup = this.svg
      .append('g')
      .attr('class', 'chart-group');

    this.updateChart();
  }

  private addDefs(): void {
    const defs = this.svg.append('defs');

    const glassGradient = defs.append('linearGradient')
      .attr('id', 'treemap-glass-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    glassGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.7)')
      .attr('stop-opacity', 1);

    glassGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.3)')
      .attr('stop-opacity', 1);

    glassGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.05)')
      .attr('stop-opacity', 1);

    const shadow = defs.append('filter')
      .attr('id', 'treemap-shadow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    shadow.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 4);

    shadow.append('feOffset')
      .attr('dx', 0)
      .attr('dy', 3)
      .attr('result', 'offsetblur');

    shadow.append('feComponentTransfer')
      .append('feFuncA')
      .attr('type', 'linear')
      .attr('slope', 0.25);

    const feMerge = shadow.append('feMerge');
    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const glow = defs.append('filter')
      .attr('id', 'treemap-glow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%');

    glow.append('feGaussianBlur')
      .attr('stdDeviation', 8)
      .attr('result', 'coloredBlur');

    const glowMerge = glow.append('feMerge');
    glowMerge.append('feMergeNode').attr('in', 'coloredBlur');
    glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  }

  private updateChart(): void {
    if (!this.data) return;

    this.chartGroup.selectAll('*').remove();

    const cornerRadius = this.config.cornerRadius ?? 8;
    const paddingInner = this.config.paddingInner ?? 2;
    const paddingOuter = this.config.paddingOuter ?? 4;

    const root = d3.hierarchy(this.data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemapLayout = d3.treemap<TreemapDataNode>()
      .size([this.width, this.height])
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter)
      .round(true);

    treemapLayout(root as any);

    const leaves = root.leaves() as d3.HierarchyRectangularNode<TreemapDataNode>[];
    const colorScale = d3.scaleOrdinal<string>()
      .domain(leaves.map((_, i) => i.toString()))
      .range(this.config.colors || [
        '#0071e3', '#8e44ff', '#ff2d55', '#34c759',
        '#ff9f0a', '#5ac8fa', '#af52de', '#ff3b30'
      ]);

    const cells = this.chartGroup
      .selectAll('.cell')
      .data(leaves)
      .join('g')
      .attr('class', 'cell')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Shadow rectangles
    cells.append('rect')
      .attr('class', 'cell-shadow')
      .attr('width', 0)
      .attr('height', 0)
      .attr('x', 2)
      .attr('y', 2)
      .attr('fill', 'rgba(0, 0, 0, 0.15)')
      .attr('rx', cornerRadius)
      .attr('ry', cornerRadius)
      .transition()
      .duration(this.config.animated !== false ? 600 : 0)
      .delay((_, i) => i * 15)
      .attr('width', d => Math.max(0, d.x1 - d.x0))
      .attr('height', d => Math.max(0, d.y1 - d.y0));

    // Main rectangles
    cells.append('rect')
      .attr('class', 'cell-rect')
      .attr('width', 0)
      .attr('height', 0)
      .attr('fill', (d, i) => d.data.color || colorScale(i.toString()))
      .attr('fill-opacity', 0.85)
      .attr('rx', cornerRadius)
      .attr('ry', cornerRadius)
      .style('filter', 'url(#treemap-shadow)')
      .style('cursor', 'pointer')
      .transition()
      .duration(this.config.animated !== false ? 600 : 0)
      .delay((_, i) => i * 15)
      .ease(d3.easeCubicOut)
      .attr('width', d => Math.max(0, d.x1 - d.x0))
      .attr('height', d => Math.max(0, d.y1 - d.y0));

    // Glass overlay
    cells.append('rect')
      .attr('class', 'cell-glass')
      .attr('width', 0)
      .attr('height', 0)
      .attr('fill', 'url(#treemap-glass-gradient)')
      .attr('rx', cornerRadius)
      .attr('ry', cornerRadius)
      .attr('pointer-events', 'none')
      .transition()
      .duration(this.config.animated !== false ? 600 : 0)
      .delay((_, i) => i * 15)
      .attr('width', d => Math.max(0, d.x1 - d.x0))
      .attr('height', d => Math.max(0, d.y1 - d.y0));

    // Labels
    if (this.config.showLabels !== false) {
      cells.append('text')
        .attr('class', 'cell-label')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => (d.y1 - d.y0) / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .attr('pointer-events', 'none')
        .style('text-shadow', '0 2px 4px rgba(0, 0, 0, 0.4)')
        .attr('opacity', 0)
        .text(d => {
          const width = d.x1 - d.x0;
          const height = d.y1 - d.y0;
          if (width > 60 && height > 30) {
            return d.data.name;
          }
          return '';
        })
        .transition()
        .duration(this.config.animated !== false ? 600 : 0)
        .delay((_, i) => i * 15 + 300)
        .attr('opacity', 1);

      // Value labels
      cells.append('text')
        .attr('class', 'cell-value')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => (d.y1 - d.y0) / 2 + 18)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255, 255, 255, 0.9)')
        .attr('font-size', '12px')
        .attr('pointer-events', 'none')
        .style('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.3)')
        .attr('opacity', 0)
        .text(d => {
          const width = d.x1 - d.x0;
          const height = d.y1 - d.y0;
          if (width > 80 && height > 50 && d.data.value) {
            return d.data.value.toLocaleString();
          }
          return '';
        })
        .transition()
        .duration(this.config.animated !== false ? 600 : 0)
        .delay((_, i) => i * 15 + 400)
        .attr('opacity', 1);
    }

    // Hover effects
    cells
      .on('mouseenter', (event, d: any) => {
        d3.select(event.currentTarget).select('.cell-rect')
          .transition()
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr('fill-opacity', 1)
          .style('filter', 'url(#treemap-glow) url(#treemap-shadow)');

        this.ngZone.run(() => {
          this.showTooltip(event, d.data);
        });
      })
      .on('mousemove', (event) => {
        this.ngZone.run(() => {
          this.tooltipX = event.clientX;
          this.tooltipY = event.clientY;
        });
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).select('.cell-rect')
          .transition()
          .duration(200)
          .ease(d3.easeCubicOut)
          .attr('fill-opacity', 0.85)
          .style('filter', 'url(#treemap-shadow)');

        this.ngZone.run(() => {
          this.hideTooltip();
        });
      });
  }

  private showTooltip(event: MouseEvent, dataNode: TreemapDataNode): void {
    if (this.config.customTooltip) {
      const customData = this.config.customTooltip(dataNode);
      this.tooltipTitle = customData.title || '';
      this.tooltipData = customData.items.map(item => ({
        label: item.label,
        value: item.value,
        color: item.color
      }));
    } else {
      this.tooltipTitle = dataNode.name;
      this.tooltipData = [
        { label: 'Value', value: (dataNode.value || 0).toLocaleString() }
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
