import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChartContainer } from '../components/base/chart-container/chart-container';
import { Legend, LegendItem } from '../components/base/legend/legend';
import { Tooltip, TooltipData } from '../components/base/tooltip/tooltip';

const meta: Meta<typeof ChartContainer> = {
  title: 'Base Components/Overview',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, Tooltip, Legend, ChartContainer],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChartContainer>;

// Tooltip Stories
export const TooltipExample: Story = {
  render: () => ({
    template: `
      <div style="padding: 100px; position: relative;">
        <button (click)="showTooltip = !showTooltip"
                (mouseenter)="updateTooltipPosition($event)"
                style="padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
          Hover or Click to Toggle Tooltip
        </button>

        <app-tooltip
          [data]="tooltipData"
          [title]="'Chart Data'"
          [x]="tooltipX"
          [y]="tooltipY"
          [visible]="showTooltip">
        </app-tooltip>
      </div>
    `,
    props: {
      showTooltip: false,
      tooltipX: 150,
      tooltipY: 150,
      tooltipData: [
        { label: 'Sales', value: '$45,231', color: '#3b82f6' },
        { label: 'Revenue', value: '$128,450', color: '#8b5cf6' },
        { label: 'Profit', value: '$83,219', color: '#10b981' },
      ] as TooltipData[],
      updateTooltipPosition(event: MouseEvent) {
        this['tooltipX'] = event.clientX;
        this['tooltipY'] = event.clientY;
        this['showTooltip'] = true;
      },
    },
  }),
};

export const LegendHorizontal: Story = {
  render: () => ({
    template: `
      <div style="padding: 40px; background: #f3f4f6; border-radius: 12px;">
        <h3 style="margin-bottom: 20px; color: #1f2937; font-weight: 600;">Horizontal Legend</h3>
        <app-legend
          [items]="legendItems"
          [orientation]="'horizontal'"
          [interactive]="true"
          (itemClick)="onLegendClick($event)"
          (itemHover)="onLegendHover($event)">
        </app-legend>

        <div style="margin-top: 20px; padding: 12px; background: white; border-radius: 8px;" *ngIf="selectedItem">
          <strong>Selected:</strong> {{ selectedItem.label }}
        </div>
      </div>
    `,
    props: {
      selectedItem: null as LegendItem | null,
      legendItems: [
        { label: 'Desktop', color: '#3b82f6', shape: 'circle', value: '45%' },
        { label: 'Mobile', color: '#8b5cf6', shape: 'circle', value: '35%' },
        { label: 'Tablet', color: '#ec4899', shape: 'circle', value: '15%' },
        { label: 'Other', color: '#10b981', shape: 'circle', value: '5%' },
      ] as LegendItem[],
      onLegendClick(item: LegendItem) {
        this['selectedItem'] = item;
        console.log('Legend clicked:', item);
      },
      onLegendHover(item: LegendItem | null) {
        console.log('Legend hover:', item);
      },
    },
  }),
};

export const LegendVertical: Story = {
  render: () => ({
    template: `
      <div style="padding: 40px; background: #f3f4f6; border-radius: 12px; max-width: 300px;">
        <h3 style="margin-bottom: 20px; color: #1f2937; font-weight: 600;">Vertical Legend</h3>
        <app-legend
          [items]="legendItems"
          [orientation]="'vertical'"
          [interactive]="true">
        </app-legend>
      </div>
    `,
    props: {
      legendItems: [
        { label: 'Q1 2026', color: '#3b82f6', shape: 'line', value: '$125K' },
        { label: 'Q2 2026', color: '#8b5cf6', shape: 'line', value: '$145K' },
        { label: 'Q3 2026', color: '#ec4899', shape: 'line', value: '$162K' },
        { label: 'Q4 2026', color: '#10b981', shape: 'line', value: '$198K' },
      ] as LegendItem[],
    },
  }),
};

export const LegendShapes: Story = {
  render: () => ({
    template: `
      <div style="padding: 40px; background: #f3f4f6; border-radius: 12px;">
        <h3 style="margin-bottom: 20px; color: #1f2937; font-weight: 600;">Different Legend Shapes</h3>
        <app-legend
          [items]="legendItems"
          [orientation]="'horizontal'"
          [interactive]="true">
        </app-legend>
      </div>
    `,
    props: {
      legendItems: [
        { label: 'Circle Shape', color: '#3b82f6', shape: 'circle' as const },
        { label: 'Square Shape', color: '#8b5cf6', shape: 'square' as const },
        { label: 'Line Shape', color: '#ec4899', shape: 'line' as const },
        { label: 'Rect Shape', color: '#10b981', shape: 'rect' as const },
      ] as LegendItem[],
    },
  }),
};

// Chart Container Stories
export const ContainerGlass: Story = {
  render: () => ({
    template: `
      <app-chart-container
        title="Glass Theme Container"
        subtitle="Modern 2026 Apple-style glass design"
        footer="Data updated in real-time"
        theme="glass"
        width="800px"
        height="400px">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #1f2937; font-size: 18px; font-weight: 600;">
          Your chart content goes here
        </div>
      </app-chart-container>
    `,
  }),
};

export const ContainerSolid: Story = {
  render: () => ({
    template: `
      <app-chart-container
        title="Solid Theme Container"
        subtitle="Clean and professional design"
        theme="solid"
        width="800px"
        height="400px">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #1f2937; font-size: 18px; font-weight: 600;">
          Your chart content goes here
        </div>
      </app-chart-container>
    `,
  }),
};

export const ContainerGradient: Story = {
  render: () => ({
    template: `
      <app-chart-container
        title="Gradient Theme Container"
        subtitle="Colorful gradient background"
        theme="gradient"
        width="800px"
        height="400px">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #1f2937; font-size: 18px; font-weight: 600;">
          Your chart content goes here
        </div>
      </app-chart-container>
    `,
  }),
};

export const ContainerLoading: Story = {
  render: () => ({
    template: `
      <app-chart-container
        title="Loading State"
        subtitle="Container with loading spinner"
        theme="glass"
        [loading]="true"
        width="800px"
        height="400px">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #1f2937; font-size: 18px; font-weight: 600;">
          Your chart content goes here
        </div>
      </app-chart-container>
    `,
  }),
};

// Complete Example with All Components
export const CompleteExample: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px; background: #e5e7eb;">
        <app-chart-container
          title="Sales Performance Dashboard"
          subtitle="Q1 2026 Analytics"
          footer="Data last updated: Today at 2:45 PM"
          theme="glass"
          width="1000px"
          height="600px">

          <div style="display: flex; flex-direction: column; height: 100%; gap: 20px;">
            <!-- Legend at top -->
            <app-legend
              [items]="legendItems"
              [orientation]="'horizontal'"
              [position]="'top'"
              [interactive]="true">
            </app-legend>

            <!-- Chart placeholder -->
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.3); border-radius: 12px; position: relative;"
                 (mouseenter)="showTooltip = true; updatePosition($event)"
                 (mousemove)="updatePosition($event)"
                 (mouseleave)="showTooltip = false">
              <p style="color: #1f2937; font-size: 16px; font-weight: 600;">Hover to see tooltip</p>

              <app-tooltip
                [data]="tooltipData"
                [title]="'January Sales'"
                [x]="tooltipX"
                [y]="tooltipY"
                [visible]="showTooltip">
              </app-tooltip>
            </div>
          </div>
        </app-chart-container>
      </div>
    `,
    props: {
      showTooltip: false,
      tooltipX: 0,
      tooltipY: 0,
      legendItems: [
        { label: 'Revenue', color: '#3b82f6', shape: 'line', value: '$245K' },
        { label: 'Profit', color: '#10b981', shape: 'line', value: '$128K' },
        { label: 'Expenses', color: '#ef4444', shape: 'line', value: '$117K' },
      ] as LegendItem[],
      tooltipData: [
        { label: 'Revenue', value: '$245,890', color: '#3b82f6' },
        { label: 'Profit', value: '$128,445', color: '#10b981' },
        { label: 'Margin', value: '52.3%', color: '#8b5cf6' },
      ] as TooltipData[],
      updatePosition(event: MouseEvent) {
        this['tooltipX'] = event.clientX;
        this['tooltipY'] = event.clientY;
      },
    },
  }),
};
