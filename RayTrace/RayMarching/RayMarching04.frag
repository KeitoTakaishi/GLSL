#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float sdBox(vec2 p, vec2 b)
{
  vec2 d = abs(p) - b;
  return min (max(d.x, d.y), 0.0 + length(max(d, 0.0)));

}

float map(vec3 p)
{
  float cube = 0.175;

  vec2 p1 = p.xz;
  float c1 = sdBox(p1, vec2(cube));

  return c1;
}

void main()
{
  vec2 pos = (gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
  vec3 camPos = vec3(-0.5, 0.0, 3.0);
  vec3 camDir = normalize(vec3(0.3, 0.0, -1.0));
  vec3 camUp = normalize(vec3(0.5, 1.0, 0.0));
  vec3 camSide = cross(camDir, camUp);
  float focus = 1.8;

  vec3 rayDir = normalize(vec3(camSide*pos.x+camUp*pos.y+camDir*focus));
  vec3 ray = camPos;
  int march = 0;
  float d = 0.;
  float total_d = 0.;
  const int MAX_MARCH = 64;
  const float MAX_DIST = 100.0;

  for (int i = 0; i < MAX_MARCH; ++i){
    d = map(ray);
    march = i;
    total_d += d;
    //rayを行進させていく
    ray += rayDir * d;
    if(d < 0.001){break;}
    if(total_d > MAX_DIST) {
      total_d = MAX_DIST;
      march = MAX_MARCH - 1;
      break;
    }
  }
  float fog = min(1.0, (1.0 / float(MAX_MARCH)) *float(march)) * 1.0;
  vec3 fog2 = 0.01 * vec3(1., 1., 1.5) * total_d;
  gl_FragColor = vec4(vec3(0.15, 0.15, 0.2) *fog + fog2, 1.0);
}
