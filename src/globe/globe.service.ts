import { Injectable, inject } from '@angular/core';
import {
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { RouteService } from '../route/route.service';
import type { RouteColor, ThemeAppearance, ThemeId } from '../theme/theme.service';
import { ThemeService } from '../theme/theme.service';
import type { DotMaterial } from './dot-material';
import type { GlobeConfig } from './globe.config';
import { GlobeGroup } from './globe-group';

export interface GlobeMountOptions {
  theme: ThemeAppearance;
  colors: readonly RouteColor[];
  lightPos?: Vector3;
  config?: Partial<GlobeConfig>;
  onHover?: (hit: boolean) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export interface GlobeSession {
  readonly materials: DotMaterial[];
  readonly state: { isIntersecting: boolean; grabbing: boolean };
  dispose: () => void;
}

@Injectable({ providedIn: 'root' })
export class GlobeService {
  readonly #themes = inject(ThemeService);
  readonly #routes = inject(RouteService);

  #session: GlobeSession | null = null;

  themeBundle(id: ThemeId): { theme: ThemeAppearance; colors: readonly RouteColor[] } {
    return {
      theme: this.#themes.appearance(id),
      colors: this.#themes.colors(id),
    };
  }

  mount(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    options: GlobeMountOptions,
  ): GlobeSession {
    this.#session?.dispose();

    const sizes = { width: container.offsetWidth, height: container.offsetHeight };
    const scene = new Scene();
    const camera = new PerspectiveCamera(30, sizes.width / sizes.height, 1, 1000);
    camera.position.z = 100;

    const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);

    const controls = new OrbitControls(camera, renderer.domElement);
    const config = options.config;
    controls.autoRotate = true;
    controls.autoRotateSpeed = config?.autoRotateSpeed ?? 1.2;
    controls.enableDamping = true;
    controls.enableRotate = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = config?.minPolarAngle ?? Math.PI / 2 - 0.5;
    controls.maxPolarAngle = config?.maxPolarAngle ?? Math.PI / 2 + 0.5;

    const root = new GlobeGroup(
      options.theme,
      options.colors,
      this.#routes.defaultRoutes,
      options.lightPos,
      config,
    );
    scene.add(root);

    const state = { isIntersecting: false, grabbing: false };
    const mouse = new Vector2();
    const raycaster = new Raycaster();
    const callbacks = {
      onHover: options.onHover,
      onDragStart: options.onDragStart,
      onDragEnd: options.onDragEnd,
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObject(root.baseMesh);
      state.isIntersecting = !!hits[0];
      callbacks.onHover?.(state.isIntersecting);
    };

    const onMouseDown = () => callbacks.onDragStart?.();
    const onMouseUp = () => callbacks.onDragEnd?.();

    const onResize = () => {
      const w = renderer.domElement.parentElement?.offsetWidth ?? window.innerWidth;
      const h = renderer.domElement.parentElement?.offsetHeight ?? window.innerHeight;
      camera.position.z = window.innerWidth > 700 ? 100 : 140;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', onResize);

    let animId: number | null = null;

    const render = () => {
      root.tick();
      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    render();

    const session: GlobeSession = {
      get materials() {
        return root.materials;
      },
      state,
      dispose: () => {
        if (animId !== null) {
          cancelAnimationFrame(animId);
        }
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('resize', onResize);
        root.dispose();
        renderer.dispose();
        if (this.#session === session) {
          this.#session = null;
        }
      },
    };

    this.#session = session;
    return session;
  }

  dispose(): void {
    this.#session?.dispose();
    this.#session = null;
  }
}
