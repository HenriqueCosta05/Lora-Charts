import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ThemeService } from '../../../services/theme';

export type GridOrientation = 'horizontal' | 'vertical' | 'both';

@Component({
    selector: 'app-grid',
    standalone: true,
    imports: [],
    templateUrl: './grid.html',
    styleUrl: './grid.css',
})
export class Grid implements OnInit, AfterViewInit, OnChanges {

    constructor(themeService: ThemeService) {
        themeService.loadAndSetTheme('/themes/main.json');
    }

    @ViewChild('gridContainer', { static: false }) gridContainer!: ElementRef<SVGGElement>;

    @Input() xScale!: d3.AxisScale<any>;
    @Input() yScale!: d3.AxisScale<any>;
    @Input() width!: number;
    @Input() height!: number;
    @Input() orientation: GridOrientation = 'both';
    @Input() xTicks?: number;
    @Input() yTicks?: number;
    @Input() strokeDasharray: string = '4,4';
    @Input() opacity: number = 0.2;

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        this.renderGrid();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.gridContainer) {
            this.renderGrid();
        }
    }

    private renderGrid(): void {
        if (!this.gridContainer) return;

        const g = d3.select(this.gridContainer.nativeElement);
        g.selectAll('*').remove();

        if (this.orientation === 'vertical' || this.orientation === 'both') {
            this.renderVerticalLines(g);
        }

        if (this.orientation === 'horizontal' || this.orientation === 'both') {
            this.renderHorizontalLines(g);
        }
    }

    private renderVerticalLines(g: d3.Selection<SVGGElement, unknown, null, undefined>): void {
        const tickValues = (this.xScale as any).ticks
            ? (this.xScale as any).ticks(this.xTicks || 10)
            : this.xScale.domain();

        g.selectAll('.grid-line-vertical')
            .data(tickValues)
            .join('line')
            .attr('class', 'grid-line-vertical')
            .attr('x1', (d: any) => this.xScale(d)!)
            .attr('x2', (d: any) => this.xScale(d)!)
            .attr('y1', 0)
            .attr('y2', this.height)
            .attr('stroke', 'var(--color-border)')
            .attr('stroke-width', 1)
            .attr('opacity', this.opacity)
            .attr('stroke-dasharray', this.strokeDasharray);
    }

    private renderHorizontalLines(g: d3.Selection<SVGGElement, unknown, null, undefined>): void {
        const tickValues = (this.yScale as any).ticks
            ? (this.yScale as any).ticks(this.yTicks || 10)
            : this.yScale.domain();

        g.selectAll('.grid-line-horizontal')
            .data(tickValues)
            .join('line')
            .attr('class', 'grid-line-horizontal')
            .attr('x1', 0)
            .attr('x2', this.width)
            .attr('y1', (d: any) => this.yScale(d)!)
            .attr('y2', (d: any) => this.yScale(d)!)
            .attr('stroke', 'var(--color-border)')
            .attr('stroke-width', 1)
            .attr('opacity', this.opacity)
            .attr('stroke-dasharray', this.strokeDasharray);
    }
}
