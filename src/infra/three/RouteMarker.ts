import { Mesh, PlaneGeometry, Vector3 } from 'three';

import type { GeoCoord, RouteColor } from '../../domain/model';
import { RouteMarkerMaterial } from './materials/RouteMarkerMaterial';

class RouteMarker extends Mesh {

	isRouteMarker = true;

	constructor( coord: GeoCoord, color: RouteColor, radius: number, size = 0.5 ) {

		const phi = ( 90 - coord.lat ) * ( Math.PI / 180 );
		const theta = ( coord.lon + 180 ) * ( Math.PI / 180 );
		const position = new Vector3(
			- ( radius * Math.sin( phi ) * Math.cos( theta ) ),
			radius * Math.cos( phi ),
			radius * Math.sin( phi ) * Math.sin( theta ),
		);

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
