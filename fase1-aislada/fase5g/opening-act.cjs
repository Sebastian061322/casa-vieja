'use strict';
const crypto=require('node:crypto'),{canonical,clone}=require('../fase3/journal.js');
const check=(x,e)=>{if(!x)throw Error(e)};const hash=x=>crypto.createHash('sha256').update(canonical(x)).digest('hex');
const stages=['PARCHMENT','GREEN','BULK','PACKAGED','SUPPLY'];
function verify(act){
 check(act?.environment==='TEST_ONLY'&&act.status==='DRAFT'&&act.productionApproved===false,'DRAFT_ACT_REQUIRED');
 check(/^TEST_ONLY:/.test(act.id||'')&&act.effectiveAt==='2026-11-01T00:00:00-05:00','INVALID_ACT_SCOPE');
 check(Array.isArray(act.rows)&&act.rows.length>0,'COUNT_REQUIRED');
 check(typeof act.responsible==='string'&&act.responsible&&typeof act.secondReviewer==='string'&&act.secondReviewer&&act.responsible!==act.secondReviewer,'TWO_REVIEWERS_REQUIRED');
 const seen=new Set();for(const r of act.rows){
  check(/^demo:/.test(r.resourceId||'')&&!seen.has(r.resourceId),'INVALID_RESOURCE');seen.add(r.resourceId);
  check(/^demo:/.test(r.lot||'')&&stages.includes(r.stage),'INVALID_STAGE');
  check(Number.isSafeInteger(r.physical)&&r.physical>=0&&Number.isSafeInteger(r.reserved)&&r.reserved>=0&&r.reserved<=r.physical,'INVALID_COUNT');
  check(['AVAILABLE','HELD','DAMAGED'].includes(r.availability),'AVAILABILITY_REQUIRED');
  check((r.stage==='PACKAGED'||r.stage==='SUPPLY')?r.unit==='unit':r.unit==='g','INVALID_UNIT');
  check(r.stage==='SUPPLY'||['Gourmet','Especialidad'].includes(r.family),'INVALID_FAMILY');
  if(r.stage==='BULK'||r.stage==='PACKAGED')check(['grano','molido'].includes(r.grind),'GRIND_REQUIRED');
  if(r.stage==='PACKAGED')check([250,500].includes(r.grams),'INVALID_PACK');
  check(Number.isSafeInteger(r.historicalValueCents)&&r.historicalValueCents>=0&&typeof r.costEvidence==='string'&&r.costEvidence.trim().length>0,'HISTORICAL_COST_EVIDENCE_REQUIRED');
  check(Array.isArray(r.pendingOrders)&&r.pendingOrders.every(o=>typeof o.legacyRef==='string'&&o.legacyRef&&Number.isSafeInteger(o.reserved)&&o.reserved>0),'PENDING_ORDERS_REQUIRED');
  check(new Set(r.pendingOrders.map(o=>o.legacyRef)).size===r.pendingOrders.length&&r.pendingOrders.reduce((n,o)=>n+o.reserved,0)===r.reserved,'RESERVATION_LINK_REQUIRED');
 }
 return {sha256:hash(act),rows:act.rows.length,executable:false,requiresOwnerApproval:true,requiresCarryoverDesign:act.rows.some(r=>r.reserved>0),noFinancialRevenue:true};
}
function sealDraft(act){return {act:clone(act),...verify(act)};}
module.exports={hash,verify,sealDraft,stages};
