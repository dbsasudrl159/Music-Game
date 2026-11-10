// JSON 불러오기 · 검증 · 내보내기 · 브라우저 저장
window.PQ=window.PQ||{};
(function(){
const D=PQ.data={files:{lyrics:"data/lyrics.json",people:"data/people.json"},raw:{},qs:{},status:{}};
PQ.esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
// JSON을 읽지 못할 때만 쓰는 내장 예시 (정상일 때는 data/*.json 이 사용됩니다)
D.fallback={
 lyrics:{game:"lyrics",title:"노래 제목 맞추기",questions:[{id:"lyrics-001",enabled:true,question:"동해물과 백두산이 마르고 닳도록",answers:["애국가"],hint:["대한민국을 대표하는 노래입니다."],image:null,description:""}]},
 people:{game:"people",title:"인물 맞추기",questions:[{id:"people-001",enabled:true,name:"Kanye",answers:["Kanye","칸예"],image:null,hints:["첫 번째 힌트를 입력하세요."],description:""}]}
};
const ok=x=>typeof x==="string"&&x.trim()!=="";
const list=x=>(Array.isArray(x)?x:ok(x)?[x]:[]).filter(ok).map(s=>s.trim());
D.validate=(g,j)=>{
 const r={qs:[],errors:[],warns:[]},seen={};
 if(!j||typeof j!=="object"||!Array.isArray(j.questions)){r.errors.push("최상위에 questions 배열이 없어요.");return r}
 if(j.game&&j.game!==g)r.warns.push(`game 값이 "${j.game}"이에요. "${g}" 이어야 해요.`);
 j.questions.forEach((q,i)=>{
  const w=`${i+1}번째 문제`;
  if(!q||typeof q!=="object"){r.errors.push(`${w}: 문제 형식이 올바르지 않아 제외해요.`);return}
  const id=ok(q.id)?q.id.trim():`${g}-auto-${i+1}`;
  if(!ok(q.id))r.warns.push(`${w}: id가 없어 "${id}"로 자동 지정했어요.`);
  if(seen[id])r.warns.push(`${w}: id "${id}"가 중복돼요.`);
  seen[id]=1;
  if(g==="lyrics"&&!ok(q.question)){r.errors.push(`${w}(${id}): question이 비어 있어 제외해요.`);return}
  const answers=list(q.answers);let en=q.enabled!==false;
  if(!answers.length){r.warns.push(`${w}(${id}): answers가 비어 있어 출제에서 제외해요.`);en=false}
  r.qs.push({id,enabled:en,text:ok(q.question)?q.question.trim():"",name:ok(q.name)?q.name.trim():(answers[0]||"?"),answers,hints:list(q.hints||q.hint),image:ok(q.image)?q.image.trim():null,desc:ok(q.description)?q.description.trim():""});
 });
 return r};
D.apply=(g,j,source,pre)=>{const v=D.validate(g,j);D.raw[g]=j;D.qs[g]=v.qs;D.status[g]={source,errors:(pre||[]).concat(v.errors),warns:v.warns};return v};
D.load=async(g,force)=>{
 let j=null,src="",pre=[];
 if(!force){try{const t=localStorage.getItem("pliup.data."+g);if(t){j=JSON.parse(t);src="불러온 파일 (이 브라우저에 저장됨)"}}catch(e){j=null}}
 if(!j){try{const r=await fetch(D.files[g],{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);j=await r.json();src=D.files[g]}
  catch(e){pre.push(`${D.files[g]} 를 불러오지 못했어요 (${e.message}). 파일이 없거나, JSON 형식이 잘못됐거나, index.html을 파일로 직접 열어 브라우저가 막았을 수 있어요. 내장 예시 데이터를 쓰는 중이에요.`);j=D.fallback[g];src="내장 예시 데이터"}}
 return D.apply(g,j,src,pre)};
D.clearSaved=g=>{try{localStorage.removeItem("pliup.data."+g)}catch(e){}};
D.importText=(g,t)=>{
 let j;try{j=JSON.parse(t)}catch(e){return{ok:false,msg:"JSON 형식이 잘못됐어요: "+e.message}}
 const v=D.validate(g,j);
 if(v.errors.length&&!v.qs.length)return{ok:false,msg:v.errors.join(" ")};
 try{localStorage.setItem("pliup.data."+g,t)}catch(e){}
 D.apply(g,j,"불러온 파일 (이 브라우저에 저장됨)");return{ok:true,v}};
D.enabled=g=>(D.qs[g]||[]).filter(q=>q.enabled);
D.checkImages=g=>Promise.all((D.qs[g]||[]).filter(q=>q.image).map(q=>new Promise(res=>{const i=new Image();i.onload=()=>res({id:q.id,image:q.image,ok:true});i.onerror=()=>res({id:q.id,image:q.image,ok:false});i.src=q.image})));
})();
