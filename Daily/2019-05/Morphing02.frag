precision mediump float;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float time;
uniform vec2 resolution;

vec2 triangle(vec2 p){
  int N = 3;
  //pixle当たりの中心からの角度
  //float a = atan(p.x,p.y)+PI;
  float a = atan(p.y,p.x) + PI; // 0 ~ 2PI
  //１つの角当たりの角度
  float r = TWO_PI/float(N);

  float theta = floor(.5+a/r)*r-a;
  float  d = cos(theta)*length(p);
  //float d = length(p);
  return vec2(0.5, d);
}

vec2 circle(vec2 p){
  float d = length(p);
  return vec2(0.8, d);
}


float square(vec2 p){
  return abs(p.x) + abs(p.y);
}

void main(){
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) /
       min(resolution.x, resolution.y);

  float a = sin(time * 5.0) * 0.5 + 0.5;
  //float d = mix(step(0.5, triangle(p)) ,step(0.5, circle(p)) , a);
   vec2 d = mix(circle(p), triangle(p), a);
   //mix(a, b, t) -> a+(b-a)*t
   vec3 color = mix(vec3(0), vec3(1), step(d.x, d.y));

  // 形状のmorphing
  //gl_FragColor = vec4(vec3(d), 1.0);
  //stepによって2値化
  gl_FragColor = vec4(vec3(mix(color, vec3(d.x), 0.3)), 1.0);
}
