import * as THREE from 'three';

/** 地理坐标 */
export class GeoCoord {
  constructor(
    public readonly lat: number,
    public readonly lon: number,
  ) {
    if (lat < -90 || lat > 90) throw new Error(`Invalid latitude: ${lat}`);
    if (lon < -180 || lon > 180) throw new Error(`Invalid longitude: ${lon}`);
  }

  projectToVector3(radius: number): THREE.Vector3 {
    const phi = (90 - this.lat) * (Math.PI / 180);
    const theta = (this.lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    );
  }
}
