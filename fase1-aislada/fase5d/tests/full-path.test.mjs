// Integración local: JWT RSA firmado ficticio → Worker → HMAC → candidato mínimo → Sheets simulado.
// Promise.all no reproduce la infraestructura de bloqueo de Google ni dispositivos físicos.
import {test} from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {randomUUID} from 'node:crypto';
import {context} from './fixture.mjs';import {createWorker} from '../api-worker.mjs';import {token,testJwk,audience,origin} from '../../fase5c/multiusuario-gratuito/tests/fixture.mjs';
const require=createRequire(import.meta.url),{Client,empty}=require('../../fase2/client.js');
function setup(){const f=context();f.f.properties.ZERO_LAB_ENABLED='YES';
 const worker=createWorker({fetcher:async()=>new Response(JSON.stringify({keys:[testJwk]}),{headers:{'cache-control':'max-age=3600'}}),bridge:async signed=>f.c.zeroRequest(signed)});
 const env={ZERO_LAB_ENABLED:'YES',FREE_PLAN_ATTESTED:'YES',BILLING_ENABLED:'NO',GOOGLE_CLIENT_ID:audience,FRONTEND_ORIGIN:origin,GATEWAY_SECRET:f.secret};
 async function request(subject,action,payload){const res=await worker.fetch(new Request(origin+'/api',{method:'POST',headers:{origin,'content-type':'application/json',authorization:'Bearer '+token(subject)},body:JSON.stringify({action,payload})}),env);return res.json();}
 return {...f,request};
}
function sale(f,extra={}){const s=f.mem.sale({saleId:'future:full-'+randomUUID(),customer:{name:'TEST_ONLY',zone:'Zona ficticia'},...extra});delete s.deliveryCostCents;delete s.deliveryChargedCents;return s;}
function memory(){let s=empty();return {read:async()=>structuredClone(s),transact:async fn=>{const next=structuredClone(s);fn(next);s=next;}};}
test('camino mínimo completo: respuesta perdida recupera mismo recibo y un solo efecto',async()=>{
 const f=setup(),store=memory(),good={execute:c=>f.request('333333','execute',c),status:id=>f.request('333333','status',id)};
 const client=new Client(store,{...good,execute:async c=>{const ack=await good.execute(c);assert.equal(ack.state,'COMMITTED');throw Error('RESPONSE_LOST');}},'TEST_ONLY_V3',randomUUID);
 const pending=await client.enqueue(sale(f));await client.flush();assert.equal((await store.read()).queue.length,1);
 client.transport=good;await client.flush();const final=await store.read();assert.equal(final.queue.length,0);assert.equal(final.receipts[pending.command.operationId].state,'COMMITTED');
 const rows=f.f.tabs.MovimientosInventarioV3.slice(1).map(r=>JSON.parse(r[2]));assert.equal(rows.filter(r=>r.operationId===pending.command.operationId).length,1);
 assert.equal(f.f.tabs.DiarioInventarioV3.slice(1).map(r=>JSON.parse(r[2])).filter(r=>r.id===pending.command.operationId&&r.kind==='COMMITTED').length,1);
});
test('camino mínimo completo: tres peticiones en vuelo compiten por una bolsa sintética',async()=>{
 const f=setup(),id='demo:last-full';const prep=f.mem.cmd('PREPARE_BAGS',{resourceId:'demo:commercial-bulk',outputResourceId:id,bagGrams:500,grind:'molido',bags:1,wasteGrams:0,processingCents:0,materials:[{resourceId:'demo:commercial-bag500'},{resourceId:'demo:commercial-label'}]});
 assert.equal((await f.request('222222','execute',prep)).state,'COMMITTED');
 const results=await Promise.all(['111111','222222','333333'].map(subject=>f.request(subject,'execute',sale(f,{items:[{offerId:'demo:single',offerVersion:1,resourceId:id,quantity:1}]}))));
 assert.equal(results.filter(r=>r.state==='COMMITTED').length,1);assert.equal(results.filter(r=>r.error==='INSUFFICIENT_STOCK').length,2);
 const view=await f.request('111111','snapshot',{format:'ui5d'});assert.equal(view.resources[id].physical,1);assert.equal(view.resources[id].reserved,1);
});
test('camino mínimo completo: permisos, revocación y conservación del diario previo',async()=>{
 const f=setup(),before=JSON.stringify(f.f.tabs);
 assert.equal((await f.request('333333','users',{role:'administrator'})).error,'PERMISSION_DENIED');
 assert.equal((await f.request('222222','configure',{})).error,'PERMISSION_DENIED');
 assert.equal(JSON.stringify(f.f.tabs),before);
 const grant={operationId:'admin-full-revoke',expectedRevision:3,subject:'google:333333',role:'seller',active:false};
 assert.equal((await f.request('111111','setUser',grant)).state,'COMMITTED');assert.equal((await f.request('333333','bootstrap',null)).error,'ACCESS_DENIED');
 assert.equal((await f.request('111111','setUser',{...grant,operationId:'admin-full-restore',expectedRevision:4,active:true})).state,'COMMITTED');
 assert.equal((await f.request('333333','bootstrap',null)).profile,'seller');assert.equal(JSON.stringify(f.f.tabs),before);
});
