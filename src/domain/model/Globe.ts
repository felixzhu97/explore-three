import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ColorScheme } from './ColorScheme';
import { DEFAULT_FLIGHT_ROUTES } from './FlightRoute';
import { FlyingLine } from './FlyingLine';
import { GlobeConfig } from './GlobeConfig';
import { GlobeControls } from './GlobeControls';
import type { GlobeInteraction, GlobeInteractionConfig } from './GlobePointer';
import { GlobePointer } from './GlobePointer';
import { GlobeRenderer } from './GlobeRenderer';
import { GlobeScene } from './GlobeScene';
import { LandMap } from './LandMap';
import type { ThemeConfig } from './ThemeConfig';

/** 地球仪应用上下文 */
export interface GlobeContext {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly controls: OrbitControls;
  readonly interaction: GlobeInteraction;
  readonly state: { isIntersecting: boolean; grabbing: boolean };
  readonly materials: THREE.ShaderMaterial[];
  readonly flyingMaterials: THREE.ShaderMaterial[];
  readonly baseMesh: THREE.Mesh;
  dispose: () => void;
}

/** 地球仪聚合根 */
export class Globe {
  static create(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    config: GlobeConfig,
    colorScheme: ColorScheme,
    theme: ThemeConfig,
    lightPos?: THREE.Vector3,
    interactionConfig?: GlobeInteractionConfig,
  ): GlobeContext {
    const ctx = GlobeScene.create(container, canvas);
    const controls = GlobeControls.create(ctx.camera, ctx.renderer.domElement, config);
    config.addSceneLights(ctx.scene, theme, lightPos);

    const sphere = new THREE.SphereGeometry(config.sphereRadius, 35, 35);
    const baseMesh = new THREE.Mesh(sphere, config.createBaseMaterial(theme.type));
    ctx.scene.add(baseMesh);

    const dotMaterial = config.createDotMaterial(theme);
    const landMap = new LandMap(config);
    const { materials } = landMap.createLandDots(dotMaterial, ctx.scene);

    const flyingMaterials: THREE.ShaderMaterial[] = [];
    config.loadArcTextures((arcTextures) => {
      DEFAULT_FLIGHT_ROUTES.forEach((route, i) => {
        const mesh = FlyingLine.createMesh(
          route,
          colorScheme.resolveColor(i),
          config,
          config.sphereRadius,
          arcTextures,
          i,
        );
        flyingMaterials.push(mesh.material as THREE.ShaderMaterial);
        ctx.scene.add(mesh);
        ctx.scene.add(
          FlyingLine.createMarker(route.origin, colorScheme.resolveColor(i), config.sphereRadius),
        );
        ctx.scene.add(
          FlyingLine.createMarker(route.destination, colorScheme.resolveColor(i), config.sphereRadius),
        );
      });
    });

    const renderer = new GlobeRenderer(ctx.scene, ctx.camera, ctx.renderer, controls, config);
    renderer.addFlyingLineMaterials(flyingMaterials);
    renderer.addDotMaterials(materials, 0.03);
    const stopRender = renderer.startRenderLoop();

    const { interaction, state } = GlobePointer.createInteraction(
      ctx.camera,
      ctx.renderer,
      new THREE.Raycaster(),
      baseMesh,
    );
    if (interactionConfig) interaction.bindCallbacks(interactionConfig);

    return {
      get scene() {
        return ctx.scene;
      },
      get camera() {
        return ctx.camera;
      },
      get renderer() {
        return ctx.renderer;
      },
      get controls() {
        return controls;
      },
      get interaction() {
        return interaction;
      },
      get state() {
        return state;
      },
      get materials() {
        return materials;
      },
      get flyingMaterials() {
        return flyingMaterials;
      },
      get baseMesh() {
        return baseMesh;
      },
      dispose() {
        stopRender();
        interaction.dispose();
        ctx.dispose();
      },
    };
  }
}
