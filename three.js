class Vec2 {
    constructor() {
        this.pi = Math.PI;
        this.pi2 = this.pi * 2;
    }

    add(p1, p2) {
        const x = p1.x + p2.x;
        const y = p1.y + p2.y;
        return this.set(x, y);
    }

    sub(p1, p2) {
        const x = p1.x - p2.x;
        const y = p1.y - p2.y;
        return this.set(x, y);
    }

    div(p1, p2) {
        const x = p1.x / p2.x;
        const y = p1.y / p2.y;
        return this.set(x, y);
    }

    mul(p1, p2) {
        const x = p1.x * p2.x;
        const y = p1.y * p2.y;
        return this.set(x, y);
    }

    dist(p1, p2) {
        const { x, y } = this.sub(p1, p2);
        return Math.hypot(x, y);
    }

    radToDeg(rad) {
        return rad * 180 / this.pi;
    }

    degToRad(deg) {
        return deg * this.pi / 180;
    }

    angle(p1, p2) {
        const { x, y } = this.sub(p1, p2);
        return Math.atan2(y, x);
    }

    scale(p, n) {
        const x = p.x * n;
        const y = p.y * n;
        return this.set(x, y);
    }

    lerp(l, c, t) {
        const v = t * (c - l) + l;
        return v;
    }

    dot(p1, p2) {
        return p1.x * p2.x + p1.y * p2.y;
    }

    cross(p1, p2) {
        const z = p1.x * p2.x - p1.y * p2.y;
        return this.set(0, 0, z);
    }

    rot2d(p1, p2, a) {
        const { x, y } = this.sub(p1, p2);
        const sin = Math.sin(a);
        const cos = Math.cos(a);

        const rotX = x * cos - y * sin + p2.x;
        const rotY = x * sin - y * cos + p2.y;

        return this.set(rotX, rotY);
    }

    length(p) {
        return Math.sqrt(p.x * p.x + p.y * p.y);
    }

    norm(p) {
        const { x, y } = p;
        let len = x * x + y * y;

        if (len > 0) len = 1 / Math.sqrt(len);

        const out1 = x * len;
        const out2 = y * len;

        return this.set(out1, out2);
    }

    clamp(v, min, max) {
        return Math.max(min, Math.min(v, max));
    }

    map(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    fract(value) {
        return value - Math.floor(value)
    }

    set(x = 0, y = 0, z = 0) {
        return { x, y, z };
    }
}

const vec2 = new Vec2();

const shaders = {
    vertex: `
    varying vec2 vUv;

    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
    `,
    fragment: `
    #define PI 3.14159265359
    #define PI2 6.28318530718
    #define S(a,b,n) smoothstep(a,b,n)

    uniform float u_time;
    
    uniform vec2 u_resolution;    
    uniform vec2 u_mouse;

    uniform sampler2D u_text0;

    varying vec2 vUv;
    
    //https://github.com/Jam3/glsl-fast-gaussian-blur
    vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
      vec4 color = vec4(0.0);
      vec2 off1 = vec2(1.411764705882353) * direction;
      vec2 off2 = vec2(3.2941176470588234) * direction;
      vec2 off3 = vec2(5.176470588235294) * direction;
      color += texture2D(image, uv) * 0.1964825501511404;
      color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
      color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
      color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
      color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
      color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
      color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
      return color;
    }

    void main(){
      vec2 uv = vUv;
      vec2 st = gl_FragCoord.xy / u_resolution;
      vec2 m = u_mouse;
      
      st.x *= u_resolution.x / u_resolution.y;
      m.x *= u_resolution.x / u_resolution.y;
        
      vec2 m_rel = vec2(m.x,u_resolution.y - m.y) / u_resolution;         
      float d = distance(st, m_rel);
    
      float e = S(.3, .01, d);

      vec2 pst = vec2(abs(uv * 2. - 1.));

      float x = pst.y * 20. + u_time * 2.;
      float y = pst.x * 20. + u_time * .5;
    
      float posx = cos(x+y) * .5 * cos(y); 
      float posy = sin(x-y) * .5 * cos(y);

      vec2 dist = vec2(uv.x + posx * e / 50., uv.y + posy * e / 50.);
      
      vec4 blur = blur13(u_text0, dist, u_resolution, vec2(1., 1.));

      vec4 color = texture2D(u_text0, dist);
		
      gl_FragColor = mix(color, blur, e);
    }
    `
};

class MathUtils {
    lerp(a, b, n) {
        return n * (b - a) + a;
    }
}

class WebGL {
    constructor(canvas) {
        this.width = innerWidth;
        this.height = innerHeight;

        this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            1000
        );

        this.scene = new THREE.Scene();
        this.loader = new THREE.TextureLoader();
        this.clock = new THREE.Clock();
        this.texture = this.loader.load("./imgs/clouds.png")

        this.uniforms = {
            u_time: { type: "f", value: 0 },
            u_resolution: {
                type: "v2",
                value: new THREE.Vector2(this.width/2, this.height/2)
            },
            u_mouse: { type: "v2", value: new THREE.Vector2(0, 0) },
            u_text0: {
                type: "t",
                value: this.texture
            }
        };

        this.mouse = {
            x: 0,
            y: 0
        };

        this.math = new MathUtils();

        this.onMouse = this.onMouse.bind(this);
        this.onResize = this.onResize.bind(this);
        this.update = this.update.bind(this);
    }

    init() {
        this.camera.position.set(0, 0, 1);
        this.scene.add(this.camera);

        this.cursor = document.querySelector(".cursor");

        this.addMesh();
        this.onResize();
        this.update();

        window.addEventListener("mousemove", this.onMouse);
        window.addEventListener("resize", this.onResize);
    }

    addMesh() {
        const geometry = new THREE.PlaneBufferGeometry(2, 2, 60, 60);
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: shaders.vertex,
            fragmentShader: shaders.fragment
        });

        this.mesh = new THREE.Mesh(geometry, material);

        this.start = performance.now();

        this.scene.add(this.mesh);
    }

    onMouse({ clientX, clientY }) {
        this.mouse = {
            x: clientX,
            y: clientY-(0.4*(Number(($(".home").css("height")).split("p")[0])/0.7-clientY))
        };
    }

    onResize() {
        const w = innerWidth;
        const h = innerHeight;

        this.uniforms.u_resolution.value.x = w;
        this.uniforms.u_resolution.value.y = h;

        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;

        if (w / h > 1) {
            this.mesh.scale.x = this.mesh.scale.y = 1.05 * w / h;
        }

        this.camera.updateProjectionMatrix();
    }

    update() {
        this.uniforms.u_time.value = this.clock.getElapsedTime();
        const now = performance.now();
        let acc =
            vec2.dist(this.mouse, this.uniforms.u_mouse.value) / (now - this.start);

        this.start = now;
        this.uniforms.u_mouse.value.x = this.math.lerp(
            this.uniforms.u_mouse.value.x,
            this.mouse.x,
            0.05
        );

        this.uniforms.u_mouse.value.y = this.math.lerp(
            this.uniforms.u_mouse.value.y,
            this.mouse.y,
            0.05
        );

        const x =
            this.uniforms.u_mouse.value.x -
            this.cursor.getBoundingClientRect().width / 2;
        const y =
            this.uniforms.u_mouse.value.y -
            this.cursor.getBoundingClientRect().height / 2;

        this.cursor.style.setProperty("--posX", x + "px");
        this.cursor.style.setProperty("--posY", y + "px");
        this.cursor.style.setProperty("--blurCursor", acc + "px");

        this.draw();
        requestAnimationFrame(this.update);
    }

    draw() {
        this.renderer.render(this.scene, this.camera);
    }
}

const webgl = new WebGL(canvas);

webgl.init();