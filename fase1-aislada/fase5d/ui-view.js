/* DTO explícito para la interfaz 5A.2. Autorización y redacción en servidor. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CV5DView=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const copy=x=>JSON.parse(JSON.stringify(x));
const pick=(x,keys)=>Object.fromEntries(keys.filter(k=>x[k]!==undefined).map(k=>[k,copy(x[k])]));
function snapshot(engine){
  const state=engine.state();
  if(engine.actor.role!=='seller'){
    const result=copy(state);result.reports=engine.reports(state);
    for(const sale of Object.values(result.sales))if(sale.commercial)sale.financial=engine.financial(state,sale.id);
    result.profile=engine.actor.role;result.uiVersion='5D';return bounded(result);
  }
  const own=new Set(engine.records().filter(row=>row.kind==='PREPARED'&&row.plan.audit?.subject===engine.actor.subject).map(row=>row.id));
  const resources=Object.fromEntries(Object.values(state.resources).filter(r=>r.stage==='PACKAGED').map(r=>[r.id,pick(r,['id','product','lot','stage','family','grind','grams','unit','physical','reserved','qty'])]));
  const offers=Object.fromEntries(Object.values(state.commerce.offers).filter(o=>o.active).map(o=>[o.id,pick(o,['id','name','family','grind','grams','bags','priceCents','validFrom','validUntil','version','active'])]));
  const sales=Object.fromEntries(Object.values(state.sales).filter(s=>s.commercial&&own.has(s.originOperationId)).map(s=>[s.id,{
    ...pick(s,['id','version','status','totalCents','deliveryChargedCents','metadata','delivered']),
    commercial:pick(s.commercial,['channel']),
    lines:s.lines.map(l=>pick(l,['resourceId','qty','lot','family','grind','grams','returned']))
  }]));
  return bounded({epoch:state.epoch,revision:state.revision,profile:'seller',uiVersion:'5D',resources,sales,
    commerce:{offers},reports:{customers:[]}});
}
function bounded(result){if(JSON.stringify(result).length>1500000)throw Error('UI_SNAPSHOT_LIMIT');return result;}
function dashboard(engine,p){
  if(engine.actor.role==='seller')throw Error('PERMISSION_DENIED');
  const valid=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d);
  if(!p||![p.from,p.to,p.today].every(valid)||p.from>p.to||!Array.isArray(p.days)||p.days.length>45||
    new Set(p.days).size!==p.days.length||p.days.some(d=>!valid(d)||d<p.from||d>p.to))throw Error('INVALID_PERIOD');
  const s=engine.state();if(s.revision!==p.revision)throw Error('REVISION_CHANGED');
  return {revision:s.revision,range:engine.reports(s,p.from,p.to),today:engine.reports(s,p.today,p.today),
    month:engine.reports(s,p.today.slice(0,7)+'-01',p.today),
    daily:p.days.map(day=>({day,report:engine.reports(s,day,day)}))};
}
return {snapshot,dashboard};});
