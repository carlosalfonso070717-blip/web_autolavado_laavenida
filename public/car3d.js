/* La Avenida: real-time studio hand wash. Model: "Ferrari 458 Italia" by vicent091036 (Sketchfab), as distributed with three.js. */
(function(){
var host=document.getElementById('car3d');if(!host||!window.THREE)return;
var T=THREE,calm=matchMedia('(prefers-reduced-motion: reduce)').matches,renderer;
var small=Math.min(window.innerWidth,window.innerHeight)<700;
var lite=small||matchMedia('(pointer: coarse)').matches||(navigator.hardwareConcurrency||8)<=4;
function pixelRatio(){var dpr=window.devicePixelRatio||1,edge=Math.max(host.clientWidth,host.clientHeight,1);if(!lite)return Math.max(.7,Math.min(dpr,1500/edge,1.25));return Math.min(dpr,3)}
try{renderer=new T.WebGLRenderer({antialias:true,powerPreference:lite?'default':'high-performance',alpha:true,preserveDrawingBuffer:false})}catch(e){return}
var run=document.getElementById('washrun'),caps=[].slice.call(run.querySelectorAll('.cap')),rail=document.getElementById('rail'),ticks=[].slice.call(rail.querySelectorAll('span'));
renderer.setPixelRatio(pixelRatio());
renderer.setClearColor(0x000000,0);
renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
host.appendChild(renderer.domElement);
var BG=new T.Color(0x03121d),scene=new T.Scene();scene.background=null;
var cam=new T.PerspectiveCamera(30,1,.1,80),carCenter=new T.Vector3(),carSize=new T.Vector3(2,1,4.2),bodyBox=null,camRight=new T.Vector3(),camUp=new T.Vector3(),viewEdge=4;
var stage=null;
function measureStage(){var opening=host.closest('.opening');if(!opening||!run){stage=null;return}var or=opening.getBoundingClientRect(),rr=run.getBoundingClientRect();if(!or.width||!rr.width){stage=null;return}stage={ow:or.width,oh:or.height,rx:rr.left-or.left,ry:rr.top-or.top,rw:rr.width,rh:rr.height}}
function stageBox(){return stage}

/* photo-studio lighting baked into the reflections, one frame after the renderer exists */
var envReady=false,envWait=[];
function bakeEnv(){
  var s=new T.Scene(),pm=new T.PMREMGenerator(renderer);
  s.add(new T.Mesh(new T.BoxGeometry(60,30,60),new T.MeshBasicMaterial({color:0x04080c,side:T.BackSide})));
  function box(w,h,x,y,z,rx,ry,k,tint){var m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(k*(tint?.8:1),k*(tint?.92:1),k),side:T.DoubleSide}));m.position.set(x,y,z);m.rotation.set(rx,ry,0);s.add(m)}
  box(4.2,13,0,7.5,0,Math.PI/2,0,7);box(.9,15,5.2,6.2,0,Math.PI/2,0,10);box(.9,15,-5.2,6.2,0,Math.PI/2,0,10);
  box(14,2.6,11,2.6,0,0,-Math.PI/2,2.4,1);box(14,2.6,-11,2.6,0,0,Math.PI/2,1.5,1);
  box(9,3,0,3.2,-13,0,0,2.2,1);box(9,3,0,3.2,13,0,Math.PI,1.6,1);box(60,60,0,-.5,0,-Math.PI/2,0,.05,1);
  scene.environment=pm.fromScene(s,lite?.04:.015).texture;pm.dispose();
  envReady=true;
  var q=envWait;envWait=[];
  q.forEach(function(fn){fn()});
}
scene.add(new T.HemisphereLight(0xd7e7f2,0x071018,lite?1.35:.55));
var key=new T.DirectionalLight(0xffffff,lite?1.6:.35);key.position.set(4,6,3);scene.add(key);
if(!lite)requestAnimationFrame(bakeEnv);
function tex(draw,sz){var c=document.createElement('canvas');c.width=c.height=sz;draw(c.getContext('2d'),sz);var t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t}
var soft=tex(function(g,s){var r=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.5,'rgba(255,255,255,.35)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,s,s)},128);
var floor=new T.Mesh(new T.PlaneGeometry(44,44),new T.MeshBasicMaterial({map:tex(function(g,s){var r=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
  r.addColorStop(0,'#1c3147');r.addColorStop(.16,'#10273a');r.addColorStop(.4,'#061a2a');r.addColorStop(.7,'#03121d');r.addColorStop(1,'#03121d');g.fillStyle=r;g.fillRect(0,0,s,s)},512),transparent:true,opacity:.86,toneMapped:false,depthWrite:false}));
floor.rotation.x=-Math.PI/2;floor.renderOrder=1;floor.visible=false;scene.add(floor);
var shade=document.createElement('canvas');shade.width=shade.height=256;
(function(g){var r=g.createRadialGradient(128,128,8,128,128,118);r.addColorStop(0,'rgba(3,12,24,.5)');r.addColorStop(.28,'rgba(3,12,24,.18)');r.addColorStop(.62,'rgba(3,12,24,0)');g.fillStyle=r;g.fillRect(0,0,256,256)})(shade.getContext('2d'));
var shadeTex=new T.CanvasTexture(shade);
var contact=new T.Mesh(new T.PlaneGeometry(5.6,2.6),new T.MeshBasicMaterial({map:shadeTex,transparent:true,depthWrite:false,toneMapped:false}));
contact.rotation.x=-Math.PI/2;contact.position.set(0,.004,.15);contact.renderOrder=2;scene.add(contact);

/* ---------- surface shader: dirt, foam, water beads, tool trails, tyre and brake detail ---------- */
var NT=lite?12:22,trail=[],ti=0;for(var i=0;i<NT;i++)trail.push(new T.Vector4(0,-9,0,0));
var U={uDirt:{value:new T.Vector2(1,1)},uFoam:{value:new T.Vector2(0,0)},uWet:{value:new T.Vector2(0,0)},uSweep:{value:9},uLag:{value:0},uTrail:{value:trail},uTrF:{value:0},uTrW:{value:0},uGloss:{value:0},uTyre:{value:new T.Vector2(0,0)}};
var NOISE='float h31(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}'+
 'float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z);}'+
 'float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vn(p);p=p*2.03+7.1;a*=.5;}return s;}';
/* wheel-space helpers: the four wheels never move, so their centres are constants */
var WHEEL='vec3 wc=vec3(.83*sign(vWP.x),.358,vWP.z<.17?-1.155:1.496);vec3 wq=wp-wc;float wr=length(wq.yz),wa=atan(wq.z,wq.y),wl=wq.x*sign(vWP.x);float rough2=-1.;';
var TYRE='if(wr>.268&&wr<.37&&abs(wq.x)<.16){float side=smoothstep(.45,.7,abs(vWN.x));'+
 'float gr=1.-smoothstep(.004,.009,min(abs(abs(wl)-.028),abs(abs(wl)-.078)));float sipe=step(fract(wa*7.+abs(wl)*9.),.1)*step(.035,abs(wl));'+
 'float tread=(1.-side)*max(gr,sipe*.7);float ring=smoothstep(.004,.0,abs(wr-.345))+smoothstep(.003,.0,abs(wr-.292));'+
 'float let=step(fract(wa*4.14),.62)*step(fract(wa*20.7),.7)*smoothstep(.312,.316,wr)*smoothstep(.333,.329,wr);'+
 'float tp=vWP.z<.17?uTyre.x:uTyre.y;float tg=side*smoothstep(0.,.07,tp*1.12-.1-fract(wa/6.2832+.5));diffuseColor.rgb=vec3(.02,.02,.021)*(1.-.75*tread)*(1.-.55*tg)+side*(ring*.02+let*.016);rough2=mix(.94,.3,tg)-side*let*.1;}';
var DISC='float hat=smoothstep(.128,.122,wr);float br=vn(vec3(wr*1400.,3.,7.));float hole=0.;for(int k=0;k<3;k++){float rr=.142+float(k)*.022;float aa=fract(wa*5.73+float(k)*.33)-.5;hole=max(hole,1.-smoothstep(.0045,.0065,length(vec2(wr-rr,aa*wr/5.73*1.))));}'+
 'diffuseColor.rgb=mix(vec3(.30,.31,.33)*(.8+.4*br),vec3(.035,.036,.04),max(hat*.85,hole));rough2=mix(.3+.25*br,.75,max(hat,hole));';
var FX='vec3 wp=vec3(vWP.x,abs(vWP.y),vWP.z);float n1=fbm(wp*3.2),n2=fbm(wp*13.+3.),n3=vn(wp*95.);'+
 'float tr=0.;for(int i=0;i<'+NT+';i++){vec4 t4=uTrail[i];tr=max(tr,t4.w*(1.-smoothstep(.06,.2,distance(wp,t4.xyz))));}'+
 'float sw=smoothstep(-.2,.2,wp.z-uSweep+(n1-.5)*.45+(wp.y-.6)*uLag);float dirt=mix(uDirt.x,uDirt.y,sw),foam=mix(uFoam.x,uFoam.y,sw),wet=mix(uWet.x,uWet.y,sw)*(1.-uTrW*tr);'+
 'float low=smoothstep(1.15,.12,wp.y);float dM=dirt*clamp(.16+low*(.55+.9*n1)+.3*(n2-.4),0.,.96);'+
 'diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.105,.082,.062)*(.7+.7*n2),dM*.92);'+
 'vec3 bp=wp*78.,bi=floor(bp),bf=fract(bp);vec3 bc=vec3(h31(bi),h31(bi+7.3),h31(bi+13.1))*.5+.25;float bsz=.1+.14*h31(bi+3.7);float bead=wet*(1.-dM)*step(.45,h31(bi+5.9))*smoothstep(bsz,bsz*.55,length(bf-bc))*smoothstep(.36,.5,n2+.12)*(rough2<0.||rough2<.6?1.:0.);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.78,.87,.94),bead*.26);'+
 'float fM=smoothstep(0.,.2,foam*1.05-(n1*.55+n2*.45))*(.84+.16*smoothstep(.3,.6,n2));fM*=1.-uTrF*tr*(.55+.3*n3);'+
 'float sud=.74+.26*n3+.14*n2;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.93,.955,.97)*sud,fM);diffuseColor.a=mix(diffuseColor.a,1.,max(max(fM,dM*.7),bead*.6));float cov=max(fM,dM);';
function patch(m,kind){
  if(lite)return m;
  m.onBeforeCompile=function(sh){
    for(var k in U)sh.uniforms[k]=U[k];
    sh.vertexShader='varying vec3 vWP;varying vec3 vWN;\n'+sh.vertexShader.replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nvWN=normalize(mat3(modelMatrix)*objectNormal);')
      .replace('#include <begin_vertex>','#include <begin_vertex>\nvWP=(modelMatrix*vec4(transformed,1.)).xyz;');
    var pre='vec3 wp0=vec3(vWP.x,abs(vWP.y),vWP.z);\n#define wp wp0\n'+WHEEL+(kind=='tyre'?TYRE:kind=='disc'?DISC:'')+'\n#undef wp\n';
    sh.fragmentShader='varying vec3 vWP;varying vec3 vWN;uniform vec2 uDirt,uFoam,uWet;uniform float uSweep,uLag,uTrF,uTrW,uGloss;uniform vec2 uTyre;uniform vec4 uTrail['+NT+'];\n'+NOISE+'\n'+sh.fragmentShader
      .replace('#include <color_fragment>','#include <color_fragment>\n'+(kind?pre:'float rough2=-1.;')+FX)
      .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nif(rough2>=0.)roughnessFactor=rough2;roughnessFactor=mix(roughnessFactor*(1.-.45*wet)*(1.-.8*bead),1.,cov);')
      .replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nmetalnessFactor*=1.-cov;')
      .replace('#include <lights_physical_fragment>','#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat*=1.-cov;\n#endif');
  };m.customProgramCacheKey=function(){return 'wash'+(kind||'')};m.needsUpdate=true;return m;
}
function paint(side){var sideV=side||T.FrontSide;if(lite)return new T.MeshStandardMaterial({color:0xb30508,metalness:.45,roughness:.38,side:sideV});return patch(new T.MeshPhysicalMaterial({color:0xb30508,metalness:.35,roughness:.42,clearcoat:1,clearcoatRoughness:.035,envMapIntensity:1.25,side:sideV}))}
var bodyMat=paint(),roofMat=paint(T.DoubleSide);
var glassMat=lite?new T.MeshStandardMaterial({color:0x05080b,metalness:0,roughness:.08,transparent:true,opacity:.72}):patch(new T.MeshPhysicalMaterial({color:0x05080b,metalness:0,roughness:.03,transparent:true,opacity:.72,clearcoat:1,envMapIntensity:1.6}));
var sideGlass=lite?new T.MeshStandardMaterial({color:0xb7c9d4,metalness:.05,roughness:.08,transparent:true,opacity:.38,side:T.DoubleSide}):patch(new T.MeshPhysicalMaterial({color:0xb7c9d4,metalness:.05,roughness:.06,transparent:true,opacity:.38,envMapIntensity:1.35,side:T.DoubleSide}));
var tyreMat=patch(new T.MeshStandardMaterial({color:0x0b0b0c,roughness:.9,metalness:0,envMapIntensity:.9}),'tyre');
var discMat=patch(new T.MeshStandardMaterial({color:0x7c8288,roughness:.35,metalness:1,envMapIntensity:1.1}),'disc');
var alloyMat=patch(new T.MeshStandardMaterial({color:0xa9b0b7,roughness:.2,metalness:1,envMapIntensity:1.25}));
var caliperMat=patch(new T.MeshPhysicalMaterial({color:0xe2b100,roughness:.35,metalness:.1,clearcoat:1,clearcoatRoughness:.1}));
function sm(k){k=k<0?0:k>1?1:k;return k*k*(3-2*k)}
function lerpTab(tab,z){if(z<=tab[0][0])return tab[0];for(var i=1;i<tab.length;i++)if(z<=tab[i][0]){var a=tab[i-1],b=tab[i],k=(z-a[0])/(b[0]-a[0]);return [z,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k]}return tab[tab.length-1]}

/* the model is an open spider: close it with a hardtop, fastback and side windows measured off the real door line and A-pillars */
function buildRoof(){
  var belt=[[-.8,.795,.815],[-.1,.795,.832],[.15,.785,.852],[.3,.775,.872],[.4,.765,.893],[.5,.74,.922],[.58,.71,.96],[.7,.7,.99],[1.4,.62,.99]],
      pill=[[-.8,.795,.83],[-.7,.745,.872],[-.6,.705,.952],[-.5,.682,.995],[-.4,.648,1.045],[-.3,.606,1.122],[-.2,.598,1.15]];
  var keys=[[-.19,1.24,.598],[0,1.258,.612],[.25,1.255,.62],[.55,1.212,.612],[.9,1.12,.58],[1.3,1.018,.5]],cv=new T.CatmullRomCurve3(keys.map(function(k){return new T.Vector3(k[2],k[1],k[0])}),false,'centripetal'),
      NZ=48,NX=24,SK=5,pos=[],idx=[],row=NX+1+2*SK,i,j,p,edge=[],q;
  for(i=0;i<=NZ;i++){p=cv.getPoint(i/NZ);var w=p.x,yc=p.y,z=p.z,k=sm((z-.33)/.15),ye=yc-.068,bt=lerpTab(belt,z),xt=bt[1]+.03,yt=Math.min(ye,bt[2]-.05);edge.push([z,w,ye]);
    /* side skirt: past the B-pillar the roof drops in a smooth curve to the body shoulder, forming the rear quarter */
    for(j=SK;j>=1;j--){q=j/SK;pos.push(-(w+(xt-w)*k*Math.pow(q,.8)),ye+(yt-ye)*k*Math.pow(q,1.5),z)}
    for(j=0;j<=NX;j++){var u=j/NX*2-1;pos.push(w*u,yc-.068*Math.pow(Math.abs(u),2.4),z)}
    for(j=1;j<=SK;j++){q=j/SK;pos.push(w+(xt-w)*k*Math.pow(q,.8),ye+(yt-ye)*k*Math.pow(q,1.5),z)}}
  for(i=0;i<NZ;i++)for(j=0;j<row-1;j++){var a=i*row+j,b=a+row;idx.push(a,b,a+1,a+1,b,b+1)}
  var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
  var roof=new T.Mesh(g,roofMat);
  /* a short lip under the roof edge so the panel reads as a closed hardtop, not a floating sheet */
  var lp=[],li=[],nE=edge.length,ei;
  for(ei=0;ei<nE;ei++){var e=edge[ei];lp.push(e[1],e[2],e[0],e[1]+.008,e[2]-.034,e[0],-e[1],e[2],e[0],-(e[1]+.008),e[2]-.034,e[0])}
  for(ei=0;ei<nE-1;ei++){var a=ei*4,b=a+4;li.push(a,b,a+1,a+1,b,b+1,a+2,a+3,b+2,a+3,b+3,b+2)}
  var lipG=new T.BufferGeometry();lipG.setAttribute('position',new T.Float32BufferAttribute(lp,3));lipG.setIndex(li);lipG.computeVertexNormals();
  /* the opening is slanted: the belt runs z -0.38 to 0.36, the header reaches the A-pillar (z -0.64) and the rear pillar (z 0.56) */
  var wp=[],wi=[],NS2=48,side,zA=edge[0][0];
  for(side=-1;side<=1;side+=2)for(i=0;i<=NS2;i++){var k=i/NS2,zb=-.38+.74*k,zt=-.64+1.2*k,b2=lerpTab(belt,zb),tx,ty;
    if(zt<zA){var tp=lerpTab(pill,zt);tx=tp[1];ty=tp[2]}
    else{var ed=lerpTab(edge,Math.min(zt,edge[nE-1][0]));tx=ed[1];ty=ed[2]}
    tx-=.004;ty-=.004;var by=b2[2]-.012;if(ty<by+.05)ty=by+.05;
    wp.push(side*(b2[1]-.008),by,zb,side*tx,ty,zt)}
  for(side=0;side<2;side++)for(i=0;i<NS2;i++){var o=side*(NS2+1)*2+i*2;wi.push(o,o+1,o+2,o+2,o+1,o+3)}
  var wg=new T.BufferGeometry();wg.setAttribute('position',new T.Float32BufferAttribute(wp,3));wg.setIndex(wi);wg.computeVertexNormals();
  var grp=new T.Group();grp.add(roof);grp.add(new T.Mesh(lipG,roofMat));grp.add(new T.Mesh(wg,sideGlass));grp.userData.roof=roof;return grp;
}
/* brake calipers and coil-over dampers behind each wheel */
function wheelParts(car){
  var sh=new T.Shape();sh.absarc(0,0,.208,-.4,.4,false);sh.absarc(0,0,.142,.4,-.4,true);
  var cg=new T.ExtrudeGeometry(sh,{depth:.07,bevelEnabled:true,bevelSize:.009,bevelThickness:.009,bevelSegments:3,curveSegments:14});cg.translate(0,0,-.035);cg.rotateY(Math.PI/2);
  var pts=[],n;for(n=0;n<=140;n++){var a=n/140*Math.PI*2*7;pts.push(new T.Vector3(Math.cos(a)*.043,n/140*.25,Math.sin(a)*.043))}
  var spring=new T.TubeGeometry(new T.CatmullRomCurve3(pts),220,.0075,6),springMat=new T.MeshStandardMaterial({color:0xb5121b,roughness:.4,metalness:.4}),rod=new T.MeshStandardMaterial({color:0x8d949b,roughness:.25,metalness:1}),dk=new T.MeshStandardMaterial({color:0x121416,roughness:.5,metalness:.6});
  [[1,-1.155],[-1,-1.155],[1,1.496],[-1,1.496]].forEach(function(w){
    var s=w[0],z=w[1],front=z<0,c=new T.Mesh(cg,caliperMat);c.position.set(s*.832,.358,z);c.rotation.x=front?-Math.PI*.5+ .55:Math.PI*.5-.55;car.add(c);
    var g=new T.Group();g.add(new T.Mesh(spring,springMat));var d=new T.Mesh(new T.CylinderGeometry(.022,.022,.2,14),dk);d.position.y=.06;g.add(d);
    var r=new T.Mesh(new T.CylinderGeometry(.009,.009,.3,10),rod);r.position.y=.2;g.add(r);var cap=new T.Mesh(new T.CylinderGeometry(.05,.05,.012,18),dk);cap.position.y=.252;g.add(cap);
    g.position.set(s*.62,.36,z+(front?.02:-.02));g.rotation.z=s*.32;car.add(g)});
}

/* ---------- hand tools (no people). On a phone they are built after the car is already on screen. ---------- */
var washOn=!lite,spray,gun,hose,bottle,jet,puff,mist,sponge,towelA,towelB,bottleG,spritz,spritzMat,seed,XAX,zgeo,zp,NZ2,A,B,D,UPV,SIDE,HN;
function buildWashTools(){
var dark=new T.MeshStandardMaterial({color:0x14181d,roughness:.45,metalness:.3}),steel=new T.MeshStandardMaterial({color:0xc2c8cd,roughness:.2,metalness:1}),blue=new T.MeshStandardMaterial({color:0x1f86d1,roughness:.4,metalness:.2}),rubber=new T.MeshStandardMaterial({color:0x0c0d0f,roughness:.8,metalness:0});
function part(g,m,x,y,z,rx){var o=new T.Mesh(g,m);o.position.set(x,y,z);if(rx)o.rotation.x=rx;o.renderOrder=6;return o}
gun=new T.Group();var H=Math.PI/2;
gun.add(part(new T.CapsuleGeometry(.038,.19,6,16),dark,0,0,-.05,H));gun.add(part(new T.CapsuleGeometry(.028,.15,6,14),rubber,0,-.13,-.14,.42));
gun.add(part(new T.TorusGeometry(.04,.006,8,20,Math.PI),dark,0,-.06,-.04,0));
gun.add(part(new T.CylinderGeometry(.0105,.0105,.6,14),steel,0,.005,.4,H));gun.add(part(new T.CylinderGeometry(.021,.025,.07,18),blue,0,.005,.12,H));
gun.add(part(new T.CylinderGeometry(.016,.016,.05,14),steel,0,.005,.69,H));gun.add(part(new T.CylinderGeometry(.013,.022,.07,18),dark,0,.005,.745,H));
bottle=new T.Group();bottle.add(part(new T.CylinderGeometry(.048,.05,.15,24),new T.MeshPhysicalMaterial({color:0xf4f8fb,roughness:.2,transparent:true,opacity:.88,clearcoat:1}),0,-.11,.66));
bottle.add(part(new T.CylinderGeometry(.03,.034,.045,18),blue,0,-.018,.66));gun.add(bottle);gun.visible=false;scene.add(gun);
gun.traverse(function(o){if(o.geometry&&o.geometry.type=='TorusGeometry')o.rotation.y=H});
var HP=[new T.Vector3(0,.4,-.2),new T.Vector3(.2,.2,.2),new T.Vector3(.6,.05,.8),new T.Vector3(1.2,.04,1.6),new T.Vector3(2,.03,3.2)],hcurve=new T.CatmullRomCurve3(HP);
var hoseSeg=18,hoseRadN=5,hoseRadius=.012,hoseGeo=new T.TubeGeometry(hcurve,hoseSeg,hoseRadius,hoseRadN);
hose=new T.Mesh(hoseGeo,rubber);hose.renderOrder=6;hose.frustumCulled=false;hose.visible=false;scene.add(hose);
var hoseP=new T.Vector3(),hoseNrm=new T.Vector3(),hoseVtx=new T.Vector3();
function hoseStep(){hcurve.needsUpdate=true;HP[0].set(0,-.24,-.17).applyMatrix4(gun.matrixWorld);var g=gun.position;HP[1].set(HP[0].x+.06,Math.max(.25,HP[0].y-.45),HP[0].z+.08);HP[2].set(g.x+.3,.03,g.z+.55);HP[3].set(g.x+.9,.025,g.z+1.7);HP[4].set(g.x+1.6,.025,g.z+4.2);
  var frames=hcurve.computeFrenetFrames(hoseSeg,false),pos=hoseGeo.attributes.position,nrm=hoseGeo.attributes.normal,i,j,v,theta,sin,cos,N,B;
  for(i=0;i<=hoseSeg;i++){hcurve.getPointAt(i/hoseSeg,hoseP);N=frames.normals[i];B=frames.binormals[i];
    for(j=0;j<=hoseRadN;j++){v=i*(hoseRadN+1)+j;theta=j/hoseRadN*Math.PI*2;sin=Math.sin(theta);cos=-Math.cos(theta);
      hoseNrm.set(cos*N.x+sin*B.x,cos*N.y+sin*B.y,cos*N.z+sin*B.z).normalize();
      hoseVtx.copy(hoseP).addScaledVector(hoseNrm,hoseRadius);pos.setXYZ(v,hoseVtx.x,hoseVtx.y,hoseVtx.z);nrm.setXYZ(v,hoseNrm.x,hoseNrm.y,hoseNrm.z)}}
  pos.needsUpdate=true;nrm.needsUpdate=true}

var NS=lite?180:640,sp=new Float32Array(NS*6),sc=new Float32Array(NS*6);seed=[];
for(i=0;i<NS;i++)seed.push({a:(Math.random()*2-1),b:(Math.random()*2-1),ph:Math.random(),v:.8+Math.random()*.6});
var sgeo=new T.BufferGeometry();sgeo.setAttribute('position',new T.BufferAttribute(sp,3));sgeo.setAttribute('color',new T.BufferAttribute(sc,3));
jet=new T.LineSegments(sgeo,new T.LineBasicMaterial({vertexColors:true,transparent:true,opacity:1,depthWrite:false,blending:T.AdditiveBlending}));jet.frustumCulled=false;jet.renderOrder=7;scene.add(jet);
var NP=lite?120:280,pp=new Float32Array(NP*3),pgeo=new T.BufferGeometry();pgeo.setAttribute('position',new T.BufferAttribute(pp,3));
var puffMat=new T.PointsMaterial({size:.15,map:soft,transparent:true,opacity:.5,depthWrite:false,color:0xffffff});
puff=new T.Points(pgeo,puffMat);puff.frustumCulled=false;puff.renderOrder=7;scene.add(puff);
var NM2=22,mistMat=new T.PointsMaterial({size:.34,map:soft,transparent:true,opacity:.1,depthWrite:false,blending:T.AdditiveBlending,color:0xd6ebf8}),mgeo=new T.BufferGeometry(),mpos=new Float32Array(NM2*3);
mgeo.setAttribute('position',new T.BufferAttribute(mpos,3));mist=new T.Points(mgeo,mistMat);mist.frustumCulled=false;mist.renderOrder=7;scene.add(mist);
A=new T.Vector3();B=new T.Vector3();D=new T.Vector3();UPV=new T.Vector3(0,1,0);SIDE=new T.Vector3();HN=new T.Vector3(1,0,0);
spray=function(t,foam,k){
  D.copy(B).sub(A);var len=D.length();D.normalize();SIDE.crossVectors(D,UPV).normalize();
  jet.visible=!foam&&k>.01;puff.visible=foam&&k>.01;mist.visible=k>.01;
  var n,s,q,o,br,q2;
  if(!foam){jet.material.opacity=k;for(n=0;n<NS;n++){s=seed[n];q=(t*s.v*2.8+s.ph)%1;q2=Math.min(1,q+.06);o=n*6;
    sp[o]=A.x+D.x*len*q+SIDE.x*s.b*.05*q;sp[o+1]=A.y+D.y*len*q+s.a*.2*q-.04*q*q;sp[o+2]=A.z+D.z*len*q+SIDE.z*s.b*.05*q;
    sp[o+3]=A.x+D.x*len*q2+SIDE.x*s.b*.05*q2;sp[o+4]=A.y+D.y*len*q2+s.a*.2*q2-.04*q2*q2;sp[o+5]=A.z+D.z*len*q2+SIDE.z*s.b*.05*q2;
    br=.42*(1-q*.6);sc[o]=sc[o+3]=br*.8;sc[o+1]=sc[o+4]=br*.93;sc[o+2]=sc[o+5]=br}
    sgeo.attributes.position.needsUpdate=true;sgeo.attributes.color.needsUpdate=true}
  else{puffMat.opacity=.4*k;for(n=0;n<NP;n++){s=seed[n];q=(t*s.v*1.6+s.ph)%1;pp[n*3]=A.x+D.x*len*q+SIDE.x*s.b*.1*q;pp[n*3+1]=A.y+D.y*len*q+s.a*.24*q-.1*q*q;pp[n*3+2]=A.z+D.z*len*q+SIDE.z*s.b*.1*q}pgeo.attributes.position.needsUpdate=true}
  /* splash and mist where the jet meets the paint */
  mistMat.opacity=(foam?.07:.13)*k;for(n=0;n<NM2;n++){s=seed[n];q=(t*(.9+s.v*.5)+s.ph)%1;var rr=.05+.34*q;
    mpos[n*3]=B.x+HN.x*(.03+.22*q)+SIDE.x*s.b*rr*.4;mpos[n*3+1]=B.y+s.a*rr-.12*q*q+HN.y*.1*q;mpos[n*3+2]=B.z+HN.z*(.03+.22*q)+s.b*rr}mgeo.attributes.position.needsUpdate=true;
}
/* soft pads: sponge and folded microfibre towels */
function pad(sx,sy,sz,pw,wr,mat){var g=new T.SphereGeometry(1,36,22),p=g.attributes.position;for(var i=0;i<p.count;i++){var x=p.getX(i),y=p.getY(i),z=p.getZ(i),X=Math.sign(x)*Math.pow(Math.abs(x),pw)*sx,Y=Math.sign(y)*Math.pow(Math.abs(y),pw)*sy,Z=Math.sign(z)*Math.pow(Math.abs(z),pw)*sz;
  Z+=wr*(Math.sin(X*46+Y*17)+.7*Math.sin(Y*61-X*23))*(z>0?1:.2);p.setXYZ(i,X,Y,Z)}g.computeVertexNormals();var m=new T.Mesh(g,mat);m.renderOrder=6;m.visible=false;m.userData={tp:new T.Vector3(),tq:new T.Quaternion(),hit:new T.Vector3(),ok:false,fresh:true};scene.add(m);return m}
sponge=pad(.115,.075,.036,.5,.0012,new T.MeshStandardMaterial({color:0xe8b41c,roughness:.97,metalness:0}));
towelA=pad(.17,.115,.014,.42,.0035,new T.MeshStandardMaterial({color:0x2a78b8,roughness:1,metalness:0}));towelB=pad(.17,.115,.014,.42,.0035,new T.MeshStandardMaterial({color:0xcfd6dc,roughness:1,metalness:0}));
/* trigger spray bottle with blue tyre dressing */
bottleG=new T.Group();(function(){
  function lathe(p,m){var g=new T.LatheGeometry(p.map(function(a){return new T.Vector2(a[0],a[1])}),36);var o=new T.Mesh(g,m);o.scale.z=.72;o.renderOrder=6;bottleG.add(o);return o}
  lathe([[0,.004],[.039,.004],[.0395,.088],[.032,.128],[.02,.15],[0,.15]],new T.MeshPhysicalMaterial({color:0x1586d6,roughness:.08,transparent:true,opacity:.9,clearcoat:1,envMapIntensity:1.3}));
  lathe([[0,0],[.04,0],[.0435,.01],[.0435,.09],[.036,.132],[.022,.162],[.0145,.176],[.0145,.192]],new T.MeshPhysicalMaterial({color:0xd9f1ff,roughness:.04,transparent:true,opacity:.3,clearcoat:1,envMapIntensity:1.6,depthWrite:false,side:T.DoubleSide})).renderOrder=7;
  var navy=new T.MeshStandardMaterial({color:0x17246b,roughness:.45,metalness:.1}),head=new T.MeshStandardMaterial({color:0xdfe4e8,roughness:.4,metalness:0});
  bottleG.add(part(new T.CylinderGeometry(.018,.018,.024,24),navy,0,.203,0));
  bottleG.add(part(new T.CapsuleGeometry(.0165,.05,6,16),head,0,.232,.014,H));bottleG.add(part(new T.BoxGeometry(.03,.02,.03),head,0,.222,-.006));
  bottleG.add(part(new T.CylinderGeometry(.0085,.0085,.016,14),navy,0,.234,.061,H));bottleG.add(part(new T.BoxGeometry(.009,.056,.013),navy,0,.196,.038,-.38));
  bottleG.scale.setScalar(1.3);bottleG.visible=false;scene.add(bottleG);bottleG.userData={tp:new T.Vector3(),fresh:true};
})();
NZ2=70;zp=new Float32Array(NZ2*3);zgeo=new T.BufferGeometry();zgeo.setAttribute('position',new T.BufferAttribute(zp,3));
spritzMat=new T.PointsMaterial({size:.06,map:soft,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending,color:0xcfe9fb});spritz=new T.Points(zgeo,spritzMat);spritz.frustumCulled=false;spritz.renderOrder=7;spritz.visible=false;scene.add(spritz);
XAX=new T.Vector3(1,0,0);
if(lite){gun.scale.setScalar(2.3);bottle.scale.setScalar(1.7);bottleG.scale.multiplyScalar(1.8);puffMat.size=.5;mistMat.size=.75;spritzMat.size=.14}
}
if(!lite)buildWashTools();
/* tools ride on the real bodywork: cast a ray at the body, then glide toward the hit so the motion stays fluid */
var ray=new T.Raycaster(),bodyMesh=null,hitList=[],NM=new T.Matrix3(),ZAX=new T.Vector3(0,0,1),QN=new T.Quaternion(),QS=new T.Quaternion(),O=new T.Vector3(),DIR=new T.Vector3(),N=new T.Vector3(),DT=1,castAcc=0,allowCast=true;
function cast(o,d){ray.set(o,d);var h=ray.intersectObjects(hitList,false)[0];if(!h)return null;N.copy(h.face.normal);if(h.object===bodyMesh)N.applyMatrix3(NM);N.normalize();if(N.dot(d)>0)N.negate();return h}
function ride(obj,fromTop,a,b,off,spin){
  var ud=obj.userData,snap=allowCast||ud.fresh;
  if(snap){if(fromTop){O.set(a,3,b);DIR.set(0,-1,0)}else{O.set(3,a,b);DIR.set(-1,0,0)}
    var h=hitList.length?cast(O,DIR):null;
    if(h&&(fromTop?h.point.y>.6:h.point.x>.5)){ud.hit.copy(h.point);ud.ok=true;ud.tp.copy(h.point).addScaledVector(N,off);QN.setFromUnitVectors(ZAX,N);QS.setFromAxisAngle(ZAX,spin);ud.tq.copy(QN).multiply(QS)}}
  var k=ud.fresh||DT>=1?1:1-Math.exp(-DT*11);obj.position.lerp(ud.tp,k);obj.quaternion.slerp(ud.tq,k);if(snap)ud.fresh=false;
}
var tAcc=0;
function mark(obj){var ud=obj.userData;if(!ud.ok)return;trail[ti].set(ud.hit.x,ud.hit.y,ud.hit.z,1);ti=(ti+1)%NT}

var ready=false,LOOP=38,time=0,clock=0,last=0,vis=false,raf=0,ZS=2.9,shownCap=-1,shownPr=-1;
/* 0 arrives · 1 pressure pre-wash · 2 foam · 3 sponge · 4 rinse · 5 towels · 6 shine, then the dust settles back */
var CUT=[0,2.2,6.4,9.8,15.2,19.4,25,30.2,LOOP],CAP=[0,1,2,2,3,4,5,5],CS=[0,2.2,6.4,15.2,19.4,25],CE=[2.2,6.4,15.2,19.4,25,30.2],lastPh=-1;
function liteFrame(){
  var ow=Math.max(host.clientWidth,1),oh=Math.max(host.clientHeight,1);
  var asp=ow/oh,vFov=cam.fov*Math.PI/180,hFov=2*Math.atan(Math.tan(vFov/2)*Math.max(asp,.2));
  var th=Math.PI/2+.16*Math.sin(clock*.4),s=Math.abs(Math.sin(th)),c=Math.abs(Math.cos(th));
  var ox=carCenter.x,oy=carCenter.y*.72,oz=carCenter.z,halfW=carSize.z*.5*s+carSize.x*.5*c,halfH=carSize.y*.55;
  if(bodyBox){ox=(bodyBox.min.x+bodyBox.max.x)*.5;oy=(bodyBox.min.y+bodyBox.max.y)*.5;oz=(bodyBox.min.z+bodyBox.max.z)*.5;halfW=(bodyBox.max.z-bodyBox.min.z)*.5*s+(bodyBox.max.x-bodyBox.min.x)*.5*c;halfH=(bodyBox.max.y-bodyBox.min.y)*.5}
  var dist=Math.max(halfW/Math.tan(hFov/2),halfH/Math.tan(vFov/2))*(washOn?1.36:1.16);
  cam.position.set(ox+Math.sin(th)*dist,oy+halfH*.2,oz+Math.cos(th)*dist);
  cam.lookAt(ox,oy,oz);
  viewEdge=dist*Math.tan(hFov/2)*.82;
  renderer.render(scene,cam);
}
function frame(t){
  if(lite&&!washOn){liteFrame();return}
  castAcc+=DT;allowCast=castAcc>(lite?.05:.033);if(allowCast)castAcc=0;
  var ph=0;while(ph<7&&t>=CUT[ph+1])ph++;
  var u=(t-CUT[ph])/(CUT[ph+1]-CUT[ph]),e=sm(u),back=sm((t-(LOOP-2.4))/2.4),io=sm(u*7)*sm((1-u)*7),sweep=ZS-2*ZS*e,n;
  var d=U.uDirt.value,f=U.uFoam.value,w=U.uWet.value;U.uLag.value=0;U.uSweep.value=sweep;U.uTrF.value=0;U.uTrW.value=0;
  if(ph!=lastPh){lastPh=ph;for(n=0;n<NT;n++)trail[n].w=0;sponge.userData.fresh=towelA.userData.fresh=towelB.userData.fresh=bottleG.userData.fresh=true;sponge.userData.ok=towelA.userData.ok=towelB.userData.ok=false}
  var fade=DT>=1?0:DT/(ph==3?3.2:2.4);for(n=0;n<NT;n++)trail[n].w=Math.max(0,trail[n].w-fade);
  if(ph==0){d.set(1,1);f.set(0,0);w.set(0,0)}
  else if(ph==1){d.set(1,.5);f.set(0,0);w.set(0,1)}
  else if(ph==2){d.set(.5,.5);f.set(0,1);w.set(1,1)}
  else if(ph==3){var dd=.5*(1-sm(u*1.4));d.set(dd,dd);f.set(1,1);w.set(1,1);U.uTrF.value=1}
  else if(ph==4){d.set(0,0);f.set(1,0);w.set(1,1);U.uLag.value=-.45}
  else if(ph==5){d.set(0,0);f.set(0,0);w.set(1,0);U.uTrW.value=1;U.uSweep.value=sweep+.55}
  else if(ph==6){d.set(0,0);f.set(0,0);w.set(0,0)}
  else{d.set(back,back);f.set(0,0);w.set(0,0)}
  /* pressure washer: aim along the car, end the jet exactly where it meets the bodywork */
  var useGun=ph==1||ph==2||ph==4;gun.visible=useGun;hose.visible=false;bottle.visible=ph==2;
  if(useGun){var enter=1-io,gx=lite?1.42:2.25;gun.position.set(gx+enter*(lite?.22:.55),(lite?.92:1.12)+.14*Math.sin(clock*1.3)+enter*(lite?.12:.4),sweep+.55+enter*(lite?Math.min(viewEdge,.35):viewEdge));B.set(lite?.55:.2,.6+.4*Math.sin(clock*2.2),sweep-.12);gun.lookAt(B);gun.updateMatrixWorld(true);
    A.set(0,.005,.78).applyMatrix4(gun.matrixWorld);DIR.copy(B).sub(A).normalize();HN.set(1,0,0);
    if(allowCast){var gh=hitList.length?cast(A,DIR):null;if(gh){B.copy(gh.point);HN.copy(N)}}
    spray(clock,ph==2,io)}
  else{jet.visible=puff.visible=mist.visible=false}
  /* sponge: slow overlapping figure-eights along the side, then across the top; the foam thins where it has just passed */
  var mk=false;if(DT<1){tAcc+=DT;if(tAcc>.055){tAcc=0;mk=true}}
  sponge.visible=ph==3;
  if(ph==3){var a=clock*3.1,top=u>.52,q=top?(u-.52)/.48:u/.52,zc=top?-1.95+3.9*sm(q):1.95-3.9*sm(q);
    if(top)ride(sponge,true,.42*Math.sin(a),zc+.2*Math.sin(2*a),.03,.35*Math.sin(a));else ride(sponge,false,.6+.17*Math.sin(2*a+.5),zc+.3*Math.sin(a),.03,.35*Math.sin(a));
    sponge.scale.setScalar((lite?2.6:1)*(.25+.75*sm(u*12)*sm((1-u)*12)));sponge.position.z+=(1-sm(Math.min(1,u*5)))*viewEdge;if(mk)mark(sponge)}
  /* towels: long S-strokes just ahead of the dry line; the water film and beads disappear under them */
  towelA.visible=ph==5||ph==6;towelB.visible=ph==5;
  if(ph==5){var a5=clock*2.5,lead=sweep-.15,s5=.25+.75*sm(u*10)*sm((1-u)*10);
    ride(towelA,false,.62+.2*Math.sin(2*a5+1),lead+.36*Math.sin(a5),.016,.3*Math.sin(a5));ride(towelB,true,.44*Math.sin(a5*.9+1),lead+.26*Math.sin(1.8*a5),.016,.3*Math.cos(a5));
    towelA.scale.setScalar((lite?2.4:1)*s5);towelB.scale.setScalar((lite?2.4:1)*s5);if(mk){mark(towelA);mark(towelB)}}
  /* tyre dressing: the bottle circles each wheel spraying, a towel follows spreading it, and the sidewall turns glossy behind them */
  bottleG.visible=spritz.visible=ph==6;
  if(ph==6){var rear=u<.5,q6=rear?u/.5:(u-.5)/.5,zc6=rear?1.496:-1.155,pr6=sm(q6*1.12-.04),wa6=(pr6-.5)*6.2832,io6=sm(q6*9)*sm((1-q6)*9),bd=bottleG.userData;
    U.uTyre.value.set(rear?0:pr6,rear?pr6:1);
    B.set(.975,.358+Math.cos(wa6)*.315,zc6+Math.sin(wa6)*.315);
    bd.tp.set(1.34+.05*Math.sin(clock*1.7)+(1-io6)*.7,Math.max(.36,.358+Math.cos(wa6)*.36+.2)+(1-io6)*.5,zc6+Math.sin(wa6)*.44);
    var k6=bd.fresh||DT>=1?1:1-Math.exp(-DT*7);bd.fresh=false;bottleG.position.lerp(bd.tp,k6);bottleG.lookAt(B);bottleG.rotateX(-.35);bottleG.updateMatrixWorld(true);
    A.set(0,.234,.07).applyMatrix4(bottleG.matrixWorld);var sq=Math.pow(Math.max(0,Math.sin(clock*7.5)),2)*io6;spritzMat.opacity=.5*sq;
    for(n=0;n<NZ2;n++){var s6=seed[n],qz=(clock*s6.v*2.2+s6.ph)%1;zp[n*3]=A.x+(B.x-A.x)*qz;zp[n*3+1]=A.y+(B.y-A.y)*qz+s6.a*.11*qz;zp[n*3+2]=A.z+(B.z-A.z)*qz+s6.b*.11*qz}zgeo.attributes.position.needsUpdate=true;
    var wa7=wa6-.75,ud6=towelA.userData;ud6.tp.set(.985,.358+Math.cos(wa7)*.322,zc6+Math.sin(wa7)*.322);QN.setFromUnitVectors(ZAX,XAX);QS.setFromAxisAngle(ZAX,wa7);ud6.tq.copy(QN).multiply(QS);
    var k7=ud6.fresh||DT>=1?1:1-Math.exp(-DT*11);ud6.fresh=false;towelA.position.lerp(ud6.tp,k7);towelA.quaternion.slerp(ud6.tq,k7);towelA.scale.setScalar(.44*(.3+.7*io6))}
  else U.uTyre.value.setScalar(ph==7?1-back:0);
  var g=ph==7?sm(u*3)*(1-back):0;U.uGloss.value=g;roofMat.roughness=bodyMat.roughness=.42-.2*g;roofMat.envMapIntensity=bodyMat.envMapIntensity=1.25+.35*g;
  if(lite){liteFrame();return}
  var box=stageBox(),ow=box?box.ow:host.clientWidth,oh=box?box.oh:host.clientHeight,rw=box?box.rw:ow,rh=box?box.rh:oh;
  var asp=ow/Math.max(oh,1),vFov=cam.fov*Math.PI/180,hFov=2*Math.atan(Math.tan(vFov/2)*Math.max(asp,.2));
  var th=Math.PI/2+.22*Math.sin(clock*.1),s=Math.abs(Math.sin(th)),c=Math.abs(Math.cos(th));
  var ox=carCenter.x,oy=carCenter.y*.72,oz=carCenter.z,halfW=carSize.z*.5*s+carSize.x*.5*c,halfH=carSize.y*.55;
  if(bodyBox){ox=(bodyBox.min.x+bodyBox.max.x)*.5;oy=(bodyBox.min.y+bodyBox.max.y)*.5;oz=(bodyBox.min.z+bodyBox.max.z)*.5;halfW=(bodyBox.max.z-bodyBox.min.z)*.5*s+(bodyBox.max.x-bodyBox.min.x)*.5*c;halfH=(bodyBox.max.y-bodyBox.min.y)*.5}
  var dist=Math.max(halfW/Math.tan(hFov/2)*(ow/Math.max(rw,1)),halfH/Math.tan(vFov/2)*(oh/Math.max(rh,1)))*1.32;
  cam.position.set(ox+Math.sin(th)*dist,oy+halfH*.15+.04*Math.sin(clock*.07),oz+Math.cos(th)*dist);
  var dx=(box?box.rx+rw*.5:ow*.5)-ow*.5,dy=(box?box.ry+rh*.5:oh*.5)-oh*.5;
  var worldW=2*dist*Math.tan(hFov/2),worldH=2*dist*Math.tan(vFov/2),sx=-dx/ow*worldW,sy=dy/oh*worldH;
  cam.lookAt(ox,oy,oz);cam.updateMatrixWorld();
  camRight.setFromMatrixColumn(cam.matrixWorld,0);camUp.setFromMatrixColumn(cam.matrixWorld,1);
  cam.lookAt(ox+camRight.x*sx+camUp.x*sy,oy+camRight.y*sx+camUp.y*sy,oz+camRight.z*sx+camUp.z*sy);
  viewEdge=dist*Math.tan(hFov/2)*.82;
  if(!NOR)renderer.render(scene,cam);
  var cp=back>.5?0:CAP[ph],pr=back>.5?0:(cp+Math.min(1,(t-CS[cp])/(CE[cp]-CS[cp])))/6;
  if(cp!=shownCap){shownCap=cp;caps.forEach(function(c,i){c.classList.toggle('on',i==cp)});ticks.forEach(function(c,i){c.classList.toggle('on',i<=cp)})}
  if(Math.abs(pr-shownPr)>.004){shownPr=pr;rail.style.setProperty('--p',pr.toFixed(3))}
}
var bufW=0,bufH=0,finger=false,fingerT=0;
function size(){measureStage();var box=stageBox(),w=lite?host.clientWidth:(box?box.ow:host.clientWidth),h=lite?host.clientHeight:(box?box.oh:host.clientHeight);if(!w||!h)return;w=Math.round(w);h=Math.round(h);if(w===bufW&&Math.abs(h-bufH)<160)return;bufW=w;bufH=h;renderer.setPixelRatio(pixelRatio());renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();if(ready&&(!vis||calm)){DT=1;frame(calm?LOOP-5:time)}}
function tick(now){if(!vis)return;DT=Math.min(lite?.034:.028,(now-last)/1000);last=now;time=(time+DT)%LOOP;clock+=DT;frame(time);raf=requestAnimationFrame(tick)}
function play(on){if(finger||sheetHold)on=false;if(on&&!vis&&ready&&!calm){measureStage();vis=true;last=performance.now();raf=requestAnimationFrame(tick)}else if(!on){vis=false;cancelAnimationFrame(raf)}}
var sheetHold=false;
document.addEventListener('lav-sheet',function(e){sheetHold=!!e.detail;if(sheetHold)play(false);else play(seen&&!document.hidden)});
function noteScroll(){finger=true;clearTimeout(fingerT);if(vis)play(false);fingerT=setTimeout(function(){finger=false;play(seen&&!document.hidden)},140)}
window.addEventListener('scroll',noteScroll,{passive:true});
window.addEventListener('resize',size);
var seen=!('IntersectionObserver' in window),primed=false;
if('IntersectionObserver' in window)new IntersectionObserver(function(en){
  var on=en[0].isIntersecting;if(on)primed=true;seen=on||!primed;play(seen&&!document.hidden);
},{threshold:0,rootMargin:'12% 0px'}).observe(host);
document.addEventListener('visibilitychange',function(){play(seen&&!document.hidden)});
renderer.domElement.addEventListener('webglcontextlost',function(e){e.preventDefault();play(false);ready=false;host.classList.remove('ready')});
/* test hooks: jump to a time, or simulate a stretch at fixed steps so trails build up; optional fixed camera */
window.__carSeek=function(t,c){play(false);DT=1;time=t;clock=c||0;frame(t)};
window.__carRun=function(t0,t1,c0){play(false);var st=1/30,t=t0,c=c0||0;DT=1;time=t;clock=c;frame(t);DT=st;NOR=true;while(t<t1-st){t+=st;c+=st;time=t;clock=c;frame(t)}NOR=false;t+=st;c+=st;time=t;clock=c;frame(t)};
window.__carView=function(x,y,z,tx,ty,tz,fov){cam.fov=fov||26;cam.updateProjectionMatrix();cam.position.set(x,y,z);cam.lookAt(tx,ty,tz);renderer.render(scene,cam)};
var NOR=false;

function fail(){host.classList.add('failed')}
function takeModel(buf){
  setTimeout(function(){new T.GLTFLoader().parse(buf,'',onModel,fail)},1);
}
var queued=window.__ferrariGlb;
if(queued&&typeof queued.then=='function')queued.then(takeModel).catch(fail);
else fetch(host.getAttribute('data-model')).then(function(r){return r.arrayBuffer()}).then(takeModel).catch(fail);
function onModel(gltf){
  var car=gltf.scene,done={};
  car.traverse(function(o){if(!o.isMesh)return;var m=o.material,mn=m&&m.name,nn=o.name;
    if(mn=='Body_Color'){o.material=bodyMat;if(!bodyMesh||o.geometry.attributes.position.count>bodyMesh.geometry.attributes.position.count)bodyMesh=o}
    else if(mn=='Glass_Gray')o.material=glassMat;
    else if(nn.indexOf('tire')==0)o.material=tyreMat;
    else if(nn.indexOf('brake')==0&&mn=='metal_gray')o.material=discMat;
    else if(/^(wheel|rim_)/.test(nn)&&mn=='metal_gray')o.material=alloyMat;
    else if(m&&!done[m.uuid]){done[m.uuid]=1;
      if(mn=='metal_gray'){m.color.setHex(0x8d949b);m.metalness=1;m.roughness=.28}
      else if(mn=='Tires'){m.color.setHex(0x0b0c0d);m.roughness=.8;m.metalness=0}
      else if(mn=='Interior_light'){m.color.setHex(0x16181b);m.roughness=.8;m.metalness=0}
      else if(mn=='plastic_gray'){m.color.setHex(0x0d0e10);m.roughness=.85;m.metalness=0}
      else if(mn=='metal_chrome'){m.metalness=1;m.roughness=.06}
      else if(mn=='Taillight_Glass'){m.emissive=new T.Color(0x5a0000);m.roughness=.15}
      else if(mn=='Projector_Glass'){m.transparent=true;m.opacity=.55;m.roughness=.05;m.metalness=.4}
      m.envMapIntensity=1.1}});
  var hard=buildRoof();car.add(hard);if(!lite)wheelParts(car);car.traverse(function(o){o.renderOrder=3});scene.add(car);car.updateMatrixWorld(true);
  var fit=new T.Box3().setFromObject(car);fit.getCenter(carCenter);fit.getSize(carSize);
  if(bodyMesh){bodyMesh.updateWorldMatrix(true,false);bodyMesh.geometry.computeBoundingBox();bodyBox=bodyMesh.geometry.boundingBox.clone().applyMatrix4(bodyMesh.matrixWorld)}
  if(bodyMesh){NM.getNormalMatrix(bodyMesh.matrixWorld);hitList=[bodyMesh,hard.userData.roof]}
  size();
  DT=1;allowCast=true;
  var warm=lite?[0,12,27]:[0,4,8,12,17,22,27],wi=0,shown=false;
  function reveal(){
    if(shown)return;shown=true;
    lastPh=-1;shownCap=-1;shownPr=-1;time=0;clock=0;
    ready=true;DT=1;
    try{frame(calm?LOOP-5:0)}catch(err){}
    host.classList.add('ready');
    if(!calm)play(seen&&!document.hidden);
    if(lite)setTimeout(function(){if(washOn)return;buildWashTools();washOn=true},900);
  }
  function warmStep(){
    try{lastPh=-1;frame(warm[wi])}catch(err){}
    wi++;
    if(wi>=(lite?1:2))reveal();
    if(wi<warm.length){requestAnimationFrame(warmStep);return}
  }
  requestAnimationFrame(warmStep);
}
size();
})();
