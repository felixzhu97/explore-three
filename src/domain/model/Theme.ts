/** Product theme id. */
export type ThemeId = 'bright' | 'tech';

/** RGB color in domain space (0..1). */
export interface RouteColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/** Product appearance — no shaders / Three types. */
export interface ThemeAppearance {
  readonly type: ThemeId;
  readonly lightConfig: {
    readonly pointColor: number;
    readonly pointIntensity: number;
    readonly hemisphereColor: number;
    readonly hemisphereIntensity: number;
  };
  readonly buttonStroke: string;
  readonly sourceUrl: string;
}

export const BRIGHT_THEME: ThemeAppearance = {
  type: 'bright',
  lightConfig: {
    pointColor: 0xffffff,
    pointIntensity: 3,
    hemisphereColor: 0xffffff,
    hemisphereIntensity: 1.5,
  },
  buttonStroke: '#333333',
  sourceUrl: 'https://github.com/felixzhu97/three-explore',
};

export const TECH_THEME: ThemeAppearance = {
  type: 'tech',
  lightConfig: {
    pointColor: 0x081b26,
    pointIntensity: 17,
    hemisphereColor: 0xffffff,
    hemisphereIntensity: 1.5,
  },
  buttonStroke: '#ffffff',
  sourceUrl: 'https://github.com/felixzhu97/threejs-globe-stripe',
};

export const BRIGHT_COLORS: readonly RouteColor[] = [
  { r: 0.3, g: 0.8, b: 1.0 },
  { r: 1.0, g: 0.5, b: 0.3 },
  { r: 0.5, g: 1.0, b: 0.3 },
  { r: 1.0, g: 0.3, b: 0.8 },
  { r: 0.8, g: 0.8, b: 0.3 },
  { r: 0.6, g: 0.3, b: 1.0 },
];

export const TECH_COLORS: readonly RouteColor[] = [
  { r: 0.0, g: 0.8, b: 1.0 },
  { r: 0.0, g: 0.4, b: 0.8 },
  { r: 0.2, g: 1.0, b: 0.8 },
  { r: 0.3, g: 0.6, b: 1.0 },
  { r: 0.0, g: 0.9, b: 0.6 },
  { r: 0.1, g: 0.5, b: 0.9 },
];
