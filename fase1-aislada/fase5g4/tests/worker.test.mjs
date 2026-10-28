import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {sandbox} from './harness.mjs';import {authorize} from './opening-helpers.mjs';import {token,testJwk,audience,origin} from '../../fase5c/multiusuario-gratuito/tests/fixture.mjs';
const source=fs.readFileSync(new URL('../build/worker-bundle.mjs',import.meta.url),'utf8');
const compiled=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {createWorker};').toString('base64'));
test('paquete exacto verifica JWT RSA, firma HMAC y tres perfiles; rechaza rol, origen y lectura financiera del vendedor',async()=>{
 const s=sandbox({serverNow:new Date().toISOString()}),worker=compiled.createWorker({fetcher:async url=>{assert.equal(url,'https://www.googleapis.com/oauth2/v3/certs');return Response.json({keys:[testJwk]});},bridge:async envelope=>s.f.c.zeroRequest(envelope)});
 const env={ZERO_LAB_ENABLED:'YES',FREE_PLAN_ATTESTED:'YES',BILLING_ENABLED:'NO',GOOGLE_CLIENT_ID:audience,FRONTEND_ORIGIN:origin,GATEWAY_SECRET:s.f.secret};
 async function req(subject,action,payload,extra={}){return worker.fetch(new Request(origin+'/api',{method:'POST',headers:{origin,'content-type':'application/json',...(subject?{authorization:'Bearer '+token(subject)}:{}),...extra},body:JSON.stringify({action,payload})}),env);}
 for(const [subject,profile] of [['111111','administrator'],['222222','operations'],['333333','seller']]){const r=await (await req(subject,'bootstrap',null)).json();assert.equal(r.profile,profile);}
 for(const action of ['users','reports','dashboard'])assert.equal((await (await req('333333',action,{continuityScope:'TEST_ONLY_CONTINUITY_5G3'})).json()).error,action==='users'?'LAB_SCOPE_ACTION_FORBIDDEN':'PERMISSION_DENIED');
 assert.equal((await (await req('333333','execute',{role:'administrator'})).json()).error,'IDENTITY_SPOOFING');
 assert.equal((await req(null,'snapshot',null)).ok,false);assert.equal((await req('111111','snapshot',null,{origin:'https://foreign.example.test'})).ok,false);
 assert.equal(s.scopedLedger().effects.length,0);assert.equal(s.f.c.CV_SCOPE53_ACTIVE,false);
});
test('verificador cifrado tiene CSP sin red; selector ficticio no se incluye en Worker desplegable y modo anterior permanece',async()=>{
 const worker=compiled.default;
 const page=await worker.fetch(new Request(origin+'/verify-backup.html'),{});assert.equal(page.status,200);assert.match(page.headers.get('content-security-policy'),/connect-src 'none'/);assert.match(page.headers.get('content-security-policy'),/form-action 'none'/);
 const script=await (await worker.fetch(new Request(origin+'/entry.mjs'),{})).text();assert.equal(script.includes('Vendedor ficticio'),false);assert.match(script,/scopedMode54/);assert.match(script,/cv-zero-lab-v1-/);assert.match(script,/scopedAdapter\?\.store/);
 const assets=await (await worker.fetch(new Request(origin+'/'),{})).text();assert.match(assets,/Laboratorio anterior: conserva sus colas/);assert.equal(assets.includes('GATEWAY_SECRET'),false);
});
test('nuevo backend limita revisión/aprobación al ámbito, encabezado y diario sintético autorizado',()=>{
 for(const options of [{enabled:false},{created:false}]){const s=sandbox(options),before=JSON.stringify(s.oldLedger()),cmd=s.scope(s.local.command('REVIEW_OPENING',{bundleHash:s.local.bundle.bundleHash,actHash:s.local.bundle.actHash,evidence:'TEST_ONLY:X'}));assert.match(s.call('execute',cmd).error,/LAB_SCOPE_DISABLED|LAB_SCOPE_SETUP_REQUIRED/);assert.equal(JSON.stringify(s.oldLedger()),before);}
 const s=sandbox();const cmd=s.local.command('REVIEW_OPENING',{bundleHash:s.local.bundle.bundleHash,actHash:s.local.bundle.actHash,evidence:'TEST_ONLY:X'});assert.equal(s.call('execute',cmd).error,'LAB_SCOPE_REQUIRED');const approval=authorize(s);const open=s.scope(s.local.command('OPEN_CONTINUITY',{bundle:s.local.bundle,approvalOperationId:approval.operationId}));assert.equal(s.call('execute',open).state,'COMMITTED');assert.equal(s.call('snapshot',{format:'ui5d'}).resources['demo:opening-bags'],undefined);assert.equal(s.call('execute',s.scope(s.local.command('CONFIGURE_OFFER',{})),'222222').error,'PERMISSION_DENIED');
});
