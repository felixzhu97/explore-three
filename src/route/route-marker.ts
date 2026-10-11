import { Mesh, PlaneGeometry, Vector3 } from 'three';

import type { GeoCoord } from '../geography/geo-coord';
import type { RouteColor } from '../theme/theme.service';
import { RouteMarkerMaterial } from './route-marker-material';

export class RouteMarker extends Mesh {
  isRouteMarker = true;

  constructor(coord: GeoCoord, color: RouteColor, radius: number, size = 0.5) {
    const point = coord.projectToSpherePoint(radius);
    const position = new Vector3(point.x, point.y, point.z);
    const geometry = new PlaneGeometry(size, size);
    const material = new RouteMarkerMaterial(color);

    super(geometry, material);

    this.position.copy(position);
    const n = position.clone().normalize();
    this.lookAt(position.clone().add(n));
  }

  dispose(): void {
    this.geometry.dispose();
    (this.material as RouteMarkerMaterial).dispose();
  }
}
