#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float t;
float a;

#define I_MAX 100
#define E 0.001 //collision dist

#define CAM_PATH 0

#define	VIGNETTE_RENDE
#define FWD_SPEED -5.

vec4 march(vec3 pos, vec3 dir);
vec3 camera(vec2 uv);
vec2 rot(vec2 p, vec2 ang);
void rotate(inout vec2 v, float angle);


void mainImage(out vec4 c_out, in vec2 f)
{
  t = time;
  vec3 col = vec3(0.0, 0.0, 0.0);
  vec2 R = resolution.xy;
  vec2 uv = vec2(f-R/2.) / R.y; //normalize
  vec3 dir = camera(uv);
  vec3 pos = vec3(.0, .0, 20.0);

  #ifndef OUTSIDE
  pos.z = t*FWD_SPEED;  //update pos
  #endif

}

float scene(vec3 p)
{

}

vec4 march(vec3 pos, vec3 dir)
{
  vec2 dist = vec2(0., 0.);
  vec3 p = vec3(0., 0., 0.);
  vec4 s = vec4(0., 0., 0., 0.);

  for(int i = 0; i < I_MAX; ++i)
  {
    p = pos + dir * dist.y;
    dist.x = scene(p);
    dist.y += dist.x;

    if(dist.x < E || dist.y > 30.)
    {
      s.y = 1.;
      break;
    }
    s.x++;
  }
  s.w = dist.y;
  return (s);
}

vec3 camera(vec2 uv)
{
  float fov = 1.;
  vec3 forw = vec3(0.0, 0.0, -1.0);
  vec3 right = vec3(1.0, 0.0, 0.0);
  vec3 up = vec3(0.0, 1.0, 0.0);

  return (normalize((uv.x) * right + (uv.y) * up + fov * forw));  //why multiply?
}

void main(void)
{
    mainImage(gl_FragColor,gl_FragCoord.xy);
}
