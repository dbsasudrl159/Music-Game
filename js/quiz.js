// 게임 진행 · 정답 판정 · 점수
(function(){
const esc=PQ.esc,D=PQ.data,Q=PQ.quiz={};let G=null;
Q.norm=(s,o)=>{s=String(s==null?"":s);if(o.ic)s=s.toLowerCase();if(o.ip)s=s.replace(/[^\p{L}\p{N}\s]/gu,"");if(o.is)s=s.replace(/\s+/g,"");return s.trim()};
Q.judge=(q,v,o)=>{const n=Q.norm(v,o);return n!==""&&q.answers.some(a=>Q.norm(a,o)===n)};
Q.counts=g=>{
 const s=PQ.settings.get(),src=(s[g].counts||"").trim()||s.site.counts;
 let a=[...new Set(String(src).split(/[,\s]+/).map(Number).filter(n=>n>=1&&n<=99))].sort((x,y)=>x-y);
 if(!a.length)a=[1,3,5];
 const n=D.enabled(g).length,o=a.filter(x=>x<=n);
 if(n>0&&n<a[a.length-1]&&!o.includes(n))o.push(n);
 return o.sort((x,y)=>x-y)};
Q.start=(g,n)=>{const a=D.enabled(g).slice();
 if(PQ.settings.get()[g].order==="random")for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 G={g,qs:a.slice(0,n),i:0,score:0,hints:0,res:null}};
Q.handle=(a,v)=>{const q=G.qs[G.i];
 if(a==="hint")G.hints++;
 else if(a==="check"){if(!v.trim())return"";const ok=Q.judge(q,v,PQ.settings.get()[G.g]);if(ok)G.score++;G.res={ok}}
 else if(a==="giveup")G.res={ok:false};
 else if(a==="next"){G.i++;if(G.i>=G.qs.length)return"result";G.hints=0;G.res=null}
 return"play"};
const SIL=`<svg class="sil" viewBox="0 0 300 260" role="img" aria-label="인물 실루엣"><circle cx="150" cy="112" r="52" fill="#eee9e4"/><path d="M40 260c0-62 40-90 110-90s110 28 110 90z" fill="#eee9e4"/><g fill="#e7a28f"><ellipse cx="94" cy="116" rx="13" ry="20"/><ellipse cx="206" cy="116" rx="13" ry="20"/></g></svg>`;
PQ.imgErr=i=>{const f=i.parentNode;f.classList.add("err");const m=f.querySelector(".fm");if(m)m.textContent="이미지를 불러오지 못했어요: "+i.getAttribute("src");i.remove()};
const frame=(q,fit,label,big)=>`<figure class="frame${big?" big":""}${q.image?"":" noimg"}" style="--fit:${fit}">${q.image?`<i class="sk"></i><img src="${esc(q.image)}" alt="" onload="this.parentNode.classList.add('ok')" onerror="PQ.imgErr(this)">`:""}${SIL}${label?`<b class="nm dp">${label}</b>`:""}<span class="fm">${q.image?"":"등록된 이미지가 없어요"}</span></figure>`;
Q.screen=()=>{
 const s=PQ.settings.get(),t=s.t,o=s[G.g],q=G.qs[G.i],a=q.answers[0],last=G.i===G.qs.length-1,hs=o.hints?q.hints:[];
 const body=G.g==="lyrics"
  ?`${q.desc?`<p class="note">${esc(q.desc)}</p>`:""}<blockquote class="lyric ko"><span class="qm dp">“</span>${esc(q.text)}</blockquote>${q.image?frame(q,"contain","",0):""}`
  :`${frame(q,o.fit,esc(G.res?q.name:"???"),1)}${G.res&&q.desc?`<p class="note">${esc(q.desc)}</p>`:""}`;
 const hint=`<ul class="hints">${hs.slice(0,G.hints).map(h=>`<li>${esc(h)}</li>`).join("")}</ul>${!G.res&&G.hints<hs.length?`<button class="ghost" data-act="hint">${esc(t.hint)} (${G.hints}/${hs.length})</button>`:""}`;
 const foot=G.res
  ?`<div class="fb ${G.res.ok?"ok":"no"}">${esc(G.res.ok?t.correct:t.wrong)}${G.res.ok?"":`<b>${esc(a)}</b>`}</div><button class="btn" data-act="next">${esc(last?t.finish:t.next)}</button>`
  :`<div class="row"><input id="ans" placeholder="${esc(t.ph)}" autocomplete="off"><button class="btn" data-act="check">${esc(t.check)}</button></div><button class="ghost" data-act="giveup">${esc(t.giveup)}</button>`;
 const p=n=>String(n).padStart(2,"0");
 return `<div class="prog dp">TRACK ${p(G.i+1)} / ${p(G.qs.length)}</div>${body}${hint}${foot}`};
Q.result=()=>{const t=PQ.settings.get().t;
 return `<span class="kick dp">${G.g==="lyrics"?"SIDE A":"SIDE B"}</span><h2 class="ttl ko">${esc(t.resultTitle)}</h2><div class="big dp">${G.score}/${G.qs.length}</div><button class="btn" data-act="go" data-g="${G.g}" data-n="${G.qs.length}">${esc(t.again)}</button> <button class="ghost" data-act="home">${esc(t.home)}</button>`};
})();
