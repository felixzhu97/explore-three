import { Injectable } from '@angular/core';

import { GeoCoord, SpherePoint } from './geo-coord';

@Injectable({ providedIn: 'root' })
export class GeographyService {
  createCoord(lat: number, lon: number): GeoCoord {
    return new GeoCoord(lat, lon);
  }

  project(coord: GeoCoord, radius: number): SpherePoint {
    return coord.projectToSpherePoint(radius);
  }
}
