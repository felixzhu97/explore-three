import {
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  SphereGeometry,
  Vector3,
} from 'three';

import { FlightArc } from '../route/flight-arc';
import { RouteMarker } from '../route/route-marker';
import type { FlightRoute } from '../route/route.service';
import type { RouteColor, ThemeAppearance, ThemeId } from '../theme/theme.service';
import { globeConfig, type GlobeConfig } from './globe.config';
import { LandDotsGroup } from './land-dots-group';

export class GlobeGroup extends Group {
  isGlobeGroup = true;

  readonly baseMesh: Mesh;
  readonly landDots: LandDotsGroup;
  readonly arcs: FlightArc[] = [];
  readonly markers: RouteMarker[] = [];

  #config: GlobeConfig;
  #animationSpeed: number;

  constructor(
    theme: ThemeAppearance,
    colors: readonly RouteColor[],
    routes: readonly FlightRoute[],
    lightPos?: Vector3,
    partialConfig?: Partial<GlobeConfig>,
  ) {
    super();

    this.#config = { ...globeConfig, ...partialConfig };
    this.#animationSpeed = this.#config.animationSpeed;

    this.#addLights(theme, lightPos);

    const sphere = new SphereGeometry(this.#config.sphereRadius, 35, 35);
    this.baseMesh = new Mesh(sphere, this.#createBaseMaterial(theme.type));
    this.add(this.baseMesh);

    this.landDots = new LandDotsGroup(theme.type, this.#config);
    this.add(this.landDots);

    FlightArc.loadTextures(this.#config.arcTextureUrls, (arcTextures) => {
      routes.forEach((route, i) => {
        const color = colors[i % colors.length];
        const arc = new FlightArc(
          route,
          color,
          this.#config,
          arcTextures[i % arcTextures.length],
          i,
        );
        this.arcs.push(arc);
        this.add(arc);

        const origin = new RouteMarker(route.origin, color, this.#config.sphereRadius);
        const dest = new RouteMarker(
          route.destination,
          color,
          this.#config.sphereRadius,
        );
        this.markers.push(origin, dest);
        this.add(origin);
        this.add(dest);
      });
    });
  }

  get materials() {
    return this.landDots.materials;
  }

  tick(): void {
    this.landDots.tick(0.03);
    for (let i = 0; i < this.arcs.length; i++) {
      this.arcs[i].tick(this.#animationSpeed);
    }
  }

  dispose(): void {
    this.baseMesh.geometry.dispose();
    (this.baseMesh.material as MeshBasicMaterial | MeshStandardMaterial).dispose();
    this.landDots.dispose();
    for (let i = 0; i < this.arcs.length; i++) {
      this.arcs[i].dispose();
    }
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].dispose();
    }
  }

  #addLights(theme: ThemeAppearance, lightPos?: Vector3): void {
    const point = new PointLight(
      theme.lightConfig.pointColor,
      theme.lightConfig.pointIntensity,
      200,
    );
    if (lightPos) {
      point.position.copy(lightPos);
    }
    this.add(point);
    this.add(
      new HemisphereLight(
        theme.lightConfig.hemisphereColor,
        theme.lightConfig.hemisphereIntensity,
      ),
    );
  }

  #createBaseMaterial(type: ThemeId) {
    if (type === 'bright') {
      return new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });
    }

    return new MeshStandardMaterial({
      color: 0x0b2636,
      transparent: true,
      opacity: 0.85,
      metalness: 0.3,
      roughness: 0.7,
    });
  }
}
