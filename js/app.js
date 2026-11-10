// 화면 전환 · 이벤트 연결
(function(){
const $=s=>document.querySelector(s),app=$("#app"),esc=PQ.esc,S=()=>PQ.settings.get(),Q=PQ.quiz,D=PQ.data,GS=["lyrics","people"];
const set=PQ.render=(h,keep)=>{app.innerHTML=`<div class="view">${h}</div>`;if(!keep)scrollTo(0,0)};
const side=g=>g==="lyrics"?"SIDE A":"SIDE B";
function home(){const s=S(),bad=GS.some(g=>((D.status[g]||{}).errors||[]).length);
 set(`<section class="cover"><div class="lp" aria-hidden="true"></div><span class="stk ko">시즌 2</span><h1 class="ko">${esc(s.site.title)}</h1><p class="sub">${esc(s.site.sub)}</p>
${s.site.notice?`<p class="note">${esc(s.site.notice)}</p>`:""}${bad?`<p class="msg warn">일부 데이터에 문제가 있어요. 설정의 전체 설정 탭에서 확인해 주세요.</p>`:""}
<nav class="tracks">${GS.map(g=>`<button class="track" data-act="pick" data-g="${g}"><small class="dp">${side(g)}</small><span class="ko">${esc(s[g].name)}</span><em>${esc(s[g].desc)}</em></button>`).join("")}</nav><p class="foot dp">@_pliup</p></section>`)}
function pick(g){const s=S(),c=Q.counts(g),n=D.enabled(g).length;
 set(`<span class="kick dp">${side(g)}</span><h2 class="ttl ko">${esc(s[g].name)}</h2><p>${esc(s.t.pickCount)}</p>
${c.length?`<div class="cnt">${c.map(k=>`<button class="num" data-act="go" data-g="${g}" data-n="${k}">${k}</button>`).join("")}</div><p class="note">출제할 수 있는 문제 ${n}개</p>`:`<p class="msg err">출제할 수 있는 문제가 없어요. 설정에서 데이터를 확인해 주세요.</p>`}
<button class="ghost" data-act="home">${esc(s.t.home)}</button>`)}
function play(){app.innerHTML=`<div class="view">${Q.screen()}</div>`;const i=$("#ans");if(i)i.focus({preventScroll:true})}
async function act(a,d){try{
 if(a==="home")home();
 else if(a==="settings")PQ.settings.show();
 else if(a==="pick")pick(d.g);
 else if(a==="go"){Q.start(d.g,+d.n);play()}
 else if(["hint","check","giveup","next"].includes(a)){const i=$("#ans"),r=Q.handle(a,i?i.value:"");if(r==="result")set(Q.result());else if(r)play()}
 else await PQ.settings.act(a,d);
}catch(e){console.error(e);set(`<p class="msg err">문제가 생겼어요: ${esc(e.message)}</p><button class="btn" data-act="home">처음으로</button>`)}}
document.addEventListener("click",e=>{const b=e.target.closest("[data-act]");if(b)act(b.dataset.act,b.dataset)});
document.addEventListener("input",e=>{const t=e.target,p=t.dataset&&t.dataset.p;if(p)PQ.settings.set(p,t.type==="checkbox"?t.checked:t.value)});
document.addEventListener("change",e=>{const g=e.target.dataset&&e.target.dataset.file;if(g&&e.target.files[0])PQ.settings.importFile(g,e.target.files[0]).then(()=>PQ.settings.show(true))});
document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.id==="ans")act("check",{})});
set('<p class="note">데이터를 불러오는 중…</p>');
Promise.all(GS.map(g=>D.load(g))).catch(e=>console.error(e)).finally(home);
})();
