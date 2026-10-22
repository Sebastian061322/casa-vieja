// Prueba de red explícita: solo claves públicas y firmas ficticias inválidas.
import {writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import candidate from '../worker-bundle.mjs';
const origin='https://casa-vieja-lab-auth.portopelaez1009.workers.dev';
const keys=await (await fetch('https://www.googleapis.com/oauth2/v3/certs',{signal:AbortSignal.timeout(15000)})).json();
const b=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
const invalid=b({alg:'RS256',kid:keys.keys[0].kid})+'.'+b({sub:'123456',aud:'synthetic-invalid',iss:'https://accounts.google.com'})+'.'+Buffer.alloc(256).toString('base64url');
const cases=[
 ['sin origen',{},403,'ORIGIN_DENIED'],
 ['origen ajeno',{origin:'https://untrusted.example.test'},403,'ORIGIN_DENIED'],
 ['sin identidad',{origin},401,'IDENTITY_REQUIRED'],
 ['firma inválida',{origin,authorization:'Bearer '+invalid},401,'IDENTITY_REQUIRED'],
 ['rol administrador declarado con firma inválida',{origin,authorization:'Bearer '+invalid},401,'IDENTITY_REQUIRED',{action:'setUser',payload:{role:'administrator',subject:'google:123456',active:true}}],
 ['credencial demasiado larga',{origin,authorization:'Bearer '+'x'.repeat(16001)},401,'IDENTITY_REQUIRED'],
 ['GET con origen permitido',{origin},400,'INVALID_REQUEST',null,'GET']
];
const results=[];
for(const [name,headers,expectedStatus,expectedError,payload,method='POST'] of cases){
 const started=performance.now();
 const response=await fetch(origin+'/api',{method,signal:AbortSignal.timeout(45000),headers:{'content-type':'application/json',...headers},...(method==='POST'?{body:JSON.stringify(payload??{action:'bootstrap',payload:null})}:{})});
 const body=await response.json();results.push({name,status:response.status,error:body.error,passed:response.status===expectedStatus&&body.error===expectedError,elapsedMs:Math.round(performance.now()-started)});
}
const assets=[];for(const path of ['/entry.mjs','/approved.css','/config.json']){const remote=await fetch(origin+path,{signal:AbortSignal.timeout(15000)}),body=await remote.text(),local=await (await candidate.fetch(new Request(origin+path),{})).text(),sha=x=>createHash('sha256').update(x).digest('hex');assets.push({path,status:remote.status,sha256:sha(body),passed:remote.ok&&sha(body)===sha(local),noStore:remote.headers.get('cache-control')==='no-store'});}
const report={assets,environment:'TEST_ONLY',observedAtUTC:new Date().toISOString(),realCredentialsUsed:false,commercialPerformanceMeasured:false,passed:results.every(x=>x.passed)&&assets.every(x=>x.passed&&x.noStore),results};
await writeFile(new URL('./resultados-red-publica.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));if(!report.passed)process.exitCode=1;
