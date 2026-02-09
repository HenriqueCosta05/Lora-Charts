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

const largeDataset = [
  { text: 'freedom', value: 50 },
  { text: 'dream', value: 45 },
  { text: 'nation', value: 40 },
  { text: 'justice', value: 38 },
  { text: 'together', value: 35 },
  { text: 'children', value: 32 },
  { text: 'ring', value: 30 },
  { text: 'day', value: 28 },
  { text: 'faith', value: 27 },
  { text: 'hope', value: 26 },
  { text: 'people', value: 25 },
  { text: 'mountain', value: 24 },
  { text: 'glory', value: 23 },
  { text: 'land', value: 22 },
  { text: 'brotherhood', value: 21 },
  { text: 'equal', value: 20 },
  { text: 'promise', value: 19 },
  { text: 'rights', value: 18 },
  { text: 'truth', value: 17 },
  { text: 'liberty', value: 16 },
  { text: 'peace', value: 15 },
  { text: 'harmony', value: 14 },
  { text: 'believe', value: 13 },
  { text: 'stand', value: 12 },
  { text: 'courage', value: 11 },
  { text: 'strength', value: 10 },
  { text: 'voice', value: 9 },
  { text: 'power', value: 8 },
  { text: 'change', value: 7 },
  { text: 'march', value: 6 },
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
    height: 500,
    config: {
      animated: true,
      fontScale: 8,
      padding: 2,
      rotate: () => (Math.random() > 0.7 ? 90 : 0),
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
    height: 500,
    config: {
      animated: true,
      fontScale: 9,
      rotate: 0,
      padding: 3,
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
    height: 500,
    config: {
      animated: true,
      fontScale: 7,
      rotate: () => (Math.random() > 0.5 ? 45 : -45),
      padding: 2,
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
      fontScale: 10,
      rotate: 0,
      padding: 4,
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
    height: 500,
    config: {
      animated: true,
      fontScale: 8,
      rotate: () => (Math.random() > 0.8 ? 90 : 0),
      padding: 2,
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
      fontScale: 10,
      rotate: 0,
      padding: 3,
      spiral: 'archimedean',
      colors: ['#3b82f6'],
    },
  },
};

export const LargeCloud: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="Large Word Cloud"
        subtitle="Many words with sqrt scaling"
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
    data: largeDataset,
    width: 960,
    height: 500,
    config: {
      animated: true,
      fontScale: 12,
      maxWords: 250,
      rotate: () => (~~(Math.random() * 6) - 3) * 30,
      padding: 1,
      spiral: 'archimedean',
    },
  },
};

export const WithMargins: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="With Margins"
        subtitle="Controlled layout spacing"
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
    data: techWords,
    width: 900,
    height: 500,
    config: {
      animated: true,
      fontScale: 7,
      marginTop: 20,
      marginRight: 20,
      marginBottom: 20,
      marginLeft: 20,
      rotate: 0,
      padding: 2,
      spiral: 'archimedean',
    },
  },
};
