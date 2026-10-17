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
  {n:'Express',p:[100,130,160,170,190],d:'El lavado de diario, por fuera.',i:['Lavado exterior','Rines','Plásticos básicos','Secado a mano con microfibra']},
  {n:'Completo',p:[null,190,220,250,320],d:'Suma el interior al Express.',i:['Lavado exterior','Rines y salpicadera','Secado a mano con microfibra','Aspirado','Consola y paneles','Cristales y plásticos','Abrillantado de llantas']},
  {n:'Deluxe',p:[null,340,370,400,450],d:'El Completo, con cera líquida.',i:['Todo lo del Completo','Cera líquida']},
  {n:'Uber Special',p:[null,120,160,170,200],d:'Válido únicamente presentando comprobante vigente de la plataforma.',i:['Lavado exterior','Aspirado interior'],sp:1},
  {n:'Happy Hour Express',p:[null,100,100,120,150],d:'El lavado Express a precio reducido. Aplicable solo en el horario de 2:00 p. m. a 5:00 p. m.',i:['Solo de 2:00 p. m. a 5:00 p. m.'],sp:1}];
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
function pesos(v){return v.toLocaleString('es-MX',{minimumFractionDigits:2,maximumFractionDigits:2})}
function money(v){return v==null?'—':'<sup>$</sup>'+pesos(v)}

/* ---------- build ---------- */
$('#sizes').innerHTML=VEH.map(function(v,i){return '<button class="size" data-veh-set="'+i+'" data-go="lavados"><div><span class="kicker">Express</span><em>'+v.l+'</em><small>'+v.n+'</small></div><div class="num">'+money(WASH[0].p[i])+'</div><div class="bar" style="--w:'+(WASH[0].p[i]/190*100)+'%"></div></button>'}).join('');

function washRow(w,i){return '<article class="wash" data-wash="'+i+'"><header class="wash-top"><h3>'+w.n+'</h3><p class="desc">'+w.d+'</p></header><div class="wash-inc"><p class="wash-k">Incluye</p><ul class="incl">'+w.i.map(function(t){return '<li>'+t+'</li>'}).join('')+'</ul></div><div class="wash-price"><div class="num" data-prices="'+JSON.stringify(w.p)+'"></div><small data-veh-or-na></small><button class="btn btn--line btn--sm pick" aria-pressed="false" data-pick="'+i+'"><span>Elegir</span></button></div></article>'}
$('#washes').innerHTML=WASH.map(function(w,i){return w.sp?'':washRow(w,i)}).join('');
$('#specials').innerHTML=WASH.map(function(w,i){return w.sp?washRow(w,i):''}).join('');
var xi=0;
$('#cats').innerHTML=CATS.map(function(c){return '<section class="cat"><h3>'+c.t+'<small>'+c.s+'</small></h3><div class="xlist">'+c.x.map(function(x){var id=xi++;x.id=id;return '<label class="x" for="x'+id+'"><input type="checkbox" id="x'+id+'" data-x="'+id+'"><span class="box"></span><b>'+x[0]+(x[1]?'<small>'+x[1]+'</small>':'')+'</b><span class="num" data-prices="'+JSON.stringify(x[2])+'"></span>'+(x[3]?'<p>'+x[3]+'</p>':'')+'</label>'}).join('')+'</div></section>'}).join('');
var XALL=[];CATS.forEach(function(c){c.x.forEach(function(x){XALL[x.id]=x})});
$$('[data-seg]').forEach(function(seg){
  var n=+seg.dataset.seg;
  seg.innerHTML=VEH.map(function(v,i){
    if(n==4&&i==0)return '';
    return '<button data-veh-set="'+i+'" aria-pressed="false"><span class="seg-s">'+v.s+'</span><span class="seg-l">'+v.l+(v.n?'<small>'+v.n+'</small>':'')+'</span></button>';
  }).join('');
  seg.removeAttribute('aria-busy');
  var pick=document.createElement('div');
  pick.className='vehpick';
  pick.innerHTML='<div class="vehpick-copy"><p class="vehpick-k">Elige tu tipo de vehículo</p><p class="vehpick-note">Los precios de esta página son para el auto que elijas.</p></div><button type="button" class="vehpick-btn" aria-expanded="false" aria-haspopup="listbox"><span></span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
  seg.before(pick);
  pick.appendChild(seg);
});
$$('[aria-busy]').forEach(function(el){el.removeAttribute('aria-busy')});

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
  $$('.vehpick').forEach(function(p){var seg=$('[data-seg]',p),i=S.veh;if(seg.dataset.seg=='4'&&i==0)i=1;$('.vehpick-btn span',p).textContent=VEH[i].l});
  var ids=Object.keys(S.extras),total=0,parts=[];
  if(S.wash!=null){var wp=WASH[S.wash].p[S.veh];if(wp==null)S.wash=null;else{total+=wp;parts.push('Lavado '+WASH[S.wash].n)}}
  ids.forEach(function(id){total+=XALL[id][2][Math.max(S.veh,1)-1]});
  if(ids.length)parts.push(ids.length+(ids.length==1?' adicional':' adicionales'));
  $('#bar').classList.toggle('show',parts.length>0);
  if(parts.length){$('#bar-title').textContent=parts.join(' + ');$('#bar-sub').textContent=(ids.length&&S.veh==0?vx:v).l;tween($('#bar-total'),total)}
}
function closePicks(){$$('.vehpick.open').forEach(function(p){p.classList.remove('open');var b=$('.vehpick-btn',p);if(b)b.setAttribute('aria-expanded','false')})}
document.addEventListener('click',function(e){
  var pickBtn=e.target.closest('.vehpick-btn');
  if(pickBtn){
    var pick=pickBtn.closest('.vehpick'),willOpen=!pick.classList.contains('open');
    closePicks();
    if(willOpen){pick.classList.add('open');pickBtn.setAttribute('aria-expanded','true')}
    return;
  }
  var t=e.target.closest('[data-veh-set]');if(t){S.veh=+t.dataset.vehSet;update();closePicks()}
  else if(!e.target.closest('.vehpick'))closePicks();
  t=e.target.closest('[data-pick]');if(t){var i=+t.dataset.pick;S.wash=S.wash==i?null:i;update()}
  t=e.target.closest('[data-go]');if(t){if(t.tagName==='A')e.preventDefault();go(t.dataset.go,t.dataset.scroll)}
});
document.addEventListener('change',function(e){var id=e.target.dataset&&e.target.dataset.x;if(id!=null){if(e.target.checked)S.extras[id]=1;else delete S.extras[id];update()}});
function openWhatsApp(text){window.open('https://wa.me/529993394611?text='+encodeURIComponent(text),'_blank','noopener,noreferrer')}
$('#bar-clear').addEventListener('click',function(){S.wash=null;S.extras={};$$('[data-x]').forEach(function(c){c.checked=false});update()});
$('#bar-send').addEventListener('click',function(){
  var ids=Object.keys(S.extras),lines=[],total=0,v=VEH[S.veh];
  if(S.wash!=null&&WASH[S.wash].p[S.veh]!=null){total+=WASH[S.wash].p[S.veh];lines.push('Lavado '+WASH[S.wash].n)}
  ids.forEach(function(id){total+=XALL[id][2][Math.max(S.veh,1)-1];lines.push(XALL[id][0]+(XALL[id][1]?' ('+XALL[id][1]+')':''))});
  if(!lines.length)return;
  openWhatsApp('Hola, quiero pedir en La Avenida:\n'+lines.join('\n')+'\nVehículo: '+v.l+'\nTotal: $'+pesos(total));
});
function closeMenu(){$('#menu').classList.remove('open');document.body.classList.remove('nav-open');var b=$('#burger');if(b)b.setAttribute('aria-expanded','false')}
$('#burger').addEventListener('click',function(e){
  e.stopPropagation();
  var o=$('#menu').classList.toggle('open');
  document.body.classList.toggle('nav-open',o);
  this.setAttribute('aria-expanded',o?'true':'false');
});
document.addEventListener('click',function(e){
  if(!e.target.closest('.topbar'))closeMenu();
});

/* ---------- pages + water sheet transition ---------- */
var cur='inicio',busy=false,WT={force:false},wrap=$('#waterWrap'),tw=$('#tword');
function show(name,scrollId,mode){
  $$('[data-view]').forEach(function(v){v.hidden=v.dataset.view!=name});
  cur=name;
  closeMenu();
  if(name=='adicionales'&&S.veh==0){S.veh=1}
  update();
  var el=scrollId&&document.getElementById(scrollId);
  var root=document.documentElement,prev=root.style.scrollBehavior;
  root.style.scrollBehavior='auto';
  window.scrollTo(0,el?el.getBoundingClientRect().top+scrollY-108:0);
  root.style.scrollBehavior=prev;
  writeUrl(name,mode||'push');
  placeNav();
}
var PAGES={
  inicio:{path:'/',title:'Club de Autolavado La Avenida | Campestre, Yucatán',desc:'Club de Autolavado La Avenida en Campestre, Yucatán. Lavado a mano, secado con microfibra y detallado. Lunes a sábado de 8:00 a. m. a 5:00 p. m.'},
  lavados:{path:'/lavados',title:'Lavados | Club de Autolavado La Avenida',desc:'Lavado Express, Completo y Deluxe en Campestre, Yucatán. El precio cambia según tu vehículo. Lunes a sábado de 8:00 a. m. a 5:00 p. m.'},
  adicionales:{path:'/adicionales',title:'Servicios adicionales | Club de Autolavado La Avenida',desc:'Quince servicios de detallado, interiores y ceras en Campestre, Yucatán. Súmalos al lavado y ve el total según tu vehículo.'}
};
function viewFromLocation(){
  var hash=(location.hash||'').replace(/^#/,'');
  if(hash==='lavados'||hash==='adicionales')return hash;
  var path=(location.pathname||'/').replace(/\/+$/,'')||'/';
  if(path==='/lavados')return 'lavados';
  if(path==='/adicionales')return 'adicionales';
  return 'inicio';
}
function setMeta(name){
  var p=PAGES[name]||PAGES.inicio,url='https://clublaavenida.com.mx'+p.path;
  document.title=p.title;
  var d=document.querySelector('meta[name="description"]');if(d)d.setAttribute('content',p.desc);
  var c=document.querySelector('link[rel="canonical"]');if(c)c.setAttribute('href',url);
  var og=document.querySelector('meta[property="og:url"]');if(og)og.setAttribute('content',url);
  var ogt=document.querySelector('meta[property="og:title"]');if(ogt)ogt.setAttribute('content',p.title);
  var ogd=document.querySelector('meta[property="og:description"]');if(ogd)ogd.setAttribute('content',p.desc);
  var twt=document.querySelector('meta[name="twitter:title"]');if(twt)twt.setAttribute('content',p.title);
  var twd=document.querySelector('meta[name="twitter:description"]');if(twd)twd.setAttribute('content',p.desc);
}
function writeUrl(name,mode){
  var path=(PAGES[name]||PAGES.inicio).path;
  var here=(location.pathname||'/').replace(/\/+$/,'')||'/';
  var same=here===path&&!location.hash;
  setMeta(name);
  if(mode==='stay'||same){
    if(!same)try{history.replaceState({view:name},'',path)}catch(_){}
    return;
  }
  try{history[mode==='push'?'pushState':'replaceState']({view:name},'',path)}catch(_){}
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
  $$('#menu [data-go]').forEach(function(b){
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
function sheet(T,B,ph,lite){
  var vv=window.visualViewport,H=vv?vv.height:innerHeight,W=vv?vv.width:innerWidth,A=Math.min(lite?18:34,W*.03),n=lite?8:18,pts=[],i,x;
  for(i=0;i<=n;i++){x=i/n*W;pts.push(x.toFixed(0)+'px '+(T*H+Math.sin(i*.9+ph)*A+Math.sin(i*.37-ph*1.3)*A*.6).toFixed(1)+'px')}
  for(i=n;i>=0;i--){x=i/n*W;pts.push(x.toFixed(0)+'px '+(B*H+Math.sin(i*.8-ph)*A+Math.sin(i*.31+ph*1.2)*A*.6).toFixed(1)+'px')}
  wrap.style.clipPath='polygon('+pts.join(',')+')';
}
var sheetGen=0,sheetTimer=0,uncoverTimer=0,sheetGo=null;
function phase(from,to,dur,fn,done){
  var gen=sheetGen,t0=performance.now(),live=0;
  function st(){
    if(gen!==sheetGen)return;
    var now=performance.now(),k=Math.min((now-t0)/dur,1);
    fn(from+(to-from)*io(k),now/260,k);
    if(gen!==sheetGen)return;
    if(k<1){
      var ticket=++live;
      requestAnimationFrame(function(){if(ticket===live)st()});
      setTimeout(function(){if(ticket===live)st()},48);
    }else{live++;done&&done()}
  }
  st();
}
function releaseSheet(){
  sheetGen++;
  clearTimeout(sheetTimer);
  clearTimeout(uncoverTimer);
  wrap.classList.remove('over');wrap.style.clipPath='';tw.style.opacity=0;WT.force=false;busy=false;
  document.dispatchEvent(new CustomEvent('lav-sheet',{detail:false}));
}
function uncover(done){
  var lite=sheetLite();
  phase(1.12,-.14,lite?620:900,function(B,ph,k){sheet(-.14,B,ph,lite);tw.style.opacity=Math.max(0,1-k*2.4)},function(){releaseSheet();done&&done()});
}
function sheetLite(){return matchMedia('(max-width:860px)').matches||matchMedia('(pointer: coarse)').matches}
function go(name,scrollId){
  if(busy){sheetGo=null;releaseSheet();show(name,scrollId);return}
  if(name==cur){var el=scrollId&&document.getElementById(scrollId);window.scrollTo({top:el?el.getBoundingClientRect().top+scrollY-108:0,behavior:calm?'auto':'smooth'});$('#menu').classList.remove('open');return}
  if(calm){show(name,scrollId);return}
  var lite=sheetLite();
  busy=true;sheetGo={n:name,id:scrollId};WT.force=!lite;WT.once=true;wrap.classList.add('over');
  document.dispatchEvent(new CustomEvent('lav-sheet',{detail:true}));
  clearTimeout(sheetTimer);
  sheetTimer=setTimeout(function(){var dest=sheetGo;sheetGo=null;releaseSheet();if(dest)show(dest.n,dest.id)},lite?1500:2400);
  phase(1.14,-.14,lite?640:760,function(T,ph,k){sheet(T,1.14,ph,lite);tw.style.opacity=Math.max(0,k*2-1)},function(){show(name,scrollId);sheetGo=null;clearTimeout(uncoverTimer);uncoverTimer=setTimeout(uncover,lite?80:140)});
}
var start=viewFromLocation();
if(start=='lavados'||start=='adicionales')show(start,null,location.hash?'replace':'stay');
else{update();placeNav();setMeta('inicio')}
window.addEventListener('popstate',function(){
  var name=viewFromLocation();
  if(name==cur)return;
  show(name,null,'stay');
});
tw.style.opacity=0;
wrap.classList.remove('over');
wrap.style.clipPath='';

/* ---------- faq + contact ---------- */
var FAQ=[
 ['¿Cómo sé qué tamaño es mi vehículo?','Manejamos cinco categorías: moto, sedán o auto pequeño, SUV mediano o camioneta, SUV grande o camioneta con tres líneas de asientos, y XL SUV o camioneta. Si tienes duda, lo confirmamos al llegar.'],
 ['¿Qué incluye el lavado Completo?','Lavado exterior, descontaminado, desengrasado de rines, salpicadera, secado a mano con toallas de microfibra, aspirado, limpieza de consola, paneles de puerta, cristales, plásticos interiores, plásticos exteriores y abrillantado de llantas.'],
 ['¿Cuál es la diferencia entre el Completo y el Deluxe?','El Deluxe incluye todo lo del Completo y añade una aplicación de cera líquida, que realza el brillo y ayuda a repeler polvo y agua.'],
 ['¿Puedo agregar servicios adicionales a cualquier lavado?','Sí. En la página de adicionales puedes marcar los que quieras y ver el total según tu vehículo antes de pedirlo.'],
 ['¿Cómo funciona el Happy Hour?','De 2:00 p. m. a 5:00 p. m. el lavado Express tiene precio reducido: $100.00 para sedán y SUV mediano, $120.00 para SUV grande y $150.00 para XL SUV. Aplica solo en ese horario.']];
$('#qs').innerHTML=FAQ.map(function(q,i){return '<div class="qa"><button class="q" id="q'+i+'" aria-expanded="false" aria-controls="a'+i+'"><span>'+q[0]+'</span><i></i></button><div class="a" id="a'+i+'" role="region" aria-labelledby="q'+i+'"><div><p>'+q[1]+'</p></div></div></div>'}).join('');
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

/* ---------- sunlit water (WebGL), after the first paint ---------- */
function startWater(){
var cv=$('#water'),gl=null;try{gl=cv.getContext('webgl',{antialias:false,alpha:true,preserveDrawingBuffer:false})}catch(_){}
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
    var waterW=0,waterH=0,waterFinger=false,waterFingerT=0;
    var waterDead=false;
    function drawWater(t){if(waterDead||(gl.isContextLost&&gl.isContextLost())){waterDead=true;cv.classList.remove('live');return}mx+=(tx-mx)*.06;my+=(ty-my)*.06;gl.uniform1f(U.t,(t||0)/1000);gl.uniform2f(U.m,mx,my);gl.drawArrays(gl.TRIANGLES,0,3);cv.classList.add('live')}
    function size(){if(waterDead)return;var s=Math.min(devicePixelRatio||1,1.5)*.6,w=Math.max(2,innerWidth*s|0),h=Math.max(2,innerHeight*s|0);if(WT.force)return;if(waterW&&Math.abs(w-waterW)<2&&Math.abs(h-waterH)<160)return;waterW=w;waterH=h;cv.width=w;cv.height=h;gl.viewport(0,0,cv.width,cv.height);gl.uniform2f(U.r,cv.width,cv.height);drawWater(performance.now())}
    var washEl=document.getElementById('washrun'),carZone=false,zoneTick=0;
    function syncZone(){var el=document.querySelector('[data-view="inicio"]:not([hidden]) .opening')||washEl;if(!el){carZone=cur!='inicio';return}carZone=el.getBoundingClientRect().bottom<80}
    function heroVisible(){return !carZone&&scrollY<innerHeight*.95}
    function ferrariOnScreen(){var car=document.getElementById('car3d');return !!(car&&car.classList.contains('ready')&&heroVisible())}
    var waterRaf=0;
    function frame(t){
      waterRaf=0;
      if(waterDead)return;
      var sheet=WT.once||WT.force;
      if(WT.once){WT.once=false;drawWater(t)}
      else if(!document.hidden&&!waterFinger&&!WT.force&&heroVisible()&&!ferrariOnScreen())drawWater(t);
      if(!calm&&!waterDead&&!document.hidden&&(sheet||(heroVisible()&&!ferrariOnScreen())))waterRaf=requestAnimationFrame(frame);
    }
    function wakeWater(){if(waterDead||calm||document.hidden||waterRaf)return;waterRaf=requestAnimationFrame(frame)}
    cv.addEventListener('webglcontextlost',function(e){e.preventDefault();waterDead=true;cv.classList.remove('live')});
    addEventListener('scroll',function(){if(WT.force||waterDead)return;waterFinger=true;clearTimeout(waterFingerT);waterFingerT=setTimeout(function(){waterFinger=false;if(!document.hidden&&heroVisible()&&!ferrariOnScreen())drawWater(performance.now());wakeWater()},140)},{passive:true});
    addEventListener('scroll',function(){if(zoneTick)return;zoneTick=requestAnimationFrame(function(){zoneTick=0;syncZone()})},{passive:true});
    document.addEventListener('visibilitychange',wakeWater);
    syncZone();
    colors();size();frame(calm?4000:0);
    addEventListener('resize',function(){size();if(calm)frame(4000)});
    addEventListener('pointermove',function(e){tx=e.clientX/innerWidth;ty=1-e.clientY/innerHeight});
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){colors();if(calm)frame(4000)});
    new MutationObserver(function(){colors();if(calm)frame(4000)}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  }
}
}
var phone=matchMedia('(max-width:860px)').matches||matchMedia('(pointer: coarse)').matches;
if(!phone){
  if(window.requestIdleCallback)requestIdleCallback(startWater,{timeout:500});
  else requestAnimationFrame(startWater);
}
}
