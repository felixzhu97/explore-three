import { GeoCoord } from './GeoCoord';

/** 飞线路由 */
export class FlightRoute {
  constructor(
    public readonly origin: GeoCoord,
    public readonly destination: GeoCoord,
  ) {}
}

/** 默认飞线路由 */
export const DEFAULT_FLIGHT_ROUTES: FlightRoute[] = [
  new FlightRoute(new GeoCoord(39.9042, 116.4074), new GeoCoord(40.7128, -74.006)),
  new FlightRoute(new GeoCoord(51.5074, -0.1278), new GeoCoord(35.6762, 139.6503)),
  new FlightRoute(new GeoCoord(-33.8688, 151.2093), new GeoCoord(34.0522, -118.2437)),
  new FlightRoute(new GeoCoord(48.8566, 2.3522), new GeoCoord(31.2304, 121.4737)),
  new FlightRoute(new GeoCoord(25.2048, 55.2708), new GeoCoord(1.3521, 103.8198)),
  new FlightRoute(new GeoCoord(-23.5505, -46.6333), new GeoCoord(-33.9249, 18.4241)),
];
