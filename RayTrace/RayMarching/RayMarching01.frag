
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

vec3  cPos = vec3(0.0, 0.0, 2.0);
const float sphereSize = 0.5;
const vec3 lightDir = vec3(-0.577, 0.777, 0.577);


vec3 cDir = vec3(0.0, 0., 1.);
vec3 cUp  = vec3(0., 1.0, 0.);

vec3 trans(vec3 p){
  float inter = 4.0;
    return mod(p, inter) - inter/2.;
}

float distanceFunc(vec3 p){
    //return length(trans(p) - vec3(.5*sin(time*6.0), .6*cos(time*6.0), 0.0)) - sphereSize
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
    // fragment position
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    cPos += vec3(0., 0., -15.5*time);
    //mat3 rot = mat3(( cos(time), -sin(time),0.,  sin(time), cos(time), 0., 0., 0., 1.));
    //cPos = cPos * rot;

    // ray

    vec3 cSide;
    //cDir = vec3()
   // vec3 cDir = vec3(0., 0., 1.);
    //vec3 cUp  = vec3(1.*sin(time*3.0+abs(clamp(p.x, -3., 0.0)*1.5*abs(sin(time)))), 1.*cos(time*3.0+abs(clamp(p.x,0., 3.0)*1.5*abs(sin(time)))), 0.);

    cSide = cross(cDir, cUp);
    float targetDepth = -1.0;
    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
    //vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));


    // marching loop
    float distance = 0.0;
    float rLen = 0.0;
    vec3  rPos = cPos;
    for(int i = 0; i < 128; i++){
        distance = distanceFunc(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
    }

    // hit check
    if(abs(distance) < 0.001){
        vec3 normal = getNormal(rPos);
        float diff = clamp(dot(lightDir, normal), 0.01, 1.0);
        //gl_FragColor = vec4(vec3(diff) + vec3(0., 0.8, 0.9), 1.0);
        gl_FragColor = vec4(vec3(diff) + vec3(0., 0.8, 0.6 + 0.2*sin(time)) ,1.);
    }else{
        //gl_FragColor = vec4(vec3(0.9, 0.0, 0.7),1.0);
        gl_FragColor = (vec4(.8, .0, .8, 1.0));
    }

}
