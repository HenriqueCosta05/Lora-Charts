import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { ThemeService } from '../../../services/theme';
import { WordCloudDataPoint } from '../../../types/chart';
import { Tooltip, TooltipData } from '../../base/tooltip/tooltip';

export interface WordCloudConfig {
  animated?: boolean;
  fontFamily?: string;
  fontScale?: number;
  maxWords?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  padding?: number;
  rotate?: number | (() => number);
  colors?: string[];
  spiral?: 'archimedean' | 'rectangular';
  customTooltip?: (data: { text: string; value: number; color?: string }) => {
    title?: string;
    items: Array<{ label: string; value: string | number; color?: string }>;
  };
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

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    themeService: ThemeService,
  ) {
    themeService.loadAndSetTheme('/themes/main.json');
  }

  @Input() data: WordCloudDataPoint[] = [];
  @Input() width: number = 640;
  @Input() height: number = 400;
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

    const marginTop = this.config.marginTop ?? 0;
    const marginRight = this.config.marginRight ?? 0;
    const marginBottom = this.config.marginBottom ?? 0;
    const marginLeft = this.config.marginLeft ?? 0;

    this.svg = container
      .append('svg')
      .attr('viewBox', [0, 0, this.width, this.height])
      .attr('width', this.width)
      .attr('font-family', this.config.fontFamily || 'sans-serif')
      .attr('text-anchor', 'middle')
      .attr('class', 'wordcloud-svg')
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    this.chartGroup = this.svg
      .append('g')
      .attr('transform', `translate(${marginLeft},${marginTop})`);

    this.updateChart();
  }

  private updateChart(): void {
    if (!this.data || this.data.length === 0) return;

    this.chartGroup.selectAll('*').remove();

    const marginTop = this.config.marginTop ?? 0;
    const marginRight = this.config.marginRight ?? 0;
    const marginBottom = this.config.marginBottom ?? 0;
    const marginLeft = this.config.marginLeft ?? 0;
    const fontFamily = this.config.fontFamily || 'sans-serif';
    const fontScale = this.config.fontScale ?? 15;
    const padding = this.config.padding ?? 0;
    const maxWords = this.config.maxWords ?? 250;
    const rotate = this.config.rotate ?? 0;

    this.svg
      .attr('viewBox', [0, 0, this.width, this.height])
      .attr('width', this.width)
      .attr('font-family', fontFamily);

    this.chartGroup.attr('transform', `translate(${marginLeft},${marginTop})`);

    const colorScale = d3
      .scaleOrdinal<string>()
      .range(
        this.config.colors || [
          '#3b82f6',
          '#8b5cf6',
          '#ec4899',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#06b6d4',
          '#f97316',
        ],
      );

    const sortedData = [...this.data]
      .sort((a, b) => d3.descending(a.value, b.value))
      .slice(0, maxWords)
      .map((d) => ({
        text: d.text,
        size: d.value,
        color: d.color,
      }));

    const cloudWidth = this.width - marginLeft - marginRight;
    const cloudHeight = this.height - marginTop - marginBottom;

    const rotateFunc: () => number = typeof rotate === 'function' ? rotate : () => rotate;

    const layout = cloud()
      .size([cloudWidth, cloudHeight])
      .words(sortedData as any)
      .padding(padding)
      .rotate(rotateFunc)
      .font(fontFamily)
      .fontSize((d: any) => Math.sqrt(d.size) * fontScale)
      .spiral(this.config.spiral || 'archimedean')
      .on('word', ({ size, x, y, rotate: r, text }: any) => {
        const word = this.chartGroup
          .append('text')
          .datum({ text, size })
          .attr('font-size', size)
          .attr('fill', (d: any) => colorScale(d.text))
          .attr('transform', `translate(${x},${y}) rotate(${r})`)
          .text(text);

        if (this.config.animated !== false) {
          word
            .attr('opacity', 0)
            .transition()
            .duration(600)
            .ease(d3.easeCubicOut)
            .attr('opacity', 1);
        }

        word
          .style('cursor', 'pointer')
          .on('mouseenter', (event: MouseEvent, d: any) => {
            d3.select(event.currentTarget as Element)
              .transition()
              .duration(200)
              .attr('font-size', size * 1.15);

            this.ngZone.run(() => {
              this.showTooltip(event, d);
            });
          })
          .on('mousemove', (event: MouseEvent) => {
            this.ngZone.run(() => {
              this.tooltipX = event.clientX;
              this.tooltipY = event.clientY;
              this.cdr.detectChanges();
            });
          })
          .on('mouseleave', (event: MouseEvent) => {
            d3.select(event.currentTarget as Element)
              .transition()
              .duration(200)
              .attr('font-size', size);

            this.ngZone.run(() => {
              this.hideTooltip();
            });
          });
      });

    layout.start();
  }

  private showTooltip(event: MouseEvent, dataPoint: any): void {
    const text = dataPoint.text;
    const value = dataPoint.size;

    if (this.config.customTooltip) {
      const customData = this.config.customTooltip({
        text,
        value,
      });
      this.tooltipTitle = customData.title || '';
      this.tooltipData = customData.items.map((item) => ({
        label: item.label,
        value: item.value,
        color: item.color,
      }));
    } else {
      this.tooltipTitle = text;
      this.tooltipData = [{ label: 'Value', value }];
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
