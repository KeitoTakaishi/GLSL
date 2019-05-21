precision mediump float;
uniform float time;
uniform vec2 resolution;

vec2 rotateZ(vec2 p, float theta){
  float c = cos(theta), s = sin(theta);
  p = p * mat2(c, s, -s, c );
  return p;
}

void main() {
   vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
   vec2 _p = p;

   for(int i = 0; i < 8; ++i){
     //p = abs(p * 1.5) - 1.0;
     p = abs(p*1.5) - 1.0;
     p = rotateZ(p, time);
    }

  //vec2 axis = 1.0 - step(0.01, abs(p));//0.01 までは0.0
  vec2 axis = 1.0 - smoothstep(0.01, 0.1+0.05*sin(time*10.0), abs(p));//blurを効かせることが出来る
  vec3 color = mix(vec3(0.0), vec3(1.0), axis.x + axis.y);


  /*
  if(abs(_p.x) > 1.0){
    color.xy = vec2(0.0);
    gl_FragColor = vec4(color, 0.0, 1.0);
  }else{
    gl_FragColor = vec4(color, 1.0, 1.0);
  }
  */

  gl_FragColor = vec4(color, 1.0);


}
