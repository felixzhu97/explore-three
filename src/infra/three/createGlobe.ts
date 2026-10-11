import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DEFAULT_ROUTES, type ThemeConfig } from '../../domain/model';
import {
  addSceneLights,
  createBaseMaterial,
  createDotMaterial,
  defaults,
  loadArcTextures,
  type RenderConfig,
} from './config';
import { createArc, createMarker } from './flyingLine';
import { addLandDots } from './land';

export interface CreateGlobeOptions {
  theme: ThemeConfig;
  colors: readonly THREE.Vector3[];
  lightPos?: THREE.Vector3;
  config?: Partial<RenderConfig>;
  onHover?: (hit: boolean) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export interface GlobeHandle {
  readonly materials: THREE.ShaderMaterial[];
  readonly state: { isIntersecting: boolean; grabbing: boolean };
  dispose: () => void;
}

/** 引导 Three.js 地球仪（非领域编排） */
export function createGlobe(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  options: CreateGlobeOptions,
): GlobeHandle {
  const config = { ...defaults, ...options.config };
  const { theme, colors, lightPos } = options;

  const sizes = { width: container.offsetWidth, height: container.offsetHeight };
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 1, 1000);
  camera.position.z = 100;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(sizes.width, sizes.height);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = config.autoRotateSpeed;
  controls.enableDamping = true;
  controls.enableRotate = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minPolarAngle = config.minPolarAngle;
  controls.maxPolarAngle = config.maxPolarAngle;

  addSceneLights(scene, theme, lightPos);

  const sphere = new THREE.SphereGeometry(config.sphereRadius, 35, 35);
  const baseMesh = new THREE.Mesh(sphere, createBaseMaterial(theme.type));
  scene.add(baseMesh);

  const dotMaterial = createDotMaterial(theme);
  const { materials } = addLandDots(scene, dotMaterial, config);

  const flyingMaterials: THREE.ShaderMaterial[] = [];
  loadArcTextures(config.arcTextureUrls, (arcTextures) => {
    DEFAULT_ROUTES.forEach((route, i) => {
      const color = colors[i % colors.length];
      const mesh = createArc(route, color, config, arcTextures, i);
      flyingMaterials.push(mesh.material as THREE.ShaderMaterial);
      scene.add(mesh);
      scene.add(createMarker(route.origin, color, config.sphereRadius));
      scene.add(createMarker(route.destination, color, config.sphereRadius));
    });
  });

  const state = { isIntersecting: false, grabbing: false };
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const callbacks = {
    onHover: options.onHover,
    onDragStart: options.onDragStart,
    onDragEnd: options.onDragEnd,
  };

  const onMouseMove = (e: MouseEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObject(baseMesh);
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

  const twinkleSpeed = 0.03;
  let animId: number | null = null;
  const render = () => {
    materials.forEach((m) => {
      m.uniforms.u_time.value += twinkleSpeed;
    });
    flyingMaterials.forEach((m) => {
      m.uniforms.time.value += config.animationSpeed;
    });
    controls.update();
    renderer.render(scene, camera);
    animId = requestAnimationFrame(render);
  };
  render();

  return {
    materials,
    state,
    dispose() {
      if (animId !== null) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    },
  };
}
