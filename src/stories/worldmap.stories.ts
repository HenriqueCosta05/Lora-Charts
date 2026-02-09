import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ChartContainer } from '../components/base/chart-container/chart-container';
import { WorldMap } from '../components/charts/worldmap/worldmap';

const meta: Meta<WorldMap> = {
  title: 'Charts/WorldMap',
  component: WorldMap,
  decorators: [
    moduleMetadata({
      imports: [WorldMap, ChartContainer],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<WorldMap>;

// Sample choropleth data using numeric country IDs (ISO 3166-1 numeric)
const populationData = [
  { countryId: '156', countryName: 'China', value: 1425, metadata: { region: 'Asia' } },
  { countryId: '356', countryName: 'India', value: 1408, metadata: { region: 'Asia' } },
  { countryId: '840', countryName: 'United States', value: 332, metadata: { region: 'Americas' } },
  { countryId: '360', countryName: 'Indonesia', value: 274, metadata: { region: 'Asia' } },
  { countryId: '076', countryName: 'Brazil', value: 214, metadata: { region: 'Americas' } },
  { countryId: '586', countryName: 'Pakistan', value: 229, metadata: { region: 'Asia' } },
  { countryId: '566', countryName: 'Nigeria', value: 219, metadata: { region: 'Africa' } },
  { countryId: '050', countryName: 'Bangladesh', value: 169, metadata: { region: 'Asia' } },
  { countryId: '643', countryName: 'Russia', value: 146, metadata: { region: 'Europe' } },
  { countryId: '484', countryName: 'Mexico', value: 130, metadata: { region: 'Americas' } },
  { countryId: '392', countryName: 'Japan', value: 125, metadata: { region: 'Asia' } },
  { countryId: '276', countryName: 'Germany', value: 84, metadata: { region: 'Europe' } },
  { countryId: '826', countryName: 'United Kingdom', value: 67, metadata: { region: 'Europe' } },
  { countryId: '250', countryName: 'France', value: 68, metadata: { region: 'Europe' } },
  { countryId: '380', countryName: 'Italy', value: 60, metadata: { region: 'Europe' } },
  { countryId: '710', countryName: 'South Africa', value: 60, metadata: { region: 'Africa' } },
  { countryId: '036', countryName: 'Australia', value: 26, metadata: { region: 'Oceania' } },
  { countryId: '124', countryName: 'Canada', value: 38, metadata: { region: 'Americas' } },
  { countryId: '410', countryName: 'South Korea', value: 52, metadata: { region: 'Asia' } },
  { countryId: '032', countryName: 'Argentina', value: 46, metadata: { region: 'Americas' } },
];

const gdpData = [
  { countryId: '840', countryName: 'United States', value: 25460 },
  { countryId: '156', countryName: 'China', value: 17960 },
  { countryId: '392', countryName: 'Japan', value: 4230 },
  { countryId: '276', countryName: 'Germany', value: 4070 },
  { countryId: '826', countryName: 'United Kingdom', value: 3070 },
  { countryId: '356', countryName: 'India', value: 3390 },
  { countryId: '250', countryName: 'France', value: 2780 },
  { countryId: '380', countryName: 'Italy', value: 2010 },
  { countryId: '124', countryName: 'Canada', value: 2140 },
  { countryId: '076', countryName: 'Brazil', value: 1920 },
  { countryId: '643', countryName: 'Russia', value: 2240 },
  { countryId: '036', countryName: 'Australia', value: 1680 },
  { countryId: '410', countryName: 'South Korea', value: 1670 },
  { countryId: '484', countryName: 'Mexico', value: 1320 },
  { countryId: '360', countryName: 'Indonesia', value: 1320 },
];

export const Equirectangular: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="World Map"
        subtitle="Equirectangular projection"
        theme="glass">
        <app-worldmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-worldmap>
      </app-chart-container>
    `,
  }),
  args: {
    data: [],
    width: 960,
    height: 500,
    config: {
      projection: 'equirectangular',
      showGraticule: true,
      showOutline: true,
      showCountryBorders: true,
      animated: true,
    },
  },
};

export const Orthographic: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="Globe View"
        subtitle="Orthographic projection"
        theme="glass">
        <app-worldmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-worldmap>
      </app-chart-container>
    `,
  }),
  args: {
    data: [],
    width: 800,
    height: 800,
    config: {
      projection: 'orthographic',
      rotate: [-30, -30],
      showGraticule: true,
      showOutline: true,
      animated: true,
      oceanColor: '#c7e9ff',
      landColor: '#e8e8e8',
      graticuleColor: '#b0c4de',
    },
  },
};

export const NaturalEarth: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="Natural Earth"
        subtitle="Compromise projection for world maps"
        theme="gradient">
        <app-worldmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-worldmap>
      </app-chart-container>
    `,
  }),
  args: {
    data: [],
    width: 960,
    height: 500,
    config: {
      projection: 'naturalEarth1',
      showGraticule: true,
      showOutline: true,
      animated: true,
      landColor: '#d4edda',
      oceanColor: '#e8f4f8',
      borderColor: '#6c757d',
      graticuleColor: '#adb5bd',
    },
  },
};

export const EqualEarth: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="Equal Earth"
        subtitle="Equal-area projection preserving relative sizes"
        theme="glass">
        <app-worldmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-worldmap>
      </app-chart-container>
    `,
  }),
  args: {
    data: [],
    width: 960,
    height: 500,
    config: {
      projection: 'equalEarth',
      showGraticule: true,
      showOutline: true,
      animated: true,
    },
  },
};

export const PopulationChoropleth: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="World Population"
        subtitle="Population by country (millions)"
        theme="glass">
        <app-worldmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-worldmap>
      </app-chart-container>
    `,
  }),
  args: {
    data: populationData,
    width: 960,
    height: 500,
    config: {
      projection: 'naturalEarth1',
      showGraticule: true,
      showOutline: true,
      animated: true,
      colorRange: ['#dbeafe', '#1e3a8a'] as [string, string],
      landColor: '#f8f9fa',
      oceanColor: '#f0f9ff',
    },
  },
};

export const GDPChoropleth: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="GDP by Country"
        subtitle="Gross Domestic Product (billions USD)"
        theme="gradient">
        <app-worldmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-worldmap>
      </app-chart-container>
    `,
  }),
  args: {
    data: gdpData,
    width: 960,
    height: 500,
    config: {
      projection: 'equirectangular',
      showGraticule: true,
      showOutline: true,
      animated: true,
      colorRange: ['#fef3c7', '#92400e'] as [string, string],
      landColor: '#f3f4f6',
      oceanColor: '#ecfdf5',
      borderColor: '#9ca3af',
    },
  },
};

export const MercatorProjection: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="Mercator Projection"
        subtitle="Classic navigation projection"
        theme="solid">
        <app-worldmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-worldmap>
      </app-chart-container>
    `,
  }),
  args: {
    data: [],
    width: 960,
    height: 600,
    config: {
      projection: 'mercator',
      showGraticule: true,
      showOutline: true,
      animated: true,
      landColor: '#fde68a',
      oceanColor: '#dbeafe',
      borderColor: '#b45309',
      graticuleColor: '#93c5fd',
    },
  },
};

export const DarkTheme: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="Dark World Map"
        subtitle="Stylized dark theme"
        theme="glass">
        <app-worldmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-worldmap>
      </app-chart-container>
    `,
  }),
  args: {
    data: populationData,
    width: 960,
    height: 500,
    config: {
      projection: 'naturalEarth1',
      showGraticule: true,
      showOutline: true,
      animated: true,
      colorRange: ['#4c1d95', '#c4b5fd'] as [string, string],
      landColor: '#1e1b4b',
      oceanColor: '#0f172a',
      borderColor: '#4338ca',
      graticuleColor: '#312e81',
      outlineColor: '#6366f1',
      highlightColor: '#f59e0b',
    },
  },
};

export const NoGraticule: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="Clean Map"
        subtitle="No graticule lines"
        theme="solid">
        <app-worldmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-worldmap>
      </app-chart-container>
    `,
  }),
  args: {
    data: [],
    width: 960,
    height: 500,
    config: {
      projection: 'equalEarth',
      showGraticule: false,
      showOutline: true,
      animated: false,
      landColor: '#e2e8f0',
      oceanColor: '#ffffff',
      borderColor: '#94a3b8',
    },
  },
};

export const RotatedOrthographic: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-chart-container
        title="Asia Focus"
        subtitle="Orthographic projection rotated to Asia"
        theme="glass">
        <app-worldmap
          [data]="data"
          [width]="width"
          [height]="height"
          [config]="config">
        </app-worldmap>
      </app-chart-container>
    `,
  }),
  args: {
    data: gdpData,
    width: 700,
    height: 700,
    config: {
      projection: 'orthographic',
      rotate: [-100, -30],
      showGraticule: true,
      showOutline: true,
      animated: true,
      colorRange: ['#dcfce7', '#166534'] as [string, string],
      landColor: '#f0fdf4',
      oceanColor: '#e0f2fe',
      graticuleColor: '#bae6fd',
      outlineColor: '#0284c7',
    },
  },
};
