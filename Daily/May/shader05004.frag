#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;



vec3 twistY(vec3 p, float power)
{
    float s = sin(power * p.y);
    float c = cos(power * p.y);
    mat3 m = mat3(
          c, 0.0,  -s,
        0.0, 1.0, 0.0,
          s, 0.0,   c
    );
    return m*p;
}

float sdTorus( vec3 p, vec2 t )
{
float theta = 3.14/2.0;
float _t = time;
 p.yz *= mat2(cos(theta), -sin(theta), sin(theta), cos(theta));
 p.xy *= mat2(cos(_t), -sin(_t), sin(_t), cos(_t));
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}


vec3 trans(vec3 p)
{
  float inter = 4.0;
  return mod(p, inter) - inter / 2.;
}

float sdSphere(vec3 p)
{
    //float r =0.7 + 0.1*sin(time+mod(gl_FragCoord.x*gl_FragCoord.y, 4.));
    float r = 1.0+1.0*sin(time);
    float t = time;
    p.xz *= mat2(cos(t), -sin(t), sin(t), cos(t));
    p.yz *= mat2(cos(t), -sin(t), sin(t), cos(t));
    //return length(trans(p)) - r;
    return length(p) - r;
}



float udBox(vec3 p, vec3 b)
{
  float t = time;
  p.xz *= mat2(cos(t), -sin(t), sin(t), cos(t));
  p.yz *= mat2(cos(t), -sin(t), sin(t), cos(t));
  return length(max(abs(p)-b, 0.0));
}




float opS(float d1, float d2)
{
  return min(d1, d2);
  //return max(-d1, d2);
}

vec3 getNormal(vec3 p){
  float d = 0.0001;
  return normalize(vec3(
      sdSphere(p + vec3(  d, 0.0, 0.0)) - sdSphere(p + vec3( -d, 0.0, 0.0)),
      sdSphere(p + vec3(0.0,   d, 0.0)) - sdSphere(p + vec3(0.0,  -d, 0.0)),
      sdSphere(p + vec3(0.0, 0.0,   d)) - sdSphere(p + vec3(0.0, 0.0,  -d))
  ));
}


void main()
{

  vec2 pos = (gl_FragCoord.xy*2.0 -resolution.xy) / min(resolution.x, resolution.y);
  //cam
  vec3 camPos = vec3(0., .0, 5.);
  vec3 camDir = vec3(0., 0. ,-1.0);
  vec3 camUp = vec3(0., 1., 0.);
  vec3 camSide = cross(camDir, camUp);
  float focus = 1.8;
  //Light
  const vec3 lightDir = vec3(5., 10., 5.);
  //Ray
  const int MAX_MARCH = 128;
  const float MAX_DIST = 50.;
  vec3 curPos = camPos;
  float total_d = 0.;
  float d = 0.;
  vec3 rayDir = normalize(vec3(camSide*pos.x+camUp*pos.y+camDir*focus));

  vec3 boxSize = vec3(0.9);

  float t = time * 0.8;

  //camPos += vec3(0., 0., t);

  for(int i = 0; i < MAX_MARCH; i++){
    //d = udBox(curPos+vec3(0.,0.,-1.0), boxSize/2.0);
    //d = opS(sdSphere(curPos), udBox(curPos, boxSize));
    //d = opS(udBox(curPos, boxSize*2.3), udBox(curPos, boxSize));
    d = opS(sdSphere(curPos), sdTorus(twistY(curPos, 2.0), vec2(2.0, 0.6)) );

    total_d += d;
    curPos = total_d * rayDir + camPos;

    if(d < 0.001){
      vec3 normal = getNormal(curPos);
      float diff = clamp(dot(lightDir, normal), 0.01, 0.6);
      gl_FragColor = vec4(vec3(diff) +vec3(total_d/30.0) +vec3(0.7+sin(time*time), 0.0, 0.8), 1.0);
      break;
    }
    if(total_d > MAX_DIST){
      gl_FragColor = vec4(0.0,0.0, 0.0, 1.0);
      break;
    }
  }
}
