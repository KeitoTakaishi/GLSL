precision mediump float;
uniform float time;
uniform vec2 resolution;


void main() {
   vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / vec2(resolution.y);
	 vec4 col = vec4(1.0);

	if(abs(uv.x) > 1.0){
		col = vec4(0.0, 0.0, 0.0, 1.0);
	}
	else{
		col = vec4(uv.x, 0.0,uv.y, 1.0);
	}
   gl_FragColor = vec4(col);
}
