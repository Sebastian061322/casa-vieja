const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=__dirname,read=p=>fs.readFileSync(path.join(root,p),'utf8'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const base=read('../status-fix/build/worker-bundle.mjs');if(sha(base)!=='cf780ac29bbe21f45c3a5ebdd7d94de43c62ee9b16cb854e4c2fb1f05019cba3')throw Error('BASE_CHANGED');
const marker='\nconst assets=',a=base.indexOf(marker),b=base.indexOf(';\nexport default',a),assets=JSON.parse(base.slice(a+marker.length,b));
const anchor="notice('Ensayo aislado 5G.4. Las colas anteriores permanecen en su vista propia.');";
const helper=read('queue-view54.mjs').replace(/^export /gm,'');
for(const key of ['/entry.mjs','/approved-app.js']){
 if(assets[key].split(anchor).length!==2)throw Error('PATCH_BOUNDARY');
 assets[key]=assets[key].replace(anchor,helper+"\nconst beforeQueueViewSync54=sync;sync=async function(){await beforeQueueViewSync54();const live=await client.view();queueView5d=live;refreshQueueState5d();$('queue').innerHTML=queueMarkup54(live,esc,explain);};\n"+anchor);
}
new vm.Script(assets['/entry.mjs']);const worker=base.slice(0,a)+marker+JSON.stringify(assets)+base.slice(b);
fs.mkdirSync(path.join(root,'build'),{recursive:true});fs.writeFileSync(path.join(root,'build/worker-bundle.mjs'),worker);fs.writeFileSync(path.join(root,'build/manifest.json'),JSON.stringify({environment:'TEST_ONLY',status:'LOCAL_NOT_APPROVED_NOT_DEPLOYED',baseWorkerSha256:sha(base),workerSha256:sha(worker),backendChanged:false,queuesChanged:false,remoteChanged:false},null,2)+'\n');console.log(JSON.stringify({workerSha256:sha(worker),backendChanged:false,remoteChanged:false}));
