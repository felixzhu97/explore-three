import * as THREE from 'three';
import type { ThemeConfig } from '../../domain/model';

/** 渲染默认参数 */
export const defaults = {
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

export type RenderConfig = typeof defaults;

export function loadArcTextures(
  urls: readonly string[],
  callback: (textures: (THREE.Texture | undefined)[]) => void,
): void {
  const loader = new THREE.TextureLoader();
  const textures: (THREE.Texture | undefined)[] = [];
  let loadedCount = 0;
  const checkComplete = () => {
    loadedCount++;
    if (loadedCount >= urls.length) callback(textures);
  };
  urls.forEach((url, i) => {
    loader.load(
      url,
      (t) => {
        textures[i] = t;
        checkComplete();
      },
      undefined,
      () => checkComplete(),
    );
  });
}

export function calculateArcPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  config: Pick<RenderConfig, 'arcHeight' | 'minArcHeight'>,
  segments = 60,
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const dist = start.distanceTo(end);
  const height = Math.max(dist * config.arcHeight, config.minArcHeight);
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const ctrl = mid.clone().normalize().multiplyScalar(dist + height);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const s = t * t * (3 - 2 * t);
    points.push(
      new THREE.Vector3(
        (1 - s) * (1 - s) * start.x + 2 * (1 - s) * s * ctrl.x + s * s * end.x,
        (1 - s) * (1 - s) * start.y + 2 * (1 - s) * s * ctrl.y + s * s * end.y,
        (1 - s) * (1 - s) * start.z + 2 * (1 - s) * s * ctrl.z + s * s * end.z,
      ),
    );
  }
  return points;
}

export function createBaseMaterial(type: ThemeConfig['type']): THREE.Material {
  if (type === 'bright') {
    return new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });
  }
  return new THREE.MeshStandardMaterial({
    color: 0x0b2636,
    transparent: true,
    opacity: 0.85,
    metalness: 0.3,
    roughness: 0.7,
  });
}

export function createDotMaterial(theme: ThemeConfig): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: { u_time: { value: 1.0 }, u_maxExtrusion: { value: 1.0 } },
    vertexShader: theme.dotShader.vertex,
    fragmentShader: theme.dotShader.fragment,
  });
}

export function addSceneLights(
  scene: THREE.Scene,
  theme: ThemeConfig,
  lightPos?: THREE.Vector3,
): void {
  const point = new THREE.PointLight(theme.lightConfig.pointColor, theme.lightConfig.pointIntensity, 200);
  if (lightPos) point.position.copy(lightPos);
  scene.add(point);
  scene.add(new THREE.HemisphereLight(theme.lightConfig.hemisphereColor, theme.lightConfig.hemisphereIntensity));
}
