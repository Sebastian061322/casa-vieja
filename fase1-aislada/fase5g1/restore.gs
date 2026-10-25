/* Mantenimiento privado: jamás invocable por google.script.run. Solo editor del propietario. */
function drDigest5g1_(value){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,CVInventoryBase.canonical(value),Utilities.Charset.UTF_8).map(b=>((b+256)%256).toString(16).padStart(2,'0')).join('');}
function drRestore5g1_(){
 if(ScriptApp.getScriptId()!==CV_TEST_SCRIPT_ID_)throw Error('WRONG_SCRIPT');
 const p=PropertiesService.getScriptProperties();
 if(p.getProperty('ZERO_LAB_ENABLED')==='YES')throw Error('STOP_WRITES_BEFORE_RESTORE');
 const expected=p.getProperty('DR_ARCHIVE_SHA256');
 if(!/^[a-f0-9]{64}$/.test(expected||''))throw Error('INDEPENDENT_HASH_REQUIRED');
 const lock=LockService.getScriptLock();lock.waitLock(30000);
 try{
  const ss=SpreadsheetApp.openById(CV_TEST_SHEET_ID_);
  if(ss.getName()!=='CasaVieja_RECUPERACION_TEST_ONLY_5G')throw Error('WRONG_DESTINATION');
  const control=ss.getSheetByName('Control');
  if(control.getRange('B3').getValue()!=='TEST_ONLY')throw Error('TEST_ONLY_REQUIRED');
  const input=ss.getSheetByName('RestoreInput');if(!input)throw Error('RESTORE_INPUT_REQUIRED');
  const raw=input.getRange(2,1,input.getLastRow()-1,1).getValues().map(r=>r[0]).join('');
  const archive=JSON.parse(raw),body=archive.payload;
  if(archive.sha256!==expected||drDigest5g1_(body)!==expected)throw Error('ARCHIVE_HASH_MISMATCH');
  if(body.format!=='CV_DR_5G1'||body.environment!=='TEST_ONLY'||body.destination!=='TEST_ONLY_DR_5G1'||body.sourceId===body.destination)throw Error('RESTORE_SCOPE_REQUIRED');
  if(!body.sections||!body.hashes||Object.keys(body.sections).sort().join()!=='configuration,devices,ledger,release')throw Error('MISSING_SECTION');
  for(const name of Object.keys(body.sections))if(drDigest5g1_(body.sections[name])!==body.hashes[name])throw Error('SECTION_CHECKSUM');
  const previous=p.getProperty('DR_RESTORE_ARCHIVE');if(previous&&previous!==expected)throw Error('RESTORE_CONFLICT');
  const data=body.sections.ledger,configs=body.sections.configuration;
  if(configs.environment!=='TEST_ONLY'||!Array.isArray(configs.users)||configs.users.length!==3||new Set(configs.users.map(u=>u.target)).size!==3||['administrator','operations','seller'].some(role=>configs.users.filter(u=>u.role===role&&u.active===true).length!==1)||configs.users.some(u=>!/^google:[0-9]{5,64}$/.test(u.target)))throw Error('RESTORE_USERS_REQUIRED');
  if(!Array.isArray(configs.policies)||configs.policies.length<1||configs.policies.length>199||!Array.isArray(body.sections.devices))throw Error('RESTORE_CONFIG_REQUIRED');
  const targets=[['DiarioInventarioV3',data.journal],['MovimientosInventarioV3',data.effects]];
  // Preflight ALL prefixes and configuration before any append; never truncate divergence.
  for(const [name,rows]of targets){
   if(!Array.isArray(rows))throw Error('MISSING_LEDGER');
   const sh=ss.getSheetByName(name);if(!sh)throw Error('SCHEMA_REQUIRED');
   const n=Math.max(0,sh.getLastRow()-1);if(n>rows.length)throw Error('RESTORE_CONFLICT');
   const prefix=n?sh.getRange(2,1,n,3).getValues():[];
   for(let i=0;i<n;i++)if(prefix[i][0]!==rows[i].id||prefix[i][1]!==rows[i].kind||CVInventoryBase.canonical(JSON.parse(prefix[i][2]))!==CVInventoryBase.canonical(rows[i]))throw Error('RESTORE_CONFLICT');
  }
  for(const [prefix,rows]of [['ZERO_USER_',configs.users],['ZERO_POLICY_',configs.policies]]){
   for(let i=0;i<200;i++){const old=p.getProperty(prefix+i);if(old!==null&&old!==undefined&&(i>=rows.length||CVInventoryBase.canonical(JSON.parse(old))!==CVInventoryBase.canonical(rows[i])))throw Error('CONFIG_RESTORE_CONFLICT');}
  }
  if(p.getProperty('DR_RESTORE_STATE')==='COMPLETE')return {state:'COMPLETE',sha256:expected,alreadyRestored:true,verifiedArchivePrefixes:true};
  p.setProperty('DR_RESTORE_ARCHIVE',expected);p.setProperty('DR_RESTORE_STATE','INCOMPLETE');
  for(const [name,rows]of targets){const sh=ss.getSheetByName(name);for(let i=sh.getLastRow()-1;i<rows.length;i++){
   const r=rows[i];sh.appendRow([r.id,r.kind,JSON.stringify(r)]);SpreadsheetApp.flush();
   const actual=sh.getRange(i+2,1,1,3).getValues()[0];if(actual[0]!==r.id||actual[1]!==r.kind||CVInventoryBase.canonical(JSON.parse(actual[2]))!==CVInventoryBase.canonical(r))throw Error('RESTORE_READBACK');
   if(p.getProperty('DR_TEST_STOP_AFTER_FIRST_ROW')==='YES'){p.setProperty('DR_TEST_STOP_AFTER_FIRST_ROW','NO');throw Error('TEST_ONLY_RESTORE_INTERRUPTED');}
  }}
  for(const [prefix,rows]of [['ZERO_USER_',configs.users],['ZERO_POLICY_',configs.policies]])for(let i=0;i<rows.length;i++){
   const raw=JSON.stringify(rows[i]);if(raw.length>7500)throw Error('CONFIG_TOO_LARGE');p.setProperty(prefix+i,raw);if(p.getProperty(prefix+i)!==raw)throw Error('RESTORE_READBACK');
  }
  // Rebuild using exactly the restored code; fail before opening service if journal is corrupt.
  cvPropertyScope5g_=new Map();try{invEngine_().state();}finally{cvPropertyScope5g_=null;}
  p.setProperty('ZERO_APPROVED_SCRIPT_ID',CV_TEST_SCRIPT_ID_);p.setProperty('DR_RESTORE_STATE','COMPLETE');
  return {state:'COMPLETE',sha256:expected,journalRows:data.journal.length,effects:data.effects.length};
 }finally{lock.releaseLock();}
}
const drBaseRequest5g1_=zeroRequest;
zeroRequest=function(envelope){
 try{
  const props=PropertiesService.getScriptProperties();if(props.getProperty('DR_RESTORE_STATE')!=='COMPLETE')throw Error('RESTORE_INCOMPLETE');
  if(envelope?.request?.action==='execute'&&envelope.request.payload?.recoveryScope!=='TEST_ONLY_DR_5G1')throw Error('SOURCE_COMMAND_FORBIDDEN');
  if(envelope?.request?.action!=='recover')return drBaseRequest5g1_(envelope);
  const previous=cvPropertyScope5g_;cvPropertyScope5g_=new Map();
  try{
   const r=zeroProof_(envelope);return cvLocked_(()=>{
    if(props.getProperty('ZERO_APPROVED_SCRIPT_ID')!==CV_TEST_SCRIPT_ID_)throw Error('APPROVED_LAB_REQUIRED');
    zeroProof_(envelope);zeroConsumeNonce_(r,props,Date.now());
    const users=zeroPropertyLog_('ZERO_USER_'),actor=CVZeroAccess.principal(r.subject,users.read());
    if(r.payload?.destination!=='TEST_ONLY_DR_5G1'||typeof r.payload.operationId!=='string')throw Error('RECOVERY_SCOPE_REQUIRED');
    const store=invEngine_().store,prepared=store.readJournal().find(x=>x.kind==='PREPARED'&&x.id===r.payload.operationId);
    if(!prepared?.plan?.audit?.subject||prepared.plan.audit.subject!==actor.subject)throw Error('OPERATION_ACTOR_MISMATCH');
    const policy=zeroPropertyLog_('ZERO_POLICY_').read();
    const engine=new CVZeroAccess.Engine(store,undefined,{actor,policy:{...policy.at(-1).rules,version:policy.length},now:()=>new Date().toISOString()});
    return engine.execute(prepared.command);
   });
  }finally{cvPropertyScope5g_=previous;}
 }catch(e){return {error:/^[A-Z_]+$/.test(e.message)?e.message:'SERVER_UNAVAILABLE',retryable:false};}
};
