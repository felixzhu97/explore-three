import * as THREE from 'three';
import { GeoCoord } from './GeoCoord';
import type { FlightRoute } from './FlightRoute';
import type { GlobeConfig } from './GlobeConfig';

const VERTEX_SHADER = `
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
    float cycle = mod(time + animationPhase, cycleDuration);
    float visibility = 0.0;
    float animationProgress = 0.0;
    float phase = 0.0;

    if (cycle < 1.0) {
      animationProgress = cycle / 1.0;
      phase = 0.0;
      if (progress <= animationProgress) visibility = 1.0;
    } else if (cycle < 3.0) {
      animationProgress = 1.0;
      phase = 1.0;
      visibility = 1.0;
      float stayTime = cycle - 1.0;
      float pulse = 0.5 + 0.3 * sin(stayTime * 2.0 * 3.14159);
      float flowOffset = mod(stayTime * 1.5, 1.0);
      float flowGradient = 0.5 + 0.5 * sin((progress + flowOffset) * 6.28318);
      visibility *= (0.7 + pulse * 0.3 + flowGradient * 0.2);
    } else {
      animationProgress = (cycle - 3.0) / 1.0;
      phase = 2.0;
      if (progress >= animationProgress) visibility = 1.0;
    }

    vVisibility = visibility;
    vAnimationProgress = animationProgress;
    vAnimationPhase = phase;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  varying vec2 vUv;
  varying float vProgress;
  varying float vVisibility;
  varying float vAnimationProgress;
  varying float vAnimationPhase;
  uniform vec3 color;
  uniform float brightness;
  uniform sampler2D arcTexture;

  void main() {
    if (vVisibility < 0.01) discard;
    float radialDistance = abs(vUv.y - 0.5) * 2.0;
    float edgeFade = 1.0 - smoothstep(0.0, 1.0, radialDistance);
    gl_FragColor = vec4(color * brightness, vVisibility * edgeFade);
  }
`;

/** 飞线实体 */
export class FlyingLine {
  static createMesh(
    route: FlightRoute,
    color: THREE.Vector3,
    config: GlobeConfig,
    radius: number,
    arcTextures: (THREE.Texture | undefined)[],
    idx = 0,
  ) {
    const startPos = route.origin.projectToVector3(radius);
    const endPos = route.destination.projectToVector3(radius);
    const pathPoints = config.calculateArcPoints(startPos, endPos, 50);
    const curve = new THREE.CatmullRomCurve3(pathPoints);

    const geo2 = new THREE.TubeGeometry(
      curve,
      config.tubularSegments,
      config.tubeRadius,
      config.radialSegments,
      false,
    );
    const progresses: number[] = [];
    for (let i = 0; i < geo2.attributes.position.count; i++) {
      progresses.push(Math.floor(i / (config.radialSegments + 1)) / config.tubularSegments);
    }
    geo2.setAttribute('progress', new THREE.Float32BufferAttribute(progresses, 1));

    const phase = Math.random() * config.cycleDuration;
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        animationPhase: { value: phase },
        color: { value: color },
        brightness: { value: 1.0 },
        arcTexture: { value: arcTextures[idx % arcTextures.length] },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    return new THREE.Mesh(geo2, mat);
  }

  static createMarker(coord: GeoCoord, color: THREE.Vector3, radius: number, size = 0.5) {
    const pos = coord.projectToVector3(radius);
    const geo2 = new THREE.PlaneGeometry(size, size);
    const tex = new THREE.TextureLoader().load('/img/disc_texture.png');
    const mat = new THREE.ShaderMaterial({
      uniforms: { color: { value: color }, discTexture: { value: tex } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 color; uniform sampler2D discTexture; varying vec2 vUv; void main() { vec4 c = texture2D(discTexture, vUv); if (c.a < 0.01) discard; gl_FragColor = vec4(color, c.a); }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo2, mat);
    mesh.position.copy(pos);
    const n = pos.clone().normalize();
    mesh.lookAt(pos.clone().add(n));
    return mesh;
  }
}
