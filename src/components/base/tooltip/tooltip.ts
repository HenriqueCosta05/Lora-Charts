import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ThemeService } from '../../../services/theme';

export interface TooltipData {
  label: string;
  value: string | number;
  color?: string;
}

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.css',
})
export class Tooltip implements OnChanges {
  @Input() data: TooltipData[] = [];
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() visible: boolean = false;
  @Input() title?: string;

  position = { x: 0, y: 0 };
  private offset = { x: 15, y: 15 };

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    themeService: ThemeService,
  ) {
    themeService.loadAndSetTheme('/themes/main.json');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['x'] || changes['y'] || changes['visible']) {
      setTimeout(() => this.updatePosition(), 0);
    }
  }

  private updatePosition(): void {
    if (!this.visible) {
      this.position = { x: this.x + this.offset.x, y: this.y + this.offset.y };
      return;
    }

    const element = this.elementRef.nativeElement.querySelector('.tooltip-container');

    if (!element) {
      this.position = { x: this.x + this.offset.x, y: this.y + this.offset.y };
      return;
    }

    const tooltipWidth = element.offsetWidth || 200;
    const tooltipHeight = element.offsetHeight || 100;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const margin = 10;

    let x = this.x + this.offset.x;
    let y = this.y + this.offset.y;

    if (x + tooltipWidth + margin > windowWidth) {
      x = this.x - tooltipWidth - this.offset.x;
    }

    if (x < margin) {
      x = margin;
    }

    if (y + tooltipHeight + margin > windowHeight) {
      y = this.y - tooltipHeight - this.offset.y;
    }

    if (y < margin) {
      y = margin;
    }

    this.position = { x, y };
  }

  private overflowCheck(): void {
    const element = this.elementRef.nativeElement.querySelector('.tooltip-container');

    if (!element) {
      return;
    }

    const tooltipWidth = element.offsetWidth || 200;
    const tooltipHeight = element.offsetHeight || 100;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const margin = 10;

    if (
      this.position.x + tooltipWidth + margin > windowWidth ||
      this.position.y + tooltipHeight + margin > windowHeight
    ) {
      this.updatePosition();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.visible) {
      this.updatePosition();
    }
  }

  @HostListener('window:overflow')
  onOverflow(): void {
    if (this.visible) {
      this.overflowCheck();
    }
  }
}
