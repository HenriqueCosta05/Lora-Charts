export type Colors = {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    shadow: string;
    glass?: string;
    glassHover?: string;
    glassBorder?: string;
    accent1?: string;
    accent2?: string;
    accent3?: string;
    accent4?: string;
    accent5?: string;
    gradient1?: string[];
    gradient2?: string[];
    gradient3?: string[];
    gradient4?: string[];
    gradient5?: string[];
};

export type Spacing = {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
};

export type Fonts = {
    family: string;
    size: Spacing;
    weight: 'extra-light' | 'light' | 'normal' | 'medium' | 'bold' | 'bolder';
};

export type Borders = {
    radius: string;
    width: string;
    style: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
};

export type Animations = {
    duration: number;
    easing: string;
};

export type Effects = {
    blur?: string;
    blurStrong?: string;
    shadow3d?: string;
    shadowHover?: string;
    shadowInner?: string;
    glassGradient?: string;
    glassBackground?: string;
    glassBorder?: string;
    perspective?: string;
    transform3d?: string;
};

export type Theme = {
    mode: 'light' | 'dark';
    colors: Colors;
    fonts: Fonts;
    borders: Borders;
    spacing: Spacing;
    animations: Animations;
    effects?: Effects;
};
