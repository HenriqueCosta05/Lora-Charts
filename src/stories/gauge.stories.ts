import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChartContainer } from '../components/base/chart-container/chart-container';
import { Gauge } from '../components/charts/gauge/gauge';

const meta: Meta<Gauge> = {
    title: 'Charts/Gauge',
    component: Gauge,
    decorators: [
        moduleMetadata({
            imports: [Gauge, ChartContainer],
        }),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Gauge>;

export const BasicGauge: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Performance Score"
        subtitle="Current system performance"
        theme="glass">
        <app-gauge
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-gauge>
      </app-chart-container>
    `,
    }),
    args: {
        data: {
            value: 75,
            min: 0,
            max: 100,
            label: 'Performance',
        },
        width: 500,
        height: 350,
        config: {
            animated: true,
            showValue: true,
            showLabel: true,
            arcWidth: 40,
        },
    },
};

export const HighValue: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Customer Satisfaction"
        subtitle="Q1 2026 Rating"
        theme="glass">
        <app-gauge
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-gauge>
      </app-chart-container>
    `,
    }),
    args: {
        data: {
            value: 92,
            min: 0,
            max: 100,
            label: 'Satisfaction Score',
        },
        width: 500,
        height: 350,
        config: {
            animated: true,
            showValue: true,
            showLabel: true,
            arcWidth: 50,
        },
    },
};

export const LowValue: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Battery Level"
        subtitle="Device status"
        theme="glass">
        <app-gauge
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-gauge>
      </app-chart-container>
    `,
    }),
    args: {
        data: {
            value: 25,
            min: 0,
            max: 100,
            label: 'Battery %',
        },
        width: 500,
        height: 350,
        config: {
            animated: true,
            showValue: true,
            showLabel: true,
            arcWidth: 35,
        },
    },
};

export const WithThresholds: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Server Load"
        subtitle="With threshold markers"
        theme="glass">
        <app-gauge
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-gauge>
      </app-chart-container>
    `,
    }),
    args: {
        data: {
            value: 68,
            min: 0,
            max: 100,
            label: 'CPU Usage',
            thresholds: [
                { value: 30, color: '#10b981', label: 'Low' },
                { value: 60, color: '#f59e0b', label: 'Medium' },
                { value: 80, color: '#ef4444', label: 'High' },
            ],
        },
        width: 500,
        height: 350,
        config: {
            animated: true,
            showValue: true,
            showLabel: true,
            arcWidth: 45,
        },
    },
};

export const ThinArc: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Minimal Gauge"
        subtitle="Thin arc design"
        theme="solid">
        <app-gauge
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-gauge>
      </app-chart-container>
    `,
    }),
    args: {
        data: {
            value: 55,
            min: 0,
            max: 100,
            label: 'Progress',
        },
        width: 400,
        height: 300,
        config: {
            animated: true,
            showValue: true,
            showLabel: true,
            arcWidth: 20,
        },
    },
};

export const CustomRange: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Temperature Monitor"
        subtitle="Current room temperature"
        theme="gradient">
        <app-gauge
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-gauge>
      </app-chart-container>
    `,
    }),
    args: {
        data: {
            value: 22,
            min: 0,
            max: 40,
            label: '°C',
        },
        width: 500,
        height: 350,
        config: {
            animated: true,
            showValue: true,
            showLabel: true,
            arcWidth: 40,
        },
    },
};
