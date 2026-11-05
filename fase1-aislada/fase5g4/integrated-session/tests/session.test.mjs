import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sandbox} from './harness.mjs';
import {token,testJwk,audience} from '../../../fase5c/multiusuario-gratuito/tests/fixture.mjs';

const bundle=fs.readFileSync(new URL('../build/worker-bundle.mjs',import.meta.url),'utf8');
const {createWorker}=await import('data:text/javascript;base64,'+Buffer.from(bundle+'\nexport {createWorker};').toString('base64'));
const origin='https://synthetic.local.invalid';
const key='CV_TEST_ONLY_SESSION_REGISTRY_63';
function fixture() {
 const s=sandbox({serverNow:new Date().toISOString()});
 s.f.c.Date=Date;
 let writes=0;
 const options={fetcher:async url=>{
  assert.equal(url,'https://www.googleapis.com/oauth2/v3/certs');
  return Response.json({keys:[testJwk]},{headers:{'cache-control':'max-age=300'}});
 },bridge:async envelope=>{
  writes++;
  return JSON.parse(s.f.c.doPost({postData:{contents:JSON.stringify(envelope)}}).text);
 }};
 const env={ZERO_LAB_ENABLED:'YES',FREE_PLAN_ATTESTED:'YES',BILLING_ENABLED:'NO',GOOGLE_CLIENT_ID:audience,FRONTEND_ORIGIN:origin,GATEWAY_SECRET:s.f.secret};
 let worker=createWorker(options);
 const send=(action,headers={},payload=null)=>worker.fetch(new Request(origin+'/api',{
  method:'POST',headers:{origin,'content-type':'application/json',...headers},body:JSON.stringify({action,payload})
 }),env);
 const login=async subject=>{
  const r=await send('sessionStart63',{authorization:'Bearer '+token(subject)});
  const body=await r.json();
  assert.equal(body.subject,'google:'+subject,JSON.stringify(body));
  const cookie=r.headers.get('set-cookie');
  assert.match(cookie,/^__Host-cv-lab-session=[a-f0-9]{64}; Path=\/; Max-Age=[0-9]+; Secure; HttpOnly; SameSite=Strict$/);
  return cookie.split(';')[0];
 };
 return {s,send,login,restart:()=>{worker=createWorker(options)},writes:()=>writes};
}
test('reanuda desde cookie tras reinicio del Worker, relee permisos y revoca en el mismo AUTH',async()=>{
 const f=fixture(), cookie=await f.login('111111');
 assert.ok(!f.s.f.f.properties[key].includes(cookie.split('=')[1]));
 f.restart();
 const resumed=await f.send('bootstrap',{cookie});
 assert.equal((await resumed.json()).profile,'administrator');
 const seller=await f.login('333333');
 assert.equal((await (await f.send('users',{cookie:seller})).json()).error,'PERMISSION_DENIED');
 const ended=await f.send('sessionEnd63',{cookie});
 assert.equal((await ended.json()).sessionEnded,true);
 assert.match(ended.headers.get('set-cookie'),/Max-Age=0/);
 assert.equal((await f.send('bootstrap',{cookie})).status,401);
 assert.equal((await (await f.send('bootstrap',{cookie:seller})).json()).subject,'google:333333');
});
test('cambio voluntario de cuenta invalida la cookie anterior y preserva el diario',async()=>{
 const f=fixture(), cookie=await f.login('111111');
 const before=JSON.stringify(f.s.scopedLedger());
 const response=await f.send('sessionStart63',{cookie,authorization:'Bearer '+token('222222')});
 assert.equal((await response.json()).profile,'operations');
 assert.equal((await f.send('bootstrap',{cookie})).status,401);
 assert.equal(JSON.stringify(f.s.scopedLedger()),before);
});
test('cookie falsa, sesión vencida y otro origen fallan sin autorizar operaciones',async()=>{
 const f=fixture(), cookie=await f.login('111111');
 const count=f.writes();
 assert.equal((await f.send('bootstrap',{cookie,origin:'https://other.example'})).status,403);
 assert.equal(f.writes(),count);
 assert.equal((await f.send('bootstrap',{cookie:'__Host-cv-lab-session='+'a'.repeat(64)})).status,401);
 const props=f.s.f.f.properties, registry=JSON.parse(props[key]);
 for(const s of Object.values(registry))s.idleExpiry=Date.now()-1;
 props[key]=JSON.stringify(registry);
 assert.equal((await f.send('bootstrap',{cookie})).status,401);
});

test('cada consulta autenticada resuelve sesión y permisos en una sola llamada de backend',async()=>{
 const f=fixture(),cookie=await f.login('111111'),before=f.writes();
 const boot=await f.send('bootstrap',{cookie});
 assert.equal((await boot.json()).profile,'administrator');
 assert.equal(f.writes()-before,1);
 const count=f.writes();
 const snapshot=await f.send('snapshot',{cookie},{format:'ui5d',continuityScope:'TEST_ONLY_CONTINUITY_5G3'});
 const body=await snapshot.json();
 assert.equal(body.__cvActor72.subject,'google:111111');
 assert.equal(f.writes()-count,1);
 assert.match(snapshot.headers.get('server-timing'),/sheetReadMs;dur=/);
 assert.equal(body.__timing72,undefined);
 const row={target:'google:111111',role:'seller',active:true};
 f.s.f.f.properties.ZERO_USER_3=JSON.stringify(row);
 const denied=await f.send('users',{cookie});
 assert.equal((await denied.json()).error,'PERMISSION_DENIED');
});
