precision mediump float;
uniform float time;
uniform vec2 resolution;


float wave(vec2 uv){
  float n = 5.0;
  vec2 iuv = floor(uv*n)/n;
  float d = length(vec2(0.5)- iuv);
  return 0.5 + 0.5 * sin(d + time * 2.0);
}
void main() {
	vec2 uv = (gl_FragCoord.xy*2.0 - resolution) / resolution.y;

  float n = 2.0;
  vec2 fuv = fract(uv * n);
  vec2 iuv = floor(uv * n);
  //gl_FragColor = vec4(fuv.x, fuv.y, 0.0, 1.0);
	gl_FragColor = vec4(vec3(wave(uv)), 1.0);
}
