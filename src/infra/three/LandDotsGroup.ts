import { CircleGeometry, Group, Mesh, Vector3 } from 'three';

import type { ThemeId } from '../../domain/model';
import type { RenderConfig } from './config';
import { DotMaterial } from './materials/DotMaterial';

class LandDotsGroup extends Group {

	isLandDotsGroup = true;

	readonly materials: DotMaterial[] = [];

	constructor( themeId: ThemeId, config: Pick<RenderConfig, 'sphereRadius' | 'dotRadius' | 'dotSegments' | 'dotDensity' | 'worldTextureUrl'> ) {

		super();

		const template = new DotMaterial( themeId );
		const img = new Image();

		img.onload = () => {

			const cvs = document.createElement( 'canvas' );
			cvs.width = img.width;
			cvs.height = img.height;
			const ctx = cvs.getContext( '2d' );
			if ( ! ctx ) return;

			ctx.drawImage( img, 0, 0 );
			const land = this._extractLand( ctx.getImageData( 0, 0, cvs.width, cvs.height ).data );

			for ( let lat = 90, j = 0; lat > - 90; lat --, j ++ ) {

				const r = Math.cos( Math.abs( lat ) * ( Math.PI / 180 ) ) * config.sphereRadius;
				const n = r * Math.PI * 2 * config.dotDensity;

				for ( let x = 0; x < n; x ++ ) {

					const lon = - 180 + ( x * 360 ) / n;
					if ( ! this._isOnLand( lon, lat, land ) ) continue;

					const v = this._toVec3( lon, lat, config.sphereRadius );
					const geo = new CircleGeometry( config.dotRadius, config.dotSegments );
					geo.lookAt( v );
					geo.translate( v.x, v.y, v.z );

					const mat = template.clone() as DotMaterial;
					mat.uniforms.u_time.value = j * Math.sin( Math.random() );
					this.materials.push( mat );
					this.add( new Mesh( geo, mat ) );

				}

			}

			template.dispose();

		};

		img.src = config.worldTextureUrl;

	}

	tick( delta: number ) {

		for ( let i = 0; i < this.materials.length; i ++ ) {

			this.materials[ i ].tick( delta );

		}

	}

	dispose() {

		this.traverse( ( obj ) => {

			if ( obj instanceof Mesh ) {

				obj.geometry.dispose();
				( obj.material as DotMaterial ).dispose();

			}

		} );

		this.materials.length = 0;

	}

	private _extractLand( data: Uint8ClampedArray ): Record<number, number[]> {

		const land: Record<number, number[]> = {};

		for ( let i = 0, lon = - 180, lat = 90; i < data.length; i += 4, lon ++ ) {

			if ( ! land[ lat ] ) land[ lat ] = [];
			if ( data[ i ] < 80 && data[ i + 1 ] < 80 && data[ i + 2 ] < 80 ) land[ lat ].push( lon );

			if ( lon === 180 ) {

				lon = - 180;
				lat --;

			}

		}

		return land;

	}

	private _isOnLand( lon: number, lat: number, land: Record<number, number[]> ): boolean {

		if ( ! land[ lat ]?.length ) return false;
		const closest = land[ lat ].reduce( ( p, c ) => ( Math.abs( c - lon ) < Math.abs( p - lon ) ? c : p ) );
		return Math.abs( lon - closest ) < 0.5;

	}

	private _toVec3( lon: number, lat: number, radius: number ): Vector3 {

		const phi = ( 90 - lat ) * ( Math.PI / 180 );
		const theta = ( lon + 180 ) * ( Math.PI / 180 );

		return new Vector3(
			- ( radius * Math.sin( phi ) * Math.cos( theta ) ),
			radius * Math.cos( phi ),
			radius * Math.sin( phi ) * Math.sin( theta ),
		);

	}

}

export { LandDotsGroup };
