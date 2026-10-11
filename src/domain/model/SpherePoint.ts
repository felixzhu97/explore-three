/** Point on a unit-scaled sphere (domain math, no Three). */
export class SpherePoint {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
  ) {}

  equals(other: SpherePoint): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
}
