import * as THREE from 'three';

/** 场景上下文 */
export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  dispose: () => void;
}

/** 场景工厂 - 封装场景/相机/渲染器初始化 */
export class GlobeScene {
  static create(container: HTMLElement, canvas: HTMLCanvasElement): SceneContext {
    const sizes = { width: container.offsetWidth, height: container.offsetHeight };
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);

    const dispose = () => {
      renderer.dispose();
    };

    return { scene, camera, renderer, dispose };
  }
}
