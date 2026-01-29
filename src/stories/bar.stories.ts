import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChartContainer } from '../components/base/chart-container/chart-container';
import { Bar } from '../components/charts/bar/bar';

const meta: Meta<Bar> = {
    title: 'Charts/Bar Chart',
    component: Bar,
    decorators: [
        moduleMetadata({
            imports: [Bar, ChartContainer],
        }),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Bar>;

// Helper function to generate sample data
const generateSampleData = (count: number, minValue: number, maxValue: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from({ length: count }, (_, i) => ({
        label: months[i % 12] || `Item ${i + 1}`,
        value: Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue,
    }));
};

const sampleData = [
    { label: 'Q1', value: 4500 },
    { label: 'Q2', value: 5200 },
    { label: 'Q3', value: 6100 },
    { label: 'Q4', value: 7300 },
];

const monthlyData = [
    { label: 'Jan', value: 3200 },
    { label: 'Feb', value: 2800 },
    { label: 'Mar', value: 4100 },
    { label: 'Apr', value: 3900 },
    { label: 'May', value: 5200 },
    { label: 'Jun', value: 6300 },
    { label: 'Jul', value: 7100 },
    { label: 'Aug', value: 6800 },
    { label: 'Sep', value: 5900 },
    { label: 'Oct', value: 6500 },
    { label: 'Nov', value: 7200 },
    { label: 'Dec', value: 8100 },
];

const coloredData = [
    { label: 'Product A', value: 4500, color: '#0071e3' },
    { label: 'Product B', value: 6200, color: '#8e44ff' },
    { label: 'Product C', value: 3100, color: '#ff2d55' },
    { label: 'Product D', value: 7800, color: '#34c759' },
    { label: 'Product E', value: 5400, color: '#ff9f0a' },
];

export const VerticalBasic: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Quarterly Sales"
        subtitle="Revenue in thousands (USD)"
        theme="glass">
        <app-bar
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-bar>
      </app-chart-container>
    `,
    }),
    args: {
        data: sampleData,
        width: 800,
        height: 500,
        config: {
            orientation: 'vertical',
            showGrid: true,
            showValues: false,
            animated: true,
            barRadius: 8,
        },
    },
};

export const VerticalWithValues: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Monthly Revenue"
        subtitle="2026 Performance"
        theme="glass">
        <app-bar
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-bar>
      </app-chart-container>
    `,
    }),
    args: {
        data: monthlyData,
        width: 1000,
        height: 500,
        config: {
            orientation: 'vertical',
            showGrid: true,
            showValues: true,
            animated: true,
            barRadius: 6,
            barPadding: 0.2,
        },
    },
};

export const HorizontalBasic: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Product Comparison"
        subtitle="Sales by product category"
        theme="glass">
        <app-bar
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-bar>
      </app-chart-container>
    `,
    }),
    args: {
        data: coloredData,
        width: 800,
        height: 400,
        config: {
            orientation: 'horizontal',
            showGrid: true,
            showValues: true,
            animated: true,
            barRadius: 8,
        },
    },
};

export const CustomColors: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Custom Styled Bar Chart"
        subtitle="With gradient theme"
        theme="gradient">
        <app-bar
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-bar>
      </app-chart-container>
    `,
    }),
    args: {
        data: coloredData,
        width: 800,
        height: 500,
        config: {
            orientation: 'vertical',
            showGrid: true,
            showValues: true,
            animated: true,
            barRadius: 12,
            colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'],
        },
    },
};

export const MinimalDesign: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Minimal Bar Chart"
        subtitle="Clean and simple"
        theme="solid">
        <app-bar
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-bar>
      </app-chart-container>
    `,
    }),
    args: {
        data: sampleData,
        width: 800,
        height: 400,
        config: {
            orientation: 'vertical',
            showGrid: false,
            showValues: false,
            animated: false,
            barRadius: 4,
            barPadding: 0.4,
        },
    },
};

export const LargeDataset: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Large Dataset Example"
        subtitle="Performance with many data points"
        theme="glass">
        <app-bar
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-bar>
      </app-chart-container>
    `,
    }),
    args: {
        data: Array.from({ length: 50 }, (_, i) => ({
            label: `Item ${i + 1}`,
            value: Math.floor(Math.random() * 1000) + 100,
        })),
        width: 1200,
        height: 500,
        config: {
            orientation: 'vertical',
            showGrid: true,
            showValues: false,
            animated: true,
            barRadius: 4,
            barPadding: 0.1,
        },
        autoRotateLabels: true, // Automatically detects and rotates labels
    },
};

export const AutoRotation: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Smart Label Rotation"
        subtitle="Labels automatically rotate based on available space"
        theme="glass">
        <app-bar
          [data]="data"
          [width]="width"
          [height]="height"
          [autoRotateLabels]="autoRotateLabels"
          [config]="config">
        </app-bar>
      </app-chart-container>
    `,
    }),
    args: {
        data: [
            { label: 'January Sales', value: 145 },
            { label: 'February Revenue', value: 178 },
            { label: 'March Targets', value: 123 },
            { label: 'April Performance', value: 198 },
            { label: 'May Quarterly', value: 167 },
            { label: 'June Projections', value: 189 },
            { label: 'July Analytics', value: 156 },
            { label: 'August Metrics', value: 172 },
        ],
        width: 900,
        height: 500,
        autoRotateLabels: true,
        config: {
            orientation: 'vertical',
            showGrid: true,
            showValues: true,
            animated: true,
            barRadius: 6,
        },
    },
};

export const ManualRotation45: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Manual 45° Rotation"
        subtitle="Fixed -45 degree label rotation"
        theme="glass">
        <app-bar
          [data]="data"
          [width]="width"
          [height]="height"
          [autoRotateLabels]="false"
          [labelRotationAngle]="-45"
          [config]="config">
        </app-bar>
      </app-chart-container>
    `,
    }),
    args: {
        data: generateSampleData(8, 50, 200),
        width: 900,
        height: 500,
        config: {
            orientation: 'vertical',
            showGrid: true,
            showValues: false,
            animated: true,
        },
    },
};

export const ManualRotation90: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Vertical Labels (90° Rotation)"
        subtitle="Maximum space efficiency with vertical labels"
        theme="glass">
        <app-bar
          [data]="data"
          [width]="width"
          [height]="height"
          [autoRotateLabels]="false"
          [labelRotationAngle]="-90"
          [config]="config">
        </app-bar>
      </app-chart-container>
    `,
    }),
    args: {
        data: generateSampleData(15, 30, 150),
        width: 900,
        height: 500,
        config: {
            orientation: 'vertical',
            showGrid: true,
            showValues: false,
            animated: true,
            barPadding: 0.2,
        },
    },
};
