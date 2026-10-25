import fs from 'node:fs';import crypto from 'node:crypto';
const root=new URL('../',import.meta.url),source=fs.readFileSync(new URL('build/worker-bundle.mjs',root),'utf8');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
if(sha(source)!=='9ac92655e66705f83b0f9267e62dd0663b9171e397902f85464c0167fe756561')throw Error('BASE_HASH_MISMATCH');
const match=source.match(/const assets=(\{.*?\});\n/s),assets=JSON.parse(match[1]);
const old="await request('execute',{operationId:'INVALID_LAB_PROBE',type:'REGISTER_SALE',role:'administrator'});";
const scoped="await request('execute',{operationId:'INVALID_LAB_PROBE',type:'REGISTER_SALE',role:'administrator',recoveryScope:'TEST_ONLY_DR_5G1'});";
const anchor=" for(let i=0;i<3;i++){const start=now();const view=await request('snapshot',{format:'ui5d'});";
const probe=" const sourceStart=now();let sourceError=null;try{await request('execute',{operationId:'INVALID_DR_SOURCE_PROBE',type:'REGISTER_SALE'});}catch(e){sourceError=e.message;}\n record({id:'reject-source-command',passed:sourceError==='SOURCE_COMMAND_FORBIDDEN',error:sourceError,elapsedMs:Math.round(now()-sourceStart)});\n";
for(const name of ['/validation.mjs','/entry.mjs']){
 if(assets[name].split(old).length!==2||assets[name].split(anchor).length!==2)throw Error('PATCH_TARGET_NOT_UNIQUE');
 assets[name]=assets[name].replace(old,scoped).replace(anchor,probe+anchor);
}
const result=source.replace(match[0],'const assets='+JSON.stringify(assets)+';\n');
const out=new URL('build/',import.meta.url);fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(new URL('worker-bundle.mjs',out),result);
const manifest={environment:'TEST_ONLY',status:'LOCAL_NOT_AUTHORIZED_FOR_PUBLICATION',baseWorkerVersion:'412e54bf-4803-4017-93b2-316dbdc6e8d5',baseSha256:sha(source),workerSha256:sha(result),changedAssets:['/validation.mjs','/entry.mjs'],backendChanged:false,authAndApiOutsideAssetsUnchanged:true,commercialUiChanged:false,credentialsChanged:false,dataChanged:false,validationUrl:'https://casa-vieja-dr-test-only-5g.portopelaez1009.workers.dev/?validation=5d'};
fs.writeFileSync(new URL('manifest.json',out),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest));
