import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChartContainer } from '../components/base/chart-container/chart-container';
import { Pie } from '../components/charts/pie/pie';

const meta: Meta<Pie> = {
    title: 'Charts/Pie Chart',
    component: Pie,
    decorators: [
        moduleMetadata({
            imports: [Pie, ChartContainer],
        }),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Pie>;

const marketShareData = [
    { label: 'Chrome', value: 63.5 },
    { label: 'Safari', value: 19.2 },
    { label: 'Edge', value: 5.3 },
    { label: 'Firefox', value: 3.8 },
    { label: 'Opera', value: 2.5 },
    { label: 'Others', value: 5.7 },
];

const revenueData = [
    { label: 'Product Sales', value: 450000, color: '#3b82f6' },
    { label: 'Services', value: 280000, color: '#8b5cf6' },
    { label: 'Subscriptions', value: 320000, color: '#ec4899' },
    { label: 'Licensing', value: 150000, color: '#10b981' },
];

const expenseData = [
    { label: 'Salaries', value: 450 },
    { label: 'Marketing', value: 230 },
    { label: 'Operations', value: 180 },
    { label: 'R&D', value: 320 },
    { label: 'Infrastructure', value: 120 },
    { label: 'Misc', value: 80 },
];

export const BasicPie: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Browser Market Share"
        subtitle="Q1 2026 Distribution"
        theme="glass">
        <app-pie
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-pie>
      </app-chart-container>
    `,
    }),
    args: {
        data: marketShareData,
        width: 600,
        height: 600,
        config: {
            showLabels: true,
            showPercentages: true,
            animated: true,
            innerRadius: 0,
            cornerRadius: 4,
        },
    },
};

export const DonutChart: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Revenue Breakdown"
        subtitle="Total: $1.2M"
        theme="glass">
        <app-pie
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-pie>
      </app-chart-container>
    `,
    }),
    args: {
        data: revenueData,
        width: 600,
        height: 600,
        config: {
            showLabels: true,
            showPercentages: true,
            animated: true,
            innerRadius: 120,
            cornerRadius: 6,
        },
    },
};

export const NoLabels: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Expense Categories"
        subtitle="Annual budget allocation"
        theme="gradient">
        <app-pie
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-pie>
      </app-chart-container>
    `,
    }),
    args: {
        data: expenseData,
        width: 600,
        height: 600,
        config: {
            showLabels: false,
            showPercentages: false,
            animated: true,
            innerRadius: 80,
            cornerRadius: 8,
        },
    },
};

export const CustomColors: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Custom Color Palette"
        subtitle="Vibrant gradient colors"
        theme="glass">
        <app-pie
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-pie>
      </app-chart-container>
    `,
    }),
    args: {
        data: marketShareData,
        width: 600,
        height: 600,
        config: {
            showLabels: true,
            showPercentages: true,
            animated: true,
            innerRadius: 100,
            cornerRadius: 10,
            colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b'],
        },
    },
};

export const MinimalDesign: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Minimal Pie Chart"
        subtitle="Clean and simple"
        theme="solid">
        <app-pie
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-pie>
      </app-chart-container>
    `,
    }),
    args: {
        data: revenueData,
        width: 500,
        height: 500,
        config: {
            showLabels: false,
            showPercentages: false,
            animated: false,
            innerRadius: 0,
            cornerRadius: 2,
            padAngle: 0.01,
        },
    },
};

export const LargePadding: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Exploded Donut Chart"
        subtitle="With spacing between slices"
        theme="glass">
        <app-pie
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-pie>
      </app-chart-container>
    `,
    }),
    args: {
        data: expenseData,
        width: 600,
        height: 600,
        config: {
            showLabels: true,
            showPercentages: false,
            animated: true,
            innerRadius: 100,
            cornerRadius: 8,
            padAngle: 0.05,
        },
    },
};
