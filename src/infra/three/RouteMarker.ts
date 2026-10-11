import { Mesh, PlaneGeometry } from 'three';

import type { GeoCoord } from '../../domain/model/GeoCoord';
import type { RouteColor } from '../../domain/model/Theme';
import { RouteMarkerMaterial } from './materials/RouteMarkerMaterial';
import { toVector3 } from './sphereVector';

class RouteMarker extends Mesh {

	isRouteMarker = true;

	constructor( coord: GeoCoord, color: RouteColor, radius: number, size = 0.5 ) {

		const position = toVector3( coord.projectToSpherePoint( radius ) );
		const geometry = new PlaneGeometry( size, size );
		const material = new RouteMarkerMaterial( color );

		super( geometry, material );

		this.position.copy( position );

		const n = position.clone().normalize();
		this.lookAt( position.clone().add( n ) );

	}

	dispose() {

		this.geometry.dispose();
		( this.material as RouteMarkerMaterial ).dispose();

	}

}

export { RouteMarker };
