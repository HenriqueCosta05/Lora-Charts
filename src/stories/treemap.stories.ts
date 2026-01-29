import type { Meta, StoryObj } from '@storybook/angular';
import { Treemap, TreemapDataNode } from '../components/charts/treemap/treemap';

const meta: Meta<Treemap> = {
  title: 'Charts/Treemap',
  component: Treemap,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'number' },
    height: { control: 'number' },
    data: { control: 'object' },
    config: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<Treemap>;

const sampleData: TreemapDataNode = {
  name: 'Root',
  children: [
    {
      name: 'Technology',
      children: [
        { name: 'AI & ML', value: 4500 },
        { name: 'Cloud Computing', value: 3800 },
        { name: 'Cybersecurity', value: 2900 },
        { name: 'IoT', value: 2200 },
      ],
    },
    {
      name: 'Finance',
      children: [
        { name: 'Banking', value: 5200 },
        { name: 'Insurance', value: 3400 },
        { name: 'Investment', value: 4100 },
      ],
    },
    {
      name: 'Healthcare',
      children: [
        { name: 'Pharma', value: 3900 },
        { name: 'Medical Devices', value: 2800 },
        { name: 'Telemedicine', value: 2100 },
      ],
    },
    {
      name: 'Energy',
      children: [
        { name: 'Renewable', value: 4200 },
        { name: 'Oil & Gas', value: 3600 },
      ],
    },
  ],
};

const productData: TreemapDataNode = {
  name: 'Company Revenue',
  children: [
    {
      name: 'North America',
      children: [
        { name: 'Product A', value: 12000, color: '#0071e3' },
        { name: 'Product B', value: 8500, color: '#5ac8fa' },
        { name: 'Product C', value: 6200, color: '#34c759' },
      ],
    },
    {
      name: 'Europe',
      children: [
        { name: 'Product A', value: 9500, color: '#8e44ff' },
        { name: 'Product B', value: 7200, color: '#af52de' },
        { name: 'Product C', value: 5800, color: '#ff2d55' },
      ],
    },
    {
      name: 'Asia',
      children: [
        { name: 'Product A', value: 15000, color: '#ff9f0a' },
        { name: 'Product B', value: 11000, color: '#ff3b30' },
      ],
    },
  ],
};

const fileSystemData: TreemapDataNode = {
  name: 'Storage',
  children: [
    {
      name: 'Documents',
      children: [
        { name: 'Work', value: 2500 },
        { name: 'Personal', value: 1800 },
        { name: 'Projects', value: 3200 },
      ],
    },
    {
      name: 'Media',
      children: [
        { name: 'Photos', value: 8500 },
        { name: 'Videos', value: 15000 },
        { name: 'Music', value: 4200 },
      ],
    },
    {
      name: 'Applications',
      children: [
        { name: 'Development', value: 3500 },
        { name: 'Design', value: 2800 },
        { name: 'Productivity', value: 1900 },
      ],
    },
    {
      name: 'System',
      value: 5500,
    },
  ],
};

export const Basic: Story = {
  args: {
    width: 800,
    height: 500,
    data: sampleData,
    config: {
      animated: true,
      showLabels: true,
      cornerRadius: 8,
      paddingInner: 2,
      paddingOuter: 4,
    },
  },
};

export const ProductRevenue: Story = {
  args: {
    width: 900,
    height: 600,
    data: productData,
    config: {
      animated: true,
      showLabels: true,
      cornerRadius: 12,
      paddingInner: 3,
      paddingOuter: 6,
    },
  },
};

export const FileSystem: Story = {
  args: {
    width: 800,
    height: 500,
    data: fileSystemData,
    config: {
      animated: true,
      showLabels: true,
      cornerRadius: 10,
      paddingInner: 2,
      paddingOuter: 4,
      colors: [
        '#0071e3',
        '#8e44ff',
        '#ff2d55',
        '#34c759',
        '#ff9f0a',
        '#5ac8fa',
        '#af52de',
        '#ff3b30',
      ],
    },
  },
};

export const GlassDesign: Story = {
  args: {
    width: 1000,
    height: 650,
    data: sampleData,
    config: {
      animated: true,
      showLabels: true,
      cornerRadius: 16,
      paddingInner: 4,
      paddingOuter: 8,
      colors: [
        'rgba(0, 113, 227, 0.85)',
        'rgba(142, 68, 255, 0.85)',
        'rgba(255, 45, 85, 0.85)',
        'rgba(52, 199, 89, 0.85)',
        'rgba(255, 159, 10, 0.85)',
        'rgba(90, 200, 250, 0.85)',
      ],
    },
  },
};

export const MinimalPadding: Story = {
  args: {
    width: 800,
    height: 500,
    data: productData,
    config: {
      animated: true,
      showLabels: true,
      cornerRadius: 4,
      paddingInner: 1,
      paddingOuter: 2,
    },
  },
};

export const LargePadding: Story = {
  args: {
    width: 800,
    height: 500,
    data: sampleData,
    config: {
      animated: true,
      showLabels: true,
      cornerRadius: 12,
      paddingInner: 6,
      paddingOuter: 10,
    },
  },
};

export const CustomTooltip: Story = {
  args: {
    width: 800,
    height: 500,
    data: fileSystemData,
    config: {
      animated: true,
      showLabels: true,
      cornerRadius: 10,
      customTooltip: (data: TreemapDataNode) => ({
        title: data.name,
        items: [
          { label: 'Size', value: `${((data.value || 0) / 1024).toFixed(2)} GB` },
          {
            label: 'Percentage',
            value: `${(((data.value || 0) / 50000) * 100).toFixed(1)}%`,
          },
        ],
      }),
    },
  },
};
