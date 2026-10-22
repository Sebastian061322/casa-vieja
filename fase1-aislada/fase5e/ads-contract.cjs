'use strict';
// Contrato sintético, sin red, tokens, programadores ni escrituras contables.
const {canonical}=require('../fase3/journal.js'),{hash}=require('./recovery.cjs');
const check=(v,e)=>{if(!v)throw Error(e)},num=n=>check(Number.isSafeInteger(n)&&n>=0,'INVALID_AD_METRIC');
function observe(log,row){
  check(row?.environment==='TEST_ONLY'&&['accountId','campaignId','adsetId','adId'].every(k=>row[k]===null||/^TEST_ONLY_/.test(row[k])),'SYNTHETIC_IDS_REQUIRED');
  check(row.accountId&&row.campaignId&&/^\d{4}-\d{2}-\d{2}$/.test(row.sourceDate)&&new Date(row.sourceDate+'T12:00:00Z').toISOString().slice(0,10)===row.sourceDate,'INVALID_AD_DATE');
  check(['PEN','USD'].includes(row.currency)&&typeof row.sourceTimezone==='string'&&row.breakdown==='NONE'&&typeof row.attributionWindow==='string'&&typeof row.metricDefinition==='string'&&row.metricDefinition.length>0,'QUERY_SPEC_REQUIRED');
  try{new Intl.DateTimeFormat('es-PE',{timeZone:row.sourceTimezone})}catch{throw Error('INVALID_TIMEZONE')}
  check(row.grain==='AD'&&row.adsetId&&row.adId,'AD_GRAIN_REQUIRED');
  check(typeof row.observedAt==='string'&&new Date(row.observedAt).toISOString()===row.observedAt,'INVALID_OBSERVED_AT');
  for(const k of ['spendCents','impressions','reach','clicks','conversations'])num(row[k]);
  const key=canonical([row.accountId,row.campaignId,row.adsetId,row.adId,row.sourceDate,row.sourceTimezone,row.currency,row.grain,row.breakdown,row.attributionWindow,row.metricDefinition]);
  const digest=hash({...row,observedAt:undefined});
  const previous=log.filter(r=>r.key===key).sort((a,b)=>a.observedAt.localeCompare(b.observedAt)).at(-1);
  if(previous?.digest===digest)return {appended:false,id:previous.id};
  check(!log.some(r=>r.key===key&&r.observedAt===row.observedAt&&r.digest!==digest),'AD_OBSERVATION_CONFLICT');
  const entry={id:hash([key,row.observedAt,digest]),key,digest,observedAt:row.observedAt,payload:structuredClone(row),limaDate:row.sourceTimezone==='America/Lima'?row.sourceDate:null,requiresHourlyForLima:row.sourceTimezone!=='America/Lima'};
  log.push(entry);return {appended:true,id:entry.id};
}
function latest(log){const groups=new Map();for(const row of log){const old=groups.get(row.key);if(!old||row.observedAt>old.observedAt)groups.set(row.key,row)}return [...groups.values()].map(x=>structuredClone(x));}
function profitability(ad,links){
  const ids=new Set(),verified=[],estimated=[];
  for(const link of links){check(!ids.has(link.saleId),'DUPLICATE_SALE_LINK');ids.add(link.saleId);check(link.environment==='TEST_ONLY'&&link.accountId===ad.accountId&&link.campaignId===ad.campaignId&&link.currency===ad.currency&&['VERIFIED','ESTIMATED'].includes(link.attribution),'ATTRIBUTION_REQUIRED');
    if(link.attribution==='VERIFIED'){check(link.evidenceRef&&['DISPATCHED','DELIVERED'].includes(link.status),'CONFIRMED_REVENUE_REQUIRED');for(const k of ['revenueCents','cogsCents','shippingCents','otherCents'])num(link[k]);verified.push(link)}else estimated.push(link);
  }
  const sum=k=>verified.reduce((n,l)=>n+l[k],0),revenue=sum('revenueCents'),profit=revenue-sum('cogsCents')-sum('shippingCents')-sum('otherCents')-ad.spendCents;
  return {verifiedSales:verified.length,estimatedLinks:estimated.length,conversations:ad.conversations,conversationDefinition:ad.metricDefinition,costPerConversationCents:ad.conversations?ad.spendCents/ad.conversations:null,revenueCents:revenue,profitAfterAdsCents:profit,roas:ad.spendCents?revenue/ad.spendCents:null,returnAfterCosts:ad.spendCents?profit/ad.spendCents:null};
}
module.exports={observe,latest,profitability};
