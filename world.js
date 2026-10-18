/* FOR YOU V4 — fully local, dependency-free WebGL procedural 3D world.
   Renderer, perspective camera, object projection, navigation, mobile joystick support.
   No external model, texture, JS library, API, or runtime account is required. */
(function(){'use strict';
const TAU=Math.PI*2, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function color(s){const c=parseInt(s.replace('#',''),16);return [(c>>16&255)/255,(c>>8&255)/255,(c&255)/255]}
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{const d=Math.hypot(...a)||1;return a.map(v=>v/d)};
function lookAt(eye,at){const z=norm(sub(eye,at)),x=norm(cross([0,1,0],z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1])}
function perspective(fov,aspect,near=.1,far=180){const f=1/Math.tan(fov/2);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0])}
function mul(a,b){const out=new Float32Array(16);for(let col=0;col<4;col++)for(let row=0;row<4;row++){let sum=0;for(let k=0;k<4;k++)sum+=a[k*4+row]*b[col*4+k];out[col*4+row]=sum}return out}
function rand(seed){let state=seed>>>0;return()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296}}
class Mesh{
 constructor(){this.p=[];this.n=[];this.c=[]}
 tri(a,b,c,na,nb,nc,col){const co=Array.isArray(col)?col:color(col);for(const [p,n] of [[a,na],[b,nb],[c,nc]]){this.p.push(...p);this.n.push(...n);this.c.push(...co)}}
 quad(a,b,c,d,na,nb,nc,nd,col){this.tri(a,b,c,na,nb,nc,col);this.tri(a,c,d,na,nc,nd,col)}
 plane(a,b,c,d,col){this.quad(a,b,c,d,[0,1,0],[0,1,0],[0,1,0],[0,1,0],col)}
 ellipsoid(x,y,z,rx,ry,rz,col,latitude=6,longitude=9,turn=0){const ct=Math.cos(turn),st=Math.sin(turn);const p=(theta,phi)=>{const yy=Math.cos(theta)*ry,s=Math.sin(theta),xx=Math.cos(phi)*s*rx,zz=Math.sin(phi)*s*rz;return [x+ct*xx-st*yy,y+st*xx+ct*yy,z+zz]};const n=(t,ph)=>{const yy=Math.cos(t)/Math.max(.01,ry),ss=Math.sin(t),xx=Math.cos(ph)*ss/Math.max(.01,rx),zz=Math.sin(ph)*ss/Math.max(.01,rz);return norm([ct*xx-st*yy,st*xx+ct*yy,zz])};for(let i=0;i<latitude;i++){const a=i*Math.PI/latitude,b=(i+1)*Math.PI/latitude;for(let j=0;j<longitude;j++){const c=j*TAU/longitude,d=(j+1)*TAU/longitude;this.quad(p(a,c),p(b,c),p(b,d),p(a,d),n(a,c),n(b,c),n(b,d),n(a,d),col)}}}
 cylinder(start,end,r1,r2,col,sides=8){const axis=norm(sub(end,start)),u=norm(cross(axis,Math.abs(axis[1])<.9?[0,1,0]:[1,0,0])),v=cross(axis,u);const p=(base,r,a)=>base.map((vv,i)=>vv+r*(u[i]*Math.cos(a)+v[i]*Math.sin(a)));const n=a=>norm(u.map((vv,i)=>vv*Math.cos(a)+v[i]*Math.sin(a)));for(let k=0;k<sides;k++){const a=k*TAU/sides,b=(k+1)*TAU/sides;this.quad(p(start,r1,a),p(end,r2,a),p(end,r2,b),p(start,r1,b),n(a),n(a),n(b),n(b),col)}}
 ribbon(points,halfWidth,col){for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],dir=norm([b[2]-a[2],0,-(b[0]-a[0])]);this.plane([a[0]-dir[0]*halfWidth,a[1],a[2]-dir[2]*halfWidth],[a[0]+dir[0]*halfWidth,a[1],a[2]+dir[2]*halfWidth],[b[0]+dir[0]*halfWidth,b[1],b[2]+dir[2]*halfWidth],[b[0]-dir[0]*halfWidth,b[1],b[2]-dir[2]*halfWidth],col)}}
 heart(x,y,z,scale,shade='#ef9cbb',rings=22,segs=64){const boundary=t=>[16*Math.sin(t)**3/17,(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)+1.7)/18];const base=color(shade);for(const side of [1,-1])for(let i=0;i<rings;i++){const r0=i/rings,r1=(i+1)/rings;for(let j=0;j<segs;j++){const t0=j*TAU/segs,t1=(j+1)*TAU/segs;const p=(r,t)=>{const [xx,yy]=boundary(t);return [x+scale*xx*r*1.1,y+scale*yy*r*1.1,z+scale*side*(.04+.49*Math.sqrt(1-r*r))]};const n=(r,t)=>{const [xx,yy]=boundary(t);return norm([xx*r*.72,yy*r*.72,side*(.4+1.2*(1-r))])};const a=p(r0,t0),b=p(r1,t0),c=p(r1,t1),d=p(r0,t1);const shading=side===1?1:.75;const col=base.map((v,k)=>clamp(v*shading+(k===0?.07:.025),0,1));this.quad(a,b,c,d,n(r0,t0),n(r1,t0),n(r1,t1),n(r0,t1),col)}}}
 export(){return {positions:new Float32Array(this.p),normals:new Float32Array(this.n),colors:new Float32Array(this.c),count:this.p.length/3}}
}
function createGarden(){const rng=rand(20261020),solid=new Mesh(),garden=new Mesh(),light=new Mesh(),tree=new Mesh(),blooms=new Mesh(),heart=new Mesh(),embers=[];
 const flowerSpots=[[-5.4,1.65,-24],[-1.7,1.65,-28],[5.15,1.65,-25.5],[-6,1.65,-34],[2.5,1.65,-35],[7,1.65,-31]];
 const lanternSpots=[[-5.8,5.2,-58],[3.5,6.2,-60],[-2,7.5,-65],[6.8,4.7,-67],[-5,4.6,-70]];
 // Endless velvet grassland with a floating pathway made from perspective visible actual triangles.
 solid.plane([-60,-1.18,27],[60,-1.18,27],[60,-1.18,-115],[-60,-1.18,-115],'#27363b');
 const points=[];for(let z=24;z>=-110;z-=2){points.push([Math.sin(-z*.085)*1.1,-1.10,z])}
 solid.ribbon(points,2.2,'#5b5160');
 solid.ribbon(points.map(p=>[p[0],-1.083,p[2]]),1.52,'#786878');
 for(let z=17;z>-107;z-=3.5){const x=Math.sin(-z*.085)*1.1;solid.ellipsoid(x-1.9,-.97,z,.16,.035,.32,'#e7bd9c',3,6);solid.ellipsoid(x+1.9,-.97,z,.16,.035,.32,'#e7bd9c',3,6)}
 // Distant stylized rolling hills and flowering hedges, no external models.
 for(let i=0;i<64;i++){const z=19-rng()*132,x=(rng()<.5?-1:1)*(15+rng()*33);solid.ellipsoid(x,-.8,z,4+rng()*11,1.9+rng()*2.5,3+rng()*6,rng()<.5?'#303e4a':'#3d4054',5,10)}
 // Arch at entrance.
 for(const x of [-4.8,4.8]){solid.cylinder([x,-1.1,4],[x,8.8,4],.17,.14,'#b28e99',10);solid.ellipsoid(x,8.7,4,.37,.43,.37,'#f4c3ba',8,10)}
 for(let i=0;i<18;i++){const a=Math.PI*i/17,xx=Math.cos(a)*4.8,yy=8.8+Math.sin(a)*2.3;const b=Math.PI*(i+1)/17;solid.cylinder([xx,yy,4],[Math.cos(b)*4.8,8.8+Math.sin(b)*2.3,4],.12,.12,'#d8b3b3',7)}
 heart.heart(7.9,5.0,4,2.75,'#ee9ab8',20,72);
 heart.ellipsoid(7.9,5.0,3.15,.6,.77,.1,'#e9b2b9',6,9);
 for(let i=0;i<26;i++){const a=i*TAU/26,r=3.3+.3*Math.sin(i*1.8);const xx=7.9+Math.cos(a)*r,yy=5+Math.sin(a)*r*.84;light.ellipsoid(xx,yy,4+.15*Math.sin(i),.07,.07,.07,i%3===0?'#fff0cd':'#fcc4d6',4,6)}
 function flower(m,x,y,z,scale,shade,turn=0){const stemTop=[x,y,z],stemBottom=[x+.12*scale,-1.07,z+.1];m.cylinder(stemBottom,stemTop,.045*scale,.035*scale,'#739b81',6);m.ellipsoid(x-.22*scale,y-.47*scale,z,.36*scale,.11*scale,.10*scale,'#7aa58b',5,8,-.33);m.ellipsoid(x+.15*scale,y-.67*scale,z,.34*scale,.10*scale,.09*scale,'#85a991',5,8,.5);for(let k=0;k<(scale<1?5:7);k++){let a=k*TAU/(scale<1?5:7)+turn;m.ellipsoid(x+Math.sin(a)*.30*scale,y+Math.cos(a)*.31*scale,z+.03,.23*scale,.33*scale,.10*scale,shade,scale<1?4:5,scale<1?6:7,-a)}m.ellipsoid(x,y,z+.15,.19*scale,.19*scale,.16*scale,'#ffe8bb',7,10);m.ellipsoid(x-.06,y+.08,z+.28,.052*scale,.06*scale,.04*scale,'#fff6d9',4,6)}
 const colors=['#ffc4d2','#cdb5f2','#f8d9a6','#f3a8c3','#bce0cd','#f6e0c0'];
 flowerSpots.forEach(([x,y,z],i)=>flower(garden,x,y,z,1.7,colors[i],i*.8));
 for(let i=0;i<36;i++){let z=14-rng()*119,x=(rng()<.5?-1:1)*(4+rng()*19);flower(garden,x,.55+rng()*.65,z,.40+rng()*.38,colors[Math.floor(rng()*colors.length)],rng()*TAU)}
 for(let i=0;i<65;i++){const z=19-rng()*122,x=(rng()<.5?-1:1)*(2.5+rng()*27);solid.ellipsoid(x,-1.04,z,.25+rng()*.5,.17+rng()*.35,.32+rng()*.6,rng()<.5?'#5d7776':'#627e78',5,7)}
 // Dreamy lanterns with arching suspension strands, each can be clicked.
 lanternSpots.forEach(([x,y,z],i)=>{const palette=['#f6cdad','#cbb4ed','#f9bcd6','#f1d5a2','#a6e2d5'][i];light.ellipsoid(x,y,z,.53,.78,.49,palette,9,13);light.ellipsoid(x,y,z+.37,.29,.45,.14,'#fff1d4',7,10);light.cylinder([x,y+.8,z],[x,y+.96,z],.28,.19,'#bd92aa',9);light.cylinder([x,y-.79,z],[x,y-.87,z],.34,.34,'#9c8199',9);for(let k=0;k<8;k++){const a=k*TAU/8;light.cylinder([x+Math.sin(a)*.49,y-.7,z+Math.cos(a)*.49],[x+Math.sin(a)*.49,y+.7,z+Math.cos(a)*.49],.023,.023,'#dfbdbf',5)}light.cylinder([x,y+.94,z],[x,y+2.1,z],.019,.019,'#eedad0',5);light.ellipsoid(x,y+2.12,z,.08,.08,.08,'#ffecce',4,6)});
 for(let i=0;i<12;i++){let x=(rng()-.5)*32,z=-51-rng()*26,y=2+rng()*7;light.ellipsoid(x,y,z,.15+rng()*.2,.30+rng()*.3,.15,'#d8b5c8',5,8)}
 // The tree is a real trunk+branch+canopy volume, visited at the end.
 const tz=-93,tx=0;tree.cylinder([tx,-1.08,tz],[tx,9.3,tz],.87,.28,'#9d7584',13);tree.cylinder([tx+.22,-1.08,tz+.08],[tx+.04,9.3,tz],.26,.08,'#c69b93',7);
 for(let i=0;i<35;i++){const a=i*2.399963,yy=3.8+(i%7)*.8,rad=3.0+rng()*5.8,end=[Math.cos(a)*rad,6.3+Math.sin(i*1.3)*2.2+(i%3),tz+Math.sin(a)*rad*.78];tree.cylinder([tx,yy,tz],end,.20,.055,'#b18a91',7);tree.ellipsoid(end[0],end[1],end[2],.28,.23,.29,'#f7d5c3',4,6)}
 for(let i=0;i<175;i++){const u=(i+.5)/175,phi=i*2.399963,yy=1-2*u,rr=Math.sqrt(Math.max(0,1-yy*yy)),r=(6.6+Math.sin(i*12.9)*.7)*rr,x=Math.cos(phi)*r,y=8.5+yy*5.7,z=tz+Math.sin(phi)*r*.8;const shade=['#f7c2d3','#f3d8c2','#f4a8c1','#c8adce','#ffddb5'][i%5];blooms.ellipsoid(x,y,z,.36+(i%5)*.08,.57+(i%4)*.09,.28+(i%3)*.07,shade,3,5,i*.28)}
 tree.heart(0,7.7,tz+3.5,1.15,'#f6bbcd',18,64);
 // Smaller luminous altar at the base.
 for(let i=0;i<24;i++){const a=i*TAU/24;light.ellipsoid(Math.cos(a)*3.2,-.8,tz+Math.sin(a)*2.8,.11,.18,.11,i%2?'#eec0d4':'#ffe5b6',5,7)}
 // Distant floating lights; point sprite shader will render them with soft edges.
 for(let i=0;i<1250;i++){const x=(rng()-.5)*92,y=.2+rng()*25,z=22-rng()*135;embers.push(x,y,z,rng(),.55+rng()*1.6)}
 return {meshes:{solid:solid.export(),garden:garden.export(),light:light.export(),tree:tree.export(),blooms:blooms.export(),heart:heart.export()},points:new Float32Array(embers),flowers:flowerSpots,lanterns:lanternSpots,tree:[0,7.5,tz+3.4],heart:[7.9,5,4]};
}
const VERT=`attribute vec3 p;attribute vec3 n;attribute vec3 col;uniform mat4 vp;uniform vec3 camera;uniform float time;uniform float pulse;uniform float kind;varying vec3 vcol;varying float vfog;varying vec3 vnormal;varying float vshine;void main(){vec3 w=p; if(kind==5.0){w=vec3(7.9,5.0,4.0)+(w-vec3(7.9,5.0,4.0))*(1.0+0.034*sin(time*2.6));}else if(kind==4.0){w.x+=0.045*sin(time*.7+w.y*1.7+w.z*.7);} else if(kind==2.0){w.x+=0.04*sin(time*.6+w.y*.9+w.z*.7);}gl_Position=vp*vec4(w,1.0);vcol=col;vnormal=normalize(n);float d=distance(camera,w);vfog=smoothstep(25.0,96.0,d);vshine=kind==4.0?0.19+pulse*.30:kind==2.0?0.25:kind==5.0?0.38:0.0;}`;
const FRAG=`precision mediump float;varying vec3 vcol;varying float vfog;varying vec3 vnormal;varying float vshine;uniform float time;void main(){vec3 n=normalize(vnormal);vec3 sun=normalize(vec3(-.43,.87,.55));float lam=max(dot(n,sun),0.0);float fill=max(dot(n,normalize(vec3(.75,.2,-.4))),0.0);float rim=pow(1.0-max(dot(n,vec3(0.,0.,1.)),0.),2.7);vec3 lit=vcol*(.42+.70*lam+.25*fill)+vec3(1.,.80,.70)*rim*.12+vcol*vshine;vec3 fog=vec3(.105,.074,.15);lit=mix(lit,fog,vfog*.8);gl_FragColor=vec4(pow(lit,vec3(.88)),1.);}`;
const PVERT=`attribute vec3 p;attribute vec2 misc;uniform mat4 vp;uniform vec3 camera;uniform float time;uniform float density;varying float a;void main(){vec3 w=p;w.y+=sin(time*(.37+misc.x*.5)+p.x*.6)*.36;w.x+=cos(time*.25+p.z*.3)*.11;vec4 clip=vp*vec4(w,1.0);gl_Position=clip;float d=distance(w,camera);gl_PointSize=clamp((misc.y*22.)/max(4.,d),1.5,9.0)*density;a=(.25+.7*misc.x)*(1.-smoothstep(30.,120.,d));}`;
const PFRAG=`precision mediump float;varying float a;void main(){float d=length(gl_PointCoord-.5);float edge=smoothstep(.5,.04,d);gl_FragColor=vec4(1.,.76,.7,edge*a);}`;
function compile(gl,type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(sh);gl.deleteShader(sh);throw Error(message)}return sh}
function program(gl,v,f){const p=gl.createProgram(),vs=compile(gl,gl.VERTEX_SHADER,v),fs=compile(gl,gl.FRAGMENT_SHADER,f);gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p}
function fallbackSVG(stage){const sky=`<defs><radialGradient id="glow" cx="50%" cy="42%" r="52%"><stop stop-color="#ffb8cd" stop-opacity=".38"/><stop offset=".65" stop-color="#775079" stop-opacity=".10"/><stop offset="1" stop-color="#20102c" stop-opacity="0"/></radialGradient><radialGradient id="heart" cx="27%" cy="16%"><stop stop-color="#fff5dc"/><stop offset=".3" stop-color="#ffcad4"/><stop offset=".65" stop-color="#df86ad"/><stop offset="1" stop-color="#854769"/></radialGradient><radialGradient id="petal"><stop stop-color="#fff5dc"/><stop offset=".53" stop-color="#f4c0cc"/><stop offset="1" stop-color="#b4749c"/></radialGradient><linearGradient id="ground" x2="0" y2="1"><stop stop-color="#6d4967"/><stop offset="1" stop-color="#22192e"/></linearGradient><filter id="shine"><feGaussianBlur stdDeviation="16"/></filter></defs>`;
const stars=Array.from({length:80},(_,i)=>{const r=rand(i+23)();let x=(i*199.31)%1400,y=(i*71.13)%850;return `<circle cx="${x}" cy="${y}" r="${i%5===0?2.2:1.1}" fill="#fff0d9" opacity="${.22+r*.55}"/>`}).join('');
const heartPath='M0 190 C-150 78 -205 12 -160 -72 C-125 -130 -45 -132 0 -70 C45 -132 125 -130 160 -72 C205 12 150 78 0 190Z';
let art='';if(stage==='intro'){
 const portrait=matchMedia('(max-width:740px)').matches;
 art=`<g transform="${portrait?'translate(752 194) scale(.90)':'translate(1015 338) scale(1.25)'}"><path d="${heartPath}" transform="translate(15 17)" fill="#9c557d" opacity=".6" filter="url(#shine)"/><path d="${heartPath}" fill="url(#heart)" stroke="#ffe7dc" stroke-width="3"/><path d="M-142 -62 C-115 -102 -67 -112 -32 -82" stroke="#fff9df" opacity=".75" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M-160 -52 Q-180 30 -135 84" fill="none" stroke="#fff5e7" opacity=".3" stroke-width="7"/></g>`;
 } else if(stage==='garden'){
 const colors=['#f4b2c9','#dbb9ef','#f3d1ac','#a9d4bc','#d8c5e8','#f5b6b8'];art=`<path d="M0 950 Q700 350 1400 950" fill="url(#ground)" opacity=".46"/>`+Array.from({length:6},(_,i)=>{const x=480+i*103,y=330+(i%2)*130,sc=1+(i%3)*.14;return `<g transform="translate(${x} ${y}) scale(${sc})"><path d="M0 0 Q-18 155 -5 265" stroke="#83a995" stroke-width="8" fill="none"/><g>${Array.from({length:8},(_,k)=>`<ellipse cy="-42" rx="24" ry="43" transform="rotate(${k*45})" fill="${colors[i]}" stroke="#ffe8dd" stroke-opacity=".24"/>`).join('')}<circle r="22" fill="#ffe4b2"/><circle cx="-7" cy="-7" r="7" fill="#fff8df"/></g></g>`}).join('');
 }else if(stage==='lights'){
 art=Array.from({length:5},(_,i)=>{const x=475+i*150,y=240+(i%2)*170,c=['#ffdab6','#d4bded','#f7bad0','#f1d6a5','#bceadd'][i];return `<g transform="translate(${x} ${y})"><line y1="-210" y2="-80" stroke="#e8c9c9" stroke-width="2"/><ellipse rx="58" ry="89" fill="${c}" opacity=".20" filter="url(#shine)"/><ellipse rx="55" ry="85" fill="${c}" stroke="#fff1df" stroke-opacity=".8"/><ellipse rx="30" ry="53" fill="#fff5d9" opacity=".8"/><path d="M-52 -80L-28 -103H28L52 -80M-50 81H50M-40 -70V70M40 -70V70" stroke="#d9a8b6" stroke-width="9" fill="none"/></g>`}).join('');
 }else{
 let branches='';for(let i=0;i<35;i++){const a=i*2.39996,r=155+(i%5)*29;branches+=`<path d="M700 704 Q${700+Math.cos(a)*70} ${490+Math.sin(a)*40} ${700+Math.cos(a)*r} ${330+Math.sin(a)*r*.69}" stroke="#bd929a" stroke-width="${i%4===0?18:12}" fill="none" stroke-linecap="round"/>`}
 const pinks=['#f9d0da','#f1abc5','#f9ddc3','#d2b0cc'];const blooms=Array.from({length:320},(_,i)=>{const a=i*2.39996,r=Math.sqrt((i+.5)/320)*340,x=700+Math.cos(a)*r*1.11,y=355+Math.sin(a)*r*.7;return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${8+i%5*2}" ry="${16+i%4*2}" transform="rotate(${i*39%160} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${pinks[i%4]}" opacity=".9"/>`}).join('');art=`<path d="M652 850 Q712 590 700 350" stroke="#ac7889" stroke-width="68" fill="none"/><path d="M658 850 Q713 560 700 350" stroke="#e3b2a0" stroke-width="23" fill="none"/>${branches}${blooms}<g transform="translate(700 360) scale(.22)"><path d="${heartPath}" fill="url(#heart)"/></g>`;
 }
return `<svg class="fb-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${sky}<rect width="1400" height="900" fill="url(#glow)"/>${stars}${art}</svg>`}
class World{
 constructor(canvas,fallback){this.canvas=canvas;this.fallback=fallback;this.model=createGarden();this.stage='intro';this.started=false;this.paused=false;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.mobile=matchMedia('(max-width:740px)').matches;this.pos=this.mobile?[7.1,4.7,23]:[0,4.6,23];this.yaw=0;this.pitch=this.mobile?-.33:-.065;this.targetYaw=this.yaw;this.targetPitch=this.pitch;this.keys=new Set();this.axes={x:0,y:0};this.focus=null;this.onTick=null;this.dragging=false;this.steerX=0;this.steerY=0;this.steerActive=false;this.quality=this.mobile?.85:1.0;this.renderScale=1;this.fpsFrames=0;this.fpsElapsed=0;this.qualityAdjustments=0;this.qualityLocked=false;this.fpsDisplay=0;this.debugHud=null;this.frame=0;this.time=0;this.last=0;this.bloom=0;this.blooming=false;this.modalLayers=[document.getElementById('message-layer'),document.getElementById('letter-layer')];
  try{this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'high-performance'})||canvas.getContext('experimental-webgl');if(this.gl)this.initGL()}catch(e){console.warn('WebGL unavailable; using artistic fallback',e);this.gl=null}
  this.fallbackMode=!this.gl;this.fallback.classList.toggle('active',this.fallbackMode);if(this.fallbackMode){canvas.style.display='none';this.setFallback('intro')}
  this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.gl=null;this.fallbackMode=true;this.canvas.style.display='none';this.fallback.classList.add('active');this.setFallback(this.stage)});
  this.initEvents();this.resize();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);document.addEventListener('visibilitychange',()=>{this.paused=document.hidden;this.last=0});if(new URLSearchParams(location.search).get('debug')==='1'){const hud=document.createElement('output');hud.id='foryou-fps';hud.style.cssText='position:fixed;right:12px;bottom:12px;z-index:9999;background:#140e20dc;color:#ffe8dd;padding:8px 12px;border-radius:9px;font:12px system-ui;pointer-events:none';hud.textContent='Đang đo FPS…';document.body.append(hud);this.debugHud=hud;}this.step=this.step.bind(this);this.raf=requestAnimationFrame(this.step);
 }
 initGL(){const gl=this.gl;const p=program(gl,VERT,FRAG);this.mainProg={p,attrs:['p','n','col'].map(s=>gl.getAttribLocation(p,s)),uniform:{vp:gl.getUniformLocation(p,'vp'),camera:gl.getUniformLocation(p,'camera'),time:gl.getUniformLocation(p,'time'),pulse:gl.getUniformLocation(p,'pulse'),kind:gl.getUniformLocation(p,'kind')}};this.buffers={};for(const [name,mesh] of Object.entries(this.model.meshes)){const buffers=[mesh.positions,mesh.normals,mesh.colors].map(arr=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,arr,gl.STATIC_DRAW);return b});this.buffers[name]={buffers,count:mesh.count}}
 const points=program(gl,PVERT,PFRAG);this.pointProg={p:points,attrs:[gl.getAttribLocation(points,'p'),gl.getAttribLocation(points,'misc')],uniform:{vp:gl.getUniformLocation(points,'vp'),camera:gl.getUniformLocation(points,'camera'),time:gl.getUniformLocation(points,'time'),density:gl.getUniformLocation(points,'density')}};this.particle=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.particle);gl.bufferData(gl.ARRAY_BUFFER,this.model.points,gl.STATIC_DRAW);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.clearColor(0,0,0,0)
 }
 initEvents(){
  const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
  // HTML story panels sit above the canvas. Listen at document level so that
  // moving over the visible 3D area still reaches the camera controller.
  // Only touch drags avoid buttons/panels; mouse gaze works everywhere (including story-card).
  const isTouchUI=e=>Boolean(e.target?.closest?.('.site-header,.story-card,.chapter-navigation,.joystick,.interact-shortcut,.marker,.controls-note,.dialog-layer,.letter-layer,button,input,textarea,select,a'));
  const setGaze=e=>{
   // Use viewport coordinates even if WebGL is unavailable and the canvas is hidden.
   const width=this.width||window.innerWidth,height=this.height||window.innerHeight;
   const nx=clamp((e.clientX-width*.5)/(width*.5),-1,1);
   const ny=clamp((e.clientY-height*.5)/(height*.5),-1,1);
   const deadzone=.16; // Prevent micro-movements near screen center.
   const curve=v=>Math.sign(v)*Math.pow(Math.max(0,(Math.abs(v)-deadzone)/(1-deadzone)),1.45);
   this.steerX=curve(nx);
   this.steerY=curve(ny);
   this.steerActive=true;
  };
  const resetGaze=()=>{this.steerActive=false;this.steerX=0;this.steerY=0};
  document.addEventListener('pointerdown',e=>{
   if(!this.started||this.focus)return;
   if(e.pointerType==='mouse'&&finePointer.matches){setGaze(e);return}
   if(isTouchUI(e))return;
   this.dragging=true;this.pointer=[e.clientX,e.clientY];
   this.touchTarget=e.target;
   try{this.touchTarget.setPointerCapture?.(e.pointerId)}catch{}
  });
  document.addEventListener('pointermove',e=>{
   if(!this.started||this.focus)return;
   if(e.pointerType==='mouse'&&finePointer.matches){
    // Document listener sees movements even when the pointer is over a card/button.
    // Modal display pauses camera via update(), not by discarding mouse input.
    setGaze(e);return;
   }
   if(!this.dragging)return;
   const dx=e.clientX-this.pointer[0],dy=e.clientY-this.pointer[1];
   // Touch: finger drag moves the viewed scene naturally (mobile unchanged).
   this.targetYaw-=dx*.0045;
   this.targetPitch=clamp(this.targetPitch-dy*.0035,-Math.PI/3,Math.PI/3);
   this.pointer=[e.clientX,e.clientY];
  });
  const up=e=>{
   if(this.dragging){this.dragging=false;try{this.touchTarget?.releasePointerCapture?.(e.pointerId)}catch{}}
  };
  document.addEventListener('pointerup',up);
  document.addEventListener('pointercancel',up);
  document.addEventListener('pointerout',e=>{if(e.pointerType==='mouse'&&!e.relatedTarget)resetGaze()});
  window.addEventListener('keydown',e=>{
   if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
   if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){
    e.preventDefault();this.keys.add(e.code);if(this.focus)this.focus=null;
   }
  });
  window.addEventListener('keyup',e=>this.keys.delete(e.code));
  window.addEventListener('blur',()=>{this.keys.clear();this.axes={x:0,y:0};resetGaze()});
  // Let the interface receive clicks while the document-level controller steers.
  this.canvas.style.pointerEvents='none';
 }
 start(){this.started=true;this.canvas.style.pointerEvents='none';this.steerActive=false;this.steerX=0;this.steerY=0;this.flyTo(0)}
 flyTo(chapter){const mobile=matchMedia('(max-width:740px)').matches;const destinations=[[0,3.8,-11.8],[0,4,-46],[0,4.8,-78]];const looks=[[0,1.9,-29],[0,4.9,-62],[0,7.6,-92]];let dest=destinations[chapter],target=looks[chapter];if(mobile){dest=[0,4.2,chapter===0?-12.5:chapter===1?-47:-79]}
 const desiredYaw=Math.atan2(target[0]-dest[0],dest[2]-target[2]);this.targetYaw=this.yaw+Math.atan2(Math.sin(desiredYaw-this.yaw),Math.cos(desiredYaw-this.yaw));this.targetPitch=Math.atan2(target[1]-dest[1],Math.hypot(target[0]-dest[0],target[2]-dest[2]));this.steerActive=false;this.steerX=0;this.steerY=0;this.focus={from:[...this.pos],to:dest,start:performance.now(),duration:this.reduced?20:2000};this.setStage(['garden','lights','tree'][chapter]);
 }
 celebrate(){this.blooming=true;}
 setStage(stage){this.stage=stage;if(this.fallbackMode)this.setFallback(stage)}
 setFallback(stage){this.fallback.innerHTML=fallbackSVG(stage)+Array.from({length:20},(_,i)=>`<span class="fb-petal" style="--x:${(i*81.7)%100}%;--y:${(i*39.1)%95}%;--s:${i%3+9}px;--c:${i%3===0?'#ffe4be':'#f2abc9'};--d:${3+i%5}s">✦</span>`).join('')}
 resize(){const w=this.canvas.clientWidth||innerWidth,h=this.canvas.clientHeight||innerHeight;if(w<=0||h<=0)return;const dpr=Math.min(window.devicePixelRatio||1,this.quality)*this.renderScale,cw=Math.max(1,Math.floor(w*dpr)),ch=Math.max(1,Math.floor(h*dpr));if(this.canvas.width!==cw||this.canvas.height!==ch){this.canvas.width=cw;this.canvas.height=ch}this.width=w;this.height=h;if(this.gl)this.gl.viewport(0,0,cw,ch);this.mvp=this.makeMVP()}
 makeMVP(){let aim=[this.pos[0]+Math.sin(this.yaw)*Math.cos(this.pitch),this.pos[1]+Math.sin(this.pitch),this.pos[2]-Math.cos(this.yaw)*Math.cos(this.pitch)];return mul(perspective((this.mobile?70:63)*Math.PI/180,this.width/this.height),lookAt(this.pos,aim))}
 project(point){const m=this.mvp;if(!m)return null;const [x,y,z]=point,cx=m[0]*x+m[4]*y+m[8]*z+m[12],cy=m[1]*x+m[5]*y+m[9]*z+m[13],cw=m[3]*x+m[7]*y+m[11]*z+m[15];if(cw<.25)return null;let nx=cx/cw,ny=cy/cw;if(Math.abs(nx)>1.2||Math.abs(ny)>1.25)return null;return {x:(nx+1)*this.width/2,y:(1-ny)*this.height/2,d:Math.hypot(this.pos[0]-x,this.pos[1]-y,this.pos[2]-z)}}
 update(dt,ms){
 const modalOpen=this.modalLayers.some(el=>el&&!el.classList.contains('hidden'));
 if(this.focus){const t=clamp((ms-this.focus.start)/this.focus.duration,0,1),e=t<.5?4*t*t*t:1-(-2*t+2)**3/2;this.pos=this.pos.map((v,i)=>this.focus.from[i]+(this.focus.to[i]-this.focus.from[i])*e);if(t>=1)this.focus=null}else if(this.started&&!this.paused){const active=!modalOpen;if(active){const fw=(this.keys.has('KeyW')||this.keys.has('ArrowUp')?1:0)-(this.keys.has('KeyS')||this.keys.has('ArrowDown')?1:0)-this.axes.y,lateral=(this.keys.has('KeyD')||this.keys.has('ArrowRight')?1:0)-(this.keys.has('KeyA')||this.keys.has('ArrowLeft')?1:0)+this.axes.x;const move=dt*7.4;this.pos[0]+=move*(fw*Math.sin(this.yaw)+lateral*Math.cos(this.yaw));this.pos[2]+=move*(-fw*Math.cos(this.yaw)+lateral*Math.sin(this.yaw));this.pos[0]=clamp(this.pos[0],-19,19);this.pos[2]=clamp(this.pos[2],-99,19.5);}}
 // Cursor steering: neutral at screen center; continuous and reversible 360° pan.
 // Positive horizontal input increases yaw (look right), negative looks left.
 const canSteer=this.started&&!this.mobile&&!this.focus&&this.steerActive&&!modalOpen;
 if(canSteer){
  // Lower angular acceleration, stable across 60/120/144Hz displays.
  this.targetYaw+=this.steerX*dt*1.05;
  this.targetPitch=clamp(this.targetPitch-this.steerY*dt*.68,-Math.PI/3,Math.PI/3);
 }
 // Time-based exponential damping, consistent on 60/120/144Hz screens.
 const smooth=1-Math.exp(-7.8*dt);
 this.yaw+=(this.targetYaw-this.yaw)*smooth;
 this.pitch+=(this.targetPitch-this.pitch)*smooth;
 this.mvp=this.makeMVP();this.time+=dt;if(this.blooming)this.bloom=Math.min(1,this.bloom+dt*.5);if(this.onTick)this.onTick(this);
 }
 render(){if(!this.gl||!this.width||!this.height)return;const gl=this.gl;gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const obj=this.mainProg;gl.useProgram(obj.p);gl.uniformMatrix4fv(obj.uniform.vp,false,this.mvp);gl.uniform3fv(obj.uniform.camera,this.pos);gl.uniform1f(obj.uniform.time,this.time);gl.uniform1f(obj.uniform.pulse,this.bloom);
 for(const [kind,name] of ['solid','garden','light','tree','blooms','heart'].entries()){
   // Distant high-poly tree can be culled while it is outside the fog range.
   if((name==='tree'||name==='blooms')&&this.pos[2]>-25)continue;
   if(name==='heart'&&this.pos[2]<-30)continue;
   const data=this.buffers[name];gl.uniform1f(obj.uniform.kind,kind);for(let k=0;k<3;k++){gl.bindBuffer(gl.ARRAY_BUFFER,data.buffers[k]);gl.enableVertexAttribArray(obj.attrs[k]);gl.vertexAttribPointer(obj.attrs[k],3,gl.FLOAT,false,0,0)}gl.drawArrays(gl.TRIANGLES,0,data.count)}
 const p=this.pointProg;gl.useProgram(p.p);gl.uniformMatrix4fv(p.uniform.vp,false,this.mvp);gl.uniform3fv(p.uniform.camera,this.pos);gl.uniform1f(p.uniform.time,this.time);gl.uniform1f(p.uniform.density,Math.min(this.width,900)/900*(1+this.bloom*.35));gl.bindBuffer(gl.ARRAY_BUFFER,this.particle);gl.enableVertexAttribArray(p.attrs[0]);gl.enableVertexAttribArray(p.attrs[1]);gl.vertexAttribPointer(p.attrs[0],3,gl.FLOAT,false,20,0);gl.vertexAttribPointer(p.attrs[1],2,gl.FLOAT,false,20,12);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);gl.drawArrays(gl.POINTS,0,this.model.points.length/5);gl.depthMask(true);gl.disable(gl.BLEND);
 }
 step(ms){
  if(!this.last)this.last=ms;
  const elapsed=Math.max(0,(ms-this.last)/1000),dt=Math.min(.05,elapsed);
  this.last=ms;
  if(!this.paused){
   this.update(dt,ms);
   this.render();
   // V9: stable one-way quality adjustment. Resizing the WebGL backbuffer while
   // turning the camera was a visible hitch in V8. Never auto-increase quality.
   if(this.gl&&this.started&&!this.focus&&elapsed>0&&elapsed<.2){
    this.fpsFrames++;this.fpsElapsed+=elapsed;
    if(this.fpsElapsed>=4.0){
     const fps=this.fpsFrames/this.fpsElapsed;
     this.fpsDisplay=Math.round(fps);
     this.fpsFrames=0;this.fpsElapsed=0;
     if(!this.qualityLocked&&fps<42&&this.renderScale>.70){
      this.renderScale=this.qualityAdjustments===0?.82:.70;
      this.qualityAdjustments++;
      this.resize(); // At most two downward adjustments during a session.
      if(this.qualityAdjustments>=2)this.qualityLocked=true;
     }
     if(this.debugHud)this.debugHud.textContent=`${this.fpsDisplay} FPS · ${Math.round(this.quality*this.renderScale*100)}% render`;
    }
   }
  }
  this.raf=requestAnimationFrame(this.step);
 }
 destroy(){cancelAnimationFrame(this.raf);this.resizeObserver.disconnect()}
}
window.ForYouWorld=World;
})();
