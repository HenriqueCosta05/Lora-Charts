export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesDataPoint {
  date: Date;
  value: number;
  label?: string;
  color?: string;
}

export interface MultiSeriesDataPoint {
  label: string;
  values: Record<string, number>;
}

export interface HeatmapDataPoint {
  x: string | number;
  y: string | number;
  value: number;
  color?: string;
}

export interface WordCloudDataPoint {
  text: string;
  value: number;
  color?: string;
}

export interface WorldMapDataPoint {
  countryId: string;
  countryName?: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface GaugeData {
  value: number;
  min: number;
  max: number;
  label?: string;
  thresholds?: GaugeThreshold[];
}

export interface GaugeThreshold {
  value: number;
  color: string;
  label?: string;
}

export interface ChartConfig {
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  responsive?: boolean;
  colors?: string[];
}

export interface AxisConfig {
  label?: string;
  showGrid?: boolean;
  ticks?: number;
  tickFormat?: (value: any) => string;
  domain?: [number, number];
}

export interface TooltipConfig {
  enabled?: boolean;
  format?: (data: any) => string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  customContent?: (data: any) => {
    title?: string;
    items: Array<{ label: string; value: string | number; color?: string }>;
  };
}

export interface LegendConfig {
  position?: 'top' | 'bottom' | 'left' | 'right';
  orientation?: 'horizontal' | 'vertical';
  interactive?: boolean;
}

export interface ChartEvent<T = any> {
  type: 'click' | 'hover' | 'mouseenter' | 'mouseleave';
  data: T;
  originalEvent: MouseEvent;
}
