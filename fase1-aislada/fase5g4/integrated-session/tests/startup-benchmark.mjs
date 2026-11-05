import fs from 'node:fs';
import {performance} from 'node:perf_hooks';
import {sandbox} from './harness.mjs';
import {token,testJwk,audience} from '../../../fase5c/multiusuario-gratuito/tests/fixture.mjs';
const source=fs.readFileSync(process.argv[2]||new URL('../build/worker-bundle.mjs',import.meta.url),'utf8');
const {createWorker}=await import('data:text/javascript;base64,'+Buffer.from(source+'\nexport {createWorker};').toString('base64'));
const marker='\nconst assets=';
const assets=JSON.parse(source.slice(source.indexOf(marker)+marker.length,source.indexOf(';\nexport default')));
const {createSession}=await import('data:text/javascript;base64,'+Buffer.from(assets['/session.mjs']).toString('base64'));
const results=[];
for(let sample=0;sample<7;sample++){
 const s=sandbox({serverNow:new Date().toISOString()});s.f.c.Date=Date;
 const rows=[];
 const worker=createWorker({fetcher:async()=>Response.json({keys:[testJwk]},{headers:{'cache-control':'max-age=300'}}),
 bridge:async envelope=>{
  const start=performance.now();
  const result=JSON.parse(s.f.c.doPost({postData:{contents:JSON.stringify(envelope)}}).text);
  rows.push({action:envelope.request.action,ms:performance.now()-start,bytes:Buffer.byteLength(JSON.stringify(result))});
  return result;
 }});
 const origin='https://synthetic.local.invalid',env={ZERO_LAB_ENABLED:'YES',FREE_PLAN_ATTESTED:'YES',BILLING_ENABLED:'NO',GOOGLE_CLIENT_ID:audience,FRONTEND_ORIGIN:origin,GATEWAY_SECRET:s.f.secret};
 let cookie='';
 const call=async(action,authorization,payload=null)=>{
  const r=await worker.fetch(new Request(origin+'/api',{method:'POST',headers:{origin,'content-type':'application/json',...(authorization?{authorization:'Bearer '+authorization}:{cookie})},body:JSON.stringify({action,payload})}),env);
  if(r.headers.has('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];
  const result=await r.json();if(result.error)throw Error(result.error);return result;
 };
 const session=createSession({send:async(_,action,payload)=>call(action,null,payload)});
 await call('sessionStart63',token('111111'));
 await session.login('CV_COOKIE_SESSION');
 await session.invoke('snapshot',{format:'ui5d',continuityScope:'TEST_ONLY_CONTINUITY_5G3'});
 const initial=[...rows];rows.length=0;
 const reopened=createSession({send:async(_,action,payload)=>call(action,null,payload)});
 await reopened.login('CV_COOKIE_SESSION');
 await reopened.invoke('snapshot',{format:'ui5d',continuityScope:'TEST_ONLY_CONTINUITY_5G3'});
 results.push({initial,resume:rows});
}
const summarize=kind=>{
 const totals=results.map(r=>r[kind].reduce((n,x)=>n+x.ms,0)).sort((a,b)=>a-b);
 return {backendCalls:results[0][kind].length,localBackendMedianMs:+totals[3].toFixed(2),localBackendWorstMs:+totals.at(-1).toFixed(2),
  stages:results[0][kind].map(r=>({action:r.action,responseBytes:r.bytes}))};
};
console.log(JSON.stringify({environment:'LOCAL_VM_NO_NETWORK',samples:7,initial:summarize('initial'),resume:summarize('resume')},null,2));
