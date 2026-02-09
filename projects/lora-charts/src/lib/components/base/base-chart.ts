import { ElementRef, inject } from '@angular/core';
import * as d3 from 'd3';
import { ThemeService } from '../../services/theme';

export interface ChartMargin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface ChartDimensions {
    width: number;
    height: number;
    innerWidth: number;
    innerHeight: number;
}

export abstract class BaseChart {
    protected themeService = inject(ThemeService);
    protected svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    protected chartGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;

    protected margin: ChartMargin = {
        top: 40,
        right: 40,
        bottom: 60,
        left: 60,
    };

    protected dimensions: ChartDimensions = {
        width: 800,
        height: 500,
        innerWidth: 0,
        innerHeight: 0,
    };

    protected animationDuration = 300;

    constructor(protected container: ElementRef, themeService: ThemeService) {
        themeService.loadAndSetTheme('/themes/main.json');
    }

    protected initializeSVG(): void {
        const containerElement = this.container.nativeElement;

        d3.select(containerElement).select('svg').remove();

        this.svg = d3.select(containerElement)
            .append('svg')
            .attr('width', this.dimensions.width)
            .attr('height', this.dimensions.height)
            .attr('class', 'chart-svg')
            .style('overflow', 'visible');

        this.addDefs();

        this.chartGroup = this.svg.append('g')
            .attr('class', 'chart-group')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        this.calculateInnerDimensions();
    }

    protected calculateInnerDimensions(): void {
        this.dimensions.innerWidth = this.dimensions.width - this.margin.left - this.margin.right;
        this.dimensions.innerHeight = this.dimensions.height - this.margin.top - this.margin.bottom;
    }

    protected addDefs(): void {
        const defs = this.svg.append('defs');

        // Enhanced Glass Gradient with multiple layers
        const glassGradient = defs.append('linearGradient')
            .attr('id', 'glass-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
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
            .attr('stop-color', 'rgba(255, 255, 255, 0.1)')
            .attr('stop-opacity', 1);

        // Radial Glass Effect
        const radialGlass = defs.append('radialGradient')
            .attr('id', 'radial-glass')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '50%');

        radialGlass.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', 'rgba(255, 255, 255, 0.8)')
            .attr('stop-opacity', 1);

        radialGlass.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', 'rgba(255, 255, 255, 0.2)')
            .attr('stop-opacity', 1);

        // Enhanced 3D Shadow Filter
        const shadow3D = defs.append('filter')
            .attr('id', 'shadow-3d')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');

        shadow3D.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 5);

        shadow3D.append('feOffset')
            .attr('dx', 0)
            .attr('dy', 6)
            .attr('result', 'offsetblur');

        shadow3D.append('feComponentTransfer')
            .append('feFuncA')
            .attr('type', 'linear')
            .attr('slope', 0.25);

        const feMerge = shadow3D.append('feMerge');
        feMerge.append('feMergeNode');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Stronger 3D Shadow
        const shadowStrong = defs.append('filter')
            .attr('id', 'shadow-3d-strong')
            .attr('x', '-100%')
            .attr('y', '-100%')
            .attr('width', '300%')
            .attr('height', '300%');

        shadowStrong.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 8);

        shadowStrong.append('feOffset')
            .attr('dx', 0)
            .attr('dy', 10)
            .attr('result', 'offsetblur');

        shadowStrong.append('feComponentTransfer')
            .append('feFuncA')
            .attr('type', 'linear')
            .attr('slope', 0.3);

        const strongMerge = shadowStrong.append('feMerge');
        strongMerge.append('feMergeNode');
        strongMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Glow Effect
        const glow = defs.append('filter')
            .attr('id', 'glow')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');

        glow.append('feGaussianBlur')
            .attr('stdDeviation', 4)
            .attr('result', 'coloredBlur');

        const glowMerge = glow.append('feMerge');
        glowMerge.append('feMergeNode').attr('in', 'coloredBlur');
        glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Strong Glow
        const glowStrong = defs.append('filter')
            .attr('id', 'glow-strong')
            .attr('x', '-100%')
            .attr('y', '-100%')
            .attr('width', '300%')
            .attr('height', '300%');

        glowStrong.append('feGaussianBlur')
            .attr('stdDeviation', 8)
            .attr('result', 'coloredBlur');

        const glowStrongMerge = glowStrong.append('feMerge');
        glowStrongMerge.append('feMergeNode').attr('in', 'coloredBlur');
        glowStrongMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Inner Shadow for depth
        const innerShadow = defs.append('filter')
            .attr('id', 'inner-shadow')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');

        innerShadow.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 3);

        innerShadow.append('feOffset')
            .attr('dx', 0)
            .attr('dy', 2);

        innerShadow.append('feComposite')
            .attr('operator', 'out')
            .attr('in', 'SourceGraphic')
            .attr('result', 'inverse');

        innerShadow.append('feFlood')
            .attr('flood-color', 'black')
            .attr('flood-opacity', 0.3)
            .attr('result', 'color');

        innerShadow.append('feComposite')
            .attr('operator', 'in')
            .attr('in', 'color')
            .attr('in2', 'inverse')
            .attr('result', 'shadow');

        const innerMerge = innerShadow.append('feMerge');
        innerMerge.append('feMergeNode').attr('in', 'shadow');
        innerMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }

    protected getColorScale(domain: string[], colors?: string[]): d3.ScaleOrdinal<string, string> {
        const modernColors = [
            '#0071e3', // Apple Blue
            '#8e44ff', // Purple
            '#ff2d55', // Pink
            '#34c759', // Green
            '#ff9f0a', // Orange
            '#5ac8fa', // Cyan
            '#af52de', // Violet
            '#ff3b30', // Red
        ];

        return d3.scaleOrdinal<string, string>()
            .domain(domain)
            .range(colors || modernColors);
    }

    protected createGradient(id: string, colors: string[], direction: 'vertical' | 'horizontal' = 'vertical'): string {
        const defs = this.svg.select('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', id)
            .attr('x1', direction === 'horizontal' ? '0%' : '0%')
            .attr('y1', direction === 'horizontal' ? '0%' : '0%')
            .attr('x2', direction === 'horizontal' ? '100%' : '0%')
            .attr('y2', direction === 'horizontal' ? '0%' : '100%');

        colors.forEach((color, i) => {
            gradient.append('stop')
                .attr('offset', `${(i / (colors.length - 1)) * 100}%`)
                .attr('stop-color', color);
        });

        return `url(#${id})`;
    }

    protected addGlassEffect(selection: d3.Selection<any, any, any, any>, strength: 'subtle' | 'medium' | 'strong' = 'medium'): void {
        const opacityMap = { subtle: 0.5, medium: 0.7, strong: 0.85 };
        selection
            .style('fill', function () {
                const currentFill = d3.select(this).style('fill');
                return currentFill;
            })
            .style('fill-opacity', opacityMap[strength])
            .style('filter', 'url(#shadow-3d)');
    }

    protected addHoverEffect(selection: d3.Selection<any, any, any, any>, scale: number = 1.05): void {
        selection
            .style('cursor', 'pointer')
            .on('mouseenter', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .ease(d3.easeCubicOut)
                    .style('filter', 'url(#glow-strong) url(#shadow-3d-strong)')
                    .attr('transform', function () {
                        const current = d3.select(this).attr('transform') || '';
                        return current + ` scale(${scale})`;
                    });
            })
            .on('mouseleave', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .ease(d3.easeCubicOut)
                    .style('filter', 'url(#shadow-3d)')
                    .attr('transform', function () {
                        const current = d3.select(this).attr('transform') || '';
                        return current.replace(` scale(${scale})`, '');
                    });
            });
    }

    protected add3DDepth(selection: d3.Selection<any, any, any, any>, depth: number = 4): void {
        selection.each(function () {
            const element = d3.select(this);
            const color = element.attr('fill') || element.style('fill');

            // Create depth layers
            for (let i = depth; i > 0; i--) {
                const depthLayer = element.clone(true);
                depthLayer
                    .attr('fill', d3.color(color)?.darker(i * 0.3).toString() || color)
                    .attr('transform', `translate(0, ${i})`)
                    .style('opacity', 0.2)
                    .lower();
            }
        });
    }

    protected formatNumber(value: number, decimals: number = 2): string {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals,
        });
    }

    protected resize(width: number, height: number): void {
        this.dimensions.width = width;
        this.dimensions.height = height;
        this.calculateInnerDimensions();

        if (this.svg) {
            this.svg
                .attr('width', width)
                .attr('height', height);
        }

        this.render();
    }

    abstract render(): void;
    abstract updateData(data: any): void;
}
