import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ThemeService } from '../../../services/theme';

export type ChartTheme = 'glass' | 'solid' | 'gradient';

@Component({
    selector: 'app-chart-container',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './chart-container.html',
    styleUrl: './chart-container.css',
})
export class ChartContainer implements OnChanges {

    constructor(themeService: ThemeService) {
        themeService.loadAndSetTheme('/themes/main.json');
    }

    @Input() title?: string;
    @Input() subtitle?: string;
    @Input() footer?: string;
    @Input() theme: ChartTheme = 'glass';
    @Input() width?: string;
    @Input() height?: string;
    @Input() loading: boolean = false;

    ngOnChanges(changes: SimpleChanges): void { }
}
