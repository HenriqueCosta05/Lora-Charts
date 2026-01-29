import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChartContainer } from '../components/base/chart-container/chart-container';
import { Area } from '../components/charts/area/area';

const meta: Meta<Area> = {
    title: 'Charts/Area Chart',
    component: Area,
    decorators: [
        moduleMetadata({
            imports: [Area, ChartContainer],
        }),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Area>;

const generateTimeSeriesData = (points: number, startValue: number = 100) => {
    const data = [];
    let value = startValue;
    const startDate = new Date('2026-01-01');

    for (let i = 0; i < points; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        value += (Math.random() - 0.4) * 20;
        data.push({
            date,
            value: Math.max(0, value),
        });
    }
    return data;
};

const singleSeries = generateTimeSeriesData(60, 200);

const multiSeriesData = {
    'Mobile': generateTimeSeriesData(60, 150),
    'Desktop': generateTimeSeriesData(60, 100),
    'Tablet': generateTimeSeriesData(60, 50),
};

export const BasicArea: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Website Traffic"
        subtitle="Daily visitors over time"
        theme="glass">
        <app-area
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-area>
      </app-chart-container>
    `,
    }),
    args: {
        data: singleSeries,
        width: 1000,
        height: 500,
        config: {
            showGrid: true,
            showLine: true,
            showPoints: false,
            curved: true,
            animated: true,
            fillOpacity: 0.5,
        },
    },
};

export const WithPoints: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Sales Growth"
        subtitle="With data points"
        theme="glass">
        <app-area
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-area>
      </app-chart-container>
    `,
    }),
    args: {
        data: singleSeries,
        width: 1000,
        height: 500,
        config: {
            showGrid: true,
            showLine: true,
            showPoints: true,
            curved: true,
            animated: true,
            fillOpacity: 0.4,
        },
    },
};

export const MultiSeries: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Traffic by Device Type"
        subtitle="Mobile, Desktop, and Tablet"
        theme="glass">
        <app-area
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-area>
      </app-chart-container>
    `,
    }),
    args: {
        data: multiSeriesData,
        width: 1100,
        height: 500,
        config: {
            showGrid: true,
            showLine: true,
            showPoints: false,
            curved: true,
            animated: true,
            fillOpacity: 0.3,
            colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
        },
    },
};

export const StraightLines: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Linear Area Chart"
        subtitle="Straight line segments"
        theme="solid">
        <app-area
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-area>
      </app-chart-container>
    `,
    }),
    args: {
        data: singleSeries,
        width: 1000,
        height: 500,
        config: {
            showGrid: true,
            showLine: true,
            showPoints: true,
            curved: false,
            animated: true,
            fillOpacity: 0.4,
        },
    },
};

export const NoLine: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Area Only"
        subtitle="Without border line"
        theme="gradient">
        <app-area
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-area>
      </app-chart-container>
    `,
    }),
    args: {
        data: singleSeries,
        width: 1000,
        height: 500,
        config: {
            showGrid: true,
            showLine: false,
            showPoints: false,
            curved: true,
            animated: true,
            fillOpacity: 0.6,
        },
    },
};

export const HighOpacity: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Solid Fill Area"
        subtitle="High opacity fill"
        theme="glass">
        <app-area
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-area>
      </app-chart-container>
    `,
    }),
    args: {
        data: singleSeries,
        width: 1000,
        height: 500,
        config: {
            showGrid: false,
            showLine: true,
            showPoints: false,
            curved: true,
            animated: true,
            fillOpacity: 0.8,
        },
    },
};

export const CustomTooltip: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Custom Tooltip Example"
        subtitle="Hover over the area to see custom tooltip"
        theme="glass">
        <app-area
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-area>
      </app-chart-container>
    `,
    }),
    args: {
        data: singleSeries,
        width: 1000,
        height: 500,
        config: {
            showGrid: true,
            showLine: true,
            showPoints: true,
            curved: true,
            animated: true,
            fillOpacity: 0.6,
            customTooltip: (data: { date: Date; value: number; seriesName?: string; }) => {
                const formattedDate = data.date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                return {
                    title: formattedDate,
                    items: [
                        { label: data.seriesName || 'Value', value: `$${data.value.toFixed(2)}`, color: '#3b82f6' },
                        { label: 'Growth', value: `${(Math.random() * 10 - 5).toFixed(1)}%` },
                        { label: 'Target', value: '$200.00' }
                    ]
                };
            }
        },
    },
};
