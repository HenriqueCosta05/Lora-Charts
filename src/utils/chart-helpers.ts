
export const shouldRotateLabels = (
    width: number,
    labels: string[],
    maxLabelWidth: number = 100,
    padding: number = 10
): boolean => {
    if (labels.length === 0) return false;

    const availableWidthPerLabel = width / labels.length;
    const requiredWidthPerLabel = maxLabelWidth + padding;

    return requiredWidthPerLabel > availableWidthPerLabel;
};

export const calculateLabelRotation = (
    width: number,
    labels: string[],
    maxLabelWidth: number = 100
): number => {
    if (labels.length === 0) return 0;

    const availableWidthPerLabel = width / labels.length;

    if (availableWidthPerLabel >= maxLabelWidth) {
        return 0;
    }

    const rotatedWidth45 = maxLabelWidth * 0.707;
    if (availableWidthPerLabel >= rotatedWidth45) {
        return -45;
    }

    return -90;
};

export const estimateTextWidth = (
    text: string,
    fontSize: number = 12,
    fontFamily: string = 'system-ui, -apple-system, sans-serif'
): number => {

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {

        return text.length * (fontSize * 0.6);
    }

    context.font = `${fontSize}px ${fontFamily}`;
    const metrics = context.measureText(text);

    return metrics.width;
};

export const getMaxLabelWidth = (
    labels: string[],
    fontSize: number = 12,
    fontFamily: string = 'system-ui, -apple-system, sans-serif'
): number => {
    if (labels.length === 0) return 0;

    return Math.max(...labels.map(label =>
        estimateTextWidth(String(label), fontSize, fontFamily)
    ));
};

export const truncateText = (
    text: string,
    maxWidth: number,
    fontSize: number = 12,
    fontFamily: string = 'system-ui, -apple-system, sans-serif'
): string => {
    const fullWidth = estimateTextWidth(text, fontSize, fontFamily);

    if (fullWidth <= maxWidth) {
        return text;
    }

    let low = 0;
    let high = text.length;
    let result = text;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const truncated = text.slice(0, mid) + '...';
        const width = estimateTextWidth(truncated, fontSize, fontFamily);

        if (width <= maxWidth) {
            result = truncated;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return result;
};

export const formatNumber = (value: number, locale: string = 'en-US', options: Intl.NumberFormatOptions = {}): string => {
    return new Intl.NumberFormat(locale, options).format(value);
};
