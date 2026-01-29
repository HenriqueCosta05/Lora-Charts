# Lora Charts 📊

A modern, interactive charting library built with Angular and D3.js, featuring beautiful glass-morphism designs and smooth animations.

[![Version](https://img.shields.io/badge/version-0.0.2-blue.svg)](https://github.com/HenriqueCosta05/Lora_DS)
[![Angular](https://img.shields.io/badge/Angular-21.1.0-red.svg)](https://angular.io/)
[![D3.js](https://img.shields.io/badge/D3.js-7.9.0-orange.svg)](https://d3js.org/)
[![License](https://img.shields.io/badge/license-private-lightgrey.svg)](https://github.com/HenriqueCosta05/Lora_DS)

## ✨ Features

- **10 Chart Types**: Bar, Line, Area, Pie, Scatter, Heatmap, Treemap, Gauge, Wordcloud, and more
- **Modern Design**: Glass-morphism effects with smooth animations
- **Interactive**: Tooltips, zoom, hover effects, and customization options
- **TypeScript**: Fully typed for better developer experience
- **Responsive**: Adapts to different screen sizes
- **Theme Support**: Customizable themes with CSS variables
- **Storybook**: Interactive documentation and component playground
- **Tested**: Unit tests with Vitest

## 📦 Installation

```bash
npm install lora-charts
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { Bar } from 'lora-charts';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [Bar],
  template: `
    <app-bar
      [data]="chartData"
      [width]="800"
      [height]="500"
      [config]="{ animated: true, showGrid: true }"
    />
  `
})
export class ExampleComponent {
  chartData = [
    { label: 'Q1', value: 4500 },
    { label: 'Q2', value: 5200 },
    { label: 'Q3', value: 6100 },
    { label: 'Q4', value: 7300 },
  ];
}
```

## 📊 Available Charts

### Bar Chart
Perfect for comparing values across categories.
```typescript
import { Bar } from 'lora-charts';
```

### Line Chart
Ideal for showing trends over time.
```typescript
import { Line } from 'lora-charts';
```

### Area Chart
Similar to line charts with filled areas.
```typescript
import { Area } from 'lora-charts';
```

### Pie Chart
Great for showing proportions and percentages.
```typescript
import { Pie } from 'lora-charts';
```

### Scatter Chart
Perfect for showing correlations and data distributions.
```typescript
import { Scatter } from 'lora-charts';
```

### Heatmap
Ideal for visualizing data density and patterns.
```typescript
import { Heatmap } from 'lora-charts';
```

### Treemap
Great for hierarchical data visualization.
```typescript
import { Treemap } from 'lora-charts';
```

### Gauge Chart
Perfect for showing progress and KPIs.
```typescript
import { Gauge } from 'lora-charts';
```

### Wordcloud
Visualize word frequencies and text data.
```typescript
import { Wordcloud } from 'lora-charts';
```

## 🎨 Theming

Lora Charts supports custom themes through CSS variables and JSON configuration.

### Using Theme Service

```typescript
import { ThemeService } from 'lora-charts';

constructor(private themeService: ThemeService) {
  this.themeService.loadAndSetTheme('/themes/main.json');
}
```

### Theme Configuration

Create a theme JSON file:

```json
{
  "mode": "light",
  "colors": {
    "primary": "#0071e3",
    "secondary": "#8e44ff",
    "background": "#f5f5f7",
    "text": "#1d1d1f",
    "border": "rgba(0, 0, 0, 0.08)"
  },
  "fonts": {
    "family": "Inter, system-ui, sans-serif",
    "size": {
      "sm": 13,
      "md": 15,
      "lg": 17
    }
  },
  "spacing": {
    "sm": 8,
    "md": 16,
    "lg": 24
  }
}
```

## ⚙️ Configuration

Each chart accepts a `config` object for customization:

### Bar Chart Config
```typescript
{
  orientation?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showValues?: boolean;
  animated?: boolean;
  barRadius?: number;
  barPadding?: number;
  colors?: string[];
  customTooltip?: (data) => TooltipConfig;
}
```

### Scatter Chart Config
```typescript
{
  showGrid?: boolean;
  animated?: boolean;
  colors?: string[];
  minBubbleSize?: number;
  maxBubbleSize?: number;
  enableZoom?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  customTooltip?: (data) => TooltipConfig;
}
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm 11.7.0

### Setup

```bash
# Clone the repository
git clone https://github.com/HenriqueCosta05/Lora_DS

# Install dependencies
npm install

# Start development server
npm start

# Run Storybook
npm run storybook

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Project Structure

```
lora-charts/
├── src/
│   ├── components/
│   │   ├── base/              # Base chart components
│   │   │   ├── axis/
│   │   │   ├── chart-container/
│   │   │   ├── grid/
│   │   │   ├── legend/
│   │   │   └── tooltip/
│   │   └── charts/            # Chart implementations
│   │       ├── area/
│   │       ├── bar/
│   │       ├── gauge/
│   │       ├── heatmap/
│   │       ├── line/
│   │       ├── pie/
│   │       ├── scatter/
│   │       ├── treemap/
│   │       └── wordcloud/
│   ├── services/              # Theme and utility services
│   ├── stories/               # Storybook stories
│   ├── types/                 # TypeScript types
│   └── utils/                 # Helper functions
├── public/
│   └── themes/                # Theme configurations
└── .storybook/                # Storybook configuration
```

## 📚 Documentation

Full documentation is available in Storybook:

```bash
npm run storybook
```

Then navigate to `http://localhost:6006`

## 🧪 Testing

Lora Charts uses Vitest for unit testing:

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage report
npm run test:coverage
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private. See the repository for licensing information.

## 🔗 Links

- [GitHub Repository](https://github.com/HenriqueCosta05/Lora_DS)
- [Storybook Documentation](http://localhost:6006)
- [D3.js Documentation](https://d3js.org/)
- [Angular Documentation](https://angular.io/)

## 👨‍💻 Author

**Henrique Costa**
- GitHub: [@HenriqueCosta05](https://github.com/HenriqueCosta05)

---

Made with ❤️ using Angular and D3.js
