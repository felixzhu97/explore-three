import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { GlobeConfig } from './GlobeConfig';

/** 渲染循环服务 */
export class GlobeRenderer {
  private flyingMaterials: THREE.ShaderMaterial[] = [];
  private dotMaterials: THREE.ShaderMaterial[] = [];
  private twinkleSpeed = 0.03;
  private animId: number | null = null;

  constructor(
    private scene: THREE.Scene,
    private camera: THREE.Camera,
    private renderer: THREE.WebGLRenderer,
    private controls: OrbitControls,
    private config: GlobeConfig,
  ) {}

  addFlyingLineMaterials(materials: THREE.ShaderMaterial[]): void {
    this.flyingMaterials = materials;
  }

  addDotMaterials(materials: THREE.ShaderMaterial[], twinkleSpeed: number): void {
    this.dotMaterials = materials;
    this.twinkleSpeed = twinkleSpeed;
  }

  startRenderLoop(): () => void {
    let time = 1.0;

    const render = () => {
      time += this.twinkleSpeed;
      this.dotMaterials.forEach((m) => {
        m.uniforms.u_time.value += this.twinkleSpeed;
      });
      this.flyingMaterials.forEach((m) => {
        m.uniforms.time.value += this.config.animationSpeed;
      });
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (this.animId !== null) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    };
  }
}
