const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');

const root=__dirname,base=path.join(root,'../integrated-session/build');
const output=path.join(root,'build');
const read=file=>fs.readFileSync(file,'utf8');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const patch=(source,before,after)=>{
 if(source.split(before).length!==2)throw Error('PATCH_BOUNDARY '+before.slice(0,80));
 return source.replace(before,after);
};

const baseManifest=JSON.parse(read(path.join(base,'manifest.json')));
if(baseManifest.workerSha256!=='6514225f39bab0298dba0e88a7522acfd2c2ee3a1d61ce8c09347e8dadb40c03')throw Error('BASE_WORKER_CHANGED');
let worker=read(path.join(base,'worker-bundle.mjs'));
const marker='\nconst assets=',start=worker.indexOf(marker)+marker.length,end=worker.indexOf(';\nexport default',start);
if(start<marker.length||end<=start)throw Error('ASSET_BOUNDARY');
const assets=JSON.parse(worker.slice(start,end));

const pwa=path.join(root,'pwa');
assets['/manifest.webmanifest']=read(path.join(pwa,'manifest.webmanifest'));
assets['/service-worker.js']=read(path.join(pwa,'service-worker.js'));
assets['/icon.svg']=read(path.join(pwa,'icon.svg'));
assets['/icon-192.png']='base64:'+fs.readFileSync(path.join(pwa,'icon-192.png')).toString('base64');
assets['/icon-512.png']='base64:'+fs.readFileSync(path.join(pwa,'icon-512.png')).toString('base64');

const mobileHead='<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#241b15"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="Casa Vieja"><link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/icon-192.png"><title>';
for(const route of ['/','/index.html'])assets[route]=patch(assets[route],'<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>',mobileHead);
assets['/entry.mjs']+='\nif("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("/service-worker.js",{scope:"/"}).catch(()=>{}));\n';

worker=worker.slice(0,start)+JSON.stringify(assets)+worker.slice(end);
worker=patch(worker,
 "const type=url.pathname.endsWith('.css')?'text/css':url.pathname.endsWith('.js')||url.pathname.endsWith('.mjs')?'text/javascript':url.pathname.endsWith('.json')?'application/json':'text/html';return new Response(request.method==='HEAD'?null:body,",
 "const binary=typeof body==='string'&&body.startsWith('base64:');const payload=binary?Uint8Array.from(atob(body.slice(7)),c=>c.charCodeAt(0)):body;const type=url.pathname.endsWith('.css')?'text/css':url.pathname.endsWith('.js')||url.pathname.endsWith('.mjs')?'text/javascript':url.pathname.endsWith('.webmanifest')?'application/manifest+json':url.pathname.endsWith('.json')?'application/json':url.pathname.endsWith('.png')?'image/png':url.pathname.endsWith('.svg')?'image/svg+xml':'text/html';return new Response(request.method==='HEAD'?null:payload,");
worker=patch(worker,"'content-type':type+'; charset=utf-8'","'content-type':type+(binary?'':'; charset=utf-8')");

const syntax=spawnSync(process.execPath,['--input-type=module','--check'],{input:worker,encoding:'utf8'});
if(syntax.status!==0)throw Error(syntax.stderr);
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'worker-bundle.mjs'),worker);
const manifest={environment:'TEST_ONLY_PRE_CUTOVER',candidate:'commercial-transition-pwa-1',baseWorkerSha256:baseManifest.workerSha256,workerSha256:hash(worker),backendSha256:baseManifest.backendSha256,backendChanged:false,deployed:false};
fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest));
