/* Reutiliza exclusivamente las guardas y bloqueo del proyecto autorizado. V2 permanece disponible. */
const INV_TABS_=['DiarioInventarioV3','MovimientosInventarioV3','VerificacionesInventarioV3'];
function invRead_(ss,name){if(!INV_TABS_.includes(name))throw Error('TAB_FORBIDDEN');const sh=ss.getSheetByName(name);if(!sh)throw Error('SETUP_REQUIRED');const n=sh.getLastRow();return n<2?[]:sh.getRange(2,1,n-1,3).getValues().map(r=>JSON.parse(r[2]));}
function invAppend_(ss,name,r){if(!INV_TABS_.includes(name))throw Error('TAB_FORBIDDEN');const raw=JSON.stringify(r);if(raw.length>40000)throw Error('RECORD_TOO_LARGE');ss.getSheetByName(name).appendRow([r.id,r.kind,raw]);SpreadsheetApp.flush();}
function invEngine_(){
 const ss=cvBook_();let journal=invRead_(ss,INV_TABS_[0]),effects=invRead_(ss,INV_TABS_[1]);
 // Cache solo durante el bloqueo actual. Cada append se relee de Sheets antes de confirmar.
 const append=(index,r)=>{invAppend_(ss,INV_TABS_[index],r);const fresh=invRead_(ss,INV_TABS_[index]);if(!fresh.some(x=>CVInventory.canonical(x)===CVInventory.canonical(r)))throw Error('EFFECT_NOT_DURABLE');if(index===0)journal=fresh;else effects=fresh;};
 return new CVInventory.Engine({readJournal:()=>CVInventory.clone(journal),readEffects:()=>CVInventory.clone(effects),appendJournal:r=>append(0,r),appendEffect:r=>append(1,r)});
}
function invReply_(fn){try{cvOwner_();return cvLocked_(fn);}catch(e){const domain=/^(INVALID_|INSUFFICIENT_|PROTOCOL_|WRONG_|OWNER_|SALE_|FUTURE_|COMMAND_|FINANCIAL_|RESOURCE_|REASON_|RETURN_|IDEMPOTENCY_|LOT_|CORRUPT_|JOURNAL_|TAB_|RECORD_|SETUP_)/.test(e.message);return {error:domain?e.message:'SERVER_UNAVAILABLE',retryable:!domain};}}
function inventoryInitialize(){return invReply_(()=>{const ss=cvBook_();for(const name of INV_TABS_)if(!ss.getSheetByName(name))ss.insertSheet(name).appendRow(['ID','Tipo','JSON']);return {initialized:true,epoch:CVInventory.EPOCH};});}
function inventoryExecute(c){return invReply_(()=>invEngine_().execute(c));}
function inventoryStatus(id){return invReply_(()=>invEngine_().status(id));}
function inventorySnapshot(){return invReply_(()=>invEngine_().state());}
function inventoryReport(report){return invReply_(()=>{if(!report||!/^inventory-browser-[a-zA-Z0-9-]+$/.test(report.run)||typeof report.passed!=='boolean'||!Array.isArray(report.results)||JSON.stringify(report).length>20000)throw Error('INVALID_REPORT');invAppend_(cvBook_(),INV_TABS_[2],{id:report.run,kind:'INVENTORY_REPORT',report});return {saved:true};});}
function inventoryScenario(){return invReply_(()=>{
 const e=invEngine_(),run='g3-'+Utilities.getUuid(),cs=CVScenario.commands(run),results=[];
 const record=(name,ok)=>{results.push({name,passed:!!ok});if(!ok)throw Error('SCENARIO_FAILED');};
 try{
 for(const c of cs){const result=e.execute(c);record(c.type+' '+c.operationId,result.state==='COMMITTED');if(JSON.stringify(e.execute(c))!==JSON.stringify(result))throw Error('RETRY_MISMATCH');}
 let s=e.state(),key=n=>'demo:'+run+'-'+n;const rs=Object.values(s.resources).filter(r=>r.id.startsWith('demo:'+run+'-'));const movements=s.effects.filter(x=>x.resourceId.startsWith('demo:'+run+'-'));
 record('Conservación de 11000 gramos ficticios',rs.filter(r=>r.stage!=='SUPPLY').reduce((n,r)=>n+r.physical*(r.unit==='g'?1:r.grams),0)+movements.reduce((n,x)=>n+(x.wasteGrams||0),0)===11000);
 record('Conservación del valor y costo de merma',rs.reduce((n,r)=>n+r.valueCents,0)+movements.filter(x=>x.kind==='STOCK_WASTE').reduce((n,x)=>n-x.valueDelta,0)===35600);
 record('Retorno físico completo mantiene costo histórico',s.sales[cs[10].saleId].lines.reduce((n,l)=>n+l.returnedCostCents,0)===s.sales[cs[10].saleId].costCents);
 const partial={...cs[6],operationId:run+'-crash',outputResourceId:key('recovery'),bags:1,wasteGrams:0};let fired=false;const failing=new CVInventory.Engine(e.store,e.opening,point=>{if(point==='afterEffect'&&!fired){fired=true;throw Error('INJECTED');}});try{failing.execute(partial);}catch(err){if(err.message!=='INJECTED')throw err;}record('Fallo parcial permanece PREPARED',e.status(partial.operationId).state==='PREPARED');e.execute(partial);record('Preparación se recupera una sola vez',e.state().resources[key('recovery')].physical===1);
 return {run,passed:true,results,resourceId:key('molido500'),recoveryResourceId:key('recovery'),saleId:cs[10].saleId};
 }catch(err){return {run,passed:false,results,error:err.message};}
});}
function doGet(event){cvOwner_();if(event&&event.parameter&&event.parameter.lab==='v2')return doGetPhase2_();return HtmlService.createHtmlOutput(INV_HTML_).setTitle('Casa Vieja · Inventario de pruebas');}
