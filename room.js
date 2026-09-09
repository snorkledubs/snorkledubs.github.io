import * as THREE from './vendor/three.module.js';

/* ---------- content (from data.js) ---------- */
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SAY=(typeof DIALOGUE!=='undefined')?DIALOGUE:{};
const card=(title,body)=>`<div class="card"><b>${esc(title)}</b><p>${body}</p></div>`;
const tags=(arr)=>`<div class="tags">${arr.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`;
const social=Object.entries(SITE.links||{}).filter(([,u])=>u);
const NAMES={github:'GitHub',linkedin:'LinkedIn',twitter:'Twitter / X',resume:'Resume'};
const pretty=(u)=>u.replace(/^https?:\/\//,'').replace(/\/$/,'');
const projHtml=(SITE.showProjects&&PROJECTS.length)
  ? PROJECTS.map(p=>card(p.title,`${esc(p.description)}${p.tags?.length?tags(p.tags):''}${[p.repo&&`<a href="${esc(p.repo)}" target="_blank" rel="noopener">code</a>`,p.demo&&`<a href="${esc(p.demo)}" target="_blank" rel="noopener">live</a>`].filter(Boolean).join(' · ')}`)).join('')
  : `<p class="todo">Nothing on display yet. The screens are warming up.</p>`;
const SECTIONS=[
 {id:'about',tv:'ABOUT',title:'About',say:SAY.about||[],html:ABOUT},
 {id:'skills',tv:'SKILLS',title:'Skills',say:SAY.skills||[],html:tags(SKILLS.flatMap(g=>g.items))+`<ul>${SKILLS.map(g=>`<li><b>${esc(g.group)}</b> — ${g.items.map(esc).join(', ')}</li>`).join('')}</ul>`},
 {id:'projects',tv:'PROJECTS',title:'Projects',say:SAY.projects||[],html:projHtml},
 {id:'experience',tv:'WORK',title:'Experience',say:SAY.experience||[],html:(typeof TIMELINE!=='undefined'?TIMELINE:[]).map(t=>card(`${t.title}${t.where?' · '+t.where:''}`,`${esc(t.when)} — ${esc(t.desc||'')}`)).join('')||'<p class="todo">Nothing here yet.</p>'},
 {id:'education',tv:'SCHOOL',title:'Education',say:SAY.education||[],html:(typeof EDUCATION!=='undefined'?EDUCATION:[]).map(e=>card(`${e.title}${e.where?' · '+e.where:''}`,`${esc(e.when||'')} — ${esc(e.desc||'')}`)).join('')||'<p class="todo">Nothing here yet.</p>'},
 {id:'hobbies',tv:'OFF HOURS',title:'Hobbies',say:SAY.hobbies||[],html:(typeof HOBBIES!=='undefined'?HOBBIES:'')},
 {id:'contact',tv:'CONTACT',title:'Contact',say:SAY.contact||[],html:`<ul>${SITE.email?`<li>Email — <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></li>`:''}${social.map(([k,u])=>`<li>${esc(NAMES[k]||k)} — <a href="${esc(u)}" target="_blank" rel="noopener">${esc(pretty(u))}</a></li>`).join('')}</ul>`},
];

/* ---------- avatar ---------- */
const STARC=['#15131a','#ece6d2','#c8262b','#e26fb5','#2f5fd8','#f2b632'];
const EYEC=['#141010','#3a2416','#3a6fd8','#2f8a5a','#8a2a3a','#f2b632'];
const SHIRTC=['#8a8a90','#ece6d2','#1b1b1f','#5a2233','#24463f','#2d3a7a'];
const DEF={name:(SITE.name||'AZAL').toUpperCase().slice(0,14),star:STARC[0],pts:5,sharp:0.42,face:'eye',eyeC:EYEC[0],shirt:SHIRTC[0],top:'tee',extras:[],voice:300};
let AV={...DEF,...JSON.parse(localStorage.getItem('azal.avatar.v9')||'{}')};
AV.skin=AV.star; // room-body hands take the star color
const save=()=>{AV.skin=AV.star;localStorage.setItem('azal.avatar.v9',JSON.stringify(AV))};
let mouthOpen=false;
function drawFace(cv,open){mouthOpen=!!open}
const face=document.getElementById('face'), prev=document.getElementById('prev');
const refreshAvatar=()=>{AV.skin=AV.star;if(window.buildHead)buildHead();applyBody();};
const $=id=>document.getElementById(id);
function swatches(el,list,key){el.innerHTML='';list.forEach(c=>{const b=document.createElement('button');b.style.background=c;if(AV[key]===c)b.classList.add('sel');b.onclick=()=>{AV[key]=c;save();refreshAvatar();swatches(el,list,key)};el.appendChild(b)})}
function seg(el,opts,key){el.innerHTML='';opts.forEach(([v,l])=>{const b=document.createElement('button');b.textContent=l;if(AV[key]===v)b.classList.add('sel');b.onclick=()=>{AV[key]=v;save();refreshAvatar();seg(el,opts,key)};el.appendChild(b)})}
function multi(el,opts,key){el.innerHTML='';opts.forEach(([v,l])=>{const b=document.createElement('button');b.textContent=l;if(AV[key].includes(v))b.classList.add('sel');b.onclick=()=>{AV[key]=AV[key].includes(v)?AV[key].filter(x=>x!==v):[...AV[key],v];save();refreshAvatar();multi(el,opts,key)};el.appendChild(b)})}
function buildCust(){
  swatches($('cStar'),STARC,'star');swatches($('cEye'),EYEC,'eyeC');swatches($('cShirt'),SHIRTC,'shirt');
  seg($('cFace'),[['eye','One eye'],['grin','Grin']],'face');
  seg($('cTop'),[['tee','Band tee'],['hoodie','Hoodie'],['sweater','Sweater']],'top');
  multi($('cGl'),[['hoops','Hoops'],['frames','Glasses'],['phones','Headphones'],['cap','Cap']],'extras');
  [['cPts','pts'],['cSharp','sharp']].forEach(([id,k])=>{$(id).value=AV[k];$(id).oninput=e=>{AV[k]=+e.target.value;save();refreshAvatar()}});
  $('cVoice').value=AV.voice; $('cVoice').oninput=e=>{AV.voice=+e.target.value;save();beep()};
  $('cName').value=AV.name; $('cName').oninput=e=>{AV.name=e.target.value.toUpperCase()||'AZAL';save()};
}
buildCust();
$('bCust').onclick=()=>{const on=$('cust').classList.toggle('on');document.body.style.cursor=on?'auto':'none'};

/* ---------- audio (Undertale-style voice) ---------- */
let AC=null, sound=true;
function beep(){
  if(!sound) return;
  AC=AC||new (window.AudioContext||window.webkitAudioContext)();
  const o=AC.createOscillator(), g=AC.createGain(), t=AC.currentTime;
  o.type='square'; o.frequency.setValueAtTime(AV.voice*(0.95+Math.random()*0.12),t);
  o.frequency.exponentialRampToValueAtTime(AV.voice*0.8,t+0.06);
  g.gain.setValueAtTime(0.06,t); g.gain.exponentialRampToValueAtTime(0.0001,t+0.07);
  o.connect(g).connect(AC.destination); o.start(t); o.stop(t+0.08);
}
sound=localStorage.getItem('azal.sound')!=='off';$('bSnd').textContent='Sound: '+(sound?'on':'off');
$('bSnd').onclick=()=>{sound=!sound;localStorage.setItem('azal.sound',sound?'on':'off');$('bSnd').textContent='Sound: '+(sound?'on':'off')};
function zap(){AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime;const b=AC.createBuffer(1,AC.sampleRate*0.12,AC.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
  const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=1800;f.Q.value=0.7;const g=AC.createGain();g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.12);s.connect(f).connect(g).connect(AC.destination);s.start(t)}
function blip(){AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type='square';o.frequency.setValueAtTime(1200,t);o.frequency.exponentialRampToValueAtTime(400,t+0.05);g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.06);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+0.07)}

/* ---------- dialogue ---------- */
const dlg=$('dlg'), txt=$('txt'), more=$('more');
let queue=[], typing=false, timer=null, mouthT=null, onDone=null;
function say(lines, done){queue=[...lines];onDone=done||null;dlg.classList.add('on');next()}
function next(){
  if(typing){clearTimeout(timer);typing=false;txt.textContent=cur;stopMouth();more.style.display='block';return}
  if(!queue.length){dlg.classList.remove('on');onDone&&onDone();return}
  cur=queue.shift(); let i=0; txt.textContent=''; typing=true; more.style.display='none';
  let open=false; mouthT=setInterval(()=>{open=!open;drawFace(face,open)},90);
  const step=()=>{ if(!typing) return; const ch=cur[i++]; txt.textContent+=ch; if(ch!==' '&&i%2)beep();
    if(i<cur.length) timer=setTimeout(step, /[.,!?]/.test(ch)?160:34); else {typing=false;stopMouth();more.style.display='block'} };
  step();
}
let cur='';
function stopMouth(){clearInterval(mouthT);drawFace(face,false)}
dlg.onclick=e=>{e.stopPropagation();next()};

/* ---------- panel ---------- */
const panel=$('panel'), pBody=$('pBody');
let active=null;
/* ---------- watch mode: the content plays ON the TV, a remote flips pages/channels ---------- */
const VW=512,VH=384;
const view=document.createElement('canvas');view.width=VW;view.height=VH;const vg=view.getContext('2d');
let viewTex=null; // created after THREE is set up (below)
const remote=$('remote');
const strip=(h)=>{const d=document.createElement('div');d.innerHTML=h;return (d.textContent||'').replace(/\s+/g,' ').trim()};
const paras=(h)=>String(h||'').split(/<\/p>|<br\s*\/?>|\n\s*\n/).map(strip).filter(Boolean);
function pagesFor(s){
  const P=[];const pg=(o)=>P.push(o);
  if(s.id==='about')paras(ABOUT).forEach(t=>pg({title:'ABOUT',text:t}));
  else if(s.id==='skills')SKILLS.forEach(g=>pg({title:g.group.toUpperCase(),text:g.items.join('  ·  ')}));
  else if(s.id==='projects'){
    if(SITE.showProjects&&PROJECTS.length)PROJECTS.forEach(p=>{
      pg({title:p.title.toUpperCase(),text:p.description||'',sub:(p.tags||[]).join(' · '),image:p.image,link:p.repo||p.demo,linkLabel:p.repo?'OPEN REPO':'OPEN DEMO'});
      (p.walkthrough||[]).forEach(w=>pg({title:(w.heading||p.title).toUpperCase(),text:strip(w.text||''),image:w.image,link:p.repo||p.demo,linkLabel:p.repo?'OPEN REPO':'OPEN DEMO'}));
    });
    else pg({title:'NO SIGNAL',text:'Nothing on air yet. Projects go live on this channel once they are ready to be seen.'});
  }
  else if(s.id==='experience')(typeof TIMELINE!=='undefined'?TIMELINE:[]).forEach(t=>pg({title:String(t.title).toUpperCase(),sub:[t.when,t.where].filter(Boolean).join(' · '),text:t.desc||''}));
  else if(s.id==='education')(typeof EDUCATION!=='undefined'?EDUCATION:[]).forEach(e=>pg({title:String(e.title).toUpperCase(),sub:[e.when,e.where].filter(Boolean).join(' · '),text:e.desc||''}));
  else if(s.id==='hobbies')paras(typeof HOBBIES!=='undefined'?HOBBIES:'').forEach(t=>pg({title:'OFF HOURS',text:t}));
  else if(s.id==='contact'){
    if(SITE.email)pg({title:'EMAIL',text:SITE.email,link:'mailto:'+SITE.email,linkLabel:'SEND MAIL'});
    social.forEach(([k,u])=>pg({title:(NAMES[k]||k).toUpperCase(),text:pretty(u),link:u,linkLabel:'OPEN'}));
  }
  if(!P.length)pg({title:s.title.toUpperCase(),text:'Nothing here yet.'});
  return paginate(P);
}
function wrap(g,text,maxW){const out=[];for(const para of String(text).split('\n')){let line='';for(const w of para.split(' ')){const t=line?line+' '+w:w;if(g.measureText(t).width>maxW&&line){out.push(line);line=w}else line=t}out.push(line)}return out}
// split long pages so nothing gets cut off on the screen
function paginate(P){
  const out=[];vg.font='26px VT323, monospace';
  P.forEach(p=>{const cap=p.image?4:(p.sub?9:10);const lines=wrap(vg,p.text,VW-48);
    if(lines.length<=cap){out.push(p);return}
    for(let i=0,n=1;i<lines.length;i+=cap,n++)out.push({...p,text:lines.slice(i,i+cap).join(' '),image:i?undefined:p.image,sub:i?undefined:p.sub,title:p.title+(i?' ('+n+')':'')})});
  return out;
}
const imgCache={};function img(src){if(!src)return null;if(!imgCache[src]){const i=new Image();i.onload=()=>{if(active)drawView()};i.src=src;imgCache[src]=i}return imgCache[src]}
let pages=[],page=0,watching=null,glitchT=null;
function drawView(){
  const p=pages[page];if(!p)return;const g=vg;
  g.fillStyle='#06170b';g.fillRect(0,0,VW,VH);
  g.textBaseline='top';g.textAlign='left';
  g.fillStyle='#8ef59a';g.font='16px "Press Start 2P", monospace';g.fillText(String(p.title).slice(0,26),24,22);
  let y=52;
  if(p.sub){g.fillStyle='#3f9a4d';g.font='20px VT323, monospace';g.fillText(String(p.sub).slice(0,60),24,y);y+=26}
  const im=img(p.image);
  if(im&&im.complete&&im.naturalWidth){const maxH=150,r=Math.min((VW-48)/im.naturalWidth,maxH/im.naturalHeight);const w=im.naturalWidth*r,h=im.naturalHeight*r;g.drawImage(im,24,y,w,h);y+=h+10}
  g.fillStyle='#c8ffd0';g.font='26px VT323, monospace';
  wrap(g,p.text,VW-48).forEach((l,i)=>g.fillText(l,24,y+i*28));
  g.fillStyle='#3f9a4d';g.font='11px "Press Start 2P", monospace';
  if(p.link)g.fillText('OK: '+(p.linkLabel||'OPEN'),24,VH-26);
  g.textAlign='right';g.fillText(`${page+1}/${pages.length}`,VW-24,VH-26);
  g.fillStyle='rgba(0,0,0,.28)';for(let yy=0;yy<VH;yy+=3)g.fillRect(0,yy,VW,1);
  g.fillStyle='rgba(255,255,255,.05)';g.fillRect(16,12,VW-32,18);
  if(viewTex)viewTex.needsUpdate=true;
}
// glitch blip: tear the current picture for a few frames, then show the next one
function glitchTo(then){
  clearTimeout(glitchT);const g=vg;let n=0;
  const step=()=>{
    const snap=g.getImageData(0,0,VW,VH);g.putImageData(snap,0,0);
    for(let i=0;i<10;i++){const y=Math.random()*VH|0,h=4+Math.random()*24|0,dx=(Math.random()*60-30)|0;g.drawImage(view,0,y,VW,h,dx,y,VW,h)}
    g.fillStyle='rgba(255,255,255,'+(0.25+Math.random()*0.5)+')';g.fillRect(0,Math.random()*VH|0,VW,2+Math.random()*3|0);
    for(let i=0;i<400;i++){g.fillStyle=Math.random()<.5?'#000':'#9ff5a8';g.fillRect(Math.random()*VW|0,Math.random()*VH|0,2,2)}
    if(viewTex)viewTex.needsUpdate=true;
    if(++n<5)glitchT=setTimeout(step,34);
    else{g.fillStyle='#06170b';g.fillRect(0,0,VW,VH);g.fillStyle='#c8ffd0';g.fillRect(0,VH/2-1,VW,2);if(viewTex)viewTex.needsUpdate=true;glitchT=setTimeout(()=>{then();if(sound)blip()},60)}
  };
  if(sound)zap();step();
}
function showScreen(sc){
  if(watching&&watching!==sc){watching.material.map=watching.userData.cold;watching.material.needsUpdate=true}
  watching=sc;sc.material.map=viewTex;sc.material.needsUpdate=true;setShell(sc,false);
}
function setPage(i){if(!pages.length)return;const n=((i%pages.length)+pages.length)%pages.length;if(n===page&&pages.length>1)return;glitchTo(()=>{page=n;drawView()})}
function openSection(s,viaRemote){
  active=s;document.body.style.cursor='auto';$('dot').style.opacity=0;if(document.pointerLockElement)document.exitPointerLock();
  pBody.innerHTML=`<h2>${s.title}</h2>${s.html}`;$('hint').style.opacity=0;
  const sc=screens.find(x=>x.userData.section===s);
  pages=pagesFor(s);page=0;
  if(viaRemote){glitchTo(()=>{showScreen(sc);drawView()})}else{showScreen(sc);drawView()}
  remote.hidden=false;
  say(s.say.map(l=>l.replace(/\{name\}/g,AV.name)));
}
function channel(dir){
  if(!active)return;const i=SECTIONS.indexOf(active);const s=SECTIONS[(i+dir+SECTIONS.length)%SECTIONS.length];
  const sc=screens.find(x=>x.userData.section===s);aimAt(sc,true);openSection(s,true);
}
function pressOK(){const p=pages[page];if(dlg.classList.contains('on')){next();return}if(p&&p.link)window.open(p.link,'_blank','noopener')}
function closeSection(){
  active=null;document.body.style.cursor='none';$('dot').style.opacity=.9;if(typeof showMode==='function'){showMode();povCursor()}
  panel.classList.remove('on');dlg.classList.remove('on');queue=[];clearTimeout(timer);typing=false;stopMouth();
  clearTimeout(glitchT);remote.hidden=true;
  if(watching){watching.material.map=watching.userData.cold;watching.material.needsUpdate=true;watching=null}
}
$('bClose').onclick=closeSection;
remote.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const r=b.dataset.r;
  if(r==='power')closeSection();else if(r==='next')setPage(page+1);else if(r==='prev')setPage(page-1);
  else if(r==='chup')channel(1);else if(r==='chdn')channel(-1);else if(r==='ok')pressOK();
  else if(r==='txt')panel.classList.toggle('on')});
addEventListener('keydown',e=>{
  if(e.key==='Escape')closeSection();
  if(!active){if(e.key==='Enter'||e.key===' ')if(dlg.classList.contains('on'))next();return}
  if(e.key==='ArrowRight'){e.preventDefault();setPage(page+1)}else if(e.key==='ArrowLeft'){e.preventDefault();setPage(page-1)}
  else if(e.key==='ArrowUp'){e.preventDefault();channel(-1)}else if(e.key==='ArrowDown'){e.preventDefault();channel(1)}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();pressOK()}
  else if(e.key==='t'||e.key==='T')panel.classList.toggle('on');
});

/* ---------- three.js ---------- */
const canvas=$('gl');
let renderer;try{renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance',logarithmicDepthBuffer:true})}catch(err){console.error('WebGL unavailable',err);document.getElementById('nogl').hidden=false;throw err}
renderer.setPixelRatio(1);
renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x0a0f1c);
scene.fog=new THREE.FogExp2(0x0a0f1c,0.05);
const camera=new THREE.PerspectiveCamera(62,1,0.2,120);
const EYE=new THREE.Vector3(0,1.18,1.7); camera.position.copy(EYE);

let IH=300, IW=400;
function resize(){const w=innerWidth,h=innerHeight;IH=300;IW=Math.round(IH*w/h);renderer.setSize(IW,IH,false);if(window.snapRes)snapRes.value.set(IW,IH);camera.aspect=w/h;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

// PS1 vertex snapping
const SNAP=`#include <project_vertex>
  vec2 grid=uSnapRes*0.5;
  gl_Position.xy = floor(gl_Position.xy/gl_Position.w*grid+0.5)/grid*gl_Position.w;`;
const snapRes={value:new THREE.Vector2(IW,IH)};window.snapRes=snapRes;
function snap(m){m.onBeforeCompile=s=>{s.uniforms.uSnapRes=snapRes;s.vertexShader='uniform vec2 uSnapRes;\n'+s.vertexShader.replace('#include <project_vertex>',SNAP)};return m}
const mat=(color,o={})=>snap(new THREE.MeshLambertMaterial({color,...o}));
const tmat=(map,o={})=>snap(new THREE.MeshLambertMaterial({map,...o}));

// canvas textures
function tex(w,h,fn,rep){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.colorSpace=THREE.SRGBColorSpace;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}
const rnd=(a,b)=>a+Math.random()*(b-a);
const noise=(g,w,h,n,a)=>{for(let i=0;i<n;i++){g.fillStyle=`rgba(${a},${a},${a},${rnd(.05,.25)})`;g.fillRect(rnd(0,w)|0,rnd(0,h)|0,rnd(1,3)|0,rnd(1,3)|0)}};
const T={
 wood:tex(64,64,(g,w,h)=>{g.fillStyle='#4a3424';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=16){g.fillStyle=['#5a4030','#523826','#63472f','#473020'][(y/16)%4];g.fillRect(0,y,w,15);g.fillStyle='#2a1a10';g.fillRect(0,y+15,w,1);g.fillRect(rnd(0,w)|0,y,1,15)}noise(g,w,h,120,0)},[4,3]),
 ceil:tex(64,64,(g,w,h)=>{for(let x=0;x<w;x+=8){g.fillStyle=x%16?'#4f5560':'#2e333b';g.fillRect(x,0,8,h)}g.fillStyle='#6b4d34';for(let i=0;i<14;i++)g.fillRect(rnd(0,w)|0,rnd(0,h)|0,rnd(2,8)|0,rnd(2,6)|0);noise(g,w,h,150,0)},[6,4]),
 wall:tex(64,64,(g,w,h)=>{g.fillStyle='#3a3238';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=8){for(let x=0;x<w;x+=16){g.fillStyle=Math.random()<.5?'#463a40':'#332a30';g.fillRect(x+((y/8)%2?8:0),y,15,7)}}noise(g,w,h,200,0);g.fillStyle='rgba(20,60,30,.35)';g.fillRect(0,h-20,w,20)},[5,2]),
 rug:tex(64,48,(g,w,h)=>{g.fillStyle='#5a1f26';g.fillRect(0,0,w,h);g.fillStyle='#8a3a30';g.fillRect(4,4,w-8,h-8);g.fillStyle='#5a1f26';g.fillRect(8,8,w-16,h-16);g.fillStyle='#c9a35a';for(let x=12;x<w-12;x+=8)for(let y=12;y<h-12;y+=8){g.fillRect(x,y,3,3);g.fillRect(x+4,y+4,2,2)}g.fillStyle='#2b3f5a';g.fillRect(w/2-6,h/2-6,12,12);noise(g,w,h,160,0)}),
 sky:tex(256,128,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#05070f');gr.addColorStop(1,'#1b2440');g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle='#fff';for(let i=0;i<140;i++)g.fillRect(rnd(0,w)|0,rnd(0,h*0.8)|0,1,1);g.fillStyle='#e9e6d8';g.beginPath();g.arc(200,26,9,0,7);g.fill();g.fillStyle='#b9b6a8';g.fillRect(197,24,3,3)}),
 speaker:tex(32,32,(g,w,h)=>{g.fillStyle='#161618';g.fillRect(0,0,w,h);g.fillStyle='#2a2a2e';for(let y=0;y<h;y+=2)g.fillRect(0,y,w,1);g.fillStyle='#0a0a0c';g.beginPath();g.arc(16,20,9,0,7);g.fill();g.fillStyle='#3a3a40';g.beginPath();g.arc(16,20,4,0,7);g.fill();g.fillStyle='#0a0a0c';g.beginPath();g.arc(16,7,4,0,7);g.fill()}),
 paper:tex(16,16,(g)=>{g.fillStyle='#d8d2bd';g.fillRect(0,0,16,16);g.fillStyle='#6a6a6a';for(let y=3;y<14;y+=3)g.fillRect(2,y,rnd(6,12)|0,1)}),
 cash:tex(16,8,(g)=>{g.fillStyle='#7a9a5a';g.fillRect(0,0,16,8);g.fillStyle='#4a6a3a';g.fillRect(1,1,14,6);g.fillStyle='#a9c98a';g.fillRect(6,2,4,4)}),
};
function screenTex(label,sub,hot){return tex(128,96,(g,w,h)=>{
  g.fillStyle=hot?'#0f3a1a':'#06170b';g.fillRect(0,0,w,h);
  g.fillStyle=hot?'#c8ffd0':'#7ff28f';g.font='bold 16px "Press Start 2P", monospace';g.textAlign='center';g.textBaseline='middle';
  g.fillText(label,w/2,h/2-6);g.font='16px VT323, monospace';g.fillStyle=hot?'#9fe8a8':'#3f9a4d';g.fillText(sub,w/2,h/2+18);
  g.fillStyle='rgba(0,0,0,.35)';for(let y=0;y<h;y+=2)g.fillRect(0,y,w,1);
  g.fillStyle='rgba(255,255,255,.08)';g.fillRect(6,6,w-12,10);
})}
function signTex(t,fg,bg){return tex(64,40,(g,w,h)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle=fg;g.fillRect(2,2,w-4,h-4);g.fillStyle=bg;g.font='bold 10px "Press Start 2P", monospace';g.textAlign='center';g.textBaseline='middle';const L=t.split('\n');L.forEach((l,i)=>g.fillText(l,w/2,h/2+(i-(L.length-1)/2)*12));noise(g,w,h,60,0)})}

const box=(w,h,d,m,x,y,z,name)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.name=name||'';scene.add(o);return o};

/* room */
const ROOM={w:8.5,d:7,h:3.1};
const floor=new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w,ROOM.d,17,14),tmat(T.wood));floor.rotation.x=-Math.PI/2;floor.position.z=-0.5;scene.add(floor);
const ceil=new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w,ROOM.d,17,14),tmat(T.ceil));ceil.rotation.x=Math.PI/2;ceil.position.set(0,ROOM.h,-0.5);scene.add(ceil);
const wallM=tmat(T.wall);
const wl=new THREE.Mesh(new THREE.PlaneGeometry(ROOM.d,ROOM.h,14,6),wallM);wl.rotation.y=Math.PI/2;wl.position.set(-ROOM.w/2,ROOM.h/2,-0.5);scene.add(wl);
const wr=wl.clone();wr.rotation.y=-Math.PI/2;wr.position.x=ROOM.w/2;scene.add(wr);
const wb=new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w,ROOM.h,17,6),wallM);wb.position.set(0,ROOM.h/2,3.0);wb.rotation.y=Math.PI;scene.add(wb);
// back: low wall + railing, open to sky
box(ROOM.w,1.0,0.2,wallM,0,0.5,-4.0);
const railM=mat(0x5a5a62);
box(ROOM.w,0.06,0.06,railM,0,1.55,-4.0);
for(let x=-4;x<=4;x+=1)box(0.05,0.55,0.05,railM,x,1.28,-4.0);
const rug=new THREE.Mesh(new THREE.PlaneGeometry(5.2,4.4,13,11),tmat(T.rug));rug.rotation.x=-Math.PI/2;rug.position.set(0,0.02,-0.4);
// rug has real thickness so it never shares a plane with the floor
const rugEdge=new THREE.Mesh(new THREE.BoxGeometry(5.2,0.02,4.4),mat(0x4a1a20));rugEdge.position.set(0,0.01,-0.4);scene.add(rugEdge);scene.add(rug);

/* outside */
const sky=new THREE.Mesh(new THREE.PlaneGeometry(160,80),new THREE.MeshBasicMaterial({map:T.sky,fog:false}));sky.position.set(0,20,-60);scene.add(sky);
const towerM=mat(0x121827);const winM=new THREE.MeshBasicMaterial({color:0xd9c27a,fog:true});
[[-9,-16,2.2,9],[5,-20,3,12],[-3,-26,4,7],[12,-24,2.5,10],[-15,-22,3.5,6]].forEach(([x,z,w,h])=>{box(w,h,w,towerM,x,h/2-2,z);for(let i=0;i<5;i++){const wn=box(0.35,0.5,0.05,winM,x+rnd(-w/2+.3,w/2-.3),rnd(0.5,h-3),z+w/2+0.03);}
  box(0.3,h+3,0.3,towerM,x-w/2-0.5,(h+3)/2-2,z-1);});
// hanging lamp
const lampM=mat(0x8a7a5a);box(0.02,1.1,0.02,railM,2.5,2.55,-0.6);
const shade=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.34,0.26,10,1,true),snap(new THREE.MeshLambertMaterial({color:0x2f3a3f,side:THREE.DoubleSide})));shade.position.set(2.5,1.98,-0.6);scene.add(shade);
const bulb=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,6),new THREE.MeshBasicMaterial({color:0xffe2a8}));bulb.position.set(2.5,1.93,-0.6);scene.add(bulb);

/* lights */
scene.add(new THREE.AmbientLight(0x2a3450,1.6));
const lamp=new THREE.PointLight(0xffb86a,14,10,2);lamp.position.set(2.5,1.9,-0.6);scene.add(lamp);
const glow=new THREE.PointLight(0x5cff86,6,7,2);glow.position.set(0,1.2,-1.6);scene.add(glow);
const hoverLight=new THREE.PointLight(0x5cff86,0,4,2);scene.add(hoverLight);
const moon=new THREE.DirectionalLight(0x6f8fc9,0.9);moon.position.set(-2,4,-8);scene.add(moon);

/* desk + tvs */
const deskM=tmat(T.wood);
box(4.8,0.07,0.95,deskM,0,0.78,-2.05);
[[-2.3,-2.45],[2.3,-2.45],[-2.3,-1.65],[2.3,-1.65]].forEach(([x,z])=>box(0.08,0.75,0.08,mat(0x2b1c12),x,0.375,z));
box(4.4,0.05,0.5,deskM,0,1.75,-2.35);
[[-1.9],[0],[1.9]].forEach(([x])=>box(0.06,0.5,0.4,mat(0x2b1c12),x,1.5,-2.4));
const plastic=mat(0x2c2c31), plastic2=mat(0x3a3733), plastic3=mat(0x25282e);
const screens=[];
function makeTV(s,w,h,d,x,y,z,bodyM){
  const g=new THREE.Group();g.position.set(x,y,z);
  const body=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),bodyM);body.name='tv_'+s.id;g.add(body);
  const back=new THREE.Mesh(new THREE.BoxGeometry(w*.7,h*.7,d*.35),bodyM);back.position.z=-d/2-d*.17;g.add(back);
  const bezel=new THREE.Mesh(new THREE.BoxGeometry(w*.86,h*.8,0.02),mat(0x0d0d10));bezel.position.set(0,h*.06,d/2+0.005);g.add(bezel);
  const cold=screenTex(s.tv,s.title.toUpperCase(),false),hot=screenTex(s.tv,'> OPEN',true);
  const sm=new THREE.MeshBasicMaterial({map:cold,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  const sc=new THREE.Mesh(new THREE.PlaneGeometry(w*.78,h*.7),sm);sc.position.set(0,h*.06,d/2+0.02);sc.userData={section:s,cold,hot};sc.name='screen_'+s.id;g.add(sc);screens.push(sc);
  // knobs
  const kn=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.02,8),mat(0x777));kn.rotation.x=Math.PI/2;kn.position.set(w*.36,-h*.38,d/2+0.01);g.add(kn);
  const kn2=kn.clone();kn2.position.x=w*.28;g.add(kn2);
  g.rotation.y=rnd(-0.08,0.08);
  scene.add(g);return g;
}
const S=Object.fromEntries(SECTIONS.map(s=>[s.id,s]));
makeTV(S.about,   0.95,0.78,0.7,-1.75,0.815+0.39,-2.1,plastic);
makeTV(S.projects,1.15,0.9,0.8,-0.5,0.815+0.45,-2.05,plastic2);
makeTV(S.skills,  0.95,0.78,0.7, 0.75,0.815+0.39,-2.1,plastic3);
makeTV(S.contact, 0.8,0.66,0.6, 1.8,0.815+0.33,-2.15,plastic);
makeTV(S.experience,0.85,0.7,0.6,-1.2,1.775+0.35,-2.4,plastic2);
makeTV(S.education,0.85,0.7,0.6, 0.15,1.775+0.35,-2.4,plastic);
makeTV(S.hobbies, 0.75,0.62,0.55,1.35,1.775+0.31,-2.45,plastic3);

/* speakers */
const spM=tmat(T.speaker);
box(0.5,1.45,0.45,spM,-3.1,0.725,-2.1);box(0.5,1.45,0.45,spM,3.1,0.725,-2.1);
box(0.36,0.5,0.35,spM,-3.1,1.7,-2.1);

/* cables */
const cabM=mat(0x1a1a1e);
[[[-4.2,2.4,-3.9],[-1.5,2.0,-2.5],[2.5,2.9,-0.6]],[[4.2,2.6,-3.9],[2.6,2.15,-2.2],[2.5,2.95,-0.6]],[[-4.2,2.9,1.0],[0,2.5,-1.5],[4.2,2.8,-3.5]]].forEach(p=>{
  const c=new THREE.CatmullRomCurve3(p.map(v=>new THREE.Vector3(...v)));scene.add(new THREE.Mesh(new THREE.TubeGeometry(c,16,0.018,5),cabM))});

/* signs on a pole */
box(0.08,3.0,0.08,railM,3.3,1.5,-3.6);
[[signTex('NO\nSIGNAL','#e2b23c','#1a1a1a'),1.45,0.3],[signTex('STAY\nSEATED','#e6e2d6','#a3231f'),2.05,-0.2],[signTex('CCTV','#d9d9d9','#1f2a5a'),2.55,0.15]].forEach(([t,y,ry])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.4,0.03),[plastic,plastic,plastic,plastic,tmat(t),plastic]);m.position.set(3.3,y,-3.55);m.rotation.y=ry;scene.add(m)});

/* clutter */
for(let i=0;i<14;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(0.22,0.28),tmat(i%3?T.paper:T.cash,{side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4}));p.rotation.set(-Math.PI/2,0,rnd(0,6.3));p.position.set(rnd(-3,3),0.045+i*0.002,rnd(-1.4,1.6));scene.add(p)}
for(let i=0;i<4;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.14,8),mat([0xc84030,0x3060c0,0xd0d0d0,0x30a050][i]));c.position.set(rnd(-2.5,2.5),0.07,rnd(-1.2,1.4));c.rotation.z=i%2?Math.PI/2:0;if(i%2)c.position.y=0.045;scene.add(c)}
/* coffee + pills */
const pillGroup=[];
const mugM=mat(0xe0d8c8),coffeeM=new THREE.MeshBasicMaterial({color:0x2a1608});
function mug(x,y,z,ry,full){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;
  const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.052,0.13,10,1,true),snap(new THREE.MeshLambertMaterial({color:0xe0d8c8,side:THREE.DoubleSide})));g.add(cup);
  const bottom=new THREE.Mesh(new THREE.CircleGeometry(0.052,10),mugM);bottom.rotation.x=Math.PI/2;bottom.position.y=-0.064;g.add(bottom);
  const cof=new THREE.Mesh(new THREE.CircleGeometry(0.057,10),coffeeM);cof.rotation.x=-Math.PI/2;cof.position.y=full?0.045:-0.03;g.add(cof);
  const hd=new THREE.Mesh(new THREE.TorusGeometry(0.035,0.01,4,8,Math.PI),mugM);hd.position.set(0.065,0,0);hd.rotation.z=-Math.PI/2;g.add(hd);
  scene.add(g);return g}
mug(2.15,0.88,-1.75,0.4,true);mug(-2.3,0.88,-1.7,-1.2,false);mug(-0.15,0.88,-1.62,2.0,false);
mug(2.55,0.085,0.9,1.1,false); // one on the floor
// stacked paper cups
for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.035,0.1,8,1,true),snap(new THREE.MeshLambertMaterial({color:0xd9d4c6,side:THREE.DoubleSide})));c.position.set(1.05+i*0.02,0.87+i*0.035,-1.68);scene.add(c)}
// orange pill bottles
const amberM=snap(new THREE.MeshLambertMaterial({color:0xf08a20,emissive:0x6a3000,emissiveIntensity:0.5,transparent:true,opacity:0.9}));const capM=mat(0xf2f2ee);
const labelT=tex(32,16,(g)=>{g.fillStyle='#f4f1e8';g.fillRect(0,0,32,16);g.fillStyle='#333';for(let y=3;y<13;y+=3)g.fillRect(3,y,rnd(12,24)|0,1);g.fillStyle='#c0392b';g.fillRect(3,1,8,1)});
function bottle(x,y,z,tipped){const g=new THREE.Group();g.position.set(x,y,z);
  const b=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035,0.11,10),amberM);g.add(b);
  const lb=new THREE.Mesh(new THREE.CylinderGeometry(0.036,0.036,0.06,10,1,true),snap(new THREE.MeshLambertMaterial({map:labelT,side:THREE.DoubleSide})));lb.position.y=-0.005;g.add(lb);
  const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.037,0.037,0.025,10),capM);cap.position.y=0.067;g.add(cap);
  if(tipped){g.rotation.z=Math.PI/2;g.rotation.y=rnd(0,6.3);g.position.y=y-0.02}else g.rotation.y=rnd(0,6.3);
  const sh=new THREE.Mesh(new THREE.CylinderGeometry(0.042,0.042,0.15,10),new THREE.MeshBasicMaterial({color:0x2a7a3e,transparent:true,opacity:0.2,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide}));sh.position.y=0.01;g.add(sh);
  scene.add(g);return g}
bottle(0.35,0.87,-1.65,false);bottle(0.45,0.87,-1.72,false);bottle(-1.05,0.87,-1.62,true);bottle(1.6,0.87,-1.6,false);
bottle(2.2,0.06,-0.4,true);bottle(-2.9,0.07,0.6,false);
// little orange football pills with an A
const pillT=tex(16,8,(g)=>{g.fillStyle='#f28c28';g.fillRect(0,0,16,8);g.fillStyle='#c96a10';g.fillRect(0,6,16,2);g.fillStyle='#7a3a05';g.fillRect(7,1,2,6);g.fillRect(6,2,1,4);g.fillRect(9,2,1,4);g.fillRect(6,4,4,1)});
const pillM=snap(new THREE.MeshLambertMaterial({map:pillT,emissive:0x5a2a00,emissiveIntensity:0.6}));
const pillGeo=new THREE.SphereGeometry(0.022,8,6);pillGeo.scale(1.6,0.7,1);
function pill(x,y,z){const p=new THREE.Mesh(pillGeo,pillM);p.position.set(x,y,z);p.rotation.set(rnd(-0.3,0.3),rnd(0,6.3),rnd(-0.3,0.3));scene.add(p);pillGroup.push(p);return p}
// spilled around the tipped bottle on the desk and on the floor
for(let i=0;i<9;i++)pill(-1.05+rnd(-0.25,0.15),0.826,-1.62+rnd(-0.15,0.2));
for(let i=0;i<4;i++)pill(0.4+rnd(-0.1,0.15),0.826,-1.7+rnd(-0.08,0.12));
// spilled across the rug under the desk, trailing out toward the chair
for(let i=0;i<14;i++)pill(-0.9+rnd(-0.5,1.6),0.036,-1.5+rnd(-0.3,0.55));
for(let i=0;i<6;i++)pill(-0.4+rnd(-0.4,0.6),0.036,-0.7+rnd(-0.2,0.3));
bottle(-0.35,0.06,-1.25,true);
// invisible hitboxes over the pill clusters for gaze detection
const pillZones=[[-1.1,0.83,-1.6,0.5],[-0.2,0.02,-1.3,1.1],[0.42,0.83,-1.68,0.3],[-0.3,0.02,-0.65,0.6]].map(([x,y,z,r])=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,6,4),new THREE.MeshBasicMaterial({visible:false}));m.position.set(x,y,z);scene.add(m);return m});

/* the seated body (POV) */
const chairM=mat(0x2a2320);
const armL=box(0.12,0.08,0.7,chairM,-0.36,0.74,1.65,'armrest');const armR=box(0.12,0.08,0.7,chairM,0.36,0.74,1.65,'armrest');
box(0.7,0.05,0.04,mat(0x3a2a1a),0,0.72,1.25,'strap'); // lap strap
const bodyParts={};
function applyBody(){
  const skin=new THREE.Color(AV.skin),shirt=new THREE.Color(AV.shirt);
  const pants=new THREE.Color(AV.shirt).multiplyScalar(0.55);
  if(!bodyParts.built){
    bodyParts.skinM=mat(skin);bodyParts.shirtM=mat(shirt);bodyParts.pantsM=mat(pants);
    [-1,1].forEach(s=>{
      box(0.17,0.16,0.62,bodyParts.pantsM,s*0.17,0.62,1.35,'thigh');
      box(0.15,0.55,0.15,bodyParts.pantsM,s*0.17,0.30,1.05,'shin');
      box(0.16,0.08,0.28,mat(0x151515),s*0.17,0.04,0.97,'shoe');
      box(0.11,0.11,0.5,bodyParts.shirtM,s*0.36,0.83,1.75,'forearm');
      box(0.11,0.07,0.16,bodyParts.skinM,s*0.36,0.81,1.45,'hand');
      // straps around wrists
      box(0.15,0.03,0.04,mat(0x3a2a1a),s*0.36,0.86,1.5,'wriststrap');
    });
    box(0.44,0.3,0.24,bodyParts.shirtM,0,0.9,1.78,'torso');
    bodyParts.built=true;
  } else {bodyParts.skinM.color.copy(skin);bodyParts.shirtM.color.copy(shirt);bodyParts.pantsM.color.copy(pants)}
}
/* ---------- PS1 star head (dialogue portrait) ---------- */
const headCanvas=document.createElement('canvas');headCanvas.width=headCanvas.height=200;
const hr=new THREE.WebGLRenderer({canvas:headCanvas,antialias:false,alpha:true});hr.setPixelRatio(1);hr.setSize(200,200,false);hr.outputColorSpace=THREE.SRGBColorSpace;
const hs=new THREE.Scene();
const hc=new THREE.PerspectiveCamera(30,1,0.1,20);hc.position.set(0.25,-0.15,4.7);hc.lookAt(0,-0.5,0);
hs.add(new THREE.HemisphereLight(0xb8c0d8,0x4a3a40,2.2));
const hk=new THREE.DirectionalLight(0xffd8b0,3.2);hk.position.set(-3,4,5);hs.add(hk);
const hfill=new THREE.DirectionalLight(0xffe8d0,1.6);hfill.position.set(2,0.5,6);hs.add(hfill);
const hg=new THREE.PointLight(0x5cff86,3,6,2);hg.position.set(-2,-0.5,2);hs.add(hg);
const HS=`#include <project_vertex>
  vec2 hgrid=vec2(150.0,150.0);
  gl_Position.xy = floor(gl_Position.xy/gl_Position.w*hgrid)/hgrid*gl_Position.w;`;
const hmat=(o)=>{const m=new THREE.MeshLambertMaterial(o);m.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <project_vertex>',HS)};return m};
const _rand=Math.random;
// face painted on the star's front cap. 64px, flat tones, ink outline like a marker drawing
// face painted on the star's front cap: 128px over a 2.9-unit span (≈44px per unit)
const SPAN=2.9,FT=128;const U=(x)=>Math.round((x/SPAN+0.5)*FT),V=(y)=>Math.round((0.5-y/SPAN)*FT);
function faceTex(open,blink){return tex(FT,FT,(g)=>{g.imageSmoothingEnabled=false;
  const base=new THREE.Color(AV.star);const dark=base.getHSL({}).l<0.4;const bc='#'+base.getHexString();
  const ink=dark?'#f2eee4':'#15100f';const iris=AV.eyeC;
  const px=(c,x,y,w=1,hh=1)=>{g.fillStyle=c;g.fillRect(x,y,w,hh)};
  px(bc,0,0,FT,FT);
  if(AV.face==='eye'){
    // one eye, centred, a touch above the middle; 0.5 wide × 0.26 tall
    const cx=U(0),cy=V(-0.02),w=26,hh=18,x=cx-w/2,y=cy-hh/2;
    if(blink){px(ink,x,cy-1,w,2)}else{
      px(ink,x,y,w,hh); px(ink,x-2,y+3,2,hh-6); px(ink,x+w,y+3,2,hh-6);
      px(bc,x,y,w,3); px(bc,x-2,y+3,2,1); px(bc,x+w,y+3,2,1);         // heavy lid
      px(iris,cx-6,y+4,12,hh-5); px('#000',cx-3,y+6,6,hh-8);           // iris, black pupil
      px('#fff',cx-5,y+5,2,2)}
    // no mouth: a censor block lives here (drawn in the post pass)
  }else{
    const cy=V(0.25);[-0.32,0.32].forEach(ox=>{const x=U(ox);px(ink,x-8,cy-1,16,3);px(ink,x-10,cy-3,3,2);px(ink,x+8,cy-3,3,2)});
    const gy=V(-0.05),gh=14;px(ink,U(-0.7),gy,U(0.7)-U(-0.7),gh);px(dark?'#15131a':'#f4f2ea',U(-0.66),gy+3,U(0.66)-U(-0.66),gh-6);
    for(let i=1;i<8;i++)px(ink,U(-0.66)+i*((U(0.66)-U(-0.66))/8|0),gy+3,1,gh-6);px(ink,U(-0.66),gy+3+((gh-6)/2|0),U(0.66)-U(-0.66),1);
  }
})}
let head=null,texClosed,texOpen,texBlink,faceMat,fig=null,starR=1.1;
// a clean regular star; sharp = inner radius ratio; a hair of jitter so it isn't clip-art
function starShape(n,inner,seed){let s=seed;const rnd=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};
  // hand-drawn star: uneven point lengths, tilted, each point leans a little
  const sh=new THREE.Shape();const tilt=-0.22;for(let i=0;i<n*2;i++){const a=(i/(n*2))*Math.PI*2+Math.PI/2+tilt+(rnd()-0.5)*0.28;
    const r=starR*(i%2===0?0.82+rnd()*0.42:inner*(0.8+rnd()*0.35));const x=Math.cos(a)*r,y=Math.sin(a)*r;
    i?sh.lineTo(x,y):sh.moveTo(x,y)}sh.closePath();return sh}
window.buildHead=function(){
  if(fig)hs.remove(fig);
  fig=new THREE.Group();head=new THREE.Group();fig.add(head);
  texClosed=faceTex(false);texOpen=faceTex(true);texBlink=faceTex(false,true);
  [texClosed,texOpen,texBlink].forEach(t=>{t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;t.repeat.set(1/SPAN,1/SPAN);t.offset.set(0.5,0.5)});
  const starC=new THREE.Color(AV.star);
  const starM=hmat({color:starC}),edgeM=hmat({color:starC.clone().offsetHSL(0,0,starC.getHSL({}).l<0.4?0.08:-0.12)}),dark=hmat({color:0x111111}),metal=hmat({color:0xd8d8e2}),metalD=hmat({color:0x9a9aa6});
  const shirt=hmat({color:AV.shirt}),shirtL=hmat({color:new THREE.Color(AV.shirt).offsetHSL(0,0,0.14)});
  faceMat=starM;
  const shape=starShape(AV.pts,AV.sharp,AV.pts*13+Math.round(AV.sharp*100));
  const geo=new THREE.ExtrudeGeometry(shape,{depth:0.2,bevelEnabled:true,bevelThickness:0.02,bevelSize:0.02,bevelSegments:1});
  geo.translate(0,0,-0.1);
  const star=new THREE.Mesh(geo,[starM,edgeM]);star.name='star';head.add(star);
  // face as geometry: quads at z just above the cap
  const inkC=starC.getHSL({}).l<0.4?0xf2eee4:0x15100f;const inkM=hmat({color:inkC}),irisM=hmat({color:AV.eyeC}),pupM=hmat({color:0x000000}),glintM=hmat({color:0xffffff});
  const quad=(w,hgt,x,y,z,m,name)=>{const q=new THREE.Mesh(new THREE.PlaneGeometry(w,hgt),m);q.position.set(x,y,z);q.name=name||'';head.add(q);return q};
  const Z=0.125;
  window.__eye=[];
  if(AV.face==='eye'){
    const ey=-0.05;
    __eye.push(quad(0.56,0.3,0,ey,Z,inkM,'eyewhite'));                 // eye shape
    quad(0.6,0.07,0,ey+0.13,Z+0.002,starM,'lid');                      // heavy lid cuts the top
    __eye.push(quad(0.24,0.22,0.02,ey-0.02,Z+0.003,irisM,'iris'));
    __eye.push(quad(0.12,0.14,0.02,ey-0.03,Z+0.005,pupM,'pupil'));
    __eye.push(quad(0.05,0.05,-0.04,ey+0.03,Z+0.007,glintM,'glint'));
    window.__blinkQuad=quad(0.56,0.05,0,ey,Z+0.01,inkM,'blink');__blinkQuad.visible=false;
    // eye bags: two sagging lines under the eye, in a muted ink
    const bagM=hmat({color:starC.getHSL({}).l<0.4?0x8a8690:0x5a3a44});
    quad(0.5,0.025,0.01,ey-0.19,Z+0.002,bagM,'bag1');quad(0.36,0.02,0.03,ey-0.24,Z+0.002,bagM,'bag2');
    [-1,1].forEach(s=>quad(0.03,0.05,s*0.25,ey-0.17,Z+0.002,bagM));
  }else{
    // ==== semi-troll face: squinty angry brows + wide curled grin, all animated ====
    const brows=window.__brows=[];
    const eyeY=0.22;
    [-0.24,0.24].forEach(ox=>{
      const inward=ox<0?1:-1;
      // three-stub brow angled down toward the nose
      for(let k=0;k<3;k++){
        const bx=ox+(k-1)*0.075;
        const by=eyeY+0.11-(k*inward)*0.025;
        const b=quad(0.078,0.032,bx,by,Z,inkM,'brow');
        brows.push({mesh:b,bx,by,side:inward,k});
      }
      // squinty slit
      const slit=quad(0.22,0.035,ox,eyeY,Z+0.001,inkM,'slit');
      brows.push({mesh:slit,bx:ox,by:eyeY,side:inward,k:-1});
      // pupil gleam
      quad(0.04,0.03,ox+inward*-0.04,eyeY,Z+0.004,starM,'gleam');
    });
    // grin as a chain of segments; right-side curl for the troll smirk
    const inkC2=starC.getHSL({}).l<0.4?0xf4f2ea:0x15131a;
    const toothM=hmat({color:inkC2});
    const segs=window.__grinSegs=[], teeth=window.__grinTeeth=[], divs=window.__grinDivs=[];
    const N=18, GW=1.05, GY=-0.16, sw=GW/N;
    for(let i=0;i<N;i++){
      const t=i/(N-1), x=-GW/2+sw/2+t*GW;
      segs.push({mesh:quad(sw*1.2,0.14,x,GY,Z+0.0005,inkM,'grin'),t,x});
      teeth.push({mesh:quad(sw*0.95,0.07,x,GY,Z+0.003,toothM,'tooth'),t,x});
    }
    for(let i=1;i<8;i++){
      const t=i/8, x=-GW/2+t*GW;
      divs.push({mesh:quad(0.018,0.07,x,GY,Z+0.005,inkM,'div'),t,x});
    }
    window.__grinBase={GY,GW};
  }
  const back=new THREE.Mesh(new THREE.ShapeGeometry(shape),starM);back.position.z=-0.125;back.rotation.y=Math.PI;head.add(back);
  // point tips (outer vertices)
  const allPts=shape.getPoints(1);const tips=allPts.filter((p,i)=>i%2===0&&i<AV.pts*2).map(p=>new THREE.Vector2(p.x,p.y));
  const byAngle=(fn)=>tips.slice().sort(fn);
  const upperLeft=byAngle((a,b)=>(b.y-b.x)-(a.y-a.x))[0];          // most up-and-left point → eyebrow
  const left=tips.filter(p=>p.x<0).sort((a,b)=>b.y-a.y),right=tips.filter(p=>p.x>0).sort((a,b)=>b.y-a.y);
  const ears=[left[Math.min(1,left.length-1)],right[Math.min(1,right.length-1)]].filter(Boolean); // second-from-top on each side
  const studM=starC.getHSL({}).l<0.4?metalD:dark;
  // ear studs on the front face near the tips, both sides
  ears.forEach(p=>{const st=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.08,0.06),studM);st.position.set(p.x*0.8,p.y*0.8,0.13);head.add(st)});
  // eyebrow barbell: a bar pierced THROUGH the upper-left point (perpendicular to the point, balls poking out both sides)
  {const d=upperLeft.clone().normalize();const n=new THREE.Vector2(-d.y,d.x);const at=upperLeft.clone().multiplyScalar(0.72);
    const bar=new THREE.Mesh(new THREE.CylinderGeometry(0.028,0.028,0.7,6),metalD);bar.position.set(at.x,at.y,0);bar.rotation.z=Math.atan2(n.y,n.x)+Math.PI/2;head.add(bar);
    [-1,1].forEach(sg=>{const ball=new THREE.Mesh(new THREE.SphereGeometry(0.07,6,5),metal);ball.position.set(at.x+n.x*0.35*sg,at.y+n.y*0.35*sg,0);head.add(ball)})}
  // septum ring right under the eye

  const ex=AV.extras||[];
  if(ex.includes('hoops'))ears.forEach(p=>{const r=new THREE.Mesh(new THREE.TorusGeometry(0.11,0.015,6,12),metal);r.position.set(p.x*0.98,p.y*0.98-0.1,0);r.rotation.y=Math.PI/2;head.add(r)});
  if(ex.includes('frames')){if(AV.face==='eye'){const r=new THREE.Mesh(new THREE.TorusGeometry(0.4,0.03,6,16),dark);r.position.set(0,-0.05,0.14);head.add(r)}else{[-0.32,0.32].forEach(x=>{const r=new THREE.Mesh(new THREE.TorusGeometry(0.24,0.03,6,16),dark);r.position.set(x,0.25,0.2);head.add(r)});const br=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.04,0.04),dark);br.position.set(0,0.25,0.2);head.add(br)}}
  if(ex.includes('phones')){const pm=hmat({color:0xd8d4cc}),pd=hmat({color:0x2a2a2e});const band=new THREE.Mesh(new THREE.TorusGeometry(1.05,0.05,4,12,Math.PI),pm);head.add(band);
    [-1,1].forEach(sg=>{const cup=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.16,8),pm);cup.rotation.z=Math.PI/2;cup.position.set(sg*1.02,0,0);head.add(cup);const pad=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,0.06,8),pd);pad.rotation.z=Math.PI/2;pad.position.set(sg*0.92,0,0);head.add(pad)})}
  if(ex.includes('cap')){const capC=hmat({color:0xc46a7a});const cr=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.26,0.5),capC);cr.position.set(0,1.32,0);head.add(cr);const bill=new THREE.Mesh(new THREE.BoxGeometry(0.85,0.06,0.45),capC);bill.position.set(0,1.2,0.42);bill.rotation.x=0.18;head.add(bill)}
  // neck + body
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.2,1.0,6),starM);neck.position.y=-1.05;fig.add(neck);
  const torso=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.5,0.55),shirt);torso.position.y=-2.0;torso.name='torso';fig.add(torso);
  // cuban chain — always on
  {const chainM=hmat({color:0xf0f0f6,emissive:0x303038}),chainD=hmat({color:0xb8b8c4});
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2;const front=Math.max(0,Math.sin(a));const y=-1.2-front*0.42;const r=0.26+front*0.2;
    const l=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.09,0.07),i%2?chainM:chainD);l.position.set(Math.cos(a)*r,y,Math.sin(a)*(0.26+front*0.14)+front*0.1);l.lookAt(0,y,0);l.rotation.z+=i%2?0.5:-0.5;fig.add(l)}}
  if(AV.top!=='tee'){const inner=new THREE.Mesh(new THREE.BoxGeometry(0.34,1.4,0.06),AV.top==='hoodie'?shirtL:hmat({color:0xd8d4cc}));inner.position.set(0,-1.98,0.28);fig.add(inner)}
  else{const print=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.5,0.03),hmat({map:tex(16,16,(g)=>{g.fillStyle=AV.shirt;g.fillRect(0,0,16,16);g.fillStyle='#c8c2b0';g.fillRect(3,3,10,1);g.fillRect(3,6,10,1);g.fillRect(3,9,10,1);g.fillRect(5,12,6,1);g.fillStyle='#8a4a6a';g.fillRect(6,4,4,2)})}));print.position.set(0,-1.95,0.28);fig.add(print);
    const collar=new THREE.Mesh(new THREE.TorusGeometry(0.28,0.05,4,10),shirtL);collar.rotation.x=Math.PI/2;collar.position.y=-1.26;fig.add(collar)}
  if(AV.top==='hoodie'){const hood=new THREE.Mesh(new THREE.BoxGeometry(1.15,0.5,0.45),shirt);hood.position.set(0,-1.2,-0.45);hood.rotation.x=0.4;fig.add(hood);
    const str=hmat({color:0xd8d4cc});[-1,1].forEach(s=>{const c=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.55,0.04),str);c.position.set(s*0.22,-1.6,0.31);fig.add(c)})}
  else if(AV.top==='sweater'){[-1,1].forEach(s=>{const c=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.3,0.08),shirtL);c.position.set(s*0.28,-1.28,0.26);c.rotation.z=s*0.6;c.rotation.x=-0.25;fig.add(c)})}
  [-1,1].forEach(s=>{const tee=AV.top==='tee';
    const sleeve=new THREE.Mesh(new THREE.BoxGeometry(0.32,tee?0.55:1.45,0.34),shirt);sleeve.position.set(s*0.72,tee?-1.55:-2.05,0);sleeve.rotation.z=s*0.06;fig.add(sleeve);
    if(tee){const arm=new THREE.Mesh(new THREE.BoxGeometry(0.26,0.95,0.28),starM);arm.position.set(s*0.74,-2.3,0);fig.add(arm)}
    const hand=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.28,0.24),starM);hand.position.set(s*0.78,-2.9,0);fig.add(hand);
    const leg=new THREE.Mesh(new THREE.BoxGeometry(0.42,1.7,0.46),hmat({color:0x1a1a20}));leg.position.set(s*0.28,-3.6,0);fig.add(leg);
    const shoe=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.26,0.62),dark);shoe.position.set(s*0.28,-4.52,0.1);fig.add(shoe);
    const sole=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.08,0.64),hmat({color:0xd8d4cc}));sole.position.set(s*0.28,-4.63,0.1);fig.add(sole)});
  const belt=new THREE.Mesh(new THREE.BoxGeometry(1.12,0.12,0.57),dark);belt.position.y=-2.75;fig.add(belt);
  hs.add(fig);
};
buildHead();
const bodyCanvas=document.createElement('canvas');bodyCanvas.width=144;bodyCanvas.height=240;
const br2=new THREE.WebGLRenderer({canvas:bodyCanvas,antialias:false,alpha:true});br2.setPixelRatio(1);br2.setSize(144,240,false);br2.outputColorSpace=THREE.SRGBColorSpace;
const fc=new THREE.PerspectiveCamera(28,144/240,0.1,30);fc.position.set(0,-1.7,12);fc.lookAt(0,-2.0,0);
const faceCtx=face.getContext('2d',{willReadFrequently:true}),prevCtx=prev.getContext('2d');
function renderHead(t){
  if(!fig)return;
  if(!dlg.classList.contains('on')&&!$('cust').classList.contains('on'))return; // nothing shows the head right nowt=performance.now()/1000;
  const blink=AV.face==='eye'&&((t%5.1)<0.1);
  if(window.__blinkQuad){__blinkQuad.visible=blink;__eye.forEach(q=>q.visible=!blink)}
  // dynamic troll grin: baseline dip, right-side smirk curl, speaking wobble
  if(AV.face==='grin'&&window.__grinSegs){
    const talking=mouthOpen?1:0, w=talking?9:2.3;
    const base=window.__grinBase.GY;
    const curl=0.16+Math.sin(t*1.1)*0.03+talking*Math.abs(Math.sin(t*w))*0.07;
    const skew=Math.sin(t*0.7)*0.012+talking*Math.sin(t*w*0.6)*0.018;
    const curveY=(tt)=>{
      const dip=Math.sin(tt*Math.PI)*0.022;
      const troll=Math.pow(Math.max(0,tt-0.55)/0.45,1.4)*curl;
      const wob=Math.sin(t*w+tt*11)*0.006*(0.35+talking);
      return base-dip+troll+wob+skew*(tt-0.5);
    };
    window.__grinSegs.forEach(s=>{s.mesh.position.y=curveY(s.t)});
    window.__grinTeeth.forEach(s=>{s.mesh.position.y=curveY(s.t)});
    window.__grinDivs.forEach(s=>{s.mesh.position.y=curveY(s.t)});
    if(window.__brows){window.__brows.forEach(b=>{
      const lift=talking?Math.sin(t*w+b.side*1.2+b.k*0.5)*0.018:Math.sin(t*1.4+b.side)*0.006;
      b.mesh.position.y=b.by+lift;
    })}
  }
  head.rotation.y=Math.sin(t*0.8)*0.1+(mouthOpen?Math.sin(t*14)*0.03:0);
  head.rotation.z=Math.sin(t*0.6)*0.06+(mouthOpen?Math.sin(t*11)*0.04:0);
  head.rotation.x=(mouthOpen?Math.sin(t*9)*0.03:0);
  head.position.y=Math.sin(t*2.2)*0.03+(mouthOpen?Math.abs(Math.sin(t*12))*0.04:0);
  const cust=$('cust').classList.contains('on');
  fig.rotation.y=cust?Math.sin(t*0.5)*0.9:Math.sin(t*0.6)*0.06;
  hr.render(hs,hc);
  faceCtx.clearRect(0,0,200,200);
  if(mouthOpen){
    // glitch only while speaking and only over the mouth area (a box under the eye)
    faceCtx.drawImage(headCanvas,0,0);
    const MX=80,MY=128,MW=42,MH=18;
    // slice shifts inside the mouth box
    let y=MY;while(y<MY+MH){const hgt=3+(Math.random()*5|0);const dx=(Math.random()*10-5|0);faceCtx.drawImage(headCanvas,MX,y,MW,hgt,MX+dx,y,MW,hgt);y+=hgt}
    // missing pieces
    const holes=2+(Math.random()*3|0);for(let i=0;i<holes;i++){const w=4+(Math.random()*10|0),hh=3+(Math.random()*6|0);faceCtx.clearRect(MX+(Math.random()*(MW-w)|0),MY+(Math.random()*(MH-hh)|0),w,hh)}
    // displaced chips
    for(let i=0;i<2;i++){const w=5+(Math.random()*6|0);const sx=MX+(Math.random()*(MW-w)|0),sy=MY+(Math.random()*(MH-w)|0);faceCtx.drawImage(headCanvas,sx,sy,w,w,sx+(Math.random()*12-6|0),sy+(Math.random()*6-3|0),w,w)}
  } else faceCtx.drawImage(headCanvas,0,0);
  const id=faceCtx.getImageData(0,0,200,200),d=id.data;
  for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;d[i]=Math.round(d[i]/8)*8;d[i+1]=Math.round(d[i+1]/8)*8;d[i+2]=Math.round(d[i+2]/8)*8}
  faceCtx.putImageData(id,0,0);
  if(cust){br2.render(hs,fc);prevCtx.clearRect(0,0,144,240);prevCtx.drawImage(bodyCanvas,0,0)}
}
refreshAvatar();

/* ---------- look + interaction ---------- */
let mx=0,my=0,yaw=0,pitch=0,tYaw=0,tPitch=0,fov=62,tFov=62;
const YAW=1.05,PIT_UP=0.45,PIT_DN=0.55;
function look(x,y){mx=x/innerWidth*2-1;my=y/innerHeight*2-1;if(!active){tYaw=-mx*YAW;tPitch=my<0?-my*PIT_UP:-my*PIT_DN}}
let dragging=false,lx=0,ly=0;
let lookMode=localStorage.getItem('azal.look')||'mouse'; // 'mouse' | 'pov'
const modeEl=$('mode');
function showMode(){modeEl.textContent=lookMode==='mouse'?'LOOK: MOUSE POSITION  [L]':'LOOK: POV'+(document.pointerLockElement?'  ·  ESC TO RELEASE':'  ·  CLICK TO GRAB')+'  [L]'}
showMode();povCursor();
function setMode(m){lookMode=m;localStorage.setItem('azal.look',m);if(m==='pov'){if(!active)canvas.requestPointerLock?.()}else if(document.pointerLockElement)document.exitPointerLock();showMode();povCursor()}
addEventListener('keydown',e=>{if(e.key==='l'||e.key==='L')setMode(lookMode==='mouse'?'pov':'mouse')});
function povCursor(){if(active)return;const grabbed=!!document.pointerLockElement;const pov=lookMode==='pov';document.body.style.cursor=(pov&&!grabbed)?'grab':'none';$('dot').style.opacity=(pov&&!grabbed)?0:.9}
document.addEventListener('pointerlockchange',()=>{showMode();povCursor()});
canvas.addEventListener('pointerdown',()=>{if(lookMode==='pov'&&!document.pointerLockElement&&!active)canvas.requestPointerLock?.()});
addEventListener('pointermove',e=>{
  if(lookMode==='pov'){if(document.pointerLockElement&&!active){tYaw=THREE.MathUtils.clamp(tYaw-e.movementX*0.0022,-YAW,YAW);tPitch=THREE.MathUtils.clamp(tPitch-e.movementY*0.0022,-PIT_DN,PIT_UP)}return}
  if(matchMedia('(pointer:fine)').matches&&!e.buttons)look(e.clientX,e.clientY);else if(dragging){tYaw+=(e.clientX-lx)*0.004;tPitch+=(e.clientY-ly)*0.003;tYaw=THREE.MathUtils.clamp(tYaw,-YAW,YAW);tPitch=THREE.MathUtils.clamp(tPitch,-PIT_DN,PIT_UP);lx=e.clientX;ly=e.clientY}});
addEventListener('pointerdown',e=>{dragging=true;lx=e.clientX;ly=e.clientY});
addEventListener('pointerup',()=>dragging=false);

const ray=new THREE.Raycaster();const center=new THREE.Vector2(0,0);
let hovered=null;const label=$('label'),dot=$('dot');
// green highlight overlay: a slightly enlarged copy of the TV body drawn with a pulsing phosphor material
const vatsM=new THREE.MeshBasicMaterial({color:0x5cff86,transparent:true,opacity:0.0,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide});
const vatsIdleM=new THREE.MeshBasicMaterial({color:0x2a7a3e,transparent:true,opacity:0.18,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide});
const shells=new Map();
screens.forEach(sc=>{const body=sc.parent.children[0];const sh=new THREE.Mesh(body.geometry,vatsIdleM.clone());sh.scale.set(1.04,1.05,1.04);sh.renderOrder=2;body.parent.add(sh);shells.set(sc,sh)});
function setShell(sc,on){const sh=shells.get(sc);if(!sh)return;sh.material=on?vatsM:vatsIdleM.clone();sh.scale.setScalar(on?1.07:1.045)}
let pillGaze=0,pillSaid=localStorage.getItem('azal.pillsaid')==='1',lastT=0;
function pick(){
  ray.setFromCamera(center,camera);
  if(!pillSaid&&!dlg.classList.contains('on')){
    const now=performance.now()/1000,dt=lastT?Math.min(now-lastT,0.1):0;lastT=now;
    const onPills=ray.intersectObjects(pillZones,false).length>0;
    pillGaze=onPills?pillGaze+dt:Math.max(0,pillGaze-dt*2);
    if(pillGaze>10){pillSaid=true;localStorage.setItem('azal.pillsaid','1');say([SAY.pills||"..."])}
  }
  const hit=ray.intersectObjects(screens,false)[0];
  const h=hit?hit.object:null;
  if(h!==hovered){
    if(hovered){hovered.material.map=hovered.userData.cold;hovered.material.needsUpdate=true;setShell(hovered,false)}
    hovered=h;
    if(h){h.material.map=h.userData.hot;h.material.needsUpdate=true;setShell(h,true);label.textContent='[ '+h.userData.section.title.toUpperCase()+' ]';label.style.opacity=1;dot.style.transform='scale(1.8)';dot.style.background='#8ef59a'}
    else{label.style.opacity=0;dot.style.transform='';dot.style.background='#fff'}
  }
}
// lean in toward the TV: the camera dollies to ~1.1m in front of the screen and looks at it
const tEye=EYE.clone(),camPos=EYE.clone();
function aimAt(sc){const p=new THREE.Vector3();sc.getWorldPosition(p);
  const n=new THREE.Vector3(0,0,1).applyQuaternion(sc.parent.getWorldQuaternion(new THREE.Quaternion()));
  const dist=innerWidth<700?0.95:1.15;tEye.copy(p).addScaledVector(n,dist);
  const d=p.clone().sub(tEye);tYaw=Math.atan2(-d.x,-d.z);tPitch=Math.atan2(d.y,Math.hypot(d.x,d.z));tFov=40}
viewTex=new THREE.CanvasTexture(view);viewTex.magFilter=viewTex.minFilter=THREE.NearestFilter;viewTex.colorSpace=THREE.SRGBColorSpace;
canvas.addEventListener('click',()=>{
  if(active){return}
  if(hovered){aimAt(hovered);openSection(hovered.userData.section)}
});
const _close=closeSection;closeSection=function(){_close();tFov=62;tEye.copy(EYE);if(lookMode==='mouse')look(innerWidth/2+mx*innerWidth/2,innerHeight/2+my*innerHeight/2)};
$('bClose').onclick=()=>closeSection();

/* intro */
let started=false;
function intro(){if(started)return;started=true;setTimeout(()=>say((SAY.intro||["Hey. I'm {name}."]).map(l=>l.replace(/\{name\}/g,AV.name))),600)}
addEventListener('pointerdown',intro,{once:true});addEventListener('keydown',intro,{once:true});
setTimeout(intro,2500);

/* loop */
let firstFrame=true;
function frame(){
  const t=performance.now()/1000;
  if(firstFrame){firstFrame=false;const l=$('loading');if(l)requestAnimationFrame(()=>l.classList.add('off'))}
  yaw+=(tYaw-yaw)*0.08;pitch+=(tPitch-pitch)*0.08;fov+=(tFov-fov)*0.08;
  camera.fov=fov;camera.updateProjectionMatrix();
  camPos.lerp(tEye,0.08);camera.position.set(camPos.x+Math.sin(t*0.7)*0.006,camPos.y+Math.sin(t*1.3)*0.008,camPos.z);
  camera.rotation.set(0,0,0,'YXZ');camera.rotation.y=yaw;camera.rotation.x=pitch;
  lamp.intensity=13+Math.sin(t*9)*0.6+(Math.random()<0.02?-4:0);
  glow.intensity=5.5+Math.sin(t*20)*0.5;
  vatsM.opacity=0.35+Math.sin(t*6)*0.2;
  if(hovered){const p=new THREE.Vector3();hovered.getWorldPosition(p);hoverLight.position.copy(p).add(new THREE.Vector3(0,0,0.6));hoverLight.intensity=6+Math.sin(t*6)*2}else hoverLight.intensity=0;
  bulb.material.color.setHSL(0.1,0.7,lamp.intensity>10?0.85:0.5);
  if(!active)pick();
  renderer.render(scene,camera);
  renderHead(t);
  requestAnimationFrame(frame);
}
document.fonts.ready.then(()=>{screens.forEach(s=>{const x=s.userData.section;s.userData.cold=screenTex(x.tv,x.title.toUpperCase(),false);s.userData.hot=screenTex(x.tv,'> OPEN',true);s.material.map=s===hovered?s.userData.hot:s.userData.cold;s.material.needsUpdate=true})});
frame();
// debug hook (harmless in production; lets tests drive the room without a mouse)
window.__room={get active(){return active},openSection,closeSection,screens,SECTIONS,setPage,channel,aimAt,get pages(){return pages},get page(){return page}};
window.addEventListener('error',e=>{window.__lastErr=(e.message||'')+' @'+(e.filename||'').split('/').pop()+':'+e.lineno});
