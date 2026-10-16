// Solo editor de laboratorio: no invocable mediante google.script.run.
function phase5bBenchmark_(){
 cvOwner_();return cvLocked_(()=>{
 const start=Date.now(),e=commercialEngine_(),loaded=Date.now(),s=e.state(),replayed=Date.now(),report=e.reports(s),reported=Date.now();
 const result={id:'phase5b-'+Utilities.getUuid(),kind:'PERFORMANCE_5B',environment:'TEST_ONLY',measuredAt:new Date().toISOString(),journalRows:e.store.readJournal().length,effectRows:e.store.readEffects().length,revision:s.revision,loadMs:loaded-start,replayMs:replayed-loaded,reportsMs:reported-replayed,totalMs:reported-start,passed:Number.isSafeInteger(s.revision),productionAccess:false};
 invAppend_(cvBook_(),'VerificacionesInventarioV3',result);console.log(JSON.stringify(result));return result;
 });
}
function phase5bRestoreTest_(){
 cvOwner_();return cvLocked_(()=>{
 const source=cvBook_(),props=PropertiesService.getScriptProperties(),key='PHASE5B_RESTORE_SHEET_ID';let destination=props.getProperty(key),ss;
 if(!destination){ss=SpreadsheetApp.create('CasaVieja_RECUPERACION_TEST_ONLY_5B');destination=ss.getId();props.setProperty(key,destination);ss.getSheets()[0].setName('Control');ss.getSheetByName('Control').getRange(1,1,3,2).setValues([['Campo','Valor'],['Entorno','SINTETICO'],['Identificador','TEST_ONLY']]);}else ss=SpreadsheetApp.openById(destination);
 if(destination===source.getId()||ss.getName()!=='CasaVieja_RECUPERACION_TEST_ONLY_5B'||ss.getSheetByName('Control').getRange('B3').getValue()!=='TEST_ONLY')throw Error('RESTORE_DESTINATION');
 const j=invRead_(source,INV_TABS_[0]),effects=invRead_(source,INV_TABS_[1]);
 const hash=x=>Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,CVInventory.canonical(x),Utilities.Charset.UTF_8));
 // Copia de filas, nunca ejecución de comandos: no genera nuevos consumos.
 for(const [index,rows]of [[0,j],[1,effects]]){
  const name=INV_TABS_[index];let sh=ss.getSheetByName(name);if(!sh)sh=ss.insertSheet(name);
  if(sh.getLastRow()===0)sh.appendRow(['ID','Tipo','JSON']);
  const existing=invRead_(ss,name);if(existing.length>rows.length||existing.some((r,i)=>CVInventory.canonical(r)!==CVInventory.canonical(rows[i])))throw Error('RESTORE_NONEMPTY_CONFLICT');
  if(existing.length<rows.length)sh.getRange(existing.length+2,1,rows.length-existing.length,3).setValues(rows.slice(existing.length).map(r=>[r.id,r.kind,JSON.stringify(r)]));
 }
 SpreadsheetApp.flush();const restoredJ=invRead_(ss,INV_TABS_[0]),restoredE=invRead_(ss,INV_TABS_[1]);
 if(hash([j,effects])!==hash([restoredJ,restoredE]))throw Error('RESTORE_READBACK');
 const memory=(journal,movements)=>new CVCommercial.Engine({readJournal:()=>journal,readEffects:()=>movements});
 const before=memory(j,effects).state(),after=memory(restoredJ,restoredE).state();if(CVInventory.canonical(before)!==CVInventory.canonical(after))throw Error('RESTORE_STATE_MISMATCH');
 if(hash([j,effects])!==hash([invRead_(source,INV_TABS_[0]),invRead_(source,INV_TABS_[1])]))throw Error('SOURCE_CHANGED');
 const result={id:'restore5b-'+Utilities.getUuid(),kind:'RESTORE_5B',environment:'TEST_ONLY',destinationId:destination,revision:after.revision,journalRows:j.length,effectRows:effects.length,sha256Base64:hash([j,effects]),passed:true,sourceUnchanged:true,measuredAt:new Date().toISOString()};
 invAppend_(source,INV_TABS_[2],result);console.log(JSON.stringify(result));return result;
 });
}
// Entrada ya existente del laboratorio para el selector bloqueado del editor.
// No se incluye en Candidate.gs y no se publica una nueva versión web.
function sandboxExecute(command){if(command!==undefined)return sandboxExecuteBefore5B_(command);phase5bBenchmark_();phase5bWriteTest_();phase5bRestoreTest_();return phase5bBenchmark_();}
function phase5bWriteTest_(){
 cvOwner_();return cvLocked_(()=>{
 const engine=commercialEngine_(),journal=engine.store.readJournal(),effects=engine.store.readEffects(),id='safe5b-'+Utilities.getUuid(),now=new Date().toISOString();
 const command={epoch:'TEST_ONLY_V3',schemaVersion:2,commercialVersion:4,operationId:id,deviceId:'lab-editor-5b',saleId:'future:'+id,type:'RECEIVE_SUPPLY',date:now,responsible:'Ensayo sintético Fase 5B',resourceId:'demo:'+id,lotId:'demo:lot-'+id,supplyKind:'LABEL',qty:2,totalCostCents:0};
 const start=Date.now(),result=engine.execute(command),confirmed=Date.now(),retry=engine.execute(command),retried=Date.now(),state=engine.state();
 const prefix=(a,b)=>CVInventory.canonical(a)===CVInventory.canonical(b.slice(0,a.length));
 if(result.state!=='COMMITTED'||CVInventory.canonical(result)!==CVInventory.canonical(retry)||state.resources[command.resourceId].physical!==2||!prefix(journal,engine.store.readJournal())||!prefix(effects,engine.store.readEffects()))throw Error('WRITE_5B_FAILED');
 const report={id,kind:'WRITE_5B',environment:'TEST_ONLY',passed:true,executeMs:confirmed-start,retryMs:retried-confirmed,revision:state.revision,originalPrefixPreserved:true,effectsAdded:engine.store.readEffects().length-effects.length,operationId:id,measuredAt:now};invAppend_(cvBook_(),INV_TABS_[2],report);console.log(JSON.stringify(report));return report;
 });
}
