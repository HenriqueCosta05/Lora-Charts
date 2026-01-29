import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChartContainer } from '../components/base/chart-container/chart-container';
import { Line } from '../components/charts/line/line';

const meta: Meta<Line> = {
    title: 'Charts/Line Chart',
    component: Line,
    decorators: [
        moduleMetadata({
            imports: [Line, ChartContainer],
        }),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Line>;

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

const singleSeries = generateTimeSeriesData(30, 150);

const multiSeriesData = {
    'Revenue': generateTimeSeriesData(30, 200),
    'Expenses': generateTimeSeriesData(30, 120),
    'Profit': generateTimeSeriesData(30, 80),
};

export const BasicLine: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Stock Price Trend"
        subtitle="Daily closing price"
        theme="glass">
        <app-line
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-line>
      </app-chart-container>
    `,
    }),
    args: {
        data: singleSeries,
        width: 900,
        height: 500,
        config: {
            showGrid: true,
            showPoints: true,
            curved: true,
            animated: true,
            lineWidth: 3,
        },
    },
};

export const WithArea: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Sales Growth"
        subtitle="Q1 2026 Daily Sales"
        theme="glass">
        <app-line
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-line>
      </app-chart-container>
    `,
    }),
    args: {
        data: singleSeries,
        width: 900,
        height: 500,
        config: {
            showGrid: true,
            showPoints: true,
            showArea: true,
            curved: true,
            animated: true,
            lineWidth: 3,
        },
    },
};

export const MultiSeries: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Financial Overview"
        subtitle="Revenue, Expenses, and Profit"
        theme="glass">
        <app-line
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-line>
      </app-chart-container>
    `,
    }),
    args: {
        data: multiSeriesData,
        width: 1000,
        height: 500,
        config: {
            showGrid: true,
            showPoints: false,
            curved: true,
            animated: true,
            lineWidth: 2.5,
            colors: ['#10b981', '#ef4444', '#3b82f6'],
        },
    },
};

export const StraightLines: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Linear Trend Analysis"
        subtitle="Straight line segments"
        theme="solid">
        <app-line
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-line>
      </app-chart-container>
    `,
    }),
    args: {
        data: singleSeries,
        width: 900,
        height: 500,
        config: {
            showGrid: true,
            showPoints: true,
            curved: false,
            animated: true,
            lineWidth: 2,
        },
    },
};

export const MinimalPoints: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Minimalist Line Chart"
        subtitle="Clean and simple design"
        theme="glass">
        <app-line
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-line>
      </app-chart-container>
    `,
    }),
    args: {
        data: singleSeries,
        width: 900,
        height: 400,
        config: {
            showGrid: false,
            showPoints: false,
            curved: true,
            animated: false,
            lineWidth: 2,
        },
    },
};

export const HighFrequency: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="High Frequency Data"
        subtitle="90 days of trading data"
        theme="gradient">
        <app-line
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-line>
      </app-chart-container>
    `,
    }),
    args: {
        data: generateTimeSeriesData(90, 1000),
        width: 1200,
        height: 500,
        config: {
            showGrid: true,
            showPoints: false,
            showArea: true,
            curved: true,
            animated: true,
            lineWidth: 2,
        },
    },
};
