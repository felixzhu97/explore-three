import * as THREE from 'three';
import type { ThemeConfig } from './ThemeConfig';

/** 地球仪配置 */
export class GlobeConfig {
  constructor(
    public readonly sphereRadius = 19.5,
    public readonly dotRadius = 0.1,
    public readonly dotSegments = 5,
    public readonly dotDensity = 2.5,
    public readonly worldTextureUrl = '/img/world_alpha_mini.jpg',
    public readonly tubeRadius = 0.05,
    public readonly radialSegments = 8,
    public readonly tubularSegments = 50,
    public readonly animationSpeed = 0.012,
    public readonly cycleDuration = 16.0,
    public readonly arcHeight = 0.1,
    public readonly minArcHeight = 3,
    public readonly autoRotateSpeed = 1.2,
    public readonly minPolarAngle = Math.PI / 2 - 0.5,
    public readonly maxPolarAngle = Math.PI / 2 + 0.5,
    public readonly arcTextureUrls = [
      '/img/arc-texture-1.png',
      '/img/arc-texture-2.png',
      '/img/arc-texture-3.png',
      '/img/arc-texture-4.png',
    ],
  ) {}

  loadArcTextures(callback: (textures: (THREE.Texture | undefined)[]) => void): void {
    const loader = new THREE.TextureLoader();
    const textures: (THREE.Texture | undefined)[] = [];
    let loadedCount = 0;
    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= this.arcTextureUrls.length) callback(textures);
    };
    this.arcTextureUrls.forEach((url, i) => {
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

  calculateArcPoints(start: THREE.Vector3, end: THREE.Vector3, segments = 60): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    const dist = start.distanceTo(end);
    const height = Math.max(dist * this.arcHeight, this.minArcHeight);
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

  createBaseMaterial(type: 'bright' | 'tech'): THREE.Material {
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

  createDotMaterial(theme: ThemeConfig): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: { u_time: { value: 1.0 }, u_maxExtrusion: { value: 1.0 } },
      vertexShader: theme.dotShader.vertex,
      fragmentShader: theme.dotShader.fragment,
    });
  }

  addSceneLights(scene: THREE.Scene, theme: ThemeConfig, lightPos?: THREE.Vector3): void {
    const point = new THREE.PointLight(theme.lightConfig.pointColor, theme.lightConfig.pointIntensity, 200);
    if (lightPos) point.position.copy(lightPos);
    scene.add(point);
    scene.add(new THREE.HemisphereLight(theme.lightConfig.hemisphereColor, theme.lightConfig.hemisphereIntensity));
  }
}
