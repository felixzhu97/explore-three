import * as THREE from 'three';
import type { RenderConfig } from './config';

/** 从陆地蒙版采样并添加陆地点 */
export function addLandDots(
  scene: THREE.Scene,
  material: THREE.ShaderMaterial,
  config: Pick<
    RenderConfig,
    'sphereRadius' | 'dotRadius' | 'dotSegments' | 'dotDensity' | 'worldTextureUrl'
  >,
): { materials: THREE.ShaderMaterial[]; dots: THREE.Mesh[] } {
  const materials: THREE.ShaderMaterial[] = [];
  const dots: THREE.Mesh[] = [];

  const extractLand = (data: Uint8ClampedArray): Record<number, number[]> => {
    const land: Record<number, number[]> = {};
    for (let i = 0, lon = -180, lat = 90; i < data.length; i += 4, lon++) {
      if (!land[lat]) land[lat] = [];
      if (data[i] < 80 && data[i + 1] < 80 && data[i + 2] < 80) land[lat].push(lon);
      if (lon === 180) {
        lon = -180;
        lat--;
      }
    }
    return land;
  };

  const isOnLand = (lon: number, lat: number, land: Record<number, number[]>): boolean => {
    if (!land[lat]?.length) return false;
    const closest = land[lat].reduce((p, c) => (Math.abs(c - lon) < Math.abs(p - lon) ? c : p));
    return Math.abs(lon - closest) < 0.5;
  };

  const toVec3 = (lon: number, lat: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(config.sphereRadius * Math.sin(phi) * Math.cos(theta)),
      config.sphereRadius * Math.cos(phi),
      config.sphereRadius * Math.sin(phi) * Math.sin(theta),
    );
  };

  const img = new Image();
  img.onload = () => {
    const cvs = document.createElement('canvas');
    cvs.width = img.width;
    cvs.height = img.height;
    const ctx = cvs.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const land = extractLand(ctx.getImageData(0, 0, cvs.width, cvs.height).data);
      for (let lat = 90, j = 0; lat > -90; lat--, j++) {
        const r = Math.cos(Math.abs(lat) * (Math.PI / 180)) * config.sphereRadius;
        const n = r * Math.PI * 2 * config.dotDensity;
        for (let x = 0; x < n; x++) {
          const lon = -180 + (x * 360) / n;
          if (!isOnLand(lon, lat, land)) continue;
          const v = toVec3(lon, lat);
          const geo = new THREE.CircleGeometry(config.dotRadius, config.dotSegments);
          geo.lookAt(v);
          geo.translate(v.x, v.y, v.z);
          const mat = material.clone();
          mat.uniforms.u_time.value = j * Math.sin(Math.random());
          materials.push(mat);
          const mesh = new THREE.Mesh(geo, mat);
          dots.push(mesh);
          scene.add(mesh);
        }
      }
    }
  };
  img.src = config.worldTextureUrl;

  return { materials, dots };
}
