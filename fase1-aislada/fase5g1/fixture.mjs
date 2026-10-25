import vm from 'node:vm';import fs from 'node:fs';import crypto from 'node:crypto';import {createRequire} from 'node:module';
import {sale} from '../fase5g/tests/flow.mjs';import {setup,receive,process,ledger} from '../fase5g/tests/harness.mjs';
const require=createRequire(import.meta.url),{canonical}=require('../fase3/journal.js');
export const hash=x=>crypto.createHash('sha256').update(canonical(x)).digest('hex');
export async function archiveFixture(principals={administrator:'google:111111',operations:'google:222222',seller:'google:333333'}){
 for(const role of ['administrator','operations','seller'])if(!/^google:[0-9]{5,64}$/.test(principals[role]||''))throw Error('VERIFIED_LAB_SUBJECT_REQUIRED');
 const f=setup(),originalCall=f.call;
 const subject=role=>principals[role].slice(7);
 ['administrator','operations','seller'].forEach((role,i)=>f.f.properties['ZERO_USER_'+i]=JSON.stringify({target:principals[role],role,active:true,revision:i+1}));
 f.call=(action,payload,sub=subject('administrator'))=>originalCall(action,payload,sub);
 await receive(f,10000);
 for(const c of [process(f,'MILL','demo:5g-pergamino','demo:5g-verde',10000,8000,2000,100),process(f,'ROAST','demo:5g-verde','demo:5g-tostado',8000,7000,1000,200),process(f,'GRIND','demo:5g-tostado','demo:5g-molido',4000,4000,0,100)]){const r=await f.call('execute',c);if(r.state!=='COMMITTED')throw Error(r.error);}
 for(const [resourceId,out,grams,grind]of [['demo:5g-molido','demo:5g-pack500',500,'molido'],['demo:5g-tostado','demo:5g-pack250',250,'grano']]){const r=await f.call('execute',f.cmd('PREPARE_BAGS',{resourceId,outputResourceId:out,bagGrams:grams,bags:8,grind,wasteGrams:0,processingCents:0,materials:[{resourceId:'demo:commercial-bag'+grams},{resourceId:'demo:commercial-label'}],documentRef:'TEST_ONLY_'+out}));if(r.state!=='COMMITTED')throw Error(r.error);}
 const lost=sale(f);await f.call('execute',lost,subject('seller'));
 const rejected=sale(f,[{offerId:'demo:single',offerVersion:1,resourceId:'demo:5g-pack500',quantity:999}]);await f.call('execute',rejected,subject('seller'));
 const pending=process(f,'GRIND','demo:5g-tostado','demo:dr-recovery-molido',1000,950,50,10);
 vm.runInContext(`const drOldFinish=CVZeroAccess.Engine.prototype.finish;let drStop=false;CVZeroAccess.Engine.prototype.finish=function(p){const old=this.hook;this.hook=(where,e)=>{if(where==='afterEffect'&&e.operationId===${JSON.stringify(pending.operationId)}&&!drStop){drStop=true;throw Error('TEST_ONLY_POWER_LOSS')}};try{return drOldFinish.call(this,p)}finally{this.hook=old}}`,f.c);
 await f.call('execute',pending,subject('operations'));
 const sections={ledger:ledger(f),configuration:{environment:'TEST_ONLY',users:[0,1,2].map(i=>JSON.parse(f.f.properties['ZERO_USER_'+i])),policies:[JSON.parse(f.f.properties.ZERO_POLICY_0)],processPolicy:{version:'DRAFT_5G_1',productionApproved:false}},release:{commit:'4731cabf36eb8471b0c25354a75f47f879f9d583',files:['Candidate.gs','worker-bundle.mjs','schema.json'].map(name=>({name,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL('build/'+name,import.meta.url))).digest('hex')}))},devices:[{id:'TEST_ONLY:DR_SELLER',origin:'https://example.test',destination:'TEST_ONLY_DR_5G1',queue:[{command:lost,state:'PENDING'},{command:rejected,state:'REJECTED'}],receipts:{},archived:[]},{id:'TEST_ONLY:DR_MANAGER',origin:'https://example.test',destination:'TEST_ONLY_DR_5G1',queue:[{command:pending,state:'PENDING'}],receipts:{},archived:[]}]};
 const payload={format:'CV_DR_5G1',environment:'TEST_ONLY',sourceId:'TEST_ONLY:SYNTHETIC_5G1_FIXTURE',destination:'TEST_ONLY_DR_5G1',createdAt:new Date().toISOString(),sections,hashes:Object.fromEntries(Object.entries(sections).map(([k,v])=>[k,hash(v)]))};
 return {archive:{payload,sha256:hash(payload)},lost,pending,rejected};
}
