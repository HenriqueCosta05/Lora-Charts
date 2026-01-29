import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ChartDataPoint } from '../../../types/chart';
import { Tooltip, TooltipData } from '../../base/tooltip/tooltip';

export interface PieChartConfig {
    showLabels?: boolean;
    showPercentages?: boolean;
    animated?: boolean;
    innerRadius?: number;
    padAngle?: number;
    cornerRadius?: number;
    colors?: string[];
    customTooltip?: (data: { label: string; value: number; percentage: number; color?: string; }) => { title?: string; items: Array<{ label: string; value: string | number; color?: string; }>; };
}

@Component({
    selector: 'app-pie',
    standalone: true,
    imports: [Tooltip],
    templateUrl: './pie.html',
    styleUrl: './pie.css',
})
export class Pie implements OnInit, OnChanges {
    @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

    @Input() data: ChartDataPoint[] = [];
    @Input() width: number = 500;
    @Input() height: number = 500;
    @Input() config: PieChartConfig = {};

    private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private chartGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;

    tooltipData: TooltipData[] = [];
    tooltipX: number = 0;
    tooltipY: number = 0;
    tooltipVisible: boolean = false;
    tooltipTitle: string = '';

    constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) { }

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
            .attr('class', 'pie-svg')
            .style('overflow', 'visible');

        this.addDefs();

        this.chartGroup = this.svg
            .append('g')
            .attr('class', 'chart-group')
            .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

        this.updateChart();
    }

    private addDefs(): void {
        const defs = this.svg.append('defs');

        // Glass gradient
        const glassGradient = defs.append('radialGradient')
            .attr('id', 'pie-glass-gradient');

        glassGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'rgba(255, 255, 255, 0.6)')
            .attr('stop-opacity', 1);

        glassGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'rgba(255, 255, 255, 0)')
            .attr('stop-opacity', 1);

        // 3D shadow
        const shadow = defs.append('filter')
            .attr('id', 'pie-shadow')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');

        shadow.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 4);

        shadow.append('feOffset')
            .attr('dx', 0)
            .attr('dy', 4);

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

        const radius = Math.min(this.width, this.height) / 2 - 60;
        const innerRadius = this.config.innerRadius ?? 0;

        // Color scale
        const colorScale = d3.scaleOrdinal<string>()
            .domain(this.data.map(d => d.label))
            .range(this.config.colors || ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f97316']);

        // Pie layout
        const pie = d3.pie<ChartDataPoint>()
            .value(d => d.value)
            .sort(null)
            .padAngle(this.config.padAngle ?? 0.02);

        // Arc generator
        const arc = d3.arc<d3.PieArcDatum<ChartDataPoint>>()
            .innerRadius(innerRadius)
            .outerRadius(radius)
            .cornerRadius(this.config.cornerRadius ?? 4);

        // Outer arc for labels
        const outerArc = d3.arc<d3.PieArcDatum<ChartDataPoint>>()
            .innerRadius(radius + 20)
            .outerRadius(radius + 20);

        // Create slices
        const slices = this.chartGroup.selectAll('.slice-group')
            .data(pie(this.data))
            .join('g')
            .attr('class', 'slice-group');

        // Shadow slices
        slices.append('path')
            .attr('class', 'slice-shadow')
            .attr('d', arc as any)
            .attr('transform', 'translate(0, 4)')
            .attr('fill', 'rgba(0, 0, 0, 0.2)');

        // Main slices
        const slicePaths = slices.append('path')
            .attr('class', 'slice')
            .attr('fill', d => d.data.color || colorScale(d.data.label))
            .style('filter', 'url(#pie-shadow)')
            .style('cursor', 'pointer');

        if (this.config.animated !== false) {
            slicePaths
                .attr('d', d3.arc<d3.PieArcDatum<ChartDataPoint>>()
                    .innerRadius(innerRadius)
                    .outerRadius(0)
                    .cornerRadius(this.config.cornerRadius ?? 4) as any)
                .transition()
                .duration(800)
                .delay((_, i) => i * 100)
                .attrTween('d', function (d: any) {
                    const interpolate = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
                    return function (t: number) {
                        return arc(interpolate(t) as any)!;
                    };
                });
        } else {
            slicePaths.attr('d', arc as any);
        }

        // Glass overlay
        slices.append('path')
            .attr('class', 'slice-glass')
            .attr('d', arc as any)
            .attr('fill', 'url(#pie-glass-gradient)')
            .attr('pointer-events', 'none')
            .attr('opacity', 0.3);

        // Add hover effects
        const cornerRadius = this.config.cornerRadius ?? 4;
        const total = d3.sum(this.data, d => d.value);

        // Attach event handlers to the slice path for better control
        slicePaths
            .style('cursor', 'pointer')
            .on('mouseenter', (event: any, d: any) => {
                const element = event.currentTarget;
                const arcTween = d3.arc<d3.PieArcDatum<ChartDataPoint>>()
                    .innerRadius(innerRadius)
                    .outerRadius(radius + 10)
                    .cornerRadius(cornerRadius);

                d3.select(element)
                    .transition()
                    .duration(200)
                    .attr('d', arcTween as any);

                this.ngZone.run(() => {
                    this.showTooltip(event, d.data, total, d.data.color || colorScale(d.data.label));
                });
            })
            .on('mousemove', (event) => {
                this.ngZone.run(() => {
                    this.tooltipX = event.clientX;
                    this.tooltipY = event.clientY;
                });
            })
            .on('mouseleave', (event: any, d: any) => {
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('d', arc as any);

                this.ngZone.run(() => {
                    this.hideTooltip();
                });
            });

        // Add labels if enabled
        if (this.config.showLabels !== false) {
            this.addLabels(slices as d3.Selection<SVGGElement, d3.PieArcDatum<ChartDataPoint>, SVGGElement, unknown>, arc, outerArc, pie(this.data));
        }

        // Add center text for donut chart
        if (innerRadius > 0) {
            const total = d3.sum(this.data, d => d.value);

            this.chartGroup.append('text')
                .attr('class', 'donut-total-label')
                .attr('text-anchor', 'middle')
                .attr('dy', '-0.3em')
                .attr('fill', 'var(--color-text)')
                .attr('font-size', 'var(--font-size-sm)')
                .attr('opacity', 0.7)
                .text('Total');

            this.chartGroup.append('text')
                .attr('class', 'donut-total-value')
                .attr('text-anchor', 'middle')
                .attr('dy', '1.2em')
                .attr('fill', 'var(--color-text)')
                .attr('font-size', 'var(--font-size-xl)')
                .attr('font-weight', '700')
                .style('text-shadow', '0 2px 4px rgba(0, 0, 0, 0.1)')
                .text(total.toLocaleString());
        }
    }

    private addLabels(
        slices: d3.Selection<SVGGElement, d3.PieArcDatum<ChartDataPoint>, SVGGElement, unknown>,
        arc: d3.Arc<any, d3.PieArcDatum<ChartDataPoint>>,
        outerArc: d3.Arc<any, d3.PieArcDatum<ChartDataPoint>>,
        pieData: d3.PieArcDatum<ChartDataPoint>[]
    ): void {
        const total = d3.sum(this.data, d => d.value);

        // Add polylines
        slices.append('polyline')
            .attr('class', 'label-line')
            .attr('points', d => {
                const pos = outerArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = (Math.min(this.width, this.height) / 2 - 30) * (midAngle < Math.PI ? 1 : -1);
                return [arc.centroid(d), outerArc.centroid(d), pos].map(p => p.join(',')).join(' ');
            })
            .attr('stroke', 'var(--color-border)')
            .attr('stroke-width', 1.5)
            .attr('fill', 'none')
            .attr('opacity', 0.6)
            .attr('pointer-events', 'none');

        // Add labels
        const labels = slices.append('text')
            .attr('class', 'slice-label')
            .attr('transform', d => {
                const pos = outerArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = (Math.min(this.width, this.height) / 2 - 20) * (midAngle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .attr('text-anchor', d => {
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return midAngle < Math.PI ? 'start' : 'end';
            })
            .attr('fill', 'var(--color-text)')
            .attr('font-size', 'var(--font-size-sm)')
            .attr('font-weight', '600')
            .style('text-shadow', '0 1px 2px rgba(255, 255, 255, 0.8)')
            .attr('pointer-events', 'none');

        labels.append('tspan')
            .attr('x', 0)
            .attr('dy', '0em')
            .text(d => d.data.label);

        if (this.config.showPercentages !== false) {
            labels.append('tspan')
                .attr('x', 0)
                .attr('dy', '1.2em')
                .attr('opacity', 0.7)
                .attr('font-size', 'var(--font-size-xs)')
                .text(d => `${((d.data.value / total) * 100).toFixed(1)}%`);
        }

        // Animate labels
        if (this.config.animated !== false) {
            labels
                .attr('opacity', 0)
                .transition()
                .duration(400)
                .delay((_, i) => i * 100 + 800)
                .attr('opacity', 1);

            slices.selectAll('.label-line')
                .attr('opacity', 0)
                .transition()
                .duration(400)
                .delay((_, i) => i * 100 + 800)
                .attr('opacity', 0.6);
        }
    }

    private showTooltip(event: MouseEvent, dataPoint: ChartDataPoint, total: number, color: string): void {
        const percentage = (dataPoint.value / total) * 100;

        if (this.config.customTooltip) {
            const customData = this.config.customTooltip({
                label: dataPoint.label,
                value: dataPoint.value,
                percentage,
                color
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
                { label: 'Value', value: dataPoint.value.toLocaleString(), color },
                { label: 'Percentage', value: `${percentage.toFixed(1)}%` }
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
