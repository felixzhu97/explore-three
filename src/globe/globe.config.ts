/** Render defaults for the globe scene. */
export const globeConfig = {
  sphereRadius: 19.5,
  dotRadius: 0.1,
  dotSegments: 5,
  dotDensity: 2.5,
  worldTextureUrl: '/img/world_alpha_mini.jpg',
  tubeRadius: 0.05,
  radialSegments: 8,
  tubularSegments: 50,
  animationSpeed: 0.012,
  cycleDuration: 16.0,
  arcHeight: 0.1,
  minArcHeight: 3,
  autoRotateSpeed: 1.2,
  minPolarAngle: Math.PI / 2 - 0.5,
  maxPolarAngle: Math.PI / 2 + 0.5,
  arcTextureUrls: [
    '/img/arc-texture-1.png',
    '/img/arc-texture-2.png',
    '/img/arc-texture-3.png',
    '/img/arc-texture-4.png',
  ],
} as const;

export type GlobeConfig = typeof globeConfig;
