import {
	AdditiveBlending,
	Color,
	DoubleSide,
	ShaderMaterial,
	type Texture,
} from 'three';

import type { RouteColor } from '../../../domain/model/Theme';

const vertexShader = /* glsl */ `
attribute float progress;
uniform float time;
uniform float animationPhase;
varying vec2 vUv;
varying float vProgress;
varying float vVisibility;
varying float vAnimationProgress;
varying float vAnimationPhase;

void main() {
	vUv = uv;
	vProgress = progress;
	float cycleDuration = 4.0;
	float cycle = mod( time + animationPhase, cycleDuration );
	float visibility = 0.0;
	float animationProgress = 0.0;
	float phase = 0.0;

	if ( cycle < 1.0 ) {
		animationProgress = cycle / 1.0;
		phase = 0.0;
		if ( progress <= animationProgress ) visibility = 1.0;
	} else if ( cycle < 3.0 ) {
		animationProgress = 1.0;
		phase = 1.0;
		visibility = 1.0;
		float stayTime = cycle - 1.0;
		float pulse = 0.5 + 0.3 * sin( stayTime * 2.0 * 3.14159 );
		float flowOffset = mod( stayTime * 1.5, 1.0 );
		float flowGradient = 0.5 + 0.5 * sin( ( progress + flowOffset ) * 6.28318 );
		visibility *= ( 0.7 + pulse * 0.3 + flowGradient * 0.2 );
	} else {
		animationProgress = ( cycle - 3.0 ) / 1.0;
		phase = 2.0;
		if ( progress >= animationProgress ) visibility = 1.0;
	}

	vVisibility = visibility;
	vAnimationProgress = animationProgress;
	vAnimationPhase = phase;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fragmentShader = /* glsl */ `
varying vec2 vUv;
varying float vProgress;
varying float vVisibility;
varying float vAnimationProgress;
varying float vAnimationPhase;
uniform vec3 color;
uniform float brightness;
uniform sampler2D arcTexture;

void main() {
	if ( vVisibility < 0.01 ) discard;
	float radialDistance = abs( vUv.y - 0.5 ) * 2.0;
	float edgeFade = 1.0 - smoothstep( 0.0, 1.0, radialDistance );
	gl_FragColor = vec4( color * brightness, vVisibility * edgeFade );
}
`;

class FlightArcMaterial extends ShaderMaterial {

	constructor( color: RouteColor, animationPhase: number, arcTexture?: Texture ) {

		super( {
			uniforms: {
				time: { value: 0 },
				animationPhase: { value: animationPhase },
				color: { value: new Color( color.r, color.g, color.b ) },
				brightness: { value: 1.0 },
				arcTexture: { value: arcTexture ?? null },
			},
			vertexShader,
			fragmentShader,
			transparent: true,
			blending: AdditiveBlending,
			side: DoubleSide,
			depthWrite: false,
		} );

		this.type = 'FlightArcMaterial';

	}

	tick( delta: number ) {

		this.uniforms.time.value += delta;

	}

}

export { FlightArcMaterial };
