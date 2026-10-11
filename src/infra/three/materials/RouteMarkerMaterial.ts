import {
	AdditiveBlending,
	Color,
	DoubleSide,
	ShaderMaterial,
	TextureLoader,
} from 'three';

import type { RouteColor } from '../../../domain/model/Theme';

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 color;
uniform sampler2D discTexture;
varying vec2 vUv;
void main() {
	vec4 c = texture2D( discTexture, vUv );
	if ( c.a < 0.01 ) discard;
	gl_FragColor = vec4( color, c.a );
}
`;

class RouteMarkerMaterial extends ShaderMaterial {

	constructor( color: RouteColor ) {

		const discTexture = new TextureLoader().load( '/img/disc_texture.png' );

		super( {
			uniforms: {
				color: { value: new Color( color.r, color.g, color.b ) },
				discTexture: { value: discTexture },
			},
			vertexShader,
			fragmentShader,
			transparent: true,
			blending: AdditiveBlending,
			depthWrite: false,
			side: DoubleSide,
		} );

		this.type = 'RouteMarkerMaterial';

	}

}

export { RouteMarkerMaterial };
