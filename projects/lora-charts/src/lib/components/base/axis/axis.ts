import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ThemeService } from '../../../services/theme';

export type AxisOrientation = 'top' | 'bottom' | 'left' | 'right';
export type AxisScale = d3.AxisScale<any>;

@Component({
  selector: 'app-axis',
  standalone: true,
  imports: [],
  templateUrl: './axis.html',
  styleUrl: './axis.css',
})
export class Axis implements OnInit, AfterViewInit, OnChanges {

  constructor(themeService: ThemeService) {
    themeService.loadAndSetTheme('/themes/main.json');
  }

  @ViewChild('axisContainer', { static: false }) axisContainer!: ElementRef<SVGGElement>;

  @Input() scale!: AxisScale;
  @Input() orientation: AxisOrientation = 'bottom';
  @Input() label?: string;
  @Input() ticks?: number;
  @Input() tickFormat?: (domainValue: any, index: number) => string;
  @Input() tickValues?: any[];
  @Input() gridLines: boolean = false;
  @Input() gridWidth?: number;
  @Input() gridHeight?: number;

  private axis!: d3.Axis<any>;

  ngOnInit(): void {
    this.createAxis();
  }

  ngAfterViewInit(): void {
    this.renderAxis();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scale'] || changes['orientation'] || changes['ticks'] || changes['tickFormat'] || changes['tickValues']) {
      this.createAxis();
      if (this.axisContainer) {
        this.renderAxis();
      }
    }
  }

  private createAxis(): void {
    switch (this.orientation) {
      case 'top':
        this.axis = d3.axisTop(this.scale);
        break;
      case 'bottom':
        this.axis = d3.axisBottom(this.scale);
        break;
      case 'left':
        this.axis = d3.axisLeft(this.scale);
        break;
      case 'right':
        this.axis = d3.axisRight(this.scale);
        break;
    }

    if (this.ticks) {
      this.axis.ticks(this.ticks);
    }

    if (this.tickFormat) {
      this.axis.tickFormat(this.tickFormat);
    }

    if (this.tickValues) {
      this.axis.tickValues(this.tickValues);
    }
  }

  private renderAxis(): void {
    if (!this.axisContainer) return;

    const g = d3.select(this.axisContainer.nativeElement);
    g.selectAll('*').remove();

    if (this.gridLines && this.gridWidth && this.gridHeight) {
      this.renderGridLines(g);
    }

    g.call(this.axis as any);

    g.selectAll('.domain')
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    g.selectAll('.tick line')
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.5);

    g.selectAll('.tick text')
      .attr('fill', 'var(--color-text)')
      .attr('font-size', 'var(--font-size-sm)')
      .attr('font-family', 'var(--font-family)')
      .style('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.1)');

    if (this.label) {
      this.addAxisLabel(g);
    }
  }

  private renderGridLines(g: d3.Selection<SVGGElement, unknown, null, undefined>): void {
    const isVertical = this.orientation === 'left' || this.orientation === 'right';

    const tickValues = this.tickValues ||
      ((this.scale as any).ticks ? (this.scale as any).ticks(this.ticks || 10) : this.scale.domain());

    if (isVertical) {
      g.selectAll('.grid-line')
        .data(tickValues)
        .join('line')
        .attr('class', 'grid-line')
        .attr('x1', 0)
        .attr('x2', this.gridWidth!)
        .attr('y1', (d: any) => this.scale(d)!)
        .attr('y2', (d: any) => this.scale(d)!)
        .attr('stroke', 'var(--color-border)')
        .attr('stroke-width', 1)
        .attr('opacity', 0.2)
        .attr('stroke-dasharray', '4,4');
    } else {
      g.selectAll('.grid-line')
        .data(tickValues)
        .join('line')
        .attr('class', 'grid-line')
        .attr('x1', (d: any) => this.scale(d)!)
        .attr('x2', (d: any) => this.scale(d)!)
        .attr('y1', 0)
        .attr('y2', -this.gridHeight!)
        .attr('stroke', 'var(--color-border)')
        .attr('stroke-width', 1)
        .attr('opacity', 0.2)
        .attr('stroke-dasharray', '4,4');
    }
  }

  private addAxisLabel(g: d3.Selection<SVGGElement, unknown, null, undefined>): void {
    const isVertical = this.orientation === 'left' || this.orientation === 'right';

    if (isVertical) {
      const yPos = this.gridHeight ? -this.gridHeight / 2 : 0;
      const xPos = this.orientation === 'left' ? -50 : 50;

      g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${xPos}, ${yPos}) rotate(-90)`)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--color-text)')
        .attr('font-size', 'var(--font-size-md)')
        .attr('font-weight', '600')
        .attr('font-family', 'var(--font-family)')
        .attr('letter-spacing', '0.5px')
        .style('text-shadow', '0 2px 4px rgba(0, 0, 0, 0.15)')
        .text(this.label!);
    } else {
      const xPos = this.gridWidth ? this.gridWidth / 2 : 0;
      const yPos = this.orientation === 'top' ? -25 : 45;

      g.append('text')
        .attr('class', 'axis-label')
        .attr('x', xPos)
        .attr('y', yPos)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--color-text)')
        .attr('font-size', 'var(--font-size-md)')
        .attr('font-weight', '600')
        .attr('font-family', 'var(--font-family)')
        .attr('letter-spacing', '0.5px')
        .style('text-shadow', '0 2px 4px rgba(0, 0, 0, 0.15)')
        .text(this.label!);
    }
  }
}
