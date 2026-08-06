import{_ as w}from"./extends-CF3RwP-h.js";import{r as e}from"./index-DJrAq1Rk.js";import{M as F,b as G,U as b,r as T,g as D,V as a,u as U,s as E,a as p}from"./react-three-fiber.esm-DbvaK_kO.js";import{v as V}from"./constants-Br-Ti-Jl.js";function I(s,l,c,u){const t=class extends G{constructor(f={}){const n=Object.entries(s);super({uniforms:n.reduce((o,[i,m])=>{const d=b.clone({[i]:{value:m}});return{...o,...d}},{}),vertexShader:l,fragmentShader:c}),this.key="",n.forEach(([o])=>Object.defineProperty(this,o,{get:()=>this.uniforms[o].value,set:i=>this.uniforms[o].value=i})),Object.assign(this,f)}};return t.key=F.generateUUID(),t}const O=I({cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new p,sectionColor:new p,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new a,worldPlanePosition:new a},`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;
    uniform bool infiniteGrid;
    uniform bool followCamera;

    void main() {
      localPosition = position.xzy;
      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
      
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
      }

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float cellSize;
    uniform float sectionSize;
    uniform vec3 cellColor;
    uniform vec3 sectionColor;
    uniform float fadeDistance;
    uniform float fadeStrength;
    uniform float fadeFrom;
    uniform float cellThickness;
    uniform float sectionThickness;

    float getGrid(float size, float thickness) {
      vec2 r = localPosition.xz / size;
      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
      float line = min(grid.x, grid.y) + 1.0 - thickness;
      return 1.0 - min(line, 1.0);
    }

    void main() {
      float g1 = getGrid(cellSize, cellThickness);
      float g2 = getGrid(sectionSize, sectionThickness);

      vec3 from = worldCamProjPosition*vec3(fadeFrom);
      float dist = distance(from, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <${V>=154?"colorspace_fragment":"encodings_fragment"}>
    }
  `),N=e.forwardRef(({args:s,cellColor:l="#000000",sectionColor:c="#2080ff",cellSize:u=.5,sectionSize:t=1,followCamera:P=!1,infiniteGrid:f=!1,fadeDistance:n=100,fadeStrength:o=1,fadeFrom:i=1,cellThickness:m=.5,sectionThickness:d=1,side:C=E,...h},x)=>{T({GridMaterial:O});const r=e.useRef(null);e.useImperativeHandle(x,()=>r.current,[]);const g=new D,y=new a(0,1,0),z=new a(0,0,0);U(k=>{g.setFromNormalAndCoplanarPoint(y,z).applyMatrix4(r.current.matrixWorld);const v=r.current.material,S=v.uniforms.worldCamProjPosition,_=v.uniforms.worldPlanePosition;g.projectPoint(k.camera.position,S.value),_.value.set(0,0,0).applyMatrix4(r.current.matrixWorld)});const M={cellSize:u,sectionSize:t,cellColor:l,sectionColor:c,cellThickness:m,sectionThickness:d},j={fadeDistance:n,fadeStrength:o,fadeFrom:i,infiniteGrid:f,followCamera:P};return e.createElement("mesh",w({ref:r,frustumCulled:!1},h),e.createElement("gridMaterial",w({transparent:!0,"extensions-derivatives":!0,side:C},M,j)),e.createElement("planeGeometry",{args:s}))});export{N as G};
