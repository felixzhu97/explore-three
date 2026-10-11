import {
	CatmullRomCurve3,
	Float32BufferAttribute,
	Mesh,
	Texture,
	TextureLoader,
	TubeGeometry,
	Vector3,
} from 'three';

import type { FlightRoute, RouteColor } from '../../domain/model';
import type { RenderConfig } from './config';
import { FlightArcMaterial } from './materials/FlightArcMaterial';

function project( lat: number, lon: number, radius: number ): Vector3 {

	const phi = ( 90 - lat ) * ( Math.PI / 180 );
	const theta = ( lon + 180 ) * ( Math.PI / 180 );

	return new Vector3(
		- ( radius * Math.sin( phi ) * Math.cos( theta ) ),
		radius * Math.cos( phi ),
		radius * Math.sin( phi ) * Math.sin( theta ),
	);

}

function calculateArcPoints(
	start: Vector3,
	end: Vector3,
	config: Pick<RenderConfig, 'arcHeight' | 'minArcHeight'>,
	segments = 60,
): Vector3[] {

	const points: Vector3[] = [];
	const dist = start.distanceTo( end );
	const height = Math.max( dist * config.arcHeight, config.minArcHeight );
	const mid = new Vector3().addVectors( start, end ).multiplyScalar( 0.5 );
	const ctrl = mid.clone().normalize().multiplyScalar( dist + height );

	for ( let i = 0; i <= segments; i ++ ) {

		const t = i / segments;
		const s = t * t * ( 3 - 2 * t );

		points.push(
			new Vector3(
				( 1 - s ) * ( 1 - s ) * start.x + 2 * ( 1 - s ) * s * ctrl.x + s * s * end.x,
				( 1 - s ) * ( 1 - s ) * start.y + 2 * ( 1 - s ) * s * ctrl.y + s * s * end.y,
				( 1 - s ) * ( 1 - s ) * start.z + 2 * ( 1 - s ) * s * ctrl.z + s * s * end.z,
			),
		);

	}

	return points;

}

class FlightArc extends Mesh {

	isFlightArc = true;

	constructor(
		route: FlightRoute,
		color: RouteColor,
		config: RenderConfig,
		arcTexture: Texture | undefined,
		idx = 0,
	) {

		const start = project( route.origin.lat, route.origin.lon, config.sphereRadius );
		const end = project( route.destination.lat, route.destination.lon, config.sphereRadius );
		const pathPoints = calculateArcPoints( start, end, config, 50 );
		const curve = new CatmullRomCurve3( pathPoints );

		const geometry = new TubeGeometry(
			curve,
			config.tubularSegments,
			config.tubeRadius,
			config.radialSegments,
			false,
		);

		const progresses: number[] = [];

		for ( let i = 0; i < geometry.attributes.position.count; i ++ ) {

			progresses.push(
				Math.floor( i / ( config.radialSegments + 1 ) ) / config.tubularSegments,
			);

		}

		geometry.setAttribute( 'progress', new Float32BufferAttribute( progresses, 1 ) );

		const phase = Math.random() * config.cycleDuration;
		const material = new FlightArcMaterial( color, phase, arcTexture );

		super( geometry, material );

		this.userData.idx = idx;

	}

	tick( delta: number ) {

		( this.material as FlightArcMaterial ).tick( delta );

	}

	dispose() {

		this.geometry.dispose();
		( this.material as FlightArcMaterial ).dispose();

	}

	static loadTextures(
		urls: readonly string[],
		callback: ( textures: ( Texture | undefined )[] ) => void,
	) {

		const loader = new TextureLoader();
		const textures: ( Texture | undefined )[] = [];
		let loadedCount = 0;

		const checkComplete = () => {

			loadedCount ++;
			if ( loadedCount >= urls.length ) callback( textures );

		};

		urls.forEach( ( url, i ) => {

			loader.load(
				url,
				( t ) => {

					textures[ i ] = t;
					checkComplete();

				},
				undefined,
				() => checkComplete(),
			);

		} );

	}

}

export { FlightArc };
