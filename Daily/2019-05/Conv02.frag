precision mediump float;
uniform float time;
uniform vec2 resolution;

vec2 rotateZ(vec2 p, float theta){
  float c = cos(theta), s = sin(theta);
  p = p * mat2(c, s, -s, c );
  return p;
}

vec3 invert(vec3 col){
  return vec3(1.0) - col;
}

vec3 mono(vec3 col){
  return vec3(smoothstep(0.5, 1.0, length(col)));
}

void main() {
   vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
   vec2 _p = p;


   for(int i = 0; i < 8; ++i){
     p = abs(p*1.5) - 1.0;
     float n = 1.0*.5;
     p.y = fract( n*(p.y+time/10.0) ) / n;
     n = 10.0;
     //p.y = floor(n*(p.y))/n;
     p = rotateZ(p, time/1.0);
    }

  //vec2 axis = 1.0 - step(0.01, abs(p));//0.01 までは0.0
  //vec2 axis = 1.0 - smoothstep(0.01, pow(length(p)/1.0, 1.0), abs(p));//blurを効かせることが出来る
  vec2 axis = 1.0 - smoothstep(0.01, fract(time)/10.0+0.02 + atan(p.y, p.x)/20.0, abs(p));//blurを効かせることが出来る


  vec3 color = mix(vec3(0.0), vec3(0.0, 1.0, 1.0), axis.x + axis.y);

  color = mono(color);
  //color = invert(color);
  if(abs(_p.x) < 1.0 && abs(_p.y) < 1.0){
    gl_FragColor = vec4(color*10.0, 1.0);
  }else{
    gl_FragColor = vec4(0.0);
  }
}
