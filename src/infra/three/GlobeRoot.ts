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

import {
	DEFAULT_ROUTES,
	type RouteColor,
	type ThemeAppearance,
} from '../../domain/model';
import { defaults, type RenderConfig } from './config';
import { FlightArc } from './FlightArc';
import { LandDotsGroup } from './LandDotsGroup';
import { RouteMarker } from './RouteMarker';

class GlobeRoot extends Group {

	isGlobeRoot = true;

	readonly baseMesh: Mesh;
	readonly landDots: LandDotsGroup;
	readonly arcs: FlightArc[] = [];
	readonly markers: RouteMarker[] = [];

	private _config: RenderConfig;
	private _animationSpeed: number;

	constructor(
		theme: ThemeAppearance,
		colors: readonly RouteColor[],
		lightPos?: Vector3,
		partialConfig?: Partial<RenderConfig>,
	) {

		super();

		this._config = { ...defaults, ...partialConfig };
		this._animationSpeed = this._config.animationSpeed;

		this._addLights( theme, lightPos );

		const sphere = new SphereGeometry( this._config.sphereRadius, 35, 35 );
		this.baseMesh = new Mesh( sphere, this._createBaseMaterial( theme.type ) );
		this.add( this.baseMesh );

		this.landDots = new LandDotsGroup( theme.type, this._config );
		this.add( this.landDots );

		FlightArc.loadTextures( this._config.arcTextureUrls, ( arcTextures ) => {

			DEFAULT_ROUTES.forEach( ( route, i ) => {

				const color = colors[ i % colors.length ];
				const arc = new FlightArc( route, color, this._config, arcTextures[ i % arcTextures.length ], i );
				this.arcs.push( arc );
				this.add( arc );

				const origin = new RouteMarker( route.origin, color, this._config.sphereRadius );
				const dest = new RouteMarker( route.destination, color, this._config.sphereRadius );
				this.markers.push( origin, dest );
				this.add( origin );
				this.add( dest );

			} );

		} );

	}

	get materials() {

		return this.landDots.materials;

	}

	tick() {

		this.landDots.tick( 0.03 );

		for ( let i = 0; i < this.arcs.length; i ++ ) {

			this.arcs[ i ].tick( this._animationSpeed );

		}

	}

	dispose() {

		this.baseMesh.geometry.dispose();
		( this.baseMesh.material as MeshBasicMaterial | MeshStandardMaterial ).dispose();
		this.landDots.dispose();

		for ( let i = 0; i < this.arcs.length; i ++ ) this.arcs[ i ].dispose();
		for ( let i = 0; i < this.markers.length; i ++ ) this.markers[ i ].dispose();

	}

	private _addLights( theme: ThemeAppearance, lightPos?: Vector3 ) {

		const point = new PointLight(
			theme.lightConfig.pointColor,
			theme.lightConfig.pointIntensity,
			200,
		);
		if ( lightPos ) point.position.copy( lightPos );
		this.add( point );
		this.add(
			new HemisphereLight(
				theme.lightConfig.hemisphereColor,
				theme.lightConfig.hemisphereIntensity,
			),
		);

	}

	private _createBaseMaterial( type: ThemeAppearance['type'] ) {

		if ( type === 'bright' ) {

			return new MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.25 } );

		}

		return new MeshStandardMaterial( {
			color: 0x0b2636,
			transparent: true,
			opacity: 0.85,
			metalness: 0.3,
			roughness: 0.7,
		} );

	}

}

export { GlobeRoot };
