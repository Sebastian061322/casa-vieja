'use strict';
const base=require('../fase5g/opening-act.cjs');
const fail=(ok,code)=>{if(!ok)throw Error(code)};
function verify(act){
 const result=base.verify(act);
 fail(typeof act.countEvidence==='string'&&act.countEvidence.trim(),'COUNT_EVIDENCE_REQUIRED');
 const totals={PARCHMENT:0,GREEN:0,BULK:0,PACKAGED:0,SUPPLY:0,coffeeGrams:0,valueCents:0,available:{},held:{}};
 for(const r of act.rows){
  fail(typeof r.countedAt==='string'&&Number.isFinite(Date.parse(r.countedAt))&&Date.parse(r.countedAt)<=Date.parse(act.effectiveAt),'COUNT_DATE_REQUIRED');
  fail(typeof r.countEvidence==='string'&&r.countEvidence.trim(),'ROW_COUNT_EVIDENCE_REQUIRED');
  fail(r.physical!==0||r.historicalValueCents===0,'VALUE_WITHOUT_STOCK');
  if(r.stage==='SUPPLY')fail(typeof r.supplyKind==='string'&&r.supplyKind.trim(),'SUPPLY_KIND_REQUIRED');
  if(r.availability!=='AVAILABLE')fail(r.reserved===0,'HELD_STOCK_CANNOT_FULFIL_RESERVATIONS');
  totals[r.stage]+=r.physical;totals.valueCents+=r.historicalValueCents;
  if(r.stage!=='SUPPLY')totals.coffeeGrams+=r.unit==='g'?r.physical:r.physical*r.grams;
  totals.available[r.resourceId]=r.availability==='AVAILABLE'?r.physical-r.reserved:0;
  if(r.availability!=='AVAILABLE')totals.held[r.resourceId]=r.physical;
  fail([totals.valueCents,totals.coffeeGrams,totals[r.stage]].every(Number.isSafeInteger),'TOTAL_OVERFLOW');
 }
 return {...result,totals,assumedYield:false,financialEvents:[],inventoryWrites:false};
}
module.exports={verify};
