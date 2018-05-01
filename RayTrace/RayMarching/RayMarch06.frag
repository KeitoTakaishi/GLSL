#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 trans(vec3 p){
  float inter = 4.0;
  return mod(p, inter) - inter/2.;
}

float sdSPhere(vec3 pos)
{
  //vec3 offSet = vec3(8.0*abs(sin(time)), 4.0*abs(sin(time*5.0)), 0.0);
  float r = 1.0;
  return length(trans(pos)) - r;
  //return length(trans(pos - offSet)) - r;
  //return length(pos) - r;
}



float udBox( vec3 p, vec3 b )
{
  //return length(max(abs(trans(p)-b), 0.));
  p.yz *= mat2(cos(time), -sin(time), sin(time), cos(time));
  p.xy *= mat2(cos(time), -sin(time), sin(time), cos(time));

  return length(max(abs(p)-b,0.0))-0.01;
}

float opS(float d1, float d2)
{
  //return max(-d1, d2);
  return min(d1, d2);
  return max(-d1, d2);

}

vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        sdSPhere(p + vec3(  d, 0.0, 0.0)) - sdSPhere(p + vec3( -d, 0.0, 0.0)),
        sdSPhere(p + vec3(0.0,   d, 0.0)) - sdSPhere(p + vec3(0.0,  -d, 0.0)),
        sdSPhere(p + vec3(0.0, 0.0,   d)) - sdSPhere(p + vec3(0.0, 0.0,  -d))
    ));
}

#define r(v,t) v *= mat2( C = cos((t)*T), S = sin((t)*T), -S, C )
void main()
{
  vec2 pos = (gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;

  vec3 camPos = vec3(0.0, 0.0, 3.0);

  vec3 camDir = vec3(0., 0., -1.0);
  vec3 camUp = vec3(0., 1., 0.);
  //vec3 camSide = cross(camUp, camDir);
  vec3 camSide = vec3(1.0, 0., 0.);
  float focus = 1.0;
  const vec3 lightDir = vec3(5.0, 5.0, 5.0);

  //camPos += vec3(0.0, 0.0, -3.0*time*1.5);


  vec3 rayDir = normalize(vec3(camSide*pos.x+camUp*pos.y+camDir*focus));
  //rayDir.xy *= mat2(cos(time), -sin(time), sin(time), cos(time));
  //rayDir.yz *= mat2(cos(time), -sin(time), sin(time), cos(time));


  vec3 ray = camPos;
  int march = 0;
  float d = 0.;
  float total_d = 0.;
  const int MAX_MARCH = 128;
  const float MAX_DIST = 100.0;

  for(int i = 0; i < MAX_MARCH; i++){
    //d = sdSPhere(ray);
    d = udBox(ray, vec3(1.0, 1.0, 1.0));
    //d = opS(sdSPhere(ray), udBox(ray, vec3(.5, .5, .5)));
    march = i;
    total_d += d;
    ray += rayDir * d;

    if(d < 0.001){
      vec3 normal = getNormal(ray);
      float diff = clamp(dot(lightDir, normal), 0.01, 1.0);
      //gl_FragColor = vec4(vec3(diff) + vec3(0.1, 0.1, 0.1), 1.0);
      gl_FragColor = vec4(vec3(0.2, 0.2, 0.0), 1.0);
      break;
    }
    if(total_d > MAX_DIST){
      total_d = MAX_DIST;
      march = MAX_MARCH - 1;
      //vec3 normal = getNormal(ray);
      //float diff = clamp(dot(lightDir, normal), 0.01, 1.0);
      //gl_FragColor = vec4(vec3(diff) + vec3(0.0, 0.0, 0.0), 1.0);
      break;
    }else{
      gl_FragColor = vec4(0.4+0.3*sin(time*2.0), 0.2, 0.5, 1.0);
    }
  }
}
