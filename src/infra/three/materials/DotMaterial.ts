import { DoubleSide, ShaderMaterial } from 'three';

import type { ThemeId } from '../../../domain/model';

const brightVertex = /* glsl */ `
uniform float u_time;
uniform float u_maxExtrusion;
varying vec3 vNormal;
void main() {
	vNormal = normal;
	vec3 pos = position;
	if ( u_maxExtrusion > 1.0 ) pos.xyz = pos.xyz * u_maxExtrusion + sin( u_time );
	else pos.xyz = pos.xyz * u_maxExtrusion;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
`;

const brightFragment = /* glsl */ `
uniform float u_time;
varying vec3 vNormal;
vec3 colorA = vec3( 1.0, 0.55, 0.1 );
vec3 colorB = vec3( 1.0, 0.35, 0.65 );
vec3 colorC = vec3( 0.55, 0.15, 0.95 );
vec3 colorD = vec3( 0.25, 0.1, 0.75 );
void main() {
	vec3 color = vec3( 0.0 );
	float t = clamp( ( vNormal.y + 1.0 ) * 0.5, 0.0, 1.0 );
	if ( t < 0.33 ) color = mix( colorA, colorB, t / 0.33 );
	else if ( t < 0.66 ) color = mix( colorB, colorC, ( t - 0.33 ) / 0.33 );
	else color = mix( colorC, colorD, ( t - 0.66 ) / 0.34 );
	color *= 1.3;
	gl_FragColor = vec4( color, 1.0 );
}
`;

const techVertex = /* glsl */ `
uniform float u_time;
uniform float u_maxExtrusion;
void main() {
	vec3 pos = position;
	if ( u_maxExtrusion > 1.0 ) pos.xyz = pos.xyz * u_maxExtrusion + sin( u_time );
	else pos.xyz = pos.xyz * u_maxExtrusion;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
`;

const techFragment = /* glsl */ `
uniform float u_time;
vec3 colorA = vec3( 0.0, 0.8, 1.0 );
vec3 colorB = vec3( 0.0, 0.4, 0.8 );
vec3 colorC = vec3( 0.2, 1.0, 0.8 );
void main() {
	vec3 color = mix( colorA, colorB, abs( sin( u_time ) ) );
	color = mix( color, colorC, abs( sin( u_time * 0.7 + 1.57 ) ) * 0.3 );
	color *= 1.2;
	gl_FragColor = vec4( color, 1.0 );
}
`;

class DotMaterial extends ShaderMaterial {

	constructor( themeId: ThemeId ) {

		const isBright = themeId === 'bright';

		super( {
			side: DoubleSide,
			uniforms: {
				u_time: { value: 1.0 },
				u_maxExtrusion: { value: 1.0 },
			},
			vertexShader: isBright ? brightVertex : techVertex,
			fragmentShader: isBright ? brightFragment : techFragment,
		} );

		this.type = 'DotMaterial';

	}

	tick( delta: number ) {

		this.uniforms.u_time.value += delta;

	}

}

export { DotMaterial };
