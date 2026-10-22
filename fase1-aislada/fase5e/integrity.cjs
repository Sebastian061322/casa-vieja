'use strict';
const {Engine}=require('../fase4/commercial.js');
const {canonical,clone}=require('../fase3/journal.js');
function inspect({journal,effects}) {
  const check=(value,code)=>{if(!value)throw Error(code)};
  check(Array.isArray(journal)&&Array.isArray(effects),'MISSING_LEDGER');
  const prepared=new Map(),committed=new Set(),rejected=new Set(),keys=new Set();
  for(const row of journal){
    check(['PREPARED','COMMITTED','REJECTED'].includes(row.kind),'INVALID_JOURNAL_KIND');
    const key=row.kind+':'+row.id;check(!keys.has(key),'DUPLICATE_JOURNAL_ID');keys.add(key);
    if(row.kind==='PREPARED'){check(!rejected.has(row.id),'CONFLICTING_TERMINAL_STATE');check(row.fingerprint===canonical(row.command),'FINGERPRINT_MISMATCH');prepared.set(row.id,row);}
    if(row.kind==='REJECTED'){check(!prepared.has(row.id)&&!committed.has(row.id),'CONFLICTING_TERMINAL_STATE');check(row.fingerprint===canonical(row.command),'FINGERPRINT_MISMATCH');rejected.add(row.id);}
    if(row.kind==='COMMITTED'){check(prepared.has(row.id),'COMMIT_BEFORE_PREPARE');check(!rejected.has(row.id),'CONFLICTING_TERMINAL_STATE');committed.add(row.id);}
  }
  const effectKeys=new Set();
  for(const effect of effects){
    check(!effectKeys.has(effect.id),'DUPLICATE_EFFECT_ID');effectKeys.add(effect.id);
    const p=prepared.get(effect.operationId);
    check(p&&p.plan.effects.some(e=>canonical(e)===canonical(effect)),'ORPHAN_OR_CHANGED_EFFECT');
  }
  const state=new Engine({readJournal:()=>clone(journal),readEffects:()=>clone(effects)}).state();
  for(const r of Object.values(state.resources)){
    const actual=state.effects.filter(e=>e.resourceId===r.id);
    for(const [key,delta]of [['physical','qtyDelta'],['reserved','reservedDelta'],['valueCents','valueDelta'],['reservedValueCents','reservedValueDelta']])check(actual.reduce((n,e)=>n+e[delta],0)===r[key],'PROJECTION_MISMATCH');
    check(r.physical>=0&&r.reserved>=0&&r.reserved<=r.physical&&r.qty===r.physical-r.reserved,'BALANCE_INVARIANT');
    const reserved=Object.values(state.sales).filter(s=>s.status==='RESERVED').flatMap(s=>s.lines).filter(l=>l.resourceId===r.id).reduce((n,l)=>n+l.qty,0);
    if(r.stage==='PACKAGED')check(reserved===r.reserved,'RESERVATION_MISMATCH');
  }
  return {revision:state.revision,committed:committed.size,rejected:rejected.size,pending:[...prepared.keys()].filter(id=>!committed.has(id)),effects:effects.length,state};
}
module.exports={inspect};
