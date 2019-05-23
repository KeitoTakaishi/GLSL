precision mediump float;
uniform float time;
uniform vec2 resolution;


float random (in vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    vec2 frequency = st;
    float lacunarity = 20.0;
    //float theta = st;

    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(frequency);
        frequency = frequency *  lacunarity;
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}


void main() {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  //float gray = length(uv);
  vec3 color = vec3(0.0);
  color += fbm(uv*3.0 );
  if(abs(uv.x) < 1.0)
	gl_FragColor = vec4(vec3(color) , 1.0);
}
