export function initSite(){
if(window.__laAvenidaReady)return;
window.__laAvenidaReady=true;

var calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};

/* ---------- data (from the client's price list) ---------- */
var VEH=[
  {s:'Moto',l:'Moto',n:''},
  {s:'Sedán',l:'Sedán / auto pequeño',n:''},
  {s:'SUV mediano',l:'SUV mediano / camioneta',n:''},
  {s:'SUV grande',l:'SUV grande / camioneta',n:'3 líneas de asientos'},
  {s:'XL SUV',l:'XL SUV / camioneta',n:''}];
var WASH=[
  {n:'Express',p:[100,130,160,170,190],d:'Lavado exterior, rines, plásticos básicos y secado a mano con toallas de microfibra.',i:['Lavado exterior','Rines','Plásticos básicos','Secado con microfibra']},
  {n:'Completo',p:[null,190,220,250,320],d:'Lavado exterior, descontaminar y desgrasar rines y salpicadera, secado a mano con toallas de microfibra, aspirar, limpieza de consola y paneles de puerta, cristales y plásticos interiores y exteriores, abrillantado de llantas.',i:['Lavado exterior','Rines y salpicadera','Secado con microfibra','Aspirado','Consola y paneles','Cristales y plásticos','Abrillantado de llantas']},
  {n:'Deluxe',p:[null,340,370,400,450],d:'Lavado exterior, cera líquida, descontaminar y desgrasar rines y salpicadera, secado a mano con toallas de microfibra, aspirar, limpieza de consola, paneles, cristales y plásticos interiores y exteriores, abrillantado de llantas.',i:['Todo lo del Completo','Cera líquida']},
  {n:'Uber Special',p:[null,120,160,170,200],d:'Válido únicamente presentando comprobante vigente de la plataforma.',i:['Con comprobante vigente'],sp:1},
  {n:'Happy Hour Express',p:[null,100,100,120,150],d:'El lavado Express a precio reducido. Aplicable solo en el horario de 2 a 5.',i:['Solo de 2 a 5'],sp:1}];
var MATRIX=[['Lavado exterior',1,1,1],['Secado a mano con toallas de microfibra',1,1,1],['Rines',1,1,1],['Plásticos básicos',1,1,1],['Descontaminar y desgrasar rines y salpicadera',0,1,1],['Aspirado',0,1,1],['Limpieza de consola y paneles de puerta',0,1,1],['Cristales y plásticos interiores y exteriores',0,1,1],['Abrillantado de llantas',0,1,1],['Cera líquida',0,0,1]];
var CATS=[
 {t:'Exterior',s:'Motor, pintura, rines y faros.',x:[
  ['Lavado de motor','',[400,500,600,600]],
  ['Descontaminación de pintura','',[1200,1400,1500,1600]],
  ['Descontaminación de rines','los 4',[250,250,250,300]],
  ['Pulido de faros','cada uno',[200,200,200,200]]]},
 {t:'Cristales',s:'Visibilidad limpia, con o sin lluvia.',x:[
  ['Descontaminación de vidrios y cristales','',[220,300,320,380]],
  ['Tratamiento antilluvia para vidrios y cristales','',[250,300,350,350],'Sellador que repele el agua y facilita el deslizamiento de las gotas. También ayuda a reducir la adherencia de insectos y suciedad.']]},
 {t:'Interiores',s:'Shampoo para asientos, alfombras y cajuela.',x:[
  ['Shampoo interior completo','',[1400,1600,1800,2000],'Detallado interior de tapetes, alfombra, cinturones y techo. Elimina suciedad, manchas, residuos y malos olores.'],
  ['Shampoo de asiento individual','',[250,250,250,280]],
  ['Shampoo de asiento doble','',[350,360,360,380]],
  ['Shampoo de asiento completo','2 individuales + 1 doble, o 2 dobles',[700,700,900,900]],
  ['Shampoo de asientos de bebé','',[100,100,100,100]],
  ['Shampoo de cajuela','',[100,120,120,150]]]},
 {t:'Ceras',s:'Tres niveles de brillo y protección.',x:[
  ['Cera líquida','',[150,150,150,170],'Cera líquida de alta calidad que realza el brillo de la pintura, protege la superficie y ayuda a repeler polvo, agua y contaminantes. Ideal para el mantenimiento regular del vehículo.'],
  ['Cera a mano','',[300,340,360,400],'Aplicación manual de cera. Da un brillo intenso, protección duradera y ayuda a conservar la pintura en óptimas condiciones.'],
  ['Cera con máquina','',[370,420,450,500],'Aplicada con pulidora profesional para lograr una cobertura uniforme, un brillo profundo y mejor adherencia del producto. Protege la pintura con un acabado de calidad profesional.']]}];

var S={veh:1,wash:null,extras:{}};
function money(v){return v==null?'—':'<sup>$</sup>'+v.toLocaleString('es-MX')}

/* ---------- build ---------- */
$('#sizes').innerHTML=VEH.map(function(v,i){return '<button class="size" data-veh-set="'+i+'" data-go="lavados"><div><em>'+v.l+'</em><small>'+v.n+'</small></div><div class="num">'+money(WASH[0].p[i])+'</div><div class="bar" style="--w:'+(WASH[0].p[i]/190*100)+'%"></div></button>'}).join('');

function washRow(w,i){return '<article class="wash" data-wash="'+i+'"><h3>'+w.n+'</h3><div><p class="desc">'+w.d+'</p><ul class="incl">'+w.i.map(function(t){return '<li>'+t+'</li>'}).join('')+'</ul></div><div class="wash-price"><div class="num" data-prices="'+JSON.stringify(w.p)+'"></div><small data-veh-or-na></small><button class="btn btn--line btn--sm pick" aria-pressed="false" data-pick="'+i+'"><span>Elegir</span></button></div></article>'}
$('#washes').innerHTML=WASH.map(function(w,i){return w.sp?'':washRow(w,i)}).join('');
$('#specials').innerHTML=WASH.map(function(w,i){return w.sp?washRow(w,i):''}).join('');
$('#matrix').innerHTML=MATRIX.map(function(r){return '<tr><th scope="row">'+r[0]+'</th>'+[1,2,3].map(function(k){return '<td>'+(r[k]?'<span class="dot"></span><span class="sr">Incluido</span>':'<span class="nodot"></span><span class="sr">No incluido</span>')+'</td>'}).join('')+'</tr>'}).join('');
$('#alltbl').innerHTML='<thead><tr><th></th>'+VEH.map(function(v,i){return '<th data-col="'+i+'">'+v.l+(v.n?'<br>('+v.n+')':'')+'</th>'}).join('')+'</tr></thead><tbody>'+WASH.map(function(w){return '<tr><th scope="row">'+w.n+'</th>'+w.p.map(function(p,i){return '<td data-col="'+i+'">'+(p==null?'—':'$'+p)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody>';
var xi=0;
$('#cats').innerHTML=CATS.map(function(c){return '<section class="cat"><h3>'+c.t+'<small>'+c.s+'</small></h3><div class="xlist">'+c.x.map(function(x){var id=xi++;x.id=id;return '<label class="x" for="x'+id+'"><input type="checkbox" id="x'+id+'" data-x="'+id+'"><span class="box"></span><b>'+x[0]+(x[1]?'<small>'+x[1]+'</small>':'')+'</b><span class="num" data-prices="'+JSON.stringify(x[2])+'"></span>'+(x[3]?'<p>'+x[3]+'</p>':'')+'</label>'}).join('')+'</div></section>'}).join('');
var XALL=[];CATS.forEach(function(c){c.x.forEach(function(x){XALL[x.id]=x})});
$$('[data-seg]').forEach(function(seg){var n=+seg.dataset.seg;seg.innerHTML=VEH.map(function(v,i){return (n==4&&i==0)?'':'<button data-veh-set="'+i+'" aria-pressed="false">'+v.s+'</button>'}).join('')});

/* ---------- state ---------- */
function tween(el,to){
  if(to==null||calm||el._v==null){el._v=to;el.innerHTML=money(to);return}
  var from=el._v,t0=performance.now();el._v=to;
  (function step(t){var k=Math.min((t-t0)/420,1),e=1-Math.pow(1-k,3);el.innerHTML=money(Math.round(from+(to-from)*e));if(k<1&&el._v===to)requestAnimationFrame(step)})(t0);
}
function priceOf(arr){return arr.length==5?arr[S.veh]:arr[Math.max(S.veh,1)-1]}
function update(){
  var v=VEH[S.veh], vx=VEH[Math.max(S.veh,1)];
  $$('[data-prices]').forEach(function(el){tween(el,priceOf(JSON.parse(el.dataset.prices)))});
  $$('[data-veh]').forEach(function(el){el.textContent='Precio para '+v.l.toLowerCase()});
  $$('.wash').forEach(function(r){var w=WASH[+r.dataset.wash],na=w.p[S.veh]==null;r.classList.toggle('na',na);r.classList.toggle('on',S.wash==+r.dataset.wash);
    $('[data-veh-or-na]',r).textContent=na?'No disponible para moto':v.l;
    var b=$('.pick',r);b.disabled=na;b.setAttribute('aria-pressed',S.wash==+r.dataset.wash);b.firstChild.textContent=S.wash==+r.dataset.wash?'Elegido':'Elegir'});
  $$('[data-seg] button').forEach(function(b){var i=+b.dataset.vehSet,on=i==S.veh||(b.parentNode.dataset.seg=='4'&&S.veh==0&&i==1);b.setAttribute('aria-pressed',on)});
  $$('[data-col]').forEach(function(c){c.classList.toggle('sel',+c.dataset.col==S.veh)});
  var ids=Object.keys(S.extras),total=0,parts=[];
  if(S.wash!=null){var wp=WASH[S.wash].p[S.veh];if(wp==null)S.wash=null;else{total+=wp;parts.push('Lavado '+WASH[S.wash].n)}}
  ids.forEach(function(id){total+=XALL[id][2][Math.max(S.veh,1)-1]});
  if(ids.length)parts.push(ids.length+(ids.length==1?' adicional':' adicionales'));
  $('#bar').classList.toggle('show',parts.length>0);
  if(parts.length){$('#bar-title').textContent=parts.join(' + ');$('#bar-sub').textContent=(ids.length&&S.veh==0?vx:v).l;tween($('#bar-total'),total)}
}
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-veh-set]');if(t){S.veh=+t.dataset.vehSet;update()}
  t=e.target.closest('[data-pick]');if(t){var i=+t.dataset.pick;S.wash=S.wash==i?null:i;update()}
  t=e.target.closest('[data-go]');if(t)go(t.dataset.go,t.dataset.scroll);
});
document.addEventListener('change',function(e){var id=e.target.dataset&&e.target.dataset.x;if(id!=null){if(e.target.checked)S.extras[id]=1;else delete S.extras[id];update()}});
function openWhatsApp(text){window.open('https://wa.me/529993394611?text='+encodeURIComponent(text),'_blank','noopener,noreferrer')}
$('#bar-clear').addEventListener('click',function(){S.wash=null;S.extras={};$$('[data-x]').forEach(function(c){c.checked=false});update()});
$('#bar-send').addEventListener('click',function(){
  var ids=Object.keys(S.extras),lines=[],total=0,v=VEH[S.veh];
  if(S.wash!=null&&WASH[S.wash].p[S.veh]!=null){total+=WASH[S.wash].p[S.veh];lines.push('Lavado '+WASH[S.wash].n)}
  ids.forEach(function(id){total+=XALL[id][2][Math.max(S.veh,1)-1];lines.push(XALL[id][0]+(XALL[id][1]?' ('+XALL[id][1]+')':''))});
  if(!lines.length)return;
  openWhatsApp('Hola, quiero pedir en La Avenida:\n'+lines.join('\n')+'\nVehículo: '+v.l+'\nTotal: $'+total.toLocaleString('es-MX'));
});
function closeMenu(){$('#menu').classList.remove('open');document.body.classList.remove('nav-open');var b=$('#burger');if(b)b.setAttribute('aria-expanded','false')}
$('#burger').addEventListener('click',function(e){
  e.stopPropagation();
  var o=$('#menu').classList.toggle('open');
  document.body.classList.toggle('nav-open',o);
  this.setAttribute('aria-expanded',o?'true':'false');
});
$('#social-toggle').addEventListener('click',function(e){
  e.stopPropagation();
  var open=$('#social').classList.toggle('open');
  this.setAttribute('aria-expanded',open?'true':'false');
});
document.addEventListener('click',function(e){
  if(!e.target.closest('#social')){$('#social').classList.remove('open');$('#social-toggle').setAttribute('aria-expanded','false')}
  if(!e.target.closest('.topbar'))closeMenu();
});

/* ---------- pages + water sheet transition ---------- */
var cur='inicio',busy=false,WT={force:false},wrap=$('#waterWrap'),tw=$('#tword');
function show(name,scrollId){
  $$('[data-view]').forEach(function(v){v.hidden=v.dataset.view!=name});
  cur=name;
  closeMenu();
  if(name=='adicionales'&&S.veh==0){S.veh=1}
  update();
  var el=scrollId&&document.getElementById(scrollId);
  window.scrollTo(0,el?el.getBoundingClientRect().top+scrollY-108:0);
  try{history.replaceState(null,'','#'+name)}catch(_){}
  placeNav();
}
var NAV_SECS=['servicios','nosotros','info','faq','contacto'];
function placeNav(){
  var id;
  if(cur!='inicio')id='servicios';
  else{
    id='inicio';
    var line=scrollY+140;
    NAV_SECS.forEach(function(s){
      var el=document.getElementById(s);
      if(el&&el.getBoundingClientRect().top+scrollY<=line)id=s;
    });
  }
  $$('#menu button').forEach(function(b){
    if(b.closest('.dd-panel'))return;
    var key=b.dataset.scroll||b.dataset.nav;
    if(key==id)b.setAttribute('aria-current','page');
    else b.removeAttribute('aria-current');
  });
}
var navTick=0;
window.addEventListener('scroll',function(){if(navTick)return;navTick=requestAnimationFrame(function(){navTick=0;placeNav()})},{passive:true});
function io(k){return k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2}
/* a sheet of water with a wavy foam crest: top edge at T, bottom edge at B (fractions of the screen) */
function sheet(T,B,ph){
  var H=innerHeight,W=innerWidth,A=Math.min(34,W*.03),n=18,pts=[],i,x;
  for(i=0;i<=n;i++){x=i/n*W;pts.push(x.toFixed(0)+'px '+(T*H+Math.sin(i*.9+ph)*A+Math.sin(i*.37-ph*1.3)*A*.6).toFixed(1)+'px')}
  for(i=n;i>=0;i--){x=i/n*W;pts.push(x.toFixed(0)+'px '+(B*H+Math.sin(i*.8-ph)*A+Math.sin(i*.31+ph*1.2)*A*.6).toFixed(1)+'px')}
  wrap.style.clipPath='polygon('+pts.join(',')+')';
}
function phase(from,to,dur,fn,done){
  var t0=performance.now();
  (function st(t){var k=Math.min((t-t0)/dur,1);fn(from+(to-from)*io(k),t/260,k);if(k<1)requestAnimationFrame(st);else done&&done()})(t0);
}
function uncover(done){
  phase(1.12,-.14,900,function(B,ph,k){sheet(-.14,B,ph);tw.style.opacity=Math.max(0,1-k*2.4)},function(){wrap.classList.remove('over');wrap.style.clipPath='';WT.force=false;busy=false;done&&done()});
}
function go(name,scrollId){
  if(busy)return;
  if(name==cur){var el=scrollId&&document.getElementById(scrollId);window.scrollTo({top:el?el.getBoundingClientRect().top+scrollY-108:0,behavior:calm?'auto':'smooth'});$('#menu').classList.remove('open');return}
  if(calm){show(name,scrollId);return}
  busy=true;WT.force=true;wrap.classList.add('over');
  phase(1.14,-.14,760,function(T,ph,k){sheet(T,1.14,ph);tw.style.opacity=Math.max(0,k*2-1)},function(){show(name,scrollId);setTimeout(uncover,140)});
}
var h=(location.hash||'').slice(1);
if(h=='lavados'||h=='adicionales')show(h);else{update();placeNav()}
tw.style.opacity=0;
wrap.classList.remove('over');
wrap.style.clipPath='';

/* ---------- faq + contact ---------- */
var FAQ=[
 ['¿Qué incluye el lavado Completo?','Lavado exterior, descontaminado y desengrasado de rines y salpicadera, secado a mano con toallas de microfibra, aspirado, limpieza de consola y paneles de puerta, cristales y plásticos interiores y exteriores, y abrillantado de llantas.'],
 ['¿Cuál es la diferencia entre el Completo y el Deluxe?','El Deluxe incluye todo lo del Completo y añade una aplicación de cera líquida, que realza el brillo y ayuda a repeler polvo y agua.'],
 ['¿Cómo sé qué tamaño es mi vehículo?','Manejamos cinco categorías: moto, sedán o auto pequeño, SUV mediano o camioneta, SUV grande o camioneta con tres líneas de asientos, y XL SUV o camioneta. Si tienes duda, lo confirmamos al llegar.'],
 ['¿Cómo funciona el Happy Hour?','De 2 a 5 el lavado Express tiene precio reducido: $100 para sedán y SUV mediano, $120 para SUV grande y $150 para XL SUV. Aplica solo en ese horario.'],
 ['¿Quién puede usar el Uber Special?','Conductores de plataforma que presenten su comprobante vigente. El precio va de $120 a $200 según el tamaño del vehículo.'],
 ['¿Lavan motos?','Sí. Las motos entran en el lavado Express por $100.'],
 ['¿Qué diferencia hay entre las tres ceras?','La cera líquida es ideal para el mantenimiento regular. La cera a mano da un brillo intenso y protección más duradera. La cera con máquina se aplica con pulidora profesional para una cobertura uniforme y un brillo más profundo.'],
 ['¿Puedo agregar servicios adicionales a cualquier lavado?','Sí. En la página de adicionales puedes marcar los que quieras y ver el total según tu vehículo antes de pedirlo.']];
$('#qs').innerHTML=FAQ.map(function(q,i){return '<div class="qa"><button class="q" id="q'+i+'" aria-expanded="'+(i==0)+'" aria-controls="a'+i+'"><span>'+q[0]+'</span><i></i></button><div class="a" id="a'+i+'" role="region" aria-labelledby="q'+i+'"><div><p>'+q[1]+'</p></div></div></div>'}).join('');
$('#qs').addEventListener('click',function(e){var b=e.target.closest('.q');if(b)b.setAttribute('aria-expanded',b.getAttribute('aria-expanded')!='true')});
function contactReady(){
  var nombre=$('#c-nombre').value.trim();
  var tel=$('#c-tel').value.replace(/\D/g,'');
  var veh=$('#c-veh').value;
  var serv=$('#c-serv').value;
  var msg=$('#c-msg').value.trim();
  var ok=nombre.length>1&&tel.length===10&&veh&&serv&&msg.length>0;
  $('#cform button[type="submit"]').disabled=!ok;
  return ok;
}
$('#cform').addEventListener('input',contactReady);
$('#cform').addEventListener('change',contactReady);
$('#cform').addEventListener('submit',function(e){
  e.preventDefault();
  var fields=[$('#c-nombre'),$('#c-tel'),$('#c-veh'),$('#c-serv'),$('#c-msg')];
  var tel=$('#c-tel').value.replace(/\D/g,'');
  fields.forEach(function(f){
    var bad=f===$('#c-tel')?tel.length!==10:!f.value.trim();
    f.classList.toggle('is-invalid',bad);
  });
  $('#cform-note').hidden=contactReady();
  if(!contactReady())return;
  openWhatsApp('Hola, soy '+$('#c-nombre').value.trim()+'.\nTeléfono: '+tel+'\nVehículo: '+$('#c-veh').value+'\nServicio: '+$('#c-serv').value+'\nMensaje: '+$('#c-msg').value.trim());
});

/* ---------- sunlit water (WebGL) ---------- */
var cv=$('#water'),gl=null;try{gl=cv.getContext('webgl',{antialias:false,alpha:false})}catch(_){}
if(gl){
  var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs='precision highp float;uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 lo,hi,gt;'+
  'float ca(vec2 p,float T){vec2 i=p;float c=1.;for(int n=0;n<5;n++){float tt=T*(1.-(3.5/float(n+1)));i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));c+=1./length(vec2(p.x/(sin(i.x+tt)/.005),p.y/(cos(i.y+tt)/.005)));}c/=5.;c=1.17-pow(c,1.4);return pow(abs(c),8.);}'+
  'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 q=uv;q.x*=r.x/r.y;vec2 d=q-vec2(m.x*r.x/r.y,m.y);float l=length(d);q+=d/(l+.001)*sin(l*38.-t*5.)*.006*exp(-l*5.);'+
  'vec2 p=mod(q*5.2,6.28318)-250.;float c=ca(p,t*.42+23.);float c2=ca(mod(q*3.1+1.7,6.28318)-250.,t*.3+5.);'+
  'vec3 base=mix(lo,hi,smoothstep(0.,1.,uv.y*.75+c2*.45));vec3 col=mix(base,gt,clamp(c*1.7,0.,1.));gl_FragColor=vec4(col,1.);}';
  function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s}
  var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
  if(gl.getProgramParameter(pr,gl.LINK_STATUS)){
    gl.useProgram(pr);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    var U={};['r','t','m','lo','hi','gt'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n)});
    var mx=.7,my=.6,tx=.7,ty=.6;
    function hex(n){var v=getComputedStyle(document.documentElement).getPropertyValue(n).trim().replace('#','');if(v.length<6)return[.58,.82,.94];return [0,2,4].map(function(i){return parseInt(v.substr(i,2),16)/255})}
    function colors(){gl.uniform3fv(U.lo,hex('--w-lo'));gl.uniform3fv(U.hi,hex('--w-hi'));gl.uniform3fv(U.gt,hex('--w-glint'))}
    function size(){var s=Math.min(devicePixelRatio||1,1.5)*.6;cv.width=Math.max(2,innerWidth*s|0);cv.height=Math.max(2,innerHeight*s|0);gl.viewport(0,0,cv.width,cv.height);gl.uniform2f(U.r,cv.width,cv.height)}
    function frame(t){
      if(scrollY<innerHeight*1.15||WT.force){mx+=(tx-mx)*.06;my+=(ty-my)*.06;gl.uniform1f(U.t,t/1000);gl.uniform2f(U.m,mx,my);gl.drawArrays(gl.TRIANGLES,0,3)}
      if(!calm)requestAnimationFrame(frame);
    }
    cv.classList.add('live');
    size();colors();frame(calm?4000:0);
    addEventListener('resize',function(){size();if(calm)frame(4000)});
    addEventListener('pointermove',function(e){tx=e.clientX/innerWidth;ty=1-e.clientY/innerHeight});
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){colors();if(calm)frame(4000)});
    new MutationObserver(function(){colors();if(calm)frame(4000)}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  }
}

}
