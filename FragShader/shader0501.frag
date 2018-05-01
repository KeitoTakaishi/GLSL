#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define pi 3.14159265
        float perlin(vec3 p) {
        	vec3 i = floor(p);
        	vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
        	vec3 f = cos((p-i)*pi)*(-.5)+.5;
        	a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
        	a.xy = mix(a.xz, a.yw, f.y);
        	return mix(a.x, a.y, f.z);
        }

#define ITE_MAX      45

 //t更新時の適当な係数。通常1で大丈夫です。
//複雑な形状だったりレイ突き抜けるような小さいオブジェクトは値を0.25位にすると良いです
#define DIST_COEFF   1.00

#define DIST_MIN     0.01
#define DIST_MAX     1000.0

// float map(vec3 p) {
// //t初期値
// float t = DIST_MAX;
// 	float w = 0.0;
// //球を出します(直径1.0)
// w = length(p) - 0.5;
// t = min(t, w);
// return t;
//   }

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float map(vec3 p) {
        	//t初期値
        	float t = DIST_MAX;
        	float w = 0.0;

        	//球を出します(直径1.0)
        	w = length(p) - 0.5 + perlin(p * 7.0*abs(sin(time))) * 0.1;
        	t = min(t, w);

        	return t;
        }


void main( void ) {

vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
float aspect = resolution.x / resolution.y;
vec2 p = (gl_FragCoord.xy*2.0 - resolution) / min(resolution.x, resolution.y);

//cam
vec3 camPos = vec3(0., 0., 0.2);
vec3  dir = vec3(p, 1.0);

//map関数で定義した形状を反復法で解きます。ここではt初期値は0にしとく
float t = 0.0;

//SphereTracing。ここintersectって名前で別に作る人も多いです
for(int i = 0 ; i < ITE_MAX; i++) {

float ttemp = map(t * dir + pos);
if(ttemp < DIST_MIN) break;
//tを更新。DIST_COEFFは複雑な形状を描画する際に小さく為につけています。
//ちょっとずつレイを進める事ができます。
t += ttemp * DIST_COEFF;
}

//option形状の近くの位置を出しておく
vec3 ip = pos + dir * t;

//色を作ります。ここでは進めたtの位置(深度)をただ出力するだけ
vec3 color = vec3(t);

//最後に色をつけておしまいです
gl_FragColor = vec4(color, 1.0);
}
