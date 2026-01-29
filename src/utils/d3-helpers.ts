import * as d3 from 'd3';

/**
 * D3 utility functions for charts
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function lightenColor(color: string, amount: number = 0.2): string {
    const rgb = d3.color(color);
    if (!rgb) return color;
    return rgb.brighter(amount).toString();
}

export function darkenColor(color: string, amount: number = 0.2): string {
    const rgb = d3.color(color);
    if (!rgb) return color;
    return rgb.darker(amount).toString();
}

export function generateColorPalette(baseColor: string, count: number): string[] {
    const base = d3.color(baseColor);
    if (!base) return [baseColor];

    const hsl = d3.hsl(base);
    const colors: string[] = [];

    for (let i = 0; i < count; i++) {
        const hue = (hsl.h + (360 / count) * i) % 360;
        colors.push(d3.hsl(hue, hsl.s, hsl.l).toString());
    }

    return colors;
}

export function getScale(
    type: 'linear' | 'band' | 'time' | 'log' | 'sqrt',
    domain: any[],
    range: any[]
): any {
    switch (type) {
        case 'linear':
            return d3.scaleLinear().domain(domain as number[]).range(range as number[]);
        case 'band':
            return d3.scaleBand().domain(domain as string[]).range(range as number[]).padding(0.2);
        case 'time':
            return d3.scaleTime().domain(domain as Date[]).range(range as number[]);
        case 'log':
            return d3.scaleLog().domain(domain as number[]).range(range as number[]);
        case 'sqrt':
            return d3.scaleSqrt().domain(domain as number[]).range(range as number[]);
        default:
            return d3.scaleLinear().domain(domain as number[]).range(range as number[]);
    }
}

export function transitionElement<T extends d3.BaseType>(
    selection: d3.Selection<T, any, any, any>,
    duration: number = 300,
    delay: number = 0
): d3.Transition<T, any, any, any> {
    return selection
        .transition()
        .duration(duration)
        .delay(delay)
        .ease(d3.easeCubicOut);
}

export function staggeredTransition<T extends d3.BaseType>(
    selection: d3.Selection<T, any, any, any>,
    duration: number = 300,
    staggerDelay: number = 50
): d3.Transition<T, any, any, any> {
    return selection
        .transition()
        .duration(duration)
        .delay((_, i) => i * staggerDelay)
        .ease(d3.easeCubicOut);
}

export function formatValue(value: number, type: 'number' | 'currency' | 'percentage' | 'compact' = 'number'): string {
    switch (type) {
        case 'currency':
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(value);
        case 'percentage':
            return new Intl.NumberFormat('en-US', {
                style: 'percent',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }).format(value);
        case 'compact':
            return new Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short',
            }).format(value);
        default:
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }).format(value);
    }
}

export function formatDate(date: Date, format: 'short' | 'long' | 'full' = 'short'): string {
    const options: Intl.DateTimeFormatOptions =
        format === 'short' ? { month: 'short', day: 'numeric' } :
            format === 'long' ? { month: 'long', day: 'numeric', year: 'numeric' } :
                { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };

    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function normalizeData(data: number[]): number[] {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    return data.map(value => (value - min) / range);
}

export function aggregateData<T>(
    data: T[],
    groupBy: (item: T) => string,
    aggregate: (items: T[]) => number
): { label: string; value: number; }[] {
    const groups = d3.group(data, groupBy);

    return Array.from(groups, ([label, items]) => ({
        label,
        value: aggregate(items),
    }));
}

export function createRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
): string {
    const r = Math.min(radius, width / 2, height / 2);

    return `
    M ${x + r} ${y}
    H ${x + width - r}
    Q ${x + width} ${y} ${x + width} ${y + r}
    V ${y + height - r}
    Q ${x + width} ${y + height} ${x + width - r} ${y + height}
    H ${x + r}
    Q ${x} ${y + height} ${x} ${y + height - r}
    V ${y + r}
    Q ${x} ${y} ${x + r} ${y}
    Z
  `;
}

export function addHoverEffect<T extends d3.BaseType>(
    selection: d3.Selection<T, any, any, any>,
    onHover: (event: MouseEvent, d: any) => void,
    onLeave: (event: MouseEvent, d: any) => void
): void {
    selection
        .on('mouseenter', function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 0.8);
            onHover(event, d);
        })
        .on('mouseleave', function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 1);
            onLeave(event, d);
        });
}

export function getResponsiveDimensions(
    container: HTMLElement,
    aspectRatio: number = 16 / 9
): { width: number; height: number; } {
    const width = container.clientWidth;
    const height = width / aspectRatio;

    return { width, height };
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return function (...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
