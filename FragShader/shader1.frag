precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
	vec2 p = (gl_FragCoord.xy * 2. - resolution) / (resolution.x, resolution.y);

	/*gl_FragColor = vec4(
    0.3 / length(p + vec2(sin(time * 1.23) * 0.4, 0)),
    0.3 / length(p + vec2(sin(time * 2.23) * 0.4, 0)),
    0.3 / length(p + vec2(sin(time * 3.23) * 0.4, 0)),
    1.
  );
  */
  float modSize = 0.1;
  float rad =0.02;

  float blockCount = 0.0;
  vec2 flag = vec2(ceil(p.x / modSize), ceil(p.y / modSize));


  gl_FragColor = vec4( rad / length(mod( p + vec2(sin(0.0), 0.0), modSize) - modSize/2.),
                       rad / length(mod( p + vec2(sin(-time*2.23)*rad, cos(time*2.23)*rad), modSize) - modSize/2.),
                       rad / length(mod( p + vec2(sin(time*2.23)*rad, cos(time*2.23)*rad), modSize) - modSize/2.),
                       1.0);


     if (flag.x > 0.0 && flag.y > 0.0 || flag.x < 0.0 && flag.y < 0.0){
       gl_FragColor = vec4( rad / length(mod( p + vec2(sin(0.0), 0.0), modSize) - modSize/2.),
                            rad / length(mod( p + vec2(sin(-time*12.23)*rad, cos(time*2.23)*rad), modSize) - modSize/2.),
                            rad / length(mod( p + vec2(sin(time*12.23)*rad, cos(time*2.23)*rad), modSize) - modSize/2.),
                            1.0);
     }

}
