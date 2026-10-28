'use strict';
const crypto=require('node:crypto');
const {canonical,clone}=require('../fase3/journal.js');
const opening=require('../fase5g1/opening.cjs'),continuity=require('../fase5g1/continuity.cjs');
const check=(ok,e)=>{if(!ok)throw Error(e)},text=x=>typeof x==='string'&&x.trim().length>0;
const hash=x=>crypto.createHash('sha256').update(canonical(x)).digest('hex');
function prepare(act,input){
 const verified=opening.verify(act),plan=continuity.plan(input);
 for(const o of plan.obligations){
  check(text(o.responsible)&&o.responsible.startsWith('TEST_ONLY:'),'OBLIGATION_RESPONSIBLE_REQUIRED');
  check(o.origin?.system==='TEST_ONLY_LEGACY'&&text(o.origin.recordId)&&o.origin.recordId===o.legacyRef,'SOURCE_LINK_REQUIRED');
  check(Number.isSafeInteger(o.origin.revision)&&o.origin.revision>0&&/^[a-f0-9]{64}$/.test(o.origin.evidenceHash||''),'SOURCE_EVIDENCE_REQUIRED');
 }
 continuity.reconcile(act,plan);
 const families=new Map();for(const row of act.rows){
  check([row.physical,row.reserved,row.historicalValueCents].every(n=>n<=100000000000),'ENGINE_LIMIT_EXCEEDED');
  check(text(row.product)&&text(row.documentRef),'OPENING_DOCUMENT_REQUIRED');
  if(row.reserved)check(row.stage==='PACKAGED','RESERVATION_STAGE_REQUIRED');
  if(row.stage!=='SUPPLY'){check(!families.has(row.lot)||families.get(row.lot)===row.family,'LOT_FAMILY_MISMATCH');families.set(row.lot,row.family);}
 }
 const body={environment:'TEST_ONLY',productionApproved:false,schemaVersion:1,act:clone(act),obligations:clone(plan.obligations),actHash:verified.sha256,continuityHash:plan.sha256};
 return {...body,bundleHash:hash(body),totals:verified.totals,executableInProduction:false};
}
function verifyBundle(b){
 check(b?.environment==='TEST_ONLY'&&b.productionApproved===false,'TEST_ONLY_REQUIRED');
 const input={environment:'TEST_ONLY',status:'DRAFT',obligations:b.obligations.map(o=>{
  const v=clone(o);for(const k of ['outstandingCents','legacyRevenueRecognized','legacyCostRecognized','legacyPaymentRecognized','physicalDelta'])delete v[k];return v;
 })};
 const expected=prepare(b.act,input);check(canonical(b)===canonical(expected),'BUNDLE_CHANGED');return expected;
}
module.exports={prepare,verifyBundle,hash};
