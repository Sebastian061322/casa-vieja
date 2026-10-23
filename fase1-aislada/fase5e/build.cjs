// Genera un candidato local: no tiene CLI de despliegue ni acceso de red.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),vm=require('node:vm');
const root=__dirname,read=p=>fs.readFileSync(path.join(root,p),'utf8');
const args=[path.join(root,'../fase5d/build.cjs'),...process.argv.slice(2)];
const built=cp.spawnSync(process.execPath,args,{encoding:'utf8'});if(built.status!==0)throw Error(built.stderr);
let code=read('../fase5d/apps-script/Candidate.gs');
function once(before,after){if(code.split(before).length!==2)throw Error('BASE_CHANGED_REVIEW_REQUIRED');code=code.replace(before,after)}
for(const name of ['cvLocked','invRead','invAppend'])once('function '+name+'_(','function '+name+'Base5e_(');
once('function zeroRequest(','function zeroRequestBase5e_(');
once('const verified=zeroProof_(envelope);','const verified=CV5EMetrics.measure("proofMs",()=>zeroProof_(envelope));CV5EMetrics.current.authorized=true;');
once("zeroActor_(current,zeroPropertyLog_('ZERO_USER_'),p);", "const actor5e=zeroActor_(current,zeroPropertyLog_('ZERO_USER_'),p);");
once('zeroConsumeNonce_(current,p,Date.now());', "zeroConsumeNonce_(current,p,Date.now());if(current.action==='snapshot'&&current.payload?.metricsProbe===true){if(actor5e.role!=='administrator')throw Error('PERMISSION_DENIED');CV5EMetrics.current.adminProbe=true;}");
once('const cells=sh.getRange(row,1,1,3).getValues();','const cells=CV5EMetrics.measure("sheetReadbackMs",()=>sh.getRange(row,1,1,3).getValues());');
code+='\n'+read('report-index.js')+'\nCV5EReports.attach(CVZeroAccess.Engine);\n'+read('apps-script/Observability.gs');
code+='\nconst CV5EStateBase_ = CVZeroAccess.Engine.prototype.state;\nCVZeroAccess.Engine.prototype.state=function(){return CV5EMetrics.measure("reconstructMs",()=>CV5EStateBase_.call(this));};\nconst CV5EReportBase_ = CVZeroAccess.Engine.prototype.reports;\nCVZeroAccess.Engine.prototype.reports=function(...args){return CV5EMetrics.measure("reportsMs",()=>CV5EReportBase_.apply(this,args));};\n';
const ctx=vm.createContext({});vm.runInContext(code,ctx);const exposed=Object.keys(ctx).filter(k=>typeof ctx[k]==='function'&&!k.endsWith('_'));if(JSON.stringify(exposed.sort())!==JSON.stringify(['doGet','doPost','zeroRequest']))throw Error('RPC_EXPOSURE');
fs.writeFileSync(path.join(root,'apps-script/Candidate.gs'),code);
const web=cp.spawnSync(process.execPath,[path.join(root,'../fase5d/build-web.cjs')],{encoding:'utf8'});if(web.status!==0)throw Error(web.stderr);
console.log(JSON.stringify({environment:'TEST_ONLY',published:false,exposed}));
