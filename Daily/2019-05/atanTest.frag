precision mediump float;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float time;
uniform vec2 resolution;

void main() {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float theta = atan(uv.y, uv.x) + PI; // 0.0-2PI
  theta /= TWO_PI;
	gl_FragColor = vec4(vec3(theta) , 1.0);
}
