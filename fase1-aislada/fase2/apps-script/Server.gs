/* Solo para el Apps Script independiente y la hoja sintética autorizados. */
const CV_TEST_SHEET_ID_ = '1CtK6KD995Pu2Fzc_na89Ajc0KQ0QLuGq3UFhj4UdLSA';
const CV_TEST_SCRIPT_ID_ = '1Dt2JbUp6BkGPdJLfngMR9ld-dVZUhSZykdlLCOsnLPngffKlrSuOxzfR';
const CV_TABS_ = ['DiarioV2','EfectosV2','AperturaV2','VerificacionesV2'];
function cvBook_(){
 if(ScriptApp.getScriptId()!==CV_TEST_SCRIPT_ID_)throw Error('WRONG_SCRIPT');
 const ss=SpreadsheetApp.openById(CV_TEST_SHEET_ID_);
 if(ss.getName()!=='CasaVieja_Pruebas_SINTETICA'||ss.getSheetByName('Control').getRange('B3').getValue()!=='TEST_ONLY')throw Error('WRONG_DESTINATION');
 return ss;
}
function cvOwner_(){
 const configured=PropertiesService.getScriptProperties().getProperty('SANDBOX_OWNER_EMAIL');
 const active=Session.getActiveUser().getEmail(),effective=Session.getEffectiveUser().getEmail();
 if(!configured||!active||active!==configured||effective!==configured)throw Error('OWNER_ONLY');
}
function cvLocked_(fn){const lock=LockService.getScriptLock();lock.waitLock(30000);try{return fn();}finally{lock.releaseLock();}}
function cvReadRows_(ss,name){if(CV_TABS_.indexOf(name)<0)throw Error('TAB_FORBIDDEN');const sh=ss.getSheetByName(name);if(!sh)throw Error('SETUP_REQUIRED');const n=sh.getLastRow();if(n<=1)return [];return sh.getRange(2,1,n-1,3).getValues().map(r=>JSON.parse(r[2]));}
function cvAppend_(ss,name,row){
 if(CV_TABS_.indexOf(name)<0)throw Error('TAB_FORBIDDEN');
 const raw=JSON.stringify(row);if(raw.length>40000)throw Error('RECORD_TOO_LARGE');
 ss.getSheetByName(name).appendRow([row.id||row.operationId||'opening',row.kind||'OPENING',raw]);SpreadsheetApp.flush();
}
function cvEngine_(){
 const ss=cvBook_();const rows=cvReadRows_(ss,'AperturaV2');if(rows.length!==1)throw Error('OPENING_REQUIRED');
 const store={readJournal:()=>cvReadRows_(ss,'DiarioV2'),readEffects:()=>cvReadRows_(ss,'EfectosV2'),appendJournal:r=>cvAppend_(ss,'DiarioV2',r),appendEffect:r=>cvAppend_(ss,'EfectosV2',r)};
 return new CVTransactions.Engine(store,rows[0]);
}
// Ejecutar manualmente en editor, una vez. Nunca accesible desde google.script.run.
function initializeSandbox_(){return cvLocked_(()=>{
 const active=Session.getActiveUser().getEmail(),effective=Session.getEffectiveUser().getEmail();if(!active||active!==effective)throw Error('OWNER_ONLY');
 const props=PropertiesService.getScriptProperties(),owner=props.getProperty('SANDBOX_OWNER_EMAIL');if(owner&&owner!==active)throw Error('OWNER_ONLY');
 const ss=cvBook_();
 for(const name of CV_TABS_){if(!ss.getSheetByName(name))ss.insertSheet(name).appendRow(['ID','Tipo','JSON']);}
 if(cvReadRows_(ss,'AperturaV2').length===0){
  const rows=ss.getSheetByName('RecursosDemo').getRange('A2:G3').getValues(),resources={};
  rows.forEach(r=>{resources[r[0]]={lot:r[1],family:r[2],grind:r[3],grams:r[4],qty:r[5],unitCostCents:r[6],active:true};});
  const opening={epoch:CVTransactions.EPOCH,resources};
  // Validar apertura antes de escribirla.
  new CVTransactions.Engine({readJournal:()=>[],readEffects:()=>[]},opening);
  cvAppend_(ss,'AperturaV2',opening);
 }
 props.setProperty('SANDBOX_OWNER_EMAIL',active);return {environment:'synthetic',epoch:CVTransactions.EPOCH,initialized:true};
});}
function cvReply_(fn){try{cvOwner_();return cvLocked_(fn);}catch(e){const known=/^(INVALID_|INSUFFICIENT_|PROTOCOL_|WRONG_|OWNER_|SALE_|FUTURE_|COMMAND_|FINANCIAL_|RESOURCE_|REASON_|RETURN_|IDEMPOTENCY_|CONSUMPTION_|CORRUPT_|JOURNAL_|EFFECT_CONFLICT|OPENING_|SETUP_|TAB_|RECORD_)/.test(e.message);return {error:known?e.message:'SERVER_UNAVAILABLE',retryable:!known};}}
// Sin argumentos: mantenimiento manual del laboratorio, restringido al propietario por el despliegue.
function sandboxExecute(command){if(command===undefined){initializeSandbox_();return runSandboxSmoke_();}return cvReply_(()=>cvEngine_().execute(command));}
function sandboxStatus(operationId){return cvReply_(()=>cvEngine_().status(operationId));}
function sandboxSnapshot(){return cvReply_(()=>cvEngine_().state());}
function doGet(){cvOwner_();return HtmlService.createHtmlOutputFromFile('Index').setTitle('Casa Vieja · Pruebas de ventas');}
function doPost(){throw Error('POST_DISABLED_USE_PRIVATE_HTML_SERVICE');}
// Prueba real solo con recursos demo; conserva registros y los compensa al terminar.
function runSandboxSmoke_(){
 cvOwner_();const run='smoke-'+Utilities.getUuid();const make=(n,saleId,type,extra)=>Object.assign({operationId:run+'-'+n,deviceId:'editor-smoke',epoch:'TEST_ONLY_V2',schemaVersion:2,saleId:'future:'+run+'-'+saleId,type},extra||{});
 const before=sandboxSnapshot();if(before.error)throw Error(before.error);
 const sale=make('register','one','REGISTER_SALE',{lines:[{resourceId:'demo:molido',qty:1}],totalCents:3300,metadata:{customer:'Prueba sintética'}});
 const first=sandboxExecute(sale);if(first.error)throw Error(first.error);
 if(JSON.stringify(sandboxExecute(sale))!==JSON.stringify(first))throw Error('SMOKE_IDEMPOTENCY');
 if(sandboxStatus(sale.operationId).state!=='COMMITTED')throw Error('SMOKE_STATUS');
 const cancel=make('cancel','one','CANCEL_SALE',{expectedSaleVersion:1,reason:'Fin de prueba sintética'});if(sandboxExecute(cancel).error)throw Error('SMOKE_CANCEL');sandboxExecute(cancel);
 const combo=make('combo','two','REGISTER_SALE',{lines:[{resourceId:'demo:molido',qty:1},{resourceId:'demo:grano',qty:1}],totalCents:6600});if(sandboxExecute(combo).error)throw Error('SMOKE_COMBO');
 const saved=sandboxSnapshot().sales[combo.saleId];
 const edit=make('edit','two','EDIT_SALE',{expectedSaleVersion:1,metadata:{customer:'Combo demo editado'}});if(sandboxExecute(edit).error)throw Error('SMOKE_EDIT');
 const edited=sandboxSnapshot().sales[combo.saleId];if(saved.profitCents!==edited.profitCents)throw Error('SMOKE_PROFIT');
 const cancelCombo=make('cancel-combo','two','CANCEL_SALE',{expectedSaleVersion:2,reason:'Fin de prueba combo'});if(sandboxExecute(cancelCombo).error)throw Error('SMOKE_CANCEL_COMBO');
 const after=sandboxSnapshot();if(JSON.stringify(before.resources)!==JSON.stringify(after.resources))throw Error('SMOKE_STOCK');
 const result={run,passed:true,revisionBefore:before.revision,revisionAfter:after.revision,stockRestored:true};console.log(JSON.stringify(result));return result;
}
// Mantenimiento del laboratorio: el despliegue se restringe al propietario.
function sandboxInitialize(){const result=initializeSandbox_();console.log(JSON.stringify(result));return result;}
function sandboxSmoke(){return runSandboxSmoke_();}
function sandboxRecovery(){return cvReply_(()=>{
 const cases=[];const engine=cvEngine_();const before=engine.state();
 for(const stage of ['afterPrepare','afterEffect','afterCommit']){
  const base='recovery-'+Utilities.getUuid(),command={operationId:base,deviceId:'recovery-test',epoch:'TEST_ONLY_V2',schemaVersion:2,type:'REGISTER_SALE',saleId:'future:'+base,lines:[{resourceId:'demo:molido',qty:1}],totalCents:3300};let fired=false;
  const failing=new CVTransactions.Engine(engine.store,engine.opening,point=>{if(point===stage&&!fired){fired=true;throw Error('INJECTED_TEST_FAILURE');}});
  try{failing.execute(command);throw Error('FAILURE_NOT_INJECTED');}catch(e){if(e.message!=='INJECTED_TEST_FAILURE')throw e;}
  const partial=engine.status(base);const result=engine.execute(command);if(result.state!=='COMMITTED')throw Error('RECOVERY_TEST_FAILED');
  engine.execute({operationId:base+'-cancel',deviceId:'recovery-test',epoch:'TEST_ONLY_V2',schemaVersion:2,type:'CANCEL_SALE',saleId:command.saleId,expectedSaleVersion:1,reason:'Fin de prueba de recuperación'});
  cases.push({stage,observed:partial.state,recovered:result.state});
 }
 const after=engine.state();if(JSON.stringify(before.resources)!==JSON.stringify(after.resources))throw Error('RECOVERY_STOCK_MISMATCH');return {passed:true,cases};
});}

function sandboxSaveReport(report){return cvReply_(()=>{
 if(!report||typeof report.run!=='string'||!report.run.startsWith('browser-')||typeof report.passed!=='boolean'||!Array.isArray(report.results)||JSON.stringify(report).length>12000)throw Error('INVALID_REPORT');
 const ss=cvBook_();if(!ss.getSheetByName('VerificacionesV2'))ss.insertSheet('VerificacionesV2').appendRow(['ID','Tipo','JSON']);
 cvAppend_(ss,'VerificacionesV2',{id:report.run,kind:'BROWSER_REPORT',environment:'synthetic',report});return {saved:true,run:report.run};
});}
