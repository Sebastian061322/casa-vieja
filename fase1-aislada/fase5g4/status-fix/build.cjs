const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=__dirname,read=p=>fs.readFileSync(path.join(root,p),'utf8'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const base=read('../catalogue-fix/build/worker-bundle.mjs');if(sha(base)!=='029871296ce23a85e36e4b1597719252371e8ae8194c73d750f679ca584de445')throw Error('BASE_CHANGED');
const marker='\nconst assets=',a=base.indexOf(marker),b=base.indexOf(';\nexport default',a),assets=JSON.parse(base.slice(a+marker.length,b));
const anchor="notice('Ensayo aislado 5G.4. Las colas anteriores permanecen en su vista propia.');";
const helper=read('status54.mjs').replace(/^export /gm,'');
for(const key of ['/entry.mjs','/approved-app.js']){
 if(assets[key].split(anchor).length!==2)throw Error('PATCH_BOUNDARY');
 assets[key]=assets[key].replace(anchor,helper+"\nconst beforeStatusSync54=sync;sync=createSyncStatus54({runSync:()=>beforeStatusSync54(),read:()=>client.view(),currentNotice:()=>$('notice').textContent,notice,describe:explain});\n"+anchor);
}
new vm.Script(assets['/entry.mjs']);
const worker=base.slice(0,a)+marker+JSON.stringify(assets)+base.slice(b);
fs.mkdirSync(path.join(root,'build'),{recursive:true});fs.writeFileSync(path.join(root,'build/worker-bundle.mjs'),worker);
fs.writeFileSync(path.join(root,'build/manifest.json'),JSON.stringify({environment:'TEST_ONLY',status:'LOCAL_NOT_APPROVED_NOT_DEPLOYED',baseWorkerSha256:sha(base),workerSha256:sha(worker),backendChanged:false,queuesChanged:false,remoteChanged:false},null,2)+'\n');
console.log(JSON.stringify({workerSha256:sha(worker),backendChanged:false,remoteChanged:false}));
