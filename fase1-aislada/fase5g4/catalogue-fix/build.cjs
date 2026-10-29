const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');const root=__dirname,read=p=>fs.readFileSync(path.join(root,p),'utf8'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
let backend=read('../build/Candidate.gs'),worker=read('../build/worker-bundle.mjs');if(sha(backend)!=='31ffa448d69ab99c093cd203da2df7d0a5105967a0ba8c0c627d003549be3cfc'||sha(worker)!=='3ca709bb257dabaf0e9edbf4dff40d438a653558ec93995cea6e0071e7c5a128')throw Error('BASE_CHANGED');
const once=(text,before,after)=>{if(text.split(before).length!==2)throw Error('PATCH_BOUNDARY:'+before.slice(0,70));return text.replace(before,after);};
backend=once(backend,'JSON.stringify(zeroRequest(JSON.parse(event.postData.contents)))','JSON.stringify(cvHttpGateway54_(JSON.parse(event.postData.contents)))');
backend=once(backend,"if(n==='../fase5g2/opening.cjs')return CV52Bundle;throw Error('LOCAL_DEPENDENCY_FORBIDDEN')};\n'use strict';\nconst {clone}","if(n==='../fase5g2/opening.cjs')return {hash:cvCatalogueUtf8Hash54_};throw Error('LOCAL_DEPENDENCY_FORBIDDEN')};\n'use strict';\nconst {clone}");
backend+='\n'+read('backend.gs');
const marker='\nconst assets=',a=worker.indexOf(marker),b=worker.indexOf(';\nexport default',a),assets=JSON.parse(worker.slice(a+marker.length,b));
for(const key of ['/entry.mjs','/approved-app.js']){
 let app=assets[key];
 app=once(app,"['DISPATCH_SALE','Despachar',s.status==='RESERVED']","['DISPATCH_SALE','Despachar',s.status==='RESERVED'&&(!scopedAdapter||s.financial.outstandingCents===0)]");
 app=once(app,"'<section class=\"card\"><h3>Catálogo sin habilitar</h3><p>Faltan configuración y vigencia del catálogo sintético en el servidor. No se utilizan precios anteriores.</p></section>'","'<section class=\"card\"><h3>Catálogo sin habilitar</h3><p>El servidor todavía no confirmó el catálogo aprobado. Conserva el borrador y actualiza la conexión.</p></section>'");
 app=once(app,"if(!snapshot.catalogue54?.enabled){$('sales').innerHTML=","if(!snapshot.catalogue54?.enabled){$('sales').innerHTML=");
 const tail="</p></section>';return;}\n  const offers=snapshot.catalogue54.offers";
 app=once(app,tail,"</p></section>';if(actor.profile==='administrator')$('sales').insertAdjacentHTML('beforeend','<button class=\"btn secondary\" data-catalogue-diagnostic54>Comprobar catálogo del laboratorio</button><pre id=\"catalogue-diagnostic54\" role=\"status\"></pre>');return;}\n  const offers=snapshot.catalogue54.offers");
 const click="if(b.hasAttribute('data-new-catalogue54'))";
 const diagnostic="if(b.hasAttribute('data-catalogue-diagnostic54')){b.disabled=true;try{const r=await session.invoke('snapshot',{format:'ui5d',continuityScope:scopedAdapter.scope,diagnostics54:true});if(!r.catalogueDiagnostics54)throw Error('CATALOGUE_DIAGNOSTIC_UNAVAILABLE');$('catalogue-diagnostic54').textContent=JSON.stringify(r.catalogueDiagnostics54,null,2);}finally{b.disabled=false;}}\n  ";
 app=once(app,click,diagnostic+click);
 assets[key]=app;
}
worker=worker.slice(0,a)+marker+JSON.stringify(assets)+worker.slice(b);
new vm.Script(assets['/entry.mjs']);const ctx=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:()=>null})}});vm.runInContext(backend,ctx);const exposed=Object.keys(ctx).filter(k=>typeof ctx[k]==='function'&&!k.endsWith('_')).sort();if(JSON.stringify(exposed)!==JSON.stringify(['doGet','doPost','zeroRequest']))throw Error('RPC_EXPOSURE');
fs.mkdirSync(path.join(root,'build'),{recursive:true});fs.writeFileSync(path.join(root,'build/Candidate.gs'),backend);fs.writeFileSync(path.join(root,'build/worker-bundle.mjs'),worker);fs.writeFileSync(path.join(root,'build/manifest.json'),JSON.stringify({environment:'TEST_ONLY',status:'LOCAL_PATCH_NOT_APPROVED_OR_DEPLOYED',backendSha256:sha(backend),workerSha256:sha(worker),originalJournalUnchanged:true,originalGatewayChecksPreserved:true,productionReady:false},null,2)+'\n');console.log(JSON.stringify({backendSha256:sha(backend),workerSha256:sha(worker),exposed}));
