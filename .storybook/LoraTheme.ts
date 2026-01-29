import { create } from "storybook/theming";

export default create({
    base: "dark",
    brandTitle: 'Lora Design System',
    brandUrl: 'https://github.com/HenriqueCosta05/Lora_DS',
    brandImage: 'https://i.ibb.co/4gF16XK5/lora.png',
    brandTarget: '_self',

    colorPrimary: '#3A5CCC',
    colorSecondary: '#2F8F83',

    // UI
    appBg: '#0F172A',
    appContentBg: '#111827',
    appPreviewBg: '#111827',
    appBorderColor: '#1F2937',
    appBorderRadius: 4,

    // Text colors
    textColor: '#F3F1ED',
    textInverseColor: '#0F172A',

    // Toolbar default and active colors
    barTextColor: '#F3F1ED',
    barSelectedColor: '#3A5CCC',
    barBg: '#10162F',

    // Form colors
    inputBg: '#1F2937',
    inputBorder: '#10162F',
    inputTextColor: '#F3F1ED',
    inputBorderRadius: 2,
});
