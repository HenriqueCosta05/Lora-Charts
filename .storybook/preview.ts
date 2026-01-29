import { setCompodocJson } from "@storybook/addon-docs/angular";
import type { Preview } from '@storybook/angular';
import docJson from "../documentation.json";
import LoraTheme from "./LoraTheme";

setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    docs: {
      theme: LoraTheme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0F172A',
        },
        {
          name: 'light',
          value: '#F3F1ED',
        },
        {
          name: 'charcoal',
          value: '#1F2937',
        },
      ],
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
        wide: {
          name: 'Wide',
          styles: { width: '1920px', height: '1080px' },
        },
      },
    },
    layout: 'centered',
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
        showName: true,
      },
    },
  },
};

export default preview;
