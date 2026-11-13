import crypto from 'node:crypto';

const clone=value=>structuredClone(value);
const check=(condition,code)=>{if(!condition)throw Error(code);};
const canonical=value=>Array.isArray(value)
  ?`[${value.map(canonical).join(',')}]`
  :value&&typeof value==='object'
    ?`{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`
    :JSON.stringify(value);
const hash=value=>crypto.createHash('sha256').update(canonical(value)).digest('hex');

function legacyEvent(kind,row){
 const sourceRef=String(row.sourceRef||'');
 check(/^legacy:[^:]+:[A-Za-z]+:.+$/.test(sourceRef),'INVALID_SOURCE_REF');
 return Object.freeze({
  eventId:`legacy-event:${hash([kind,sourceRef]).slice(0,32)}`,
  kind,
  sourceRef,
  legacy:true,
  immutable:true,
  inventoryEffects:false,
  payload:clone(row)
 });
}
export function prepareCommercialMigration(source,{existingSourceRefs=[]}={}){
 check(source?.status==='PREPARED_NOT_IMPORTED','MIGRATION_NOT_PREPARED');
 check(source?.source?.sourceUnchanged===true,'SOURCE_MUTATION_NOT_ALLOWED');
 check(source?.policy?.historicalRowsImmutable===true,'IMMUTABLE_HISTORY_REQUIRED');
 check(source?.policy?.historicalInventoryEffects===false,'HISTORICAL_STOCK_REPLAY_FORBIDDEN');
 check(source?.policy?.oldSystemRemainsActive===true,'OLD_SYSTEM_CONTINUITY_REQUIRED');
 check(source?.policy?.noDualStockWritersBeforeCutover===true,'DUAL_WRITER_GUARD_REQUIRED');
 check(Array.isArray(source.sales)&&source.sales.length>0,'LEGACY_SALES_REQUIRED');

 const seen=new Set(existingSourceRefs),created=[],skipped=[];
 const add=(kind,row)=>{
  check(!created.some(event=>event.sourceRef===row.sourceRef),'DUPLICATE_SOURCE_REF_IN_PACKAGE');
  if(seen.has(row.sourceRef)){skipped.push(row.sourceRef);return;}
  const event=legacyEvent(kind,row);seen.add(event.sourceRef);created.push(event);
 };
 for(const row of source.sales)add('LEGACY_SALE_IMPORTED',row);
 for(const row of source.expenses||[])add('LEGACY_EXPENSE_IMPORTED',row);
 for(const row of source.ads||[])add('LEGACY_AD_IMPORTED',row);
 for(const row of source.movementsAuditOnly||[])add('LEGACY_MOVEMENT_AUDIT_IMPORTED',row);

 const opening=source.opening;
 check(opening?.poolId==='CASA_VIEJA_COMMON_BLEND_2026_11','OPENING_POOL_REQUIRED');
 check(opening?.asOf==='2026-11-01','OPENING_DATE_REQUIRED');
 check(Number.isFinite(opening.availableKgAtSourceSnapshot)&&opening.availableKgAtSourceSnapshot>=0,'INVALID_OPENING_BALANCE');
 check(Math.abs(opening.operationalOpeningKg-opening.novemberConsumedKg-opening.availableKgAtSourceSnapshot)<1e-9,'OPENING_RECONCILIATION_FAILED');
 const openingEvent={
  eventId:`opening:${opening.poolId}`,
  kind:'COMMERCIAL_INVENTORY_OPENED',
  sourceRef:`opening:${opening.poolId}`,
  at:opening.asOf,
  poolId:opening.poolId,
  lot:opening.lot,
  grams:Math.round(opening.availableKgAtSourceSnapshot*1000),
  unitCostCentsPerKg:Math.round(Number(source.costPolicy.coffeePerKg)*100),
  sharedAcrossCommercialFamilies:opening.sharedAcrossCommercialFamilies===true,
  historicalSalesAlreadyDeducted:true
 };
 check(openingEvent.grams===139500,'OPENING_SNAPSHOT_MISMATCH');
 if(seen.has(openingEvent.sourceRef))skipped.push(openingEvent.sourceRef);
 else created.push(Object.freeze(openingEvent));

 return Object.freeze({
  schemaVersion:1,
  mode:'PRE_CUTOVER_READ_ONLY_HISTORY',
  sourceWorkbookSha256:source.source.workbookSha256,
  packageSha256:hash(source),
  events:created,
  skipped,
  counts:{created:created.length,skipped:skipped.length},
  guards:{oldSystemActive:true,newSalesEnabled:false,stockWriter:'OLD_SYSTEM_ONLY'}
 });
}

export function applyMigrationInMemory(state,plan,{interruptAfter=Infinity}={}){
 const next=clone(state||{events:[],sourceRefs:{}});
 next.events=next.events||[];next.sourceRefs=next.sourceRefs||{};
 let applied=0;
 for(const event of plan.events){
  if(next.sourceRefs[event.sourceRef])continue;
  if(applied>=interruptAfter)return {state:next,status:'INCOMPLETE',applied};
  next.events.push(clone(event));
  next.sourceRefs[event.sourceRef]=event.eventId;
  applied++;
 }
 return {state:next,status:'COMPLETE',applied};
}
