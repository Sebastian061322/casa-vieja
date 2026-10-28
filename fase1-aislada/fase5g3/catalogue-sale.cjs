'use strict';
const {clone}=require('../fase3/journal.js'),{hash}=require('../fase5g2/opening.cjs');
const check=(ok,code)=>{if(!ok)throw Error(code)};
function prepareSale(state,command,config,catalogue,now){
 check(config?.environment==='TEST_ONLY'&&config.enabled===true&&config.approvalKind==='SYNTHETIC_TEST_APPROVAL','CATALOGUE_APPROVAL_REQUIRED');
 check(config.catalogueHash===hash(catalogue)&&command.catalogueVersion===catalogue.version,'CATALOGUE_VERSION_CONFLICT');
 const day=new Date(Date.parse(now)-5*3600000).toISOString().slice(0,10);
 check(/^\d{4}-\d{2}-\d{2}$/.test(config.validFrom||'')&&/^\d{4}-\d{2}-\d{2}$/.test(config.validUntil||'')&&config.validFrom<=day&&day<=config.validUntil,'CATALOGUE_NOT_EFFECTIVE');
 check(['REGISTER_SALE','RESERVE_SALE'].includes(command.type),'CATALOGUE_SALE_REQUIRED');
 for(const key of ['items','lines','totalCents','costCents','priceCents','discountCents','authorizationId'])check(command[key]===undefined,'CATALOGUE_BROWSER_PRICE_FORBIDDEN');
 const offer=catalogue.offers.find(o=>o.id===command.catalogueOfferId);check(offer,'CATALOGUE_OFFER_REQUIRED');
 const packs=command.packs;check(Number.isSafeInteger(packs)&&packs>0&&packs<=10,'INVALID_PACK_COUNT');
 check(Array.isArray(command.selections)&&command.selections.length>0&&command.selections.length<=8,'INVALID_SELECTIONS');
 const rows=[],seen=new Set(),actual={};
 for(const line of command.selections){
  check(Object.keys(line).sort().join(',')==='quantity,resourceId','INVALID_SELECTION_FIELDS');
  const r=state.resources[line.resourceId],binding=config.resourceLines?.[line.resourceId];
  check(r&&binding&&binding.lot===r.lot&&binding.grams===r.grams&&binding.grind===r.grind,'COMMERCIAL_LOT_MAPPING_REQUIRED');
  check(binding.line==='Gourmet'||binding.line==='Monte Alto','COMMERCIAL_LINE_REQUIRED');
  check(r.family===(binding.line==='Gourmet'?'Gourmet':'Especialidad')&&r.stage==='PACKAGED'&&r.grams===offer.grams&&['grano','molido'].includes(r.grind),'CATALOGUE_RESOURCE_MISMATCH');
  check(!seen.has(r.id)&&Number.isSafeInteger(line.quantity)&&line.quantity>0&&line.quantity<=30,'INVALID_SELECTION_QUANTITY');seen.add(r.id);
  actual[binding.line]=(actual[binding.line]||0)+line.quantity;
  const unit=catalogue.offers.find(o=>o.grams===offer.grams&&Object.keys(o.composition).length===1&&o.composition[binding.line]===1);check(unit,'CATALOGUE_UNIT_PRICE_REQUIRED');
  rows.push({r,quantity:line.quantity,weight:line.quantity*unit.priceCents});
 }
 check(Object.keys(actual).length===Object.keys(offer.composition).length&&Object.entries(offer.composition).every(([line,n])=>actual[line]===n*packs),'BUNDLE_COMPOSITION_MISMATCH');
 rows.sort((a,b)=>a.r.id.localeCompare(b.r.id));const weight=rows.reduce((n,r)=>n+r.weight,0),total=offer.priceCents*packs;
 const derived=clone(state);let cumulative=0,allocated=0;
 const items=rows.map((line,i)=>{cumulative+=line.weight;const next=Number(BigInt(total)*BigInt(cumulative)/BigInt(weight)),priceCents=next-allocated;allocated=next;
  const id='demo:cv53_internal_'+i;derived.commerce.offers[id]={id,name:offer.name,version:1,active:true,family:line.r.family,grind:line.r.grind,grams:offer.grams,bags:line.quantity,priceCents,validFrom:config.validFrom,validUntil:config.validUntil,synthetic:true};
  return {offerId:id,offerVersion:1,resourceId:line.r.id,quantity:1};
 });
 return {state:derived,command:{...clone(command),items},catalogueRef:{version:catalogue.version,sha256:config.catalogueHash,offerId:offer.id,priceCents:offer.priceCents,packs,totalCents:total,source:offer.source,approvalKind:'SYNTHETIC_TEST_APPROVAL',productionApproved:false}};
}
module.exports={prepareSale};
