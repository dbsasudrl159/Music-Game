// 설정 화면 (탭) · 게임별 설정 · JSON 불러오기/내보내기
(function(){
const esc=PQ.esc,D=PQ.data;
const TL={pickCount:"문제 개수 안내",ph:"입력창 안내",check:"확인 버튼",hint:"힌트 버튼",giveup:"정답 보기 버튼",next:"다음 버튼",finish:"결과 버튼",correct:"정답 문구",wrong:"오답 문구",resultTitle:"결과 제목",again:"다시 하기 버튼",home:"처음으로 버튼"};
const DEF={
 site:{title:"귀가본능",sub:"음악이 이끄는 곳으로, 당신의 플레이리스트를 들려주세요.",notice:"",counts:"3,5,7,9,12"},
 t:{pickCount:"몇 문제를 풀어볼까요?",ph:"정답을 입력하세요",check:"정답 확인",hint:"힌트 보기",giveup:"정답 보기",next:"다음 문제",finish:"결과 보기",correct:"정답입니다!",wrong:"아쉬워요! 정답은",resultTitle:"결과",again:"다시 하기",home:"처음으로"},
 lyrics:{name:"노래 제목 맞추기",desc:"Play the music",order:"random",counts:"",hints:true,ic:true,is:true,ip:true},
 people:{name:"인물 맞추기",desc:"Nice to meet you",order:"random",counts:"",hints:true,ic:true,is:true,ip:true,fit:"contain"}
};
const clone=o=>JSON.parse(JSON.stringify(o));
let S=clone(DEF),tab="all",armed=false;const msg={},imgres={};
try{const s=JSON.parse(localStorage.getItem("pliup.settings"));if(s)for(const k in DEF)Object.assign(S[k],s[k]||{})}catch(e){}
const save=()=>{try{localStorage.setItem("pliup.settings",JSON.stringify(S))}catch(e){}};
const f=(p,l,v)=>`<label>${l}<input data-p="${p}" value="${esc(v)}"></label>`;
const ck=(p,l,v)=>`<label class="ck"><input type="checkbox" data-p="${p}" ${v?"checked":""}>${l}</label>`;
const sel=(p,l,v,o)=>`<label>${l}<select data-p="${p}">${o.map(([k,t])=>`<option value="${k}" ${v===k?"selected":""}>${t}</option>`).join("")}</select></label>`;
const m=k=>msg[k]?`<p class="msg ${msg[k][0]}">${esc(msg[k][1])}</p>`:"";
const stat=g=>{const st=D.status[g]||{errors:[],warns:[],source:"-"},q=D.qs[g]||[];
 return `<p class="stat"><b>출처</b> ${esc(st.source)}<br><b>등록된 문제</b> ${q.length}개 · <b>활성화된 문제</b> ${q.filter(x=>x.enabled).length}개</p>${st.errors.map(x=>`<p class="msg err">${esc(x)}</p>`).join("")}${st.warns.map(x=>`<p class="msg warn">${esc(x)}</p>`).join("")}`};
const all=()=>`<div class="set">${f("site.title","웹사이트 제목",S.site.title)}${f("site.sub","부제목",S.site.sub)}${f("site.notice","공통 안내 문구 (처음 화면에 표시돼요)",S.site.notice)}${f("site.counts","기본 문제 개수 후보 (쉼표로 구분, 예: 1,3,5)",S.site.counts)}
<h3>데이터 로딩 상태</h3>${["lyrics","people"].map(g=>`<h4>${esc(S[g].name)}</h4>${stat(g)}`).join("")}
<button class="ghost" data-act="reload">두 JSON 파일 다시 불러오기</button>${m("all")}
<h3>버튼·안내 문구</h3><details><summary>문구 수정하기</summary>${Object.keys(TL).map(k=>f("t."+k,TL[k],S.t[k])).join("")}</details>
<h3>초기화</h3><button class="ghost" data-act="resetall">${armed?"정말 초기화할까요? 한 번 더 누르세요":"전체 설정 초기화"}</button></div>`;
const game=g=>{const s=S[g],r=imgres[g];
 return `<div class="set">${f(g+".name","게임 이름",s.name)}${f(g+".desc","게임 설명",s.desc)}
${sel(g+".order","문제 출제 방식",s.order,[["random","랜덤"],["fixed","등록 순서"]])}${f(g+".counts","문제 출제 개수 후보 (쉼표로 구분, 비우면 전체 설정 값 사용)",s.counts)}
<h3>정답 판정</h3>${ck(g+".ic","대소문자 무시",s.ic)}${ck(g+".is","공백 무시",s.is)}${ck(g+".ip","문장부호 무시",s.ip)}
<h3>힌트</h3>${ck(g+".hints","힌트 보기 버튼 표시",s.hints)}
${g==="people"?`<h3>이미지</h3>${sel("people.fit","이미지 표시 방식",s.fit,[["contain","전체가 보이게 (비율 유지)"],["cover","화면을 꽉 채우게 (일부 잘림)"]])}`:""}
<h3>문제 데이터</h3>${stat(g)}
<p class="note">이 화면에서 불러오거나 고친 데이터는 이 브라우저에만 저장돼요. 원본 파일은 자동으로 바뀌지 않아요. 내보낸 JSON을 data 폴더에 직접 덮어써야 해요.</p>
<label>JSON 파일 불러오기<input type="file" accept=".json,application/json" data-file="${g}"></label>
<button class="ghost" data-act="export" data-g="${g}">JSON 내보내기</button><button class="ghost" data-act="reload" data-g="${g}">파일에서 다시 불러오기</button><button class="ghost" data-act="imgcheck" data-g="${g}">이미지 경로 확인</button><button class="ghost" data-act="clear" data-g="${g}">이 게임 초기화</button>
${m(g)}${r?(r.length?`<ul class="list">${r.map(x=>`<li>${x.ok?"✓":"✗"} ${esc(x.id)}: ${esc(x.image)}${x.ok?"":" (파일을 찾지 못했어요)"}</li>`).join("")}</ul>`:`<p class="note">이미지가 등록된 문제가 없어요.</p>`):""}</div>`};
const S_=PQ.settings={get:()=>S,set(p,v){const k=p.split(".");S[k[0]][k[1]]=v;save()}};
S_.html=()=>{const tabs=[["all","전체 설정"],["lyrics","노래 제목 맞추기"],["people","인물 맞추기"]];
 return `<span class="kick dp">SETTINGS</span><h2 class="ttl ko">설정</h2><button class="btn" data-act="home">저장하고 돌아가기</button>
<div class="tabs" role="tablist">${tabs.map(([k,l])=>`<button class="tab" role="tab" data-act="tab" data-t="${k}" aria-selected="${tab===k}">${l}</button>`).join("")}</div>
<div class="pnl ${tab==="lyrics"?"a":tab==="people"?"b":""}">${tab==="all"?all():game(tab)}</div>`};
S_.show=keep=>PQ.render(S_.html(),keep);
S_.importFile=async(g,file)=>{const r=D.importText(g,await file.text());
 msg[g]=r.ok?["ok",`${file.name} 을(를) 불러왔어요. 문제 ${D.qs[g].length}개${r.v.errors.length+r.v.warns.length?" (아래 상태의 안내를 확인해 주세요)":""}.`]:["err",r.msg]};
const exp=g=>{const b=new Blob([JSON.stringify(D.raw[g]||D.fallback[g],null,2)],{type:"application/json"}),a=document.createElement("a"),n=D.files[g].split("/").pop();
 a.href=URL.createObjectURL(b);a.download=n;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
 msg[g]=["ok",`${n} 을(를) 다운로드했어요. 이 파일을 data 폴더에 직접 덮어써야 원본이 바뀌어요.`]};
S_.act=async(a,d)=>{const g=d.g;
 if(a==="tab")tab=d.t;
 else if(a==="export")exp(g);
 else if(a==="reload"){for(const x of g?[g]:["lyrics","people"]){D.clearSaved(x);await D.load(x,true)}msg[g||"all"]=["ok","JSON 파일을 다시 불러왔어요."]}
 else if(a==="clear"){S[g]=clone(DEF[g]);save();D.clearSaved(g);await D.load(g,true);delete imgres[g];msg[g]=["ok","이 게임의 설정과 불러온 데이터를 초기화했어요."]}
 else if(a==="imgcheck")imgres[g]=await D.checkImages(g);
 else if(a==="resetall"){if(armed){armed=false;S=clone(DEF);save();msg.all=["ok","모든 설정을 초기화했어요."]}else armed=true}
 if(a!=="resetall")armed=false;
 S_.show(true)};
})();
