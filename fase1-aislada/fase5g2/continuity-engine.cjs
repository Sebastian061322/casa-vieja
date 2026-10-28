'use strict';
// Extensión local TEST_ONLY del diario existente. Sin transporte, red ni credenciales.
const {clone,canonical}=require('../fase3/journal.js');
const {verifyBundle,hash}=require('./opening.cjs');
const check=(ok,e)=>{if(!ok)throw Error(e)},uint=(n,min=0)=>{check(Number.isSafeInteger(n)&&n>=min&&n<=100000000000,'INVALID_NUMBER');return n;};
const proportion=(v,q,n)=>Number(BigInt(v)*BigInt(q)/BigInt(n));
function createEngineClass(A,config){
 const getSettings=typeof config==='function'?()=>clone(config()):()=>clone(config);
 check(getSettings()?.environment==='TEST_ONLY','TEST_ONLY_REQUIRED');const baseState=A.Engine.prototype.state,basePlan=A.Engine.prototype.plan,baseExecute=A.Engine.prototype.execute,baseReports=A.Engine.prototype.reports;
 return class ContinuityEngine extends A.Engine{
  execute(c){if(c?.type==='OPEN_CONTINUITY')check(JSON.stringify(c).length<=12000,'OPENING_BUNDLE_TOO_LARGE');return baseExecute.call(this,c);}
  state(){
   const s=baseState.call(this);s.continuity={opening:null,obligations:{},cashCollections:[]};
   const prepared=new Map(this.records().filter(x=>x.kind==='PREPARED').map(x=>[x.id,x]));
   for(const commit of this.records().filter(x=>x.kind==='COMMITTED'))for(const e of prepared.get(commit.id).plan.continuityEvents||[]){
    if(e.kind==='OPENING'){check(!s.continuity.opening,'DUPLICATE_OPENING');s.continuity.opening=clone(e);}
    if(e.kind==='OBLIGATION'){const old=s.continuity.obligations[e.obligation.legacyRef];check(e.obligation.version===(old?.version||0)+1,'OBLIGATION_LOG_CORRUPT');s.continuity.obligations[e.obligation.legacyRef]=clone(e.obligation);}
    if(e.kind==='LEGACY_CASH_COLLECTION')s.continuity.cashCollections.push(clone(e));
   }
   for(const r of Object.values(s.resources))if(r.availability&&r.availability!=='AVAILABLE')r.qty=0;
   return s;
  }
  reports(s,from='0000-01-01',to='9999-12-31'){
   const r=baseReports.call(this,s,from,to),legacy=s.continuity||{obligations:{},cashCollections:[]};
   const collected=legacy.cashCollections.filter(e=>{const day=new Date(Date.parse(e.date)-5*3600000).toISOString().slice(0,10);return day>=from&&day<=to}).reduce((n,e)=>uint(n+e.amountCents),0);
   const due=Object.values(legacy.obligations).filter(o=>o.state!=='CANCELLED').reduce((n,o)=>uint(n+o.outstandingCents),0);
   return {...r,legacyCollectionsCents:collected,legacyOutstandingCents:due,legacyPendingOrders:Object.values(legacy.obligations).filter(o=>['RESERVED','DELIVERY_PENDING','DISPATCHED_UNPAID'].includes(o.state)).length,collectionsCents:uint(r.collectionsCents+collected),netCollectionsCents:r.netCollectionsCents+collected,outstandingCents:uint(r.outstandingCents+due)};
  }
  plan(s,c){
   if(!['OPEN_CONTINUITY','CONTINUITY_PAYMENT','CONTINUITY_DISPATCH','CONTINUITY_DELIVER','CONTINUITY_CANCEL'].includes(c.type)){
    const p=basePlan.call(this,s,c);
    for(const e of p.effects){const r=s.resources[e.resourceId];if(r?.availability&&r.availability!=='AVAILABLE')check(e.qtyDelta>=0&&e.reservedDelta<=0,'HELD_RESOURCE');}
    return p;
   }
   check(['administrator','operations'].includes(this.actor.role),'PERMISSION_DENIED');
   check(c.commercialVersion===4,'COMMERCIAL_VERSION_REQUIRED');
   const at=this.context.now();check(Number.isFinite(Date.parse(at)),'INVALID_SERVER_TIME');
   const settings=getSettings();check(settings.environment==='TEST_ONLY','TEST_ONLY_REQUIRED');const policy=settings.policies?.[c.type];
   check(policy?.kind==='SYNTHETIC_TEST_APPROVAL'&&policy.environment==='TEST_ONLY'&&typeof policy.version==='string'&&policy.version.startsWith('TEST_ONLY:')&&policy.evidence?.startsWith('TEST_ONLY:')&&Date.parse(policy.effectiveAt)<=Date.parse(at),'POLICY_APPROVAL_REQUIRED');
   const {sha256,...policyBody}=policy;check(/^google:[0-9]{5,64}$/.test(policy.approvedBy||'')&&Number.isFinite(Date.parse(policy.approvedAt))&&Date.parse(policy.approvedAt)<=Date.parse(at)&&hash(policyBody)===sha256,'POLICY_PROVENANCE_REQUIRED');
   const p={sale:{id:c.saleId,entityType:'continuity',version:1},resources:[],lots:[],effects:[],commerceEvents:[],continuityEvents:[],audit:{subject:this.actor.subject,role:this.actor.role,serverAt:at,submittedAt:c.date,type:c.type,operationId:c.operationId},policyRef:{version:policy.version,evidence:policy.evidence,effectiveAt:policy.effectiveAt,approvedBy:policy.approvedBy,approvedAt:policy.approvedAt,contentSha256:sha256,environment:'TEST_ONLY',rulesApprovedForProduction:false}};
   const event=(kind,extra)=>p.continuityEvents.push({id:c.operationId+':continuity:'+p.continuityEvents.length,kind,operationId:c.operationId,date:at,responsible:this.actor.subject,policyVersion:policy.version,...extra});
   const effect=(r,kind,physical,reserved,value,reservedValue)=>p.effects.push({id:c.operationId+':effect:'+p.effects.length,operationId:c.operationId,saleId:c.saleId,date:at,responsible:this.actor.subject,lot:r.lot,product:r.product,unit:r.unit,resourceId:r.id,kind,qtyDelta:physical,reservedDelta:reserved,valueDelta:value,reservedValueDelta:reservedValue});
   if(c.type==='OPEN_CONTINUITY'){
    check(this.actor.role==='administrator','PERMISSION_DENIED');check(!s.continuity.opening&&!Object.keys(s.resources).length&&!Object.keys(s.sales).length,'OPENING_ALREADY_APPLIED');
    const b=verifyBundle(c.bundle);check(settings.approvedBundleHash===b.bundleHash,'OPENING_APPROVAL_REQUIRED');check(Date.parse(at)>=Date.parse(b.act.effectiveAt),'OPENING_NOT_EFFECTIVE');
    const allocations={};for(const row of b.act.rows){
     const r={id:row.resourceId,physical:0,reserved:0,valueCents:0,reservedValueCents:0,qty:0,lot:row.lot,product:row.product,stage:row.stage,unit:row.unit,availability:row.availability,...Object.fromEntries(['family','grind','grams','supplyKind'].filter(k=>row[k]!==undefined).map(k=>[k,row[k]]))};p.resources.push(r);
     const rv=row.reserved?proportion(row.historicalValueCents,row.reserved,row.physical):0;
     effect(r,'OPENING_BALANCE',row.physical,row.reserved,row.historicalValueCents,rv);
     if(!p.lots.some(x=>x.id===row.lot))p.lots.push({id:row.lot,family:row.family||null,origin:'TEST_ONLY_OPENING_ACT',openingActId:b.act.id,documentRef:row.documentRef});
     allocations[row.resourceId]={qty:0,value:0,row};
    }
    event('OPENING',{actId:b.act.id,bundleHash:b.bundleHash,actHash:b.actHash,continuityHash:b.continuityHash,effectiveAt:b.act.effectiveAt});
    for(const source of b.obligations){
     const obligation={...clone(source),version:1,futureCollectedCents:0,importedBy:this.actor.subject,originOpeningId:b.act.id};
     obligation.lines=source.lines.map(l=>{if(source.state!=='RESERVED')return {...clone(l),reservedCostCents:0};const a=allocations[l.resourceId],next=uint(a.qty+l.qty),value=proportion(a.row.historicalValueCents,next,a.row.physical),cost=value-a.value;a.qty=next;a.value=value;return {...clone(l),reservedCostCents:cost};});event('OBLIGATION',{obligation});
    }
   }else{
    check(s.continuity.opening,'OPENING_REQUIRED');const old=s.continuity.obligations[c.legacyRef];check(old,'LEGACY_OBLIGATION_NOT_FOUND');check(c.expectedVersion===old.version,'OBLIGATION_VERSION_CONFLICT');const o=clone(old);o.version++;
    if(c.type==='CONTINUITY_PAYMENT'){
     check(o.state!=='CANCELLED','INVALID_OBLIGATION_STATE');uint(c.amountCents,1);check(c.amountCents<=o.outstandingCents,'PAYMENT_EXCEEDS_DUE');check(typeof c.documentRef==='string'&&c.documentRef.length<=100&&/^TEST_ONLY:/.test(c.documentRef),'PAYMENT_EVIDENCE_REQUIRED');const documentRef=c.documentRef.trim().toUpperCase();
     check(!s.continuity.cashCollections.some(x=>x.documentRef===documentRef)&&!s.commerce.documents[documentRef],'DUPLICATE_DOCUMENT');o.futureCollectedCents=uint(o.futureCollectedCents+c.amountCents);o.outstandingCents-=c.amountCents;event('LEGACY_CASH_COLLECTION',{legacyRef:o.legacyRef,amountCents:c.amountCents,documentRef,createsHistoricalRevenue:false});
    }else if(c.type==='CONTINUITY_DISPATCH'){
     check(o.state==='RESERVED','INVALID_OBLIGATION_STATE');check(o.outstandingCents===0||policy.allowUnpaidDispatch===true,'UNPAID_DISPATCH_NOT_APPROVED');
     for(const l of o.lines){const r=s.resources[l.resourceId];check(r?.availability==='AVAILABLE'&&r.physical>=l.qty&&r.reserved>=l.qty&&r.reservedValueCents>=l.reservedCostCents,'RESERVATION_MISMATCH');effect(r,'LEGACY_FUTURE_DISPATCH',-l.qty,-l.qty,-l.reservedCostCents,-l.reservedCostCents);}o.state='DELIVERY_PENDING';
    }else if(c.type==='CONTINUITY_DELIVER'){
     check(['DISPATCHED_UNPAID','DELIVERY_PENDING'].includes(o.state),'INVALID_OBLIGATION_STATE');check(/^TEST_ONLY:/.test(c.evidence||''),'DELIVERY_EVIDENCE_REQUIRED');o.state='DELIVERED';o.deliveryEvidence=c.evidence;
    }else{
     check(o.state==='RESERVED','INVALID_OBLIGATION_STATE');check(o.paidCents+o.futureCollectedCents===0,'ADVANCE_RESOLUTION_REQUIRED');check(/^TEST_ONLY:/.test(c.evidence||''),'CANCELLATION_EVIDENCE_REQUIRED');
     for(const l of o.lines){const r=s.resources[l.resourceId];check(r&&r.reserved>=l.qty&&r.reservedValueCents>=l.reservedCostCents,'RESERVATION_MISMATCH');effect(r,'LEGACY_RESERVATION_RELEASE',0,-l.qty,0,-l.reservedCostCents);}o.state='CANCELLED';o.outstandingCents=0;o.cancellationEvidence=c.evidence;
    }
    event('OBLIGATION',{obligation:o});p.sale.version=o.version;
   }
   check(JSON.stringify({command:c,fingerprint:canonical(c),plan:p}).length<=38000,'CONTINUITY_PLAN_TOO_LARGE');return p;
  }
 };
}
function inspectContinuity(engine){
 const s=engine.state();for(const r of Object.values(s.resources)){
  const legacy=Object.values(s.continuity.obligations).filter(o=>o.state==='RESERVED').flatMap(o=>o.lines).filter(l=>l.resourceId===r.id);
  const sales=Object.values(s.sales).filter(x=>x.status==='RESERVED').flatMap(x=>x.lines).filter(l=>l.resourceId===r.id);
  check(r.reserved===legacy.reduce((n,x)=>n+x.qty,0)+sales.reduce((n,x)=>n+x.qty,0),'RESERVATION_MISMATCH');
  check(r.physical>=r.reserved&&r.valueCents>=r.reservedValueCents&&r.reserved>=0,'BALANCE_INVARIANT');
 }
 return s;
}
module.exports={createEngineClass,inspectContinuity};
