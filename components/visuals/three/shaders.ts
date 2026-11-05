// GLSL for the brand shader gradient and the glass shells of the 3D core.
// Colours are passed as uniforms in display (sRGB) space and written straight out.

const simplex3d = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

/** Full-screen quad: ignores the camera so the gradient always fills the canvas. */
export const gradientVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const gradientFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uPointer;
uniform vec2 uFocus;
uniform float uScroll;
uniform float uIntensity;
uniform vec3 uBase;
uniform vec3 uDeep;
uniform vec3 uBrand;
uniform vec3 uGlow;
varying vec2 vUv;
${simplex3d}
void main(){
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  float t = uTime * 0.16 + uScroll * 1.6;

  // Two passes of domain warping: bold, moving liquid folds.
  vec2 q = vec2(snoise(vec3(p * 1.1, t)), snoise(vec3(p * 1.1 + 5.2, t)));
  vec2 r = vec2(
    snoise(vec3(p * 1.6 + q * 1.6 + vec2(1.7, 9.2), t * 1.3)),
    snoise(vec3(p * 1.6 + q * 1.6 + vec2(8.3, 2.8), t * 1.3))
  );
  float n = snoise(vec3(p * 0.9 + r * 1.3, t * 0.8)) * 0.5 + 0.5;
  float n2 = snoise(vec3(p * 2.2 - r * 0.8, t * 1.1 + 3.0)) * 0.5 + 0.5;

  // A broad pool of brand light behind the focal content, pushed around by the warp field.
  vec2 f = (uFocus - 0.5) * vec2(aspect, 1.0) + vec2(0.0, uScroll * 0.6);
  float pool = smoothstep(1.4, 0.0, length(p - f + r * 0.3));

  // Strong light that follows the visitor's pointer.
  vec2 m = (uPointer - 0.5) * vec2(aspect, 1.0);
  float pl = smoothstep(0.75, 0.0, length(p - m));

  vec3 cyan = vec3(0.0, 0.85, 1.0);
  vec3 violet = vec3(0.45, 0.25, 1.0);

  vec3 col = uBase;
  col = mix(col, uDeep * 1.35, smoothstep(0.15, 0.75, n));
  col = mix(col, uBrand, smoothstep(0.35, 0.9, n) * (0.15 + pool * 0.75) * uIntensity);
  col = mix(col, violet, smoothstep(0.62, 0.95, n2) * 0.55 * uIntensity);
  // Bright liquid ridges where the folds crest.
  float ridge = pow(1.0 - abs(n - 0.62) * 3.2, 6.0);
  col += mix(uGlow, cyan, n2) * max(ridge, 0.0) * 0.32 * uIntensity;
  col += uGlow * (pl * 0.28 + pow(pool, 2.0) * 0.1) * uIntensity;

  // Light vignette so copy at the edges still sits on dark.
  col *= mix(0.72, 1.0, smoothstep(1.5, 0.2, length(p * vec2(0.75, 1.1))));

  // Dither to stop banding in the long gradients.
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

export const fresnelVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

export const fresnelFragment = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform float uOpacity;
uniform float uPower;
varying vec3 vNormal;
varying vec3 vView;
void main(){
  float f = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), uPower);
  gl_FragColor = vec4(uColor, (0.15 + f * 1.6) * uOpacity);
}
`;

/** Brand palette in 0–1 sRGB, matching tailwind.config.ts. */
export const brand = {
  ink: [0.039, 0.051, 0.086] as const, // #0A0D16
  deep: [0.035, 0.09, 0.24] as const, // between primary-900 and primary-800
  primary: [0.118, 0.416, 1.0] as const, // #1E6AFF
  light: [0.498, 0.663, 1.0] as const, // #7FA9FF
};
