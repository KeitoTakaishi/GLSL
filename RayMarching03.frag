precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const vec3 cPos = vec3(0.0,  0.0,  5.0);
vec3 cDir = vec3(0., 0., -1.);
vec3 cUp  = vec3(0., 1., 0.);


const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

// box distance function
float distFuncBox(vec3 p){
	return length(max(abs(p) - vec3(2.0, 0.1, 0.5), 0.0)) - 0.1;
  //return length(max(trans(p) - vec3(2.0, 0.1, 0.5), 0.0)) - 0.1;

}

// torus distance function
float distFuncTorus(vec3 p){
	vec2 t = vec2(1.5, 0.25);
	vec2 r = vec2(length(p.xy) - t.x, p.z);
	return length(r) - t.y;
}

// distance function
 float distFunc(vec3 p){
	float d1 = distFuncTorus(p);
	float d2 = distFuncBox(p);


  return min(d1 , d2);
	//return max(d1, d2);  // 重なっている部分だけを描く
  //return max(-d1, d2); // d1が重なっていないd2部分を描く
	//return max(d1, -d2); // d2が重なっていないd1部分を描く
  //return max(-d1, -d2);
}

vec3 genNormal(vec3 p){
	float d = 0.0001;
	return normalize(vec3(
		distFunc(p + vec3(  d, 0.0, 0.0)) - distFunc(p + vec3( -d, 0.0, 0.0)),
		distFunc(p + vec3(0.0,   d, 0.0)) - distFunc(p + vec3(0.0,  -d, 0.0)),
		distFunc(p + vec3(0.0, 0.0,   d)) - distFunc(p + vec3(0.0, 0.0,  -d))
	));
}

void main(void){
	// fragment position
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	// camera and ray
  //vec3 cDir = vec3(0., -1., 0.);
  //vec3 cUp  = vec3(0., 0.0, -1.);
  vec3 cDir = vec3(0., 0., -1.);
  vec3 cUp  = vec3(1.*sin(time*0.0), 1.*cos(time*0.0), 0.);


	vec3 cSide = cross(cDir, cUp);
	float targetDepth = 1.0;
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

	// marching loop
	float tmp, dist;
	tmp = 0.0;
	vec3 dPos = cPos;
	for(int i = 0; i < 256; i++){
		dist = distFunc(dPos);
    //dist = abs(dist);
		tmp += dist;
		dPos = cPos + tmp * ray;
    if(dist < 0.0001){
      break;
    }
	}

	// hit check
	vec3 color;
	if(abs(dist) < 0.0001){
		vec3 normal = genNormal(dPos);
		float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
		color = vec3(1.0, 1.0, 1.0) * diff;
	}else{
		color = vec3(0.0);
	}
	gl_FragColor = vec4(color, 1.0);
}
