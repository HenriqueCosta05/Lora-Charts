import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-controls",
    "@storybook/addon-actions",
    "@storybook/addon-viewport",
    "@storybook/addon-backgrounds",
    "@storybook/addon-toolbars",
    "@storybook/addon-measure",
    "@storybook/addon-outline",
  ],
  "framework": {
    "name": "@storybook/angular",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ]
};
export default config;
