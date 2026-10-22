'use strict';
// Solo archivos locales TEST_ONLY. Sin HTTP, cuentas reales ni conectores.
const fs=require('node:fs'),path=require('node:path'),{performance}=require('node:perf_hooks'),assert=require('node:assert/strict');
const {setup}=require('../fase4/tests/helpers.cjs'),{Engine}=require('../fase4/commercial.js'),R=require('./recovery.cjs'),{attach}=require('./report-index.js');
const root=__dirname,local=path.join(root,'evidencia-local');fs.mkdirSync(local,{recursive:true,mode:0o700});
const f=setup();f.e.execute(f.sale());const pending=f.sale({saleId:'future:5e-partial'});let failed=false;
const interrupted=new Engine(f.store,undefined,point=>{if(point==='afterEffect'&&!failed){failed=true;throw Error('TEST_ONLY_POWER_LOST')}},{role:'owner',now:()=> '2026-10-15T15:00:00.000Z'});
try{interrupted.execute(pending)}catch(e){if(e.message!=='TEST_ONLY_POWER_LOST')throw e}
const createdAt=new Date().toISOString(),archive=R.create({sourceId:'TEST_ONLY:local-source',createdAt,ledger:{journal:f.store.readJournal(),effects:f.store.readEffects()},configuration:{environment:'TEST_ONLY',users:[{subject:'fictitious:administrator',role:'administrator',active:true}],rulesApprovedForProduction:false},release:{commit:'4e9c95bd09be526a17fb86173eca1a66126e5566+LOCAL_5E',files:['integrity.cjs','recovery.cjs','report-index.js','apps-script/Candidate.gs','../fase5d/worker-bundle.mjs','../fase5d/apps-script/appsscript.candidate.json'].map(p=>({path:p,content:fs.readFileSync(path.join(root,p),'utf8')}))},devices:[{id:'TEST_ONLY_SYNTHETIC_PHONE',origin:'https://example.test',engine:'V4',epoch:'TEST_ONLY_V3',coverage:'COMPLETE_SYNTHETIC_STATE',state:{queue:[{command:pending,state:'PENDING'}],receipts:{}}}]});
const backup=path.join(local,'backup-'+archive.sha256+'.json');if(!fs.existsSync(backup))fs.writeFileSync(backup,JSON.stringify(archive),{mode:0o600,flag:'wx'});
const destination=path.join(local,'restore-'+archive.sha256);fs.mkdirSync(destination,{recursive:true,mode:0o700});
const catalog={sourceId:archive.payload.sourceId,sha256:archive.sha256,createdAt,releaseHash:archive.payload.hashes.release};fs.writeFileSync(path.join(root,'tests/recovery-catalog.json'),JSON.stringify(catalog,null,2)+'\n');
const trustedHash=JSON.parse(fs.readFileSync(path.join(root,'tests/recovery-catalog.json'),'utf8')).sha256;
let lost=false;const target={environment:'TEST_ONLY',id:'TEST_ONLY:local-destination',keys:()=>fs.readdirSync(destination).map(x=>x.replace(/\.json$/,'')),read:k=>{const file=path.join(destination,k+'.json');return fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):undefined},writeAbsent:(k,v)=>{fs.writeFileSync(path.join(destination,k+'.json'),JSON.stringify(v),{mode:0o600,flag:'wx'});if(k==='configuration'&&!lost){lost=true;throw Error('TEST_ONLY_RESTORE_INTERRUPTED')}}};
const before=performance.now();assert.throws(()=>R.restore(archive,target,trustedHash),/TEST_ONLY_RESTORE_INTERRUPTED/);const restored=R.restore(archive,target,trustedHash);const restoreMs=performance.now()-before;R.restore(archive,target,trustedHash);
const rows=structuredClone(target.read('ledger')),store={readJournal:()=>structuredClone(rows.journal),readEffects:()=>structuredClone(rows.effects),appendJournal:r=>rows.journal.push(structuredClone(r)),appendEffect:r=>rows.effects.push(structuredClone(r))};
const recovered=new Engine(store,undefined,undefined,{role:'owner',now:()=> '2026-10-15T15:00:00.000Z'});recovered.execute(pending);const n=rows.effects.length;recovered.execute(pending);assert.equal(rows.effects.length,n);assert.equal(recovered.state().resources['demo:commercial-molido500'].reserved,2);
const recoveryResult={environment:'TEST_ONLY',actualGoogle:false,sourceId:archive.payload.sourceId,destinationId:target.id,sha256:archive.sha256,sourceUnchanged:R.hash(archive.payload.sections.ledger)===R.hash({journal:f.store.readJournal(),effects:f.store.readEffects()}),archiveVerified:true,repeatedRestoreNoDuplicate:true,restoreInterruptedAndResumed:true,preparedRecoveredOnce:true,physical:recovered.state().resources['demo:commercial-molido500'].physical,reserved:2,pendingIdsAtBackup:restored.state.pending,restoreMs,queueScope:'COMPLETE_SYNTHETIC_STATE only; no physical-device export',secretsRecovered:false,accountsRecovered:false,realRtoMeasured:false};
fs.writeFileSync(path.join(root,'tests/recovery-local.json'),JSON.stringify(recoveryResult,null,2)+'\n');
class Indexed extends Engine{}attach(Indexed);
const baseline=new Engine({}),optimized=new Indexed({}),seed=f.e.state().sales['future:commercial'];
const stats=values=>{const a=values.toSorted((x,y)=>x-y);return {samples:a.length,meanMs:a.reduce((n,v)=>n+v,0)/a.length,p50Ms:a[Math.ceil(a.length*.5)-1],p95DescriptiveMs:a[Math.ceil(a.length*.95)-1],maxMs:a.at(-1)}};
const volumes=[];
for(const size of [100,500,1000]){
  const state={sales:{},commerce:{events:[]}};
  for(let i=0;i<size;i++){const id='future:TEST_ONLY_'+i;state.sales[id]={...structuredClone(seed),id,status:'DISPATCHED',metadata:{phone:'',customer:'TEST_ONLY_'+i}};for(const [kind,amountCents]of [['ORDER_REGISTERED',3500],['DISPATCH_RECOGNIZED',3500],['PAYMENT',3500]])state.commerce.events.push({id:id+kind,saleId:id,kind,date:'2026-10-15T15:00:00.000Z',amountCents,costCents:1735,distributionCents:0})}
  const original=JSON.stringify(state);assert.deepEqual(optimized.reports(state),baseline.reports(state));
  baseline.reports(state);optimized.reports(state);const a=[],b=[];
  for(let sample=0;sample<30;sample++)for(const [engine,output]of sample%2?[[optimized,b],[baseline,a]]:[[baseline,a],[optimized,b]]){const start=performance.now();engine.reports(state);output.push(performance.now()-start)}
  assert.equal(JSON.stringify(state),original);volumes.push({sales:size,events:state.commerce.events.length,before:stats(a),after:stats(b),sameResult:true});
}
fs.writeFileSync(path.join(root,'tests/performance-local.json'),JSON.stringify({environment:'TEST_ONLY',measuredAtUTC:new Date().toISOString(),runtime:process.version,scope:'Node synthetic report state only; no Google or Worker latency',remoteBeforeAfterAvailable:false,volumes},null,2)+'\n');
console.log(JSON.stringify({recovery:recoveryResult,performance:volumes}));
