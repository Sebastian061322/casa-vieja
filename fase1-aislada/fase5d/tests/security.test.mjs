import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {context} from './fixture.mjs';
import {createSession} from '../web/session.mjs';
import closedWorker from '../closed-worker.mjs';
const actor = (subject='111111',profile='administrator') => ({subject:'google:'+subject,profile,environment:'TEST_ONLY',destination:'TEST_ONLY_ZERO_1'});
const deferred = () => {let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};

test('candidato mínimo no utiliza Session y conserva destino sintético fijo',()=>{
  const source=fs.readFileSync(new URL('../apps-script/Candidate.gs',import.meta.url),'utf8');
  assert.doesNotMatch(source,/Session\.getActiveUser|Session\.getEffectiveUser|function cvOwner_/);
  assert.match(source,/const CV_TEST_SHEET_ID_ = '1CtK6KD995Pu2Fzc_na89Ajc0KQ0QLuGq3UFhj4UdLSA'/);
  assert.match(source,/getName\(\)!=='CasaVieja_Pruebas_SINTETICA'/);
  assert.match(source,/getRange\('B3'\)\.getValue\(\)!=='TEST_ONLY'/);
  const manifest=JSON.parse(fs.readFileSync(new URL('../apps-script/appsscript.candidate.json',import.meta.url),'utf8'));
  assert.deepEqual(manifest.oauthScopes,['https://www.googleapis.com/auth/spreadsheets']);
});

test('un mensaje firmado solo se acepta una vez; el reintento nuevo recupera la misma venta',async()=>{
  const {f,c,mem,sign}=context();f.properties.ZERO_LAB_ENABLED='YES';
  const sale=mem.sale(),message=await sign('111111','execute',sale);
  assert.equal(c.zeroRequest(message).state,'COMMITTED');
  const effects=f.tabs.MovimientosInventarioV3.length;
  assert.equal(c.zeroRequest(message).error,'REQUEST_REPLAYED');
  assert.equal(c.zeroRequest(await sign('111111','execute',sale)).state,'COMMITTED');
  assert.equal(f.tabs.MovimientosInventarioV3.length,effects);
});
test('otro gerente no reutiliza el identificador de una operación confirmada',async()=>{
  const {f,c,mem,sign}=context();f.properties.ZERO_LAB_ENABLED='YES';
  const sale=mem.sale();assert.equal(c.zeroRequest(await sign('111111','execute',sale)).state,'COMMITTED');
  const before=JSON.stringify(f.tabs);
  assert.equal(c.zeroRequest(await sign('222222','execute',sale)).error,'OPERATION_ACTOR_MISMATCH');
  assert.equal(JSON.stringify(f.tabs),before);
});
test('la revocación se consulta antes de consumir nonces o leer Sheets',async()=>{
  const {f,c,sign}=context();f.properties.ZERO_LAB_ENABLED='YES';
  f.properties.ZERO_USER_3=JSON.stringify({target:'google:333333',role:'seller',active:false});
  const opened=f.opens.length;
  assert.equal(c.zeroRequest(await sign('333333','snapshot',{})).error,'ACCESS_DENIED');
  assert.equal(f.properties.ZERO_REPLAY_WINDOW,undefined);assert.equal(f.opens.length,opened);
});
test('nonce caducado dentro del bloqueo no se acepta; no depende de CacheService',()=>{
  const c=vm.createContext({});vm.runInContext(fs.readFileSync(new URL('../apps-script/Replay.gs',import.meta.url),'utf8'),c);
  const values={},p={getProperty:k=>values[k],setProperty:(k,v)=>values[k]=v};
  assert.throws(()=>c.zeroConsumeNonce_({requestId:'abcdefgh',issuedAt:1,expiresAt:10},p,10),/IDENTITY_REQUIRED/);
  assert.equal(values.ZERO_REPLAY_WINDOW,undefined);
  c.zeroConsumeNonce_({requestId:'abcdefgh',issuedAt:1,expiresAt:10},p,2);
  assert.throws(()=>c.zeroConsumeNonce_({requestId:'abcdefgh',issuedAt:1,expiresAt:10},p,3),/REQUEST_REPLAYED/);
  c.zeroConsumeNonce_({requestId:'ijklmnop',issuedAt:10,expiresAt:20},p,10);
  assert.equal(JSON.parse(values.ZERO_REPLAY_WINDOW).length,1);
});
test('fallo de persistencia del nonce impide ejecutar operaciones',()=>{
  const c=vm.createContext({});vm.runInContext(fs.readFileSync(new URL('../apps-script/Replay.gs',import.meta.url),'utf8'),c);
  assert.throws(()=>c.zeroConsumeNonce_({requestId:'abcdefgh',issuedAt:1,expiresAt:10},{getProperty:()=>null,setProperty:()=>{}},2),/REPLAY_STATE_NOT_DURABLE/);
});
test('ventana de transporte llena conserva los registros y falla cerrada',()=>{
  const c=vm.createContext({});vm.runInContext(fs.readFileSync(new URL('../apps-script/Replay.gs',import.meta.url),'utf8'),c);
  const raw=JSON.stringify(Array.from({length:64},(_,i)=>['request-'+i,100]));let writes=0;
  assert.throws(()=>c.zeroConsumeNonce_({requestId:'abcdefgh',issuedAt:1,expiresAt:10},{getProperty:()=>raw,setProperty:()=>writes++},2),/REPLAY_WINDOW_FULL/);
  assert.equal(writes,0);
});
test('cerrar sesión descarta respuestas privadas en tránsito sin borrar colas',async()=>{
  const pending=deferred();let cleared=0;
  const session=createSession({clearView:()=>cleared++,send:async(t,action)=>action==='bootstrap'?actor():pending.promise});
  await session.login('token-only-in-memory');
  const response=session.invoke('snapshot',{});await new Promise(r=>setImmediate(r));
  session.logout();pending.resolve({private:'synthetic'});
  await assert.rejects(response,/SESSION_CHANGED/);assert.equal(session.current(),null);assert.equal(cleared,2);
});
test('cambiar cuenta durante un inicio anterior no restaura la sesión anterior',async()=>{
  const old=deferred();const session=createSession({send:async t=>t==='old'?old.promise:actor('333333','seller')});
  const previous=session.login('old');await session.login('new');old.resolve(actor());
  await assert.rejects(previous,/SESSION_CHANGED/);assert.equal(session.current().profile,'seller');
});
test('cambio de perfil exige volver a autenticar antes de transmitir una venta',async()=>{
  let role='administrator',executed=0;const session=createSession({send:async(t,a)=>a==='bootstrap'?actor('111111',role):executed++});
  await session.login('credential');role='seller';
  await assert.rejects(session.invoke('execute',{}),/ACCOUNT_OR_PROFILE_CHANGED/);assert.equal(executed,0);assert.equal(session.current(),null);
});
test('desconexión no confirma ni termina la identidad local',async()=>{
  let offline=false;const session=createSession({send:async()=>{if(offline)throw Error('OFFLINE');return actor();}});
  await session.login('credential');offline=true;
  await assert.rejects(session.invoke('execute',{}),/OFFLINE/);assert.equal(session.current().subject,'google:111111');
});
test('despliegue inicial cerrado no admite datos, inicio de sesión ni operaciones',async()=>{
  for(const path of ['/','/api','/api/execute'])for(const method of ['GET','POST']){
    const response=await closedWorker.fetch(new Request('https://lab.example'+path,{method}));
    assert.equal(response.status,503);assert.equal((await response.json()).operationsEnabled,false);
    assert.equal(response.headers.get('cache-control'),'no-store');
  }
});
