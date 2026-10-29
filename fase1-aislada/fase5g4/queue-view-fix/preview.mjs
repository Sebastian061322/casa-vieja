// Solo fixture local: JWT RSA ficticio → Worker real → HMAC → Apps Script VM.
// Nunca se publica este servidor ni su selector de identidades ficticias.
import http from 'node:http';import fs from 'node:fs';import vm from 'node:vm';import {createRequire} from 'node:module';
import {sandbox,tabs} from '../catalogue-fix/tests/harness.mjs';import {act,obligations} from '../../fase5g2/tests/fixture.mjs';
import {token,testJwk,audience} from '../../fase5c/multiusuario-gratuito/tests/fixture.mjs';
const require=createRequire(import.meta.url),{hash}=require('../../fase5g2/opening.cjs');
const source=fs.readFileSync(new URL('./build/worker-bundle.mjs',import.meta.url),'utf8');
const module=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {createWorker};').toString('base64'));
const f=sandbox({serverNow:new Date().toISOString()});f.f.c.Date=Date;
const a=act();a.effectiveAt='2026-10-28T00:00:00-05:00';for(const row of a.rows)row.countedAt='2026-10-27T22:00:00-05:00';
// Mantener HELD igual que la propuesta remota.
a.rows.push({...structuredClone(a.rows[1]),resourceId:'demo:monte-500',lot:'demo:monte-500-lot',product:'TEST_ONLY Monte Alto 500 g',grams:500,physical:4,historicalValueCents:8000});
a.rows.push({...structuredClone(a.rows[0]),resourceId:'demo:gourmet-250',lot:'demo:gourmet-250-lot',product:'TEST_ONLY Gourmet 250 g',grams:250,physical:4,reserved:0,historicalValueCents:2000,pendingOrders:[]});
f.f.c.CV_SCOPE53_ACTIVE=true;const bundle=vm.runInContext('CV52Bundle.prepare('+JSON.stringify(a)+','+JSON.stringify(obligations())+')',f.f.c);f.f.c.CV_SCOPE53_ACTIVE=false;
const cfg=structuredClone(f.local.config);cfg.approvedBundleHash=bundle.bundleHash;for(const p of Object.values(cfg.policies)){delete p.sha256;p.approvedAt='2026-10-27T23:00:00-05:00';p.effectiveAt=a.effectiveAt;p.sha256=hash(p);}
f.f.f.properties.CV_5G3_CONTINUITY_CONFIG=JSON.stringify(cfg);f.f.f.properties.CV_5G4_OPENING_PROPOSAL=JSON.stringify(bundle);
const catalogue=JSON.parse(fs.readFileSync(new URL('../../fase5g3/catalogue-source.json',import.meta.url),'utf8'));
const {createHash}=await import('node:crypto');f.f.f.properties.CV_5G4_BACKEND_SHA256=createHash('sha256').update(fs.readFileSync(new URL('../catalogue-fix/build/Candidate.gs',import.meta.url))).digest('hex');f.f.f.properties.CV_5G4_WORKER_SHA256=createHash('sha256').update(source).digest('hex');
f.f.f.properties.CV_5G3_CATALOGUE_CONFIG=JSON.stringify({environment:'TEST_ONLY',enabled:true,approvalKind:'SYNTHETIC_TEST_APPROVAL',catalogueHash:hash(catalogue),validFrom:'2026-10-28',validUntil:'2026-10-31',resourceLines:Object.fromEntries(a.rows.map(r=>[r.resourceId,{line:r.family==='Gourmet'?'Gourmet':'Monte Alto',lot:r.lot,grams:r.grams,grind:r.grind}]))});
if(process.env.CV_FIXTURE_SEED_OPENING==='YES'||process.argv.includes('--seed-opening')){
 const common={bundleHash:bundle.bundleHash,actHash:bundle.actHash,evidence:'TEST_ONLY:LOCAL_FIXTURE_PRESEED'},ids=[];
 for(const actor of ['111111','222222']){const c=f.scope(f.local.command('REVIEW_OPENING',common));if(f.call('execute',c,actor).state!=='COMMITTED')throw Error('FIXTURE_REVIEW_FAILED');ids.push(c.operationId);}
 const approval=f.scope(f.local.command('AUTHORIZE_OPENING',{...common,reviewOperationIds:ids}));if(f.call('execute',approval).state!=='COMMITTED')throw Error('FIXTURE_AUTHORIZATION_FAILED');
 if(f.call('execute',f.scope(f.local.command('OPEN_CONTINUITY',{bundle,approvalOperationId:approval.operationId}))).state!=='COMMITTED')throw Error('FIXTURE_OPENING_FAILED');
}
const port=Number(process.argv.find(x=>x.startsWith('--port='))?.slice(7)||process.env.CV_TEST_PORT||8801),origin='http://127.0.0.1:'+port;
const gateway=module.createWorker({fetcher:async url=>{if(url!=='https://www.googleapis.com/oauth2/v3/certs')throw Error('EXTERNAL_NETWORK_FORBIDDEN');return new Response(JSON.stringify({keys:[testJwk]}),{headers:{'cache-control':'max-age=3600'}})},bridge:async envelope=>JSON.parse(f.f.c.doPost({postData:{contents:JSON.stringify(envelope)}}).text)});
const env={ZERO_LAB_ENABLED:'YES',FREE_PLAN_ATTESTED:'YES',BILLING_ENABLED:'NO',GOOGLE_CLIENT_ID:audience,FRONTEND_ORIGIN:origin,GATEWAY_SECRET:f.f.secret};
const marker='\nconst assets=',begin=source.indexOf(marker)+marker.length,end=source.indexOf(';\nexport default',begin),assets=JSON.parse(source.slice(begin,end));
const hook=`
status('SIMULACIÓN LOCAL · identidades ficticias; no es inicio de sesión Google real.');
$('google-button').innerHTML='<p>Solo datos TEST_ONLY. Sin Google ni Sheets reales.</p><button class="btn" data-fixture54="111111">Administrador ficticio</button><button class="btn" data-fixture54="222222">Gerente ficticio</button><button class="btn" data-fixture54="333333">Vendedor ficticio</button>';
const fixturePanel54=document.createElement('div');fixturePanel54.innerHTML='<label><input type="checkbox" id="offline-fixture54"> Simular desconexión local (solo API de este ensayo)</label>';document.body.prepend(fixturePanel54);
const fetchFixture54=window.fetch.bind(window);window.fetch=(input,options)=>{if(String(input)==='/api'&&$('offline-fixture54')?.checked)return Promise.reject(Error('TEST_ONLY_OFFLINE'));return fetchFixture54(input,options);};
document.querySelectorAll('[data-fixture54]').forEach(b=>b.onclick=async()=>{try{const response=await fetch('/fixture-credential54?subject='+b.dataset.fixture54).then(r=>r.json());await login({credential:response.credential});}catch(e){status(e.message)}});
`;
const tail="start().catch(()=>status('No se pudo abrir el acceso. No se confirmó ninguna operación.'));";
if(assets['/entry.mjs'].split(tail).length!==2)throw Error('FIXTURE_BOUNDARY');assets['/entry.mjs']=assets['/entry.mjs'].replace(tail,hook);
const server=http.createServer(async(req,res)=>{try{
 if(req.headers.host!=='127.0.0.1:'+port){res.writeHead(403);res.end();return;}
 const url=new URL(req.url,origin);let response;
 if(url.pathname==='/fixture-credential54'){const subject=url.searchParams.get('subject');if(!['111111','222222','333333'].includes(subject)){res.writeHead(403);res.end();return;}response=Response.json({credential:token(subject)},{headers:{'cache-control':'no-store'}});}
 else if(url.pathname==='/api'){const chunks=[];for await(const c of req)chunks.push(c);response=await gateway.fetch(new Request(url,{method:req.method,headers:req.headers,body:Buffer.concat(chunks)}),env);}
 else if(assets[url.pathname])response=new Response(assets[url.pathname],{headers:{'content-type':url.pathname.endsWith('.css')?'text/css':url.pathname.endsWith('.js')||url.pathname.endsWith('.mjs')?'text/javascript':'text/html','cache-control':'no-store'}});
 else response=new Response('Not found',{status:404});
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500,{'content-type':'application/json'});res.end(JSON.stringify({error:'LOCAL_FIXTURE_UNAVAILABLE'}));}});
server.listen(port,'127.0.0.1',()=>console.log('Fixture local TEST_ONLY '+origin+'/?engine=5g4; sin Google/Sheets reales'));
