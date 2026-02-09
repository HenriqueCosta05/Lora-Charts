import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { GaugeData } from '../../../types/chart';
import { Tooltip, TooltipData } from '../../base/tooltip/tooltip';

export interface GaugeConfig {
    animated?: boolean;
    showValue?: boolean;
    showLabel?: boolean;
    arcWidth?: number;
    startAngle?: number;
    endAngle?: number;
}

@Component({
    selector: 'app-gauge',
    standalone: true,
    imports: [Tooltip],
    templateUrl: './gauge.html',
    styleUrl: './gauge.css',
})
export class Gauge implements OnInit, OnChanges {
    @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

    @Input() data: GaugeData = { value: 0, min: 0, max: 100 };
    @Input() width: number = 400;
    @Input() height: number = 300;
    @Input() config: GaugeConfig = {};

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
            .attr('class', 'gauge-svg')
            .style('overflow', 'visible');

        this.addDefs();

        this.chartGroup = this.svg
            .append('g')
            .attr('class', 'chart-group')
            .attr('transform', `translate(${this.width / 2},${this.height * 0.75})`);

        this.updateChart();
    }

    private addDefs(): void {
        const defs = this.svg.append('defs');

        const gradient = defs.append('linearGradient')
            .attr('id', 'gauge-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#10b981');

        gradient.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', '#f59e0b');

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#ef4444');

        const glassGradient = defs.append('radialGradient')
            .attr('id', 'gauge-glass-gradient');

        glassGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'rgba(255, 255, 255, 0.6)')
            .attr('stop-opacity', 1);

        glassGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'rgba(255, 255, 255, 0)')
            .attr('stop-opacity', 1);

        const shadow = defs.append('filter')
            .attr('id', 'gauge-shadow')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');

        shadow.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 3);

        shadow.append('feOffset')
            .attr('dx', 0)
            .attr('dy', 3);

        shadow.append('feComponentTransfer')
            .append('feFuncA')
            .attr('type', 'linear')
            .attr('slope', 0.3);

        const feMerge = shadow.append('feMerge');
        feMerge.append('feMergeNode');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }

    private updateChart(): void {
        this.chartGroup.selectAll('*').remove();

        const radius = Math.min(this.width, this.height * 1.5) / 2 - 20;
        const arcWidth = this.config.arcWidth ?? 40;
        const startAngle = this.config.startAngle ?? -Math.PI * 0.75;
        const endAngle = this.config.endAngle ?? Math.PI * 0.75;

        const backgroundArc = d3.arc()
            .innerRadius(radius - arcWidth)
            .outerRadius(radius)
            .startAngle(startAngle)
            .endAngle(endAngle)
            .cornerRadius(8);

        this.chartGroup.append('path')
            .datum({ startAngle, endAngle })
            .attr('class', 'gauge-background')
            .attr('d', backgroundArc as any)
            .attr('fill', 'var(--color-border)')
            .attr('opacity', 0.2);

        const valueArc = d3.arc()
            .innerRadius(radius - arcWidth)
            .outerRadius(radius)
            .startAngle(startAngle)
            .cornerRadius(8);

        const percentage = (this.data.value - this.data.min) / (this.data.max - this.data.min);
        const valueAngle = startAngle + (endAngle - startAngle) * percentage;

        this.chartGroup.append('path')
            .datum({ startAngle, endAngle: valueAngle })
            .attr('class', 'gauge-value-shadow')
            .attr('d', valueArc as any)
            .attr('transform', 'translate(0, 3)')
            .attr('fill', 'rgba(0, 0, 0, 0.2)');

        const valuePath = this.chartGroup.append('path')
            .datum({ startAngle, endAngle: startAngle })
            .attr('class', 'gauge-value')
            .attr('d', valueArc as any)
            .attr('fill', this.getColor(percentage))
            .style('filter', 'url(#gauge-shadow)');

        if (this.config.animated !== false) {
            valuePath
                .transition()
                .duration(1500)
                .ease(d3.easeElasticOut.amplitude(1).period(0.5))
                .attrTween('d', function () {
                    const interpolate = d3.interpolate(startAngle, valueAngle);
                    return function (t: number) {
                        const currentAngle = interpolate(t);
                        return valueArc({ startAngle, endAngle: currentAngle } as any)!;
                    };
                });
        } else {
            valuePath.datum({ startAngle, endAngle: valueAngle }).attr('d', valueArc as any);
        }

        this.chartGroup.append('path')
            .datum({ startAngle, endAngle: valueAngle })
            .attr('class', 'gauge-glass')
            .attr('d', valueArc as any)
            .attr('fill', 'url(#gauge-glass-gradient)')
            .attr('pointer-events', 'none')
            .attr('opacity', 0.3);

        this.chartGroup.append('circle')
            .attr('r', radius - arcWidth - 10)
            .attr('fill', 'var(--color-background)')
            .attr('opacity', 0.5)
            .style('filter', 'url(#gauge-shadow)');

        if (this.config.showValue !== false) {
            const valueText = this.chartGroup.append('text')
                .attr('class', 'gauge-value-text')
                .attr('text-anchor', 'middle')
                .attr('dy', '-0.3em')
                .attr('fill', 'var(--color-text)')
                .attr('font-size', radius / 3)
                .attr('font-weight', '700')
                .style('text-shadow', '0 2px 4px rgba(0, 0, 0, 0.2)');

            if (this.config.animated !== false) {
                valueText.text('0');
                const targetValue = this.data.value;
                valueText
                    .transition()
                    .duration(1500)
                    .tween('text', function () {
                        const interpolate = d3.interpolate(0, targetValue);
                        const element = this;
                        return function (t: number) {
                            d3.select(element).text(Math.round(interpolate(t)));
                        };
                    });
            } else {
                valueText.text(Math.round(this.data.value));
            }
        }

        if (this.config.showLabel !== false && this.data.label) {
            this.chartGroup.append('text')
                .attr('class', 'gauge-label-text')
                .attr('text-anchor', 'middle')
                .attr('dy', '1.2em')
                .attr('fill', 'var(--color-text)')
                .attr('font-size', 'var(--font-size-sm)')
                .attr('opacity', 0.7)
                .text(this.data.label);
        }

        if (this.data.thresholds && this.data.thresholds.length > 0) {
            this.addThresholds(radius, arcWidth, startAngle, endAngle);
        }
    }

    private addThresholds(
        radius: number,
        arcWidth: number,
        startAngle: number,
        endAngle: number
    ): void {
        const thresholdGroup = this.chartGroup.append('g').attr('class', 'thresholds');

        this.data.thresholds?.forEach(threshold => {
            const percentage = (threshold.value - this.data.min) / (this.data.max - this.data.min);
            const angle = startAngle + (endAngle - startAngle) * percentage;

            const x1 = Math.cos(angle) * (radius - arcWidth - 5);
            const y1 = Math.sin(angle) * (radius - arcWidth - 5);
            const x2 = Math.cos(angle) * (radius + 5);
            const y2 = Math.sin(angle) * (radius + 5);

            thresholdGroup.append('line')
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x2)
                .attr('y2', y2)
                .attr('stroke', threshold.color)
                .attr('stroke-width', 2)
                .attr('opacity', 0.6);
        });
    }

    private getColor(percentage: number): string {
        if (percentage < 0.3) return '#ef4444';
        if (percentage < 0.6) return '#f59e0b';
        if (percentage < 0.8) return '#eab308';
        return '#10b981';
    }
}
