precision mediump float;
uniform float time;
uniform vec2 resolution;

vec2 circle(vec2 p){
  return vec2(length(p), 0.8);
}

vec2 square(vec2 p){
  return vec2 (abs(p.x) + abs(p.y), 0.5);
}


void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) /
         min(resolution.x, resolution.y);

     float a = sin(time * 5.0) * 0.5 + 0.5;

     //distance function morphing
     vec2 d = mix(circle(p), square(p), a);
     vec3 color = mix(vec3(1), vec3(0), step(d.x, d.y));
     gl_FragColor = vec4(color, 1.0);

}
