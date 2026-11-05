// Diagnóstico efímero. Solo acciones, tamaños, estados y tiempos. Sin payloads ni identidad.
const CVPerf72=(()=>{
 const enabled=new URLSearchParams(location.search).get('perf')==='1';
 const calls=[],marks={};let sequence=0,active=0,maximumConcurrent=0;
 const mark=(name)=>{if(marks[name]===undefined)marks[name]=Math.round(performance.now());};
 let output;
 function draw(){
  if(!enabled)return;
  if(!output){const details=document.createElement('details');details.id='cv-performance72';
   const title=document.createElement('summary');title.textContent='Tiempos del ensayo';output=document.createElement('pre');
   output.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere';details.append(title,output);document.body.append(details);}
  const durations=calls.filter(c=>Number.isFinite(c.durationMs)).map(c=>c.durationMs).sort((a,b)=>a-b);
  const median=durations.length?durations[Math.floor(durations.length/2)]:null;
  const summary={environment:'TEST_ONLY',marks,calls,maximumConcurrent,medianCallMs:median,worstCallMs:durations.at(-1)??null};
  const text=JSON.stringify(summary,null,2);if(output.textContent!==text)output.textContent=text;
 }
 async function fetchApi(input,options){
  const start=performance.now(),id=++sequence;
  let action='unknown';try{action=JSON.parse(options.body).action||'unknown';}catch{}
  const row={id,action,startedMs:Math.round(start)};calls.push(row);if(calls.length>60)calls.shift();
  maximumConcurrent=Math.max(maximumConcurrent,++active);
  try{
   const response=await fetch(input,options);row.firstResponseMs=Math.round(performance.now()-start);row.status=response.status;
   row.serverTiming=response.headers.get('server-timing')||'';
   if(enabled)void response.clone().arrayBuffer().then(bytes=>{row.responseBytes=bytes.byteLength;row.durationMs=Math.round(performance.now()-start);draw();}).catch(()=>{});
   return response;
  }catch(error){row.networkError=true;throw error;}
  finally{active--;if(!enabled)row.durationMs=Math.round(performance.now()-start);draw();}
 }
 if(enabled){
  try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.name==='first-contentful-paint'){marks.firstScreenMs=Math.round(e.startTime);draw();}}).observe({type:'paint',buffered:true});}catch{}
  document.addEventListener('DOMContentLoaded',draw,{once:true});
  new MutationObserver(()=>{
   const app=document.getElementById('app');
   if(app&&!app.hidden)mark('panelUsableMs');
   if(performance.getEntriesByName('cv-inventory-current72').length&&document.getElementById('inventory-rows')?.textContent.trim())mark('inventoryRenderedMs');
   draw();
  }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
 }
 return {fetchApi,mark(name){mark(name);draw();}};
})();
