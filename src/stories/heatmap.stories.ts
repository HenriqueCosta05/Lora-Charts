import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChartContainer } from '../components/base/chart-container/chart-container';
import { Heatmap } from '../components/charts/heatmap/heatmap';

const meta: Meta<Heatmap> = {
    title: 'Charts/Heatmap',
    component: Heatmap,
    decorators: [
        moduleMetadata({
            imports: [Heatmap, ChartContainer],
        }),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<Heatmap>;

const weeklyData = [];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

for (const day of days) {
    for (const hour of hours) {
        weeklyData.push({
            x: hour,
            y: day,
            value: Math.random() * 100,
        });
    }
}

const correlationData = [];
const variables = ['Temperature', 'Humidity', 'Pressure', 'Wind Speed', 'Visibility'];

for (const varX of variables) {
    for (const varY of variables) {
        correlationData.push({
            x: varX,
            y: varY,
            value: varX === varY ? 1 : Math.random(),
        });
    }
}

const monthlyData = [];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const years = ['2022', '2023', '2024', '2025', '2026'];

for (const year of years) {
    for (const month of months) {
        monthlyData.push({
            x: month,
            y: year,
            value: Math.random() * 1000 + 500,
        });
    }
}

export const ActivityHeatmap: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Weekly Activity Heatmap"
        subtitle="Hourly activity patterns"
        theme="glass">
        <app-heatmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-heatmap>
      </app-chart-container>
    `,
    }),
    args: {
        data: weeklyData,
        width: 1200,
        height: 400,
        config: {
            showValues: false,
            animated: true,
            cellRadius: 4,
            colorScheme: 'blues',
        },
    },
};

export const WithValues: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Correlation Matrix"
        subtitle="Variable correlations"
        theme="glass">
        <app-heatmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-heatmap>
      </app-chart-container>
    `,
    }),
    args: {
        data: correlationData,
        width: 700,
        height: 700,
        config: {
            showValues: true,
            animated: true,
            cellRadius: 6,
            colorScheme: 'viridis',
        },
    },
};

export const MonthlyRevenue: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Monthly Revenue Heatmap"
        subtitle="5-year revenue trends"
        theme="glass">
        <app-heatmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-heatmap>
      </app-chart-container>
    `,
    }),
    args: {
        data: monthlyData,
        width: 1000,
        height: 400,
        config: {
            showValues: false,
            animated: true,
            cellRadius: 8,
            colorScheme: 'greens',
        },
    },
};

export const PlasmaTheme: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Plasma Color Scheme"
        subtitle="Modern vibrant colors"
        theme="gradient">
        <app-heatmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-heatmap>
      </app-chart-container>
    `,
    }),
    args: {
        data: correlationData,
        width: 700,
        height: 700,
        config: {
            showValues: false,
            animated: true,
            cellRadius: 8,
            colorScheme: 'plasma',
        },
    },
};

export const RedTheme: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Temperature Heatmap"
        subtitle="Red color scheme"
        theme="solid">
        <app-heatmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-heatmap>
      </app-chart-container>
    `,
    }),
    args: {
        data: weeklyData,
        width: 1200,
        height: 400,
        config: {
            showValues: false,
            animated: false,
            cellRadius: 4,
            colorScheme: 'reds',
        },
    },
};
