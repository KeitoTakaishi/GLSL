precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float gray = length(uv);
	gl_FragColor = vec4(vec3(gray) , 1.0);
}
