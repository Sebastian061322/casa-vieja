// Únicamente localhost: identidades y Sheets simulados. Nunca se empaqueta en Worker.
import http from 'node:http';import fs from 'node:fs';import {context} from './fixture.mjs';
import worker from '../worker-bundle.mjs';
const f=context();f.f.properties.ZERO_LAB_ENABLED='YES';
const subjects={administrator:'111111',operations:'222222',seller:'333333'};
const server=http.createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname==='/api'){
    const role=(req.headers.authorization||'').replace('Bearer local-demo-','');if(!subjects[role])throw Error('TEST_IDENTITY_REQUIRED');
    let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>30000)throw Error('TOO_LARGE');}
    const {action,payload}=JSON.parse(raw),result=f.c.zeroRequest(await f.sign(subjects[role],action,payload));
    if(req.headers['x-cv-lab-fault']==='DROP_COMMITTED_ACK_5E'&&action==='execute'&&/^TEST_ONLY_5E_/.test(payload?.customer?.name||'')&&result.state==='COMMITTED'){res.writeHead(503,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify({error:'TEST_ONLY_RESPONSE_LOST',retryable:true}));return;}
    res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(result));return;
  }
  const allowed=new Set(['index.html','entry.mjs','session.mjs','login-flow.mjs','validation.mjs','api-response.mjs','queue-status.mjs','customer.mjs','polling.mjs','approved-app.js','approved.css','client.js','continuity-core.js','continuity.mjs','admin-queue.mjs','config.json']);
  const name=url.pathname==='/'?'index.html':url.pathname.slice(1);if(!allowed.has(name)){res.writeHead(404);res.end();return;}
  let body=await (await worker.fetch(new Request('http://127.0.0.1/'+name),{})).text();
  if(name==='entry.mjs')body=body.replace("start().catch(()=>status('No se pudo abrir el acceso. No se confirmó ninguna operación.'));","window.google={accounts:{id:{disableAutoSelect(){}}}};status('PRUEBA LOCAL · IDENTIDAD FICTICIA');login({credential:'local-demo-'+(new URLSearchParams(location.search).get('role')||'administrator')});");
  const type=name.endsWith('.css')?'text/css':name.endsWith('.mjs')||name.endsWith('.js')?'text/javascript':name.endsWith('.json')?'application/json':'text/html';
  res.writeHead(200,{'content-type':type+';charset=utf-8','cache-control':'no-store'});res.end(body);
}catch(e){res.writeHead(500,{'content-type':'application/json'});res.end(JSON.stringify({error:e.message}));}});
server.listen(0,'127.0.0.1',()=>console.log('PRUEBA LOCAL FICTICIA http://127.0.0.1:'+server.address().port));
