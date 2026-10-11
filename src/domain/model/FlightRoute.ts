import { GeoCoord } from './GeoCoord';

/** Flight route between two geographic coordinates. */
export class FlightRoute {
  private constructor(
    public readonly origin: GeoCoord,
    public readonly destination: GeoCoord,
  ) {}

  static of(origin: GeoCoord, destination: GeoCoord): FlightRoute {
    return new FlightRoute(origin, destination);
  }

  endpoints(): [GeoCoord, GeoCoord] {
    return [this.origin, this.destination];
  }
}

/** Default international routes. */
export const DEFAULT_ROUTES: FlightRoute[] = [
  FlightRoute.of(new GeoCoord(39.9042, 116.4074), new GeoCoord(40.7128, -74.006)),
  FlightRoute.of(new GeoCoord(51.5074, -0.1278), new GeoCoord(35.6762, 139.6503)),
  FlightRoute.of(new GeoCoord(-33.8688, 151.2093), new GeoCoord(34.0522, -118.2437)),
  FlightRoute.of(new GeoCoord(48.8566, 2.3522), new GeoCoord(31.2304, 121.4737)),
  FlightRoute.of(new GeoCoord(25.2048, 55.2708), new GeoCoord(1.3521, 103.8198)),
  FlightRoute.of(new GeoCoord(-23.5505, -46.6333), new GeoCoord(-33.9249, 18.4241)),
];
