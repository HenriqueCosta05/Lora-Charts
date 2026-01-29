import type { Meta, StoryObj } from '@storybook/angular';
import { Scatter, ScatterDataPoint } from '../components/charts/scatter/scatter';

const meta: Meta<Scatter> = {
  title: 'Charts/Scatter',
  component: Scatter,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'number' },
    height: { control: 'number' },
    data: { control: 'object' },
    config: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<Scatter>;

// Generate random scatter data
const generateScatterData = (count: number): ScatterDataPoint[] => {
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 50 + 10,
    label: `Point ${i + 1}`,
    category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
  }));
};

// Generate clustered data
const generateClusteredData = (): ScatterDataPoint[] => {
  const clusters = [
    { centerX: 25, centerY: 25, color: '#0071e3', category: 'Cluster 1' },
    { centerX: 75, centerY: 75, color: '#8e44ff', category: 'Cluster 2' },
    { centerX: 25, centerY: 75, color: '#ff2d55', category: 'Cluster 3' },
    { centerX: 75, centerY: 25, color: '#34c759', category: 'Cluster 4' },
  ];

  return clusters.flatMap((cluster, clusterIdx) =>
    Array.from({ length: 20 }, (_, i) => ({
      x: cluster.centerX + (Math.random() - 0.5) * 20,
      y: cluster.centerY + (Math.random() - 0.5) * 20,
      size: Math.random() * 30 + 10,
      label: `${cluster.category} - Point ${i + 1}`,
      color: cluster.color,
      category: cluster.category,
    }))
  );
};

export const Basic: Story = {
  args: {
    width: 800,
    height: 500,
    data: generateScatterData(50),
    config: {
      showGrid: true,
      animated: true,
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis',
    },
  },
};

export const WithClusters: Story = {
  args: {
    width: 800,
    height: 500,
    data: generateClusteredData(),
    config: {
      showGrid: true,
      animated: true,
      xAxisLabel: 'Feature 1',
      yAxisLabel: 'Feature 2',
      minBubbleSize: 6,
      maxBubbleSize: 18,
    },
  },
};

export const WithZoom: Story = {
  args: {
    width: 800,
    height: 500,
    data: generateScatterData(100),
    config: {
      showGrid: true,
      animated: true,
      enableZoom: true,
      xAxisLabel: 'X Coordinate',
      yAxisLabel: 'Y Coordinate',
    },
  },
};

export const LargeBubbles: Story = {
  args: {
    width: 800,
    height: 500,
    data: generateScatterData(30),
    config: {
      showGrid: true,
      animated: true,
      minBubbleSize: 15,
      maxBubbleSize: 40,
      xAxisLabel: 'Sales',
      yAxisLabel: 'Profit',
    },
  },
};

export const GlassDesign: Story = {
  args: {
    width: 900,
    height: 600,
    data: generateClusteredData(),
    config: {
      showGrid: false,
      animated: true,
      minBubbleSize: 8,
      maxBubbleSize: 25,
      xAxisLabel: 'User Engagement Score',
      yAxisLabel: 'Satisfaction Rating',
      colors: [
        'rgba(0, 113, 227, 0.8)',
        'rgba(142, 68, 255, 0.8)',
        'rgba(255, 45, 85, 0.8)',
        'rgba(52, 199, 89, 0.8)',
      ],
    },
  },
};

export const CustomTooltip: Story = {
  args: {
    width: 800,
    height: 500,
    data: generateScatterData(40),
    config: {
      showGrid: true,
      animated: true,
      xAxisLabel: 'Temperature (°C)',
      yAxisLabel: 'Humidity (%)',
      customTooltip: (data: ScatterDataPoint) => ({
        title: data.label || 'Measurement',
        items: [
          { label: 'Temperature', value: `${data.x.toFixed(1)}°C`, color: '#ff9f0a' },
          { label: 'Humidity', value: `${data.y.toFixed(1)}%`, color: '#5ac8fa' },
          { label: 'Size', value: data.size?.toFixed(0) || 'N/A' },
        ],
      }),
    },
  },
};
