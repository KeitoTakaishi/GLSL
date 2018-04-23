#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));

vec3 onRep(vec3 pos, float interval) {
  return mod(pos, interval) - interval * 0.5;
}

float distSphere(vec3 pos, float size){
  size = 2.0;
  return length(onRep(pos, 4.0)) - size ;
}


float dist_func(vec3 pos, float size)
{
   return length(pos) - size;

   // size = 0.05;
   // vec3 size_ = vec3(size, size, size);
   // return length(max(abs(pos) - size_, 0.0));
 }

vec3 getNormal(vec3 pos, float size)
{
	float ep = 0.0001;
	return normalize(vec3(
			dist_func(pos, size) - dist_func(vec3(pos.x - ep, pos.y, pos.z), size),
			dist_func(pos, size) - dist_func(vec3(pos.x, pos.y - ep, pos.z), size),
			dist_func(pos, size) - dist_func(vec3(pos.x, pos.y, pos.z - ep), size)
		));
}

void main(void)
{
  vec2 pos = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  vec3 col = vec3(0.0);
  vec3 cameraPos = vec3(0.0, 0.0, 10.0);


  vec3 ray = normalize(vec3(pos, 0.0) - cameraPos); //(target - camPos)
  vec3 cur = cameraPos;

  float size = 1.0;

  for (int i = 0; i < 128; i++)
	{
		float d = distSphere(cur, size);
    //float d = distSphere(onRep(cur, 4.0), 1.0);
		if (d < 0.0001)
		{
			vec3 normal = getNormal(cur, size);
			float diff = dot(normal, lightDir);
			//col = vec3(diff) + vec3(0.0, 0.1*sin(time), 0.3*sin(time));
      col = vec3(diff) + vec3(0.0, 0.3*sin(time), 0.0);
			break;
		}
    //rayを進める
		cur += ray * d;
	}

  gl_FragColor = vec4(col.x, col.y, col.z,1.0);

}
