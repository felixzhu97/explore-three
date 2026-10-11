import * as THREE from 'three';

/** 配色方案 */
export class ColorScheme {
  constructor(private readonly colors: readonly THREE.Vector3[]) {}

  static createBrightScheme() {
    return new ColorScheme([
      new THREE.Vector3(0.3, 0.8, 1.0),
      new THREE.Vector3(1.0, 0.5, 0.3),
      new THREE.Vector3(0.5, 1.0, 0.3),
      new THREE.Vector3(1.0, 0.3, 0.8),
      new THREE.Vector3(0.8, 0.8, 0.3),
      new THREE.Vector3(0.6, 0.3, 1.0),
    ]);
  }

  static createTechScheme() {
    return new ColorScheme([
      new THREE.Vector3(0.0, 0.8, 1.0),
      new THREE.Vector3(0.0, 0.4, 0.8),
      new THREE.Vector3(0.2, 1.0, 0.8),
      new THREE.Vector3(0.3, 0.6, 1.0),
      new THREE.Vector3(0.0, 0.9, 0.6),
      new THREE.Vector3(0.1, 0.5, 0.9),
    ]);
  }

  resolveColor(i: number) {
    return this.colors[i % this.colors.length];
  }
}
