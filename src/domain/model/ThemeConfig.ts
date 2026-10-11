/** 主题类型 */
export type ThemeType = 'bright' | 'tech';

/** 主题配置 */
export interface ThemeConfig {
  readonly type: ThemeType;
  readonly dotShader: { vertex: string; fragment: string };
  readonly lightConfig: {
    pointColor: number;
    pointIntensity: number;
    hemisphereColor: number;
    hemisphereIntensity: number;
  };
  readonly buttonStroke: string;
  readonly sourceUrl: string;
}

/** 亮色主题 */
export const BRIGHT_THEME: ThemeConfig = {
  type: 'bright',
  dotShader: {
    vertex: `
      uniform float u_time;
      uniform float u_maxExtrusion;
      varying vec3 vNormal;
      void main() {
        vNormal = normal;
        vec3 pos = position;
        if(u_maxExtrusion > 1.0) pos.xyz = pos.xyz * u_maxExtrusion + sin(u_time);
        else pos.xyz = pos.xyz * u_maxExtrusion;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragment: `
      uniform float u_time;
      varying vec3 vNormal;
      vec3 colorA = vec3(1.0, 0.55, 0.1);
      vec3 colorB = vec3(1.0, 0.35, 0.65);
      vec3 colorC = vec3(0.55, 0.15, 0.95);
      vec3 colorD = vec3(0.25, 0.1, 0.75);
      void main() {
        vec3 color = vec3(0.0);
        float t = clamp((vNormal.y + 1.0) * 0.5, 0.0, 1.0);
        if (t < 0.33) color = mix(colorA, colorB, t / 0.33);
        else if (t < 0.66) color = mix(colorB, colorC, (t - 0.33) / 0.33);
        else color = mix(colorC, colorD, (t - 0.66) / 0.34);
        color *= 1.3;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  },
  lightConfig: {
    pointColor: 0xffffff,
    pointIntensity: 3,
    hemisphereColor: 0xffffff,
    hemisphereIntensity: 1.5,
  },
  buttonStroke: '#333333',
  sourceUrl: 'https://github.com/felixzhu97/three-explore',
};

/** 科技主题 */
export const TECH_THEME: ThemeConfig = {
  type: 'tech',
  dotShader: {
    vertex: `
      uniform float u_time;
      uniform float u_maxExtrusion;
      void main() {
        vec3 pos = position;
        if(u_maxExtrusion > 1.0) pos.xyz = pos.xyz * u_maxExtrusion + sin(u_time);
        else pos.xyz = pos.xyz * u_maxExtrusion;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragment: `
      uniform float u_time;
      vec3 colorA = vec3(0.0, 0.8, 1.0);
      vec3 colorB = vec3(0.0, 0.4, 0.8);
      vec3 colorC = vec3(0.2, 1.0, 0.8);
      void main() {
        vec3 color = mix(colorA, colorB, abs(sin(u_time)));
        color = mix(color, colorC, abs(sin(u_time * 0.7 + 1.57)) * 0.3);
        color *= 1.2;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  },
  lightConfig: {
    pointColor: 0x081b26,
    pointIntensity: 17,
    hemisphereColor: 0xffffff,
    hemisphereIntensity: 1.5,
  },
  buttonStroke: '#ffffff',
  sourceUrl: 'https://github.com/felixzhu97/threejs-globe-stripe',
};
