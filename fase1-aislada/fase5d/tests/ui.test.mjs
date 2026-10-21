import {test} from 'node:test';import assert from 'node:assert/strict';
import {context} from './fixture.mjs';import {createWorker} from '../api-worker.mjs';
import {token,testJwk,audience,origin} from '../../fase5c/multiusuario-gratuito/tests/fixture.mjs';
test('vista 5A.2: vendedor solo recibe sus pedidos y precios públicos',async()=>{
  const f=context();f.f.properties.ZERO_LAB_ENABLED='YES';
  const sale=f.mem.sale({customer:{name:'FICTICIO',zone:'Zona ficticia'}});delete sale.deliveryCostCents;delete sale.deliveryChargedCents;
  assert.equal(f.c.zeroRequest(await f.sign('333333','execute',sale)).state,'COMMITTED');
  const result=f.c.zeroRequest(await f.sign('333333','snapshot',{format:'ui5d'}));
  assert.equal(result.uiVersion,'5D');assert.equal(result.profile,'seller');assert.ok(result.sales[sale.saleId]);
  assert.ok(result.commerce.offers['demo:single']);
  assert.doesNotMatch(JSON.stringify(result),/costCents|valueCents|profit|acquisitionCents|processingCents|financial|authorization|documents/i);
  const other=f.c.zeroRequest(await f.sign('222222','snapshot',{format:'ui5d'}));assert.ok(other.reports);assert.ok(other.lots);assert.ok(other.sales[sale.saleId].financial);
});
test('dashboard usa revisión única, limita fechas y deniega al vendedor',async()=>{
  const f=context();f.f.properties.ZERO_LAB_ENABLED='YES';const snapshot=f.c.zeroRequest(await f.sign('111111','snapshot',{format:'ui5d'}));
  const period={revision:snapshot.revision,from:'2026-10-01',to:'2026-10-21',today:'2026-10-21',days:['2026-10-20','2026-10-21']};
  assert.equal(f.c.zeroRequest(await f.sign('111111','dashboard',period)).daily.length,2);
  assert.equal(f.c.zeroRequest(await f.sign('333333','dashboard',period)).error,'PERMISSION_DENIED');
  assert.equal(f.c.zeroRequest(await f.sign('111111','dashboard',{...period,revision:-1})).error,'REVISION_CHANGED');
  assert.equal(f.c.zeroRequest(await f.sign('111111','dashboard',{...period,days:['2026-09-30']})).error,'INVALID_PERIOD');
});
test('Worker verifica JWT y firma correo de Google; ignorar correo en payload',async()=>{
  let captured;
  const worker=createWorker({fetcher:async (url,options)=>{assert.equal(options.redirect,'manual');assert.equal(url,'https://www.googleapis.com/oauth2/v3/certs');return new Response(JSON.stringify({keys:[testJwk]}),{headers:{'cache-control':'max-age=3600'}});},bridge:async value=>{captured=value;return {received:true};}});
  const env={ZERO_LAB_ENABLED:'YES',FREE_PLAN_ATTESTED:'YES',BILLING_ENABLED:'NO',GOOGLE_CLIENT_ID:audience,FRONTEND_ORIGIN:origin,GATEWAY_SECRET:'fictitious-secret-'.repeat(4)};
  const response=await worker.fetch(new Request(origin+'/api',{method:'POST',headers:{origin,'content-type':'application/json',authorization:'Bearer '+token('333333')},body:JSON.stringify({action:'bootstrap',payload:{verifiedEmail:'admin@example.test',role:'administrator'}})}),env);
  assert.equal(response.status,200);assert.equal(captured.request.verifiedEmail,'333333@example.test');assert.equal(captured.request.subject,'google:333333');
});
test('diagnóstico distingue certificados y respuesta del backend sin exponer excepciones',async()=>{
  const env={ZERO_LAB_ENABLED:'YES',FREE_PLAN_ATTESTED:'YES',BILLING_ENABLED:'NO',GOOGLE_CLIENT_ID:audience,FRONTEND_ORIGIN:origin,GATEWAY_SECRET:'fictitious-secret-'.repeat(4),APPS_SCRIPT_URL:'https://script.google.com/macros/s/TEST_ONLY/exec'};
  const request=()=>new Request(origin+'/api',{method:'POST',headers:{origin,'content-type':'application/json',authorization:'Bearer '+token('333333')},body:JSON.stringify({action:'bootstrap',payload:null})});
  const unavailable=createWorker({fetcher:async()=>{throw Error('private diagnostic never returned')}});
  assert.equal((await (await unavailable.fetch(request(),env)).json()).error,'GOOGLE_KEYS_FETCH_FAILED');
  const malformed=createWorker({fetcher:async url=>url.includes('/certs')?new Response(JSON.stringify({keys:[testJwk]}),{headers:{'cache-control':'max-age=3600'}}):new Response('<html>not a backend receipt</html>')});
  assert.equal((await (await malformed.fetch(request(),env)).json()).error,'BACKEND_RESPONSE_UNAVAILABLE');
});

test('claves Google: rechaza redirecciones sin seguir otro destino',async()=>{
  let calls=0;const worker=createWorker({fetcher:async(_url,options)=>{calls++;assert.equal(options.redirect,'manual');return new Response(null,{status:302,headers:{location:'https://untrusted.example.test/keys'}});}});
  const env={ZERO_LAB_ENABLED:'YES',FREE_PLAN_ATTESTED:'YES',BILLING_ENABLED:'NO',GOOGLE_CLIENT_ID:audience,FRONTEND_ORIGIN:origin};
  const response=await worker.fetch(new Request(origin+'/api',{method:'POST',headers:{origin,'content-type':'application/json',authorization:'Bearer '+token('333333')},body:JSON.stringify({action:'bootstrap'})}),env);
  assert.equal((await response.json()).error,'KEY_SERVICE_UNAVAILABLE');assert.equal(calls,1);
});
