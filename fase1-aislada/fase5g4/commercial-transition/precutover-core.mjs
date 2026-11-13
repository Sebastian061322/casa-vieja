const check=(ok,code)=>{if(!ok)throw Error(code);};

export function verifyCommercialPrecutover({control,opening,counts}){
 const values=Object.fromEntries(control.slice(1).map(row=>[String(row[0]),row[1]]));
 check(values.Entorno==='COMMERCIAL_PRE_CUTOVER','WRONG_ENVIRONMENT');
 check(values.Estado==='CARGADO_SIN_VENTAS_NUEVAS','WRONG_STATE');
 check(values['Ventas nuevas habilitadas']==='NO','SALES_MUST_REMAIN_DISABLED');
 check(values['Escritor de stock autorizado']==='SISTEMA_ANTIGUO','OLD_WRITER_REQUIRED');
 check(values['Fuente antigua']==='SOLO_LECTURA','SOURCE_MUST_BE_READ_ONLY');
 check(Number(values['Ventas legado'])===328,'LEGACY_SALES_MISMATCH');
 check(Number(values['Movimientos solo auditoría'])===430,'LEGACY_MOVEMENTS_MISMATCH');
 const headers=opening[0]||[],row=opening[1]||[],entry=Object.fromEntries(headers.map((key,index)=>[key,row[index]]));
 check(entry.state==='PREPARED_NOT_ACTIVE','OPENING_ALREADY_ACTIVE');
 check(entry.poolId==='CASA_VIEJA_COMMON_BLEND_2026_11','OPENING_POOL_MISMATCH');
 check(Number(entry.grams)===139500,'OPENING_GRAMS_MISMATCH');
 check(Number(entry.unitCostPerKg)===36.35,'OPENING_COST_MISMATCH');
 check(entry.historicalSalesAlreadyDeducted===true,'HISTORY_DEDUCTION_REQUIRED');
 check(counts.sales===328&&counts.movements===430&&counts.expenses===17&&counts.ads===103,'IMPORT_COUNTS_MISMATCH');
 return Object.freeze({
  environment:'COMMERCIAL_PRE_CUTOVER',
  status:'VERIFIED_READ_ONLY',
  newSalesEnabled:false,
  stockWriter:'OLD_SYSTEM_ONLY',
  opening:{state:entry.state,poolId:entry.poolId,grams:Number(entry.grams),unitCostPerKg:Number(entry.unitCostPerKg)},
  counts:{...counts}
 });
}

export function rejectPrecutoverWrite(){
 return Object.freeze({error:'CUTOVER_NOT_APPROVED',retryable:false,newSalesEnabled:false});
}
