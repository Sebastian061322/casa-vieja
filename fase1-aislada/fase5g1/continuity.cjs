'use strict';
// Plan prospectivo puro: nunca recontabiliza ventas, costos ni cobros anteriores.
const {canonical}=require('../fase3/journal.js');
const crypto=require('node:crypto');
const fail=(ok,code)=>{if(!ok)throw Error(code)};
const uint=n=>Number.isSafeInteger(n)&&n>=0;
function plan(input){
 fail(input?.environment==='TEST_ONLY'&&input.status==='DRAFT','DRAFT_REQUIRED');
 fail(Array.isArray(input.obligations),'OBLIGATIONS_REQUIRED');
 const refs=new Set(),allocations=new Map();
 const obligations=input.obligations.map(o=>{
  fail(typeof o.legacyRef==='string'&&/^TEST_ONLY:/.test(o.legacyRef)&&!refs.has(o.legacyRef),'UNIQUE_LEGACY_REF_REQUIRED');refs.add(o.legacyRef);
  fail(['RESERVED','DISPATCHED_UNPAID','DELIVERY_PENDING','CANCEL_UNRESOLVED','UNKNOWN'].includes(o.state),'INVALID_OBLIGATION_STATE');
  fail(typeof o.evidence==='string'&&o.evidence.trim()&&uint(o.totalCents)&&uint(o.paidCents)&&o.paidCents<=o.totalCents,'FINANCIAL_EVIDENCE_REQUIRED');
  fail(Array.isArray(o.lines),'LINES_REQUIRED');
  const seen=new Set();for(const l of o.lines){
   fail(typeof l.resourceId==='string'&&l.resourceId.startsWith('demo:')&&!seen.has(l.resourceId)&&uint(l.qty)&&l.qty>0,'INVALID_LINE');seen.add(l.resourceId);
   if(o.state==='RESERVED')allocations.set(l.resourceId,(allocations.get(l.resourceId)||0)+l.qty);
  }
  if(o.state==='RESERVED')fail(o.lines.length>0,'RESERVATION_LINES_REQUIRED');
  return {...structuredClone(o),outstandingCents:o.totalCents-o.paidCents,legacyRevenueRecognized:false,legacyCostRecognized:false,legacyPaymentRecognized:false,physicalDelta:0};
 });
 const blockers=obligations.filter(o=>['UNKNOWN','CANCEL_UNRESOLVED'].includes(o.state)).map(o=>o.legacyRef);
 const body={environment:'TEST_ONLY',status:'DRAFT',obligations,reservations:Object.fromEntries(allocations),blockers,executable:false,requiresOwnerApproval:true,financialEvents:[],inventoryEffects:[]};
 return {...body,sha256:crypto.createHash('sha256').update(canonical(body)).digest('hex')};
}
function reconcile(opening,continuity){
 const rows=new Map(opening.rows.map(r=>[r.resourceId,r]));
 for(const [id,qty]of Object.entries(continuity.reservations))fail(rows.has(id)&&rows.get(id).reserved===qty,'CARRYOVER_RESERVATION_MISMATCH');
 for(const r of opening.rows){
  fail((continuity.reservations[r.resourceId]||0)===r.reserved,'CARRYOVER_RESERVATION_MISMATCH');
  const expected=continuity.obligations.filter(o=>o.state==='RESERVED').flatMap(o=>o.lines.filter(l=>l.resourceId===r.resourceId).map(l=>({legacyRef:o.legacyRef,reserved:l.qty}))).sort((a,b)=>a.legacyRef.localeCompare(b.legacyRef));
  fail(canonical([...r.pendingOrders].sort((a,b)=>a.legacyRef.localeCompare(b.legacyRef)))===canonical(expected),'LEGACY_REFERENCE_MISMATCH');
 }
 fail(!continuity.blockers.length,'UNRESOLVED_LEGACY_OPERATIONS');
 return {matched:true,executable:false,createsHistoricalRevenue:false,createsHistoricalCost:false,createsHistoricalPayment:false};
}
module.exports={plan,reconcile};
