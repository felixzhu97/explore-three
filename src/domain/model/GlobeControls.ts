import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { GlobeConfig } from './GlobeConfig';

export { OrbitControls };

/** 相机控制器工厂 */
export class GlobeControls {
  static create(camera: THREE.Camera, domElement: HTMLElement, config: GlobeConfig): OrbitControls {
    const controls = new OrbitControls(camera, domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = config.autoRotateSpeed;
    controls.enableDamping = true;
    controls.enableRotate = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = config.minPolarAngle;
    controls.maxPolarAngle = config.maxPolarAngle;
    return controls;
  }
}
