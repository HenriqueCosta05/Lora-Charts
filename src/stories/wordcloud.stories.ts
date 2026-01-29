import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChartContainer } from '../components/base/chart-container/chart-container';
import { WordCloud } from '../components/charts/wordcloud/wordcloud';

const meta: Meta<WordCloud> = {
    title: 'Charts/WordCloud',
    component: WordCloud,
    decorators: [
        moduleMetadata({
            imports: [WordCloud, ChartContainer],
        }),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<WordCloud>;

const techWords = [
    { text: 'JavaScript', value: 95 },
    { text: 'TypeScript', value: 88 },
    { text: 'React', value: 82 },
    { text: 'Angular', value: 76 },
    { text: 'Vue', value: 70 },
    { text: 'Node.js', value: 85 },
    { text: 'Python', value: 90 },
    { text: 'Docker', value: 72 },
    { text: 'Kubernetes', value: 65 },
    { text: 'AWS', value: 80 },
    { text: 'Azure', value: 68 },
    { text: 'MongoDB', value: 75 },
    { text: 'PostgreSQL', value: 78 },
    { text: 'GraphQL', value: 62 },
    { text: 'REST', value: 85 },
    { text: 'Microservices', value: 60 },
    { text: 'AI', value: 92 },
    { text: 'Machine Learning', value: 87 },
    { text: 'DevOps', value: 73 },
    { text: 'CI/CD', value: 70 },
];

const sentimentWords = [
    { text: 'Amazing', value: 85 },
    { text: 'Excellent', value: 90 },
    { text: 'Great', value: 75 },
    { text: 'Good', value: 70 },
    { text: 'Love', value: 95 },
    { text: 'Perfect', value: 80 },
    { text: 'Wonderful', value: 82 },
    { text: 'Awesome', value: 88 },
    { text: 'Fantastic', value: 86 },
    { text: 'Beautiful', value: 78 },
    { text: 'Outstanding', value: 84 },
    { text: 'Brilliant', value: 79 },
    { text: 'Incredible', value: 83 },
    { text: 'Superb', value: 77 },
    { text: 'Terrific', value: 76 },
];

const smallDataset = [
    { text: 'Innovation', value: 100 },
    { text: 'Technology', value: 85 },
    { text: 'Design', value: 75 },
    { text: 'Development', value: 90 },
    { text: 'Cloud', value: 80 },
    { text: 'Security', value: 70 },
    { text: 'Analytics', value: 65 },
    { text: 'Performance', value: 72 },
];

export const TechStack: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Technology Stack"
        subtitle="Most popular technologies 2026"
        theme="glass">
        <app-wordcloud
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-wordcloud>
      </app-chart-container>
    `,
    }),
    args: {
        data: techWords,
        width: 900,
        height: 600,
        config: {
            animated: true,
            minFontSize: 16,
            maxFontSize: 80,
            rotation: () => (Math.random() > 0.7 ? 90 : 0),
            padding: 5,
            spiral: 'archimedean',
        },
    },
};

export const SentimentAnalysis: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Customer Sentiment"
        subtitle="Positive feedback keywords"
        theme="glass">
        <app-wordcloud
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-wordcloud>
      </app-chart-container>
    `,
    }),
    args: {
        data: sentimentWords,
        width: 900,
        height: 600,
        config: {
            animated: true,
            minFontSize: 20,
            maxFontSize: 90,
            rotation: 0,
            padding: 8,
            spiral: 'archimedean',
            colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
        },
    },
};

export const RectangularSpiral: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Rectangular Layout"
        subtitle="Alternative spiral pattern"
        theme="gradient">
        <app-wordcloud
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-wordcloud>
      </app-chart-container>
    `,
    }),
    args: {
        data: techWords,
        width: 900,
        height: 600,
        config: {
            animated: true,
            minFontSize: 18,
            maxFontSize: 75,
            rotation: () => (Math.random() > 0.5 ? 45 : -45),
            padding: 6,
            spiral: 'rectangular',
        },
    },
};

export const NoRotation: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Horizontal Words Only"
        subtitle="No rotation applied"
        theme="solid">
        <app-wordcloud
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-wordcloud>
      </app-chart-container>
    `,
    }),
    args: {
        data: smallDataset,
        width: 800,
        height: 500,
        config: {
            animated: true,
            minFontSize: 24,
            maxFontSize: 80,
            rotation: 0,
            padding: 10,
            spiral: 'archimedean',
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
        <app-wordcloud
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-wordcloud>
      </app-chart-container>
    `,
    }),
    args: {
        data: techWords,
        width: 900,
        height: 600,
        config: {
            animated: true,
            minFontSize: 16,
            maxFontSize: 85,
            rotation: () => (Math.random() > 0.8 ? 90 : 0),
            padding: 5,
            spiral: 'archimedean',
            colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
        },
    },
};

export const MinimalDesign: Story = {
    render: (args) => ({
        props: args,
        template: `
      <app-chart-container
        title="Minimal Word Cloud"
        subtitle="Simple and clean"
        theme="solid">
        <app-wordcloud
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-wordcloud>
      </app-chart-container>
    `,
    }),
    args: {
        data: smallDataset,
        width: 800,
        height: 500,
        config: {
            animated: false,
            minFontSize: 20,
            maxFontSize: 70,
            rotation: 0,
            padding: 8,
            spiral: 'archimedean',
            colors: ['#3b82f6'],
        },
    },
};
