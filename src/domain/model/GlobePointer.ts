import * as THREE from 'three';

/** 交互回调配置 */
export interface GlobeInteractionConfig {
  onHover?: (hit: boolean) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

/** 交互事件接口 */
export interface GlobeInteraction {
  bindCallbacks: (callbacks: GlobeInteractionConfig) => void;
  dispose: () => void;
}

/** 指针交互服务 */
export class GlobePointer {
  static createInteraction(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    raycaster: THREE.Raycaster,
    baseMesh: THREE.Mesh,
  ): { interaction: GlobeInteraction; state: { isIntersecting: boolean; grabbing: boolean } } {
    const state = { isIntersecting: false, grabbing: false };
    const mouse = new THREE.Vector2();
    const callbacks: GlobeInteractionConfig = {};

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObject(baseMesh);
      state.isIntersecting = !!hits[0];
      callbacks.onHover?.(state.isIntersecting);
    };

    const onResize = () => {
      const w = renderer.domElement.parentElement?.offsetWidth ?? window.innerWidth;
      const h = renderer.domElement.parentElement?.offsetHeight ?? window.innerHeight;
      camera.position.z = window.innerWidth > 700 ? 100 : 140;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const onMouseDown = () => callbacks.onDragStart?.();
    const onMouseUp = () => callbacks.onDragEnd?.();

    const interaction: GlobeInteraction = {
      bindCallbacks(cbs) {
        Object.assign(callbacks, cbs);
      },
      dispose() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('resize', onResize);
      },
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', onResize);

    return { interaction, state };
  }
}
