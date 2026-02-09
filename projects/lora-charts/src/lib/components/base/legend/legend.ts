import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from '../../../services/theme';

export interface LegendItem {
    label: string;
    color: string;
    visible?: boolean;
    shape?: 'circle' | 'square' | 'line' | 'rect';
    value?: string | number;
}

export type LegendPosition = 'top' | 'bottom' | 'left' | 'right';
export type LegendOrientation = 'horizontal' | 'vertical';

@Component({
    selector: 'app-legend',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './legend.html',
    styleUrl: './legend.css',
})
export class Legend {

    constructor(themeService: ThemeService) {
        themeService.loadAndSetTheme('/themes/main.json');
    }
    @Input() items: LegendItem[] = [];
    @Input() position: LegendPosition = 'bottom';
    @Input() orientation: LegendOrientation = 'horizontal';
    @Input() interactive: boolean = true;

    @Output() itemClick = new EventEmitter<LegendItem>();
    @Output() itemHover = new EventEmitter<LegendItem | null>();

    onItemClick(item: LegendItem): void {
        if (this.interactive) {
            this.itemClick.emit(item);
        }
    }

    onItemMouseEnter(item: LegendItem): void {
        if (this.interactive) {
            this.itemHover.emit(item);
        }
    }

    onItemMouseLeave(): void {
        if (this.interactive) {
            this.itemHover.emit(null);
        }
    }

    getShapeClass(item: LegendItem): string {
        return `legend-shape legend-shape-${item.shape || 'circle'}`;
    }

    isVisible(item: LegendItem): boolean {
        return item.visible !== false;
    }
}
