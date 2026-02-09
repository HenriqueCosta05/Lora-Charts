import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { WordCloudDataPoint } from '../../../types/chart';
import { Tooltip, TooltipData } from '../../base/tooltip/tooltip';

export interface WordCloudConfig {
    animated?: boolean;
    fontFamily?: string;
    minFontSize?: number;
    maxFontSize?: number;
    rotation?: number | (() => number);
    padding?: number;
    colors?: string[];
    spiral?: 'archimedean' | 'rectangular';
    customTooltip?: (data: { text: string; value: number; color?: string; }) => { title?: string; items: Array<{ label: string; value: string | number; color?: string; }>; };
}

@Component({
    selector: 'app-wordcloud',
    standalone: true,
    imports: [Tooltip],
    templateUrl: './wordcloud.html',
    styleUrl: './wordcloud.css',
})
export class WordCloud implements OnInit, OnChanges {
    @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

    @Input() data: WordCloudDataPoint[] = [];
    @Input() width: number = 800;
    @Input() height: number = 600;
    @Input() config: WordCloudConfig = {};

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
            .attr('class', 'wordcloud-svg')
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

        // Text shadow filter
        const shadow = defs.append('filter')
            .attr('id', 'word-shadow')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');

        shadow.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 2);

        shadow.append('feOffset')
            .attr('dx', 0)
            .attr('dy', 2);

        shadow.append('feComponentTransfer')
            .append('feFuncA')
            .attr('type', 'linear')
            .attr('slope', 0.3);

        const feMerge = shadow.append('feMerge');
        feMerge.append('feMergeNode');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Glow filter
        const glow = defs.append('filter')
            .attr('id', 'word-glow')
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
        if (!this.data || this.data.length === 0) return;

        this.chartGroup.selectAll('*').remove();

        // Create font size scale
        const values = this.data.map(d => d.value);
        const fontScale = d3.scaleLinear()
            .domain([Math.min(...values), Math.max(...values)])
            .range([this.config.minFontSize || 16, this.config.maxFontSize || 80]);

        // Color scale
        const colorScale = d3.scaleOrdinal<string>()
            .domain(this.data.map(d => d.text))
            .range(this.config.colors || ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f97316']);

        // Create layout
        const layout = cloud()
            .size([this.width, this.height])
            .words(this.data.map(d => ({
                text: d.text,
                size: fontScale(d.value),
                color: d.color || colorScale(d.text),
                value: d.value
            })))
            .padding(this.config.padding ?? 5)
            .rotate(this.config.rotation ?? (() => (Math.random() > 0.5 ? 0 : 90)))
            .font(this.config.fontFamily || 'var(--font-family)')
            .fontSize((d: any) => d.size)
            .spiral(this.config.spiral || 'archimedean')
            .on('end', (words: any[]) => {
                this.renderWords(words);
            });

        layout.start();
    }

    private renderWords(words: any[]): void {
        const wordGroups = this.chartGroup.selectAll('.word-group')
            .data(words)
            .join('g')
            .attr('class', 'word-group')
            .attr('transform', d => `translate(${d.x},${d.y})`);

        // Add text shadow
        wordGroups.append('text')
            .attr('class', 'word-shadow')
            .attr('text-anchor', 'middle')
            .attr('transform', d => `rotate(${d.rotate}) translate(1, 1)`)
            .attr('font-size', d => `${d.size}px`)
            .attr('font-family', this.config.fontFamily || 'var(--font-family)')
            .attr('font-weight', '700')
            .attr('fill', 'rgba(0, 0, 0, 0.2)')
            .text(d => d.text);

        // Add main text
        const wordElements = wordGroups.append('text')
            .attr('class', 'word')
            .attr('text-anchor', 'middle')
            .attr('transform', (d: any) => `rotate(${d.rotate})`)
            .attr('font-size', (d: any) => `${d.size}px`)
            .attr('font-family', this.config.fontFamily || 'var(--font-family)')
            .attr('font-weight', '700')
            .attr('fill', (d: any) => d.color)
            .style('filter', 'url(#word-shadow)')
            .text((d: any) => d.text);

        // Animate words
        if (this.config.animated !== false) {
            wordElements
                .attr('opacity', 0)
                .attr('transform', (d: any) => `rotate(${d.rotate}) scale(0)`)
                .transition()
                .duration(800)
                .delay((_: any, i: number) => i * 50)
                .ease(d3.easeBackOut)
                .attr('opacity', 1)
                .attr('transform', (d: any) => `rotate(${d.rotate}) scale(1)`);
        }

        // Add hover effects
        wordElements
            .on('mouseenter', function (_event: any, d: any) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('transform', `rotate(${d.rotate}) scale(1.2)`)
                    .style('filter', 'url(#word-glow) url(#word-shadow)')
                    .attr('cursor', 'pointer');
            })
            .on('mouseleave', function (_event: any, d: any) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('transform', `rotate(${d.rotate}) scale(1)`)
                    .style('filter', 'url(#word-shadow)');
            });

        // Add tooltips on hover
        wordElements
            .append('title')
            .text((d: any) => `${d.text}: ${d.value}`);
    }
}
