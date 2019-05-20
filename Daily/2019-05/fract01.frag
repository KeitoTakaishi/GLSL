/*fractは繰り返しに主に使用される*/
precision mediump float;
uniform float time;
uniform vec2 resolution;


float circle(vec2 st){
	float num = 5.0;
	float gray = 0.2;
	vec2 uv = fract(st*num + vec2(time, 0.0));
	gray = length( uv - vec2(0.5));
	float threshould = 0.2 + 0.3*sin(time);
	gray = step(threshould, gray);
	return gray;
}

float box(vec2 st, float size){
	float num = 5.0;
	st = fract(st * num);

	vec2 stFromCenter = st - vec2(0.5);
	//float gray = length(st);
	float gray = length(stFromCenter);

	float _x = length(stFromCenter.x);
	float _y = length(stFromCenter.y);

	//隣との距離が0.5だから
	size = 0.5 + 0.5 * size;
	gray = step(size, (1.0 - _x)) * step(size, (1.0 - _y));
	//gray = 1.0 - gray;

	return length(gray);
}

void main() {
	vec2 uv = gl_FragCoord.xy / vec2(resolution.x);
	//gl_FragColor = vec4(vec3(circle(uv)),1.0);
	gl_FragColor = vec4(vec3(box(uv, 0.5+0.5*sin(time))), 1.0);
}
