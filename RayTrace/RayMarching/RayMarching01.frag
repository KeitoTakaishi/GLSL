//repeate sphere

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const float sphereSize = 1.0;
const vec3 lightDir = vec3(0.5, 0.5, 0.5);

vec3 trans(vec3 p){
  float inter = 4.0;
  return mod(p, inter) - inter/2.;
}

float distanceFunc(vec3 p){
    //return length(trans(p) - vec3(.5*sin(time*6.0), .6*cos(time*6.0), 0.0)) - sphereSize
    //return length(p)  -  sphereSize;
    return length(trans(p)) - sphereSize;
}

// float distanceFunc(vec3 p){
//   vec3 q = abs(trans(p));
//   return length(max(q - vec3(.5), .0));
//
// }

vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
        distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
        distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
    ));
}

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 camPos = vec3(0., 0., 5.0);
    vec3 camDir = vec3(0., 0., -1.);
    vec3 camUp = vec3(0., 1., 0.);
    vec3 camSide = cross(camDir, camUp);
    float focus = 1.0;

    vec3 ray = normalize(vec3(camSide*p.x + camUp*p.y + camDir*focus));


    // marching loop
    float distance = 0.0;
    float total_dis = 0.0;
    vec3  rayPos = camPos;

    const int MAX_MARCH = 128;
    const float MAX_DIST = 100.0;

    for(int i = 0; i < MAX_MARCH; i++){
        distance = distanceFunc(rayPos);
        //totalの進んだ距離
        total_dis += distance;
        //現在の位置
        rayPos = camPos + ray * total_dis;

        if(abs(distance) < 0.001){
          vec3 normal = getNormal(rayPos);
          float diff = clamp(dot(lightDir, normal), 0.01, 1.0);
          gl_FragColor = vec4(vec3(diff) + vec3(0., 0.8, 0.9), 1.0);
        }else{
          gl_FragColor = vec4(vec3(0., 0., 0.),1.0);
        }
      }
    }
