/* Inventario sintético: cantidades enteras en gramos o unidades; dinero en céntimos. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./journal.js'):root.CVInventoryBase);if(typeof module==='object'&&module.exports)module.exports=api;else root.CVInventory=api;})(typeof globalThis==='object'?globalThis:this,function(B){
'use strict';
const {BaseEngine,EPOCH,canonical,clone,uint,id,require_:check}=B;
const proportion=(value,qty,total)=>Number(BigInt(value)*BigInt(qty)/BigInt(total));
class Engine extends BaseEngine{
 constructor(store,opening={epoch:EPOCH,resources:{}},hook=()=>{}){check(opening.epoch===EPOCH&&Object.keys(opening.resources).length===0,'INVALID_OPENING');super(store,opening,hook);}
 state(){
  const rows=this.records(),effects=this.effects(),s={epoch:EPOCH,revision:0,resources:{},lots:{},sales:{},effects:[]};
  for(const commit of rows.filter(r=>r.kind==='COMMITTED')){
   const p=rows.find(r=>r.kind==='PREPARED'&&r.id===commit.id);check(p&&p.result.revision===s.revision+1&&canonical(commit.result)===canonical(p.result)&&p.fingerprint===canonical(p.command),'CORRUPT_COMMIT');
   for(const r of p.plan.resources||[]){check(!s.resources[r.id],'RESOURCE_EXISTS');s.resources[r.id]=clone(r);}
   for(const lot of p.plan.lots||[]){check(!s.lots[lot.id],'LOT_EXISTS');s.lots[lot.id]=clone(lot);}
   for(const e of p.plan.effects){check(effects.some(x=>x.id===e.id&&canonical(x)===canonical(e)),'INCOMPLETE_COMMIT');const r=s.resources[e.resourceId];check(r,'RESOURCE_UNAVAILABLE');r.physical+=e.qtyDelta;r.reserved+=e.reservedDelta;r.valueCents+=e.valueDelta;r.reservedValueCents+=e.reservedValueDelta;r.qty=r.physical-r.reserved;check([r.physical,r.reserved,r.valueCents,r.reservedValueCents,r.qty].every(Number.isSafeInteger)&&r.qty>=0&&r.reserved>=0&&r.valueCents>=r.reservedValueCents&&r.reservedValueCents>=0,'CORRUPT_STOCK');s.effects.push(clone(e));}
   if(p.plan.sale.entityType==='sale')s.sales[p.plan.sale.id]=clone(p.plan.sale);s.revision=p.result.revision;
  }return s;
 }
 plan(s,c){
  check(typeof c.date==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(c.date)&&!Number.isNaN(Date.parse(c.date)),'INVALID_DATE');
  check(typeof c.responsible==='string'&&c.responsible.trim().length>0&&c.responsible.length<=120,'INVALID_RESPONSIBLE');
  const effects=[],resources=[],lots=[];let sale={id:c.saleId,version:1,entityType:'inventory'};
  const resource=key=>{id(key,'demo:');const r=s.resources[key];check(r,'RESOURCE_UNAVAILABLE');return r;};
  const effect=(r,kind,physical=0,reserved=0,value=0,reservedValue=0,extra={})=>{check([physical,reserved,value,reservedValue].every(Number.isSafeInteger),'INVALID_NUMBER');effects.push({id:c.operationId+':'+effects.length,operationId:c.operationId,saleId:c.saleId,date:c.date,responsible:c.responsible,lot:r.lot,product:r.product,unit:r.unit,resourceId:r.id,kind,qtyDelta:physical,reservedDelta:reserved,valueDelta:value,reservedValueDelta:reservedValue,...extra});};
  const define=(key,attrs)=>{id(key,'demo:');check(!s.resources[key]&&!resources.some(x=>x.id===key),'RESOURCE_EXISTS');const r={id:key,physical:0,reserved:0,valueCents:0,reservedValueCents:0,qty:0,...attrs};resources.push(r);return r;};
  const allocate=(r,n)=>{uint(n,1);check(r.qty>=n,'INSUFFICIENT_STOCK');return proportion(r.valueCents-r.reservedValueCents,n,r.qty);};
  const reason=()=>check(typeof c.reason==='string'&&c.reason.trim().length>0&&c.reason.length<=500,'REASON_REQUIRED');
  if(c.type==='RECEIVE_LOT'){
   id(c.lotId,'demo:');check(!s.lots[c.lotId],'LOT_EXISTS');check(['Gourmet','Especialidad'].includes(c.family),'INVALID_FAMILY');check(typeof c.origin==='string'&&c.origin.trim().length>0&&c.origin.length<=200&&typeof c.coffeeType==='string'&&c.coffeeType.length>0&&c.coffeeType.length<=120,'INVALID_LOT');uint(c.grams,1);const cost=uint(uint(c.acquisitionCents)+uint(c.processingCents));
   const lot={id:c.lotId,origin:c.origin,coffeeType:c.coffeeType,family:c.family,receivedGrams:c.grams,acquisitionCents:c.acquisitionCents,processingCents:c.processingCents,date:c.date,operationId:c.operationId};lots.push(lot);
   const r=define(c.resourceId,{lot:c.lotId,product:'pergamino',stage:'PARCHMENT',family:c.family,unit:'g'});effect(r,'LOT_RECEIPT',c.grams,0,cost);
  }else if(c.type==='RECEIVE_SUPPLY'){
   check(['BAG250','BAG500','LABEL'].includes(c.supplyKind),'INVALID_SUPPLY');uint(c.qty,1);uint(c.totalCostCents);id(c.lotId,'demo:');
   const r=define(c.resourceId,{lot:c.lotId,product:c.supplyKind,stage:'SUPPLY',unit:'unit',supplyKind:c.supplyKind});effect(r,'SUPPLY_RECEIPT',c.qty,0,c.totalCostCents);
  }else if(c.type==='ROAST'){
   const r=resource(c.resourceId);check(r.stage==='PARCHMENT','INVALID_STAGE');uint(c.outputGrams,1);uint(c.wasteGrams);uint(c.processingCents);const input=uint(c.outputGrams+c.wasteGrams,1),cost=allocate(r,input);
   const out=define(c.outputResourceId,{lot:r.lot,product:'tostado',stage:'BULK',unit:'g',family:r.family});
   effect(r,'ROAST_INPUT',-input,0,-cost);effect(out,'ROAST_OUTPUT',c.outputGrams,0,uint(cost+c.processingCents),0,{processingCents:c.processingCents});effect(r,'PROCESS_WASTE',0,0,0,0,{wasteGrams:c.wasteGrams,fromStage:'PARCHMENT'});
  }else if(c.type==='PREPARE_BAGS'){
   const r=resource(c.resourceId);check(r.stage==='BULK','INVALID_STAGE');check([250,500].includes(c.bagGrams)&&['grano','molido'].includes(c.grind),'INVALID_PRESENTATION');uint(c.bags,1);uint(c.wasteGrams);uint(c.processingCents);const used=uint(c.bags*c.bagGrams+c.wasteGrams,1),coffeeCost=allocate(r,used);
   check(Array.isArray(c.materials)&&c.materials.length===2,'INVALID_RECIPE');const seen=new Set();let cost=coffeeCost+c.processingCents;
   for(const item of c.materials){const m=resource(item.resourceId);check(m.stage==='SUPPLY'&&[c.bagGrams===250?'BAG250':'BAG500','LABEL'].includes(m.supplyKind)&&!seen.has(m.supplyKind),'INVALID_RECIPE');seen.add(m.supplyKind);const v=allocate(m,c.bags);cost+=v;effect(m,'PREPARATION_SUPPLY',-c.bags,0,-v);}
   const out=define(c.outputResourceId,{lot:r.lot,product:r.family+' '+c.grind+' '+c.bagGrams+'g',stage:'PACKAGED',unit:'unit',family:r.family,grind:c.grind,grams:c.bagGrams,preparedBy:c.responsible});
   effect(r,'PREPARATION_COFFEE',-used,0,-coffeeCost);effect(out,'PREPARATION_OUTPUT',c.bags,0,uint(cost),0,{processingCents:c.processingCents});effect(r,'PROCESS_WASTE',0,0,0,0,{wasteGrams:c.wasteGrams,fromStage:'BULK'});
  }else if(c.type==='REGISTER_SALE'||c.type==='RESERVE_SALE'){
   check(!s.sales[c.saleId],'SALE_EXISTS');check(Array.isArray(c.lines)&&c.lines.length>0&&c.lines.length<=20,'INVALID_LINES');const seen=new Set();const lines=c.lines.map(l=>{const r=resource(l.resourceId);check(r.stage==='PACKAGED'&&!seen.has(r.id),'INVALID_LINES');seen.add(r.id);const cost=allocate(r,l.qty);effect(r,'SALE_RESERVATION',0,l.qty,0,cost);return {resourceId:r.id,qty:l.qty,lot:r.lot,family:r.family,grind:r.grind,grams:r.grams,totalCostCents:cost,returned:0,returnedCostCents:0};});
   const total=uint(c.totalCents),cost=uint(lines.reduce((n,l)=>n+l.totalCostCents,0)),shipping=uint(c.deliveryCostCents||0),charged=uint(c.deliveryChargedCents||0);
   sale={id:c.saleId,entityType:'sale',version:1,status:'RESERVED',lines,totalCents:total,costCents:cost,profitCents:total+charged-shipping-cost,deliveryCostCents:shipping,deliveryChargedCents:charged,metadata:this.metadata(c.metadata||{}),originOperationId:c.operationId};
  }else if(c.type==='WASTE'){
   reason();const r=resource(c.resourceId),cost=allocate(r,c.qty);effect(r,'STOCK_WASTE',-c.qty,0,-cost,0,{reason:c.reason,wasteGrams:r.unit==='g'?c.qty:r.stage==='PACKAGED'?uint(c.qty*r.grams):0});
  }else{
   const old=s.sales[c.saleId];check(old,'FUTURE_SALE_NOT_FOUND');sale=clone(old);
   if(c.type==='CANCEL_SALE'&&old.status==='CANCELLED')return {sale,effects,resources,lots};
   check(c.expectedSaleVersion===old.version,'SALE_VERSION_CONFLICT');
   if(c.type==='CANCEL_SALE'){
    reason();check(old.status==='RESERVED','RETURN_RECEIPT_REQUIRED');for(const l of sale.lines)effect(resource(l.resourceId),'RESERVATION_RELEASE',0,-l.qty,0,-l.totalCostCents, {reverses:old.originOperationId});sale.status='CANCELLED';sale.cancelReason=c.reason;
   }else if(c.type==='DISPATCH_SALE'){
    check(old.status==='RESERVED','INVALID_SALE_STATE');for(const l of sale.lines)effect(resource(l.resourceId),'DISPATCH',-l.qty,-l.qty,-l.totalCostCents,-l.totalCostCents,{reservationOperationId:old.originOperationId});sale.status='DISPATCHED';
   }else if(c.type==='RETURN_SALE'){
    reason();check(['DISPATCHED','PART_RETURNED'].includes(old.status),'INVALID_SALE_STATE');check(Array.isArray(c.lines)&&c.lines.length>0&&c.lines.length<=20,'INVALID_LINES');const seen=new Set();
    for(const item of c.lines){check(!seen.has(item.resourceId),'INVALID_LINES');seen.add(item.resourceId);const l=sale.lines.find(x=>x.resourceId===item.resourceId);check(l,'INVALID_LINES');uint(item.qty,1);check(l.returned+item.qty<=l.qty,'RETURN_EXCEEDS_DISPATCH');const cumulative=proportion(l.totalCostCents,l.returned+item.qty,l.qty),cost=cumulative-l.returnedCostCents;effect(resource(l.resourceId),'PHYSICAL_RETURN',item.qty,0,cost,0,{dispatchSaleId:sale.id,reason:c.reason});l.returned+=item.qty;l.returnedCostCents=cumulative;}
    sale.status=sale.lines.every(l=>l.returned===l.qty)?'RETURNED':'PART_RETURNED';
   }else if(c.type==='EDIT_SALE'){
    check(!['totalCents','profitCents','costCents','lines','deliveryCostCents','deliveryChargedCents'].some(k=>Object.hasOwnProperty.call(c,k)),'FINANCIAL_EDIT_NOT_ALLOWED');sale.metadata=Object.assign({},sale.metadata,this.metadata(c.metadata||{}));
   }else if(c.type==='PAY_SALE'||c.type==='DELIVER_SALE'){
    check(c.type==='PAY_SALE'?['RESERVED','DISPATCHED'].includes(old.status):old.status==='DISPATCHED','INVALID_SALE_STATE');sale[c.type==='PAY_SALE'?'paid':'delivered']=true;
   }else throw Error('COMMAND_NOT_ALLOWED');sale.version++;
  }
  return {sale,effects,resources,lots};
 }
}
return {Engine,EPOCH,canonical,clone};
});
