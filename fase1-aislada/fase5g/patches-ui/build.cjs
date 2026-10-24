'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const {lotMetadata}=require('./lot-metadata.cjs');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const source=fs.readFileSync(path.join(__dirname,'../build/worker-bundle.mjs'),'utf8');
if(sha(source)!=='966dc1577447a4b95b07975fd57ae9693743b2473ba61f527c999a584116ba8a')throw Error('BASE_CHANGED_REVIEW_REQUIRED');
const marker='\nconst assets=',start=source.indexOf(marker),end=source.indexOf(';\nexport default',start);
const assets=JSON.parse(source.slice(start+marker.length,end)),before=assets['/approved-app.js'];
const replacements=[
 ['<p>Recibido: ${l.receivedGrams} g · Adquisición inicial: ${money(l.acquisitionCents)} · Procesamiento inicial: ${money(l.processingCents)}</p>','${('+lotMetadata.toString()+')(l,money)}'],
 ["['CANCEL_SALE','Cancelar',s.status==='RESERVED']","['CANCEL_SALE','Cancelar',false]"],
 ["['RETURN_SALE','Recibir devolución',['DISPATCHED','PART_RETURNED'].includes(s.status)]","['RETURN_SALE','Recibir devolución',false]"]
];
let after=before;
for(const [from,to]of replacements){if(after.split(from).length!==2)throw Error('PATCH_BOUNDARY');after=after.replace(from,to);}
const strip=x=>x.replace(/^import .*\n/gm,'');
if(assets['/entry.mjs'].split(strip(before)).length!==2)throw Error('ENTRY_BOUNDARY');
assets['/entry.mjs']=assets['/entry.mjs'].replace(strip(before),strip(after));assets['/approved-app.js']=after;
new vm.Script(assets['/entry.mjs']);
const result=source.slice(0,start)+marker+JSON.stringify(assets)+source.slice(end);
fs.mkdirSync(path.join(__dirname,'build'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'build/worker-bundle.mjs'),result);
fs.writeFileSync(path.join(__dirname,'build/manifest.json'),JSON.stringify({environment:'TEST_ONLY',status:'LOCAL_NOT_AUTHORIZED_FOR_PUBLICATION',baseWorkerVersion:'94e3fbd3',baseSha256:sha(source),workerSha256:sha(result),backendUnchanged:true,permissionsUnchanged:true,recordsUnchanged:true,productionReady:false},null,2)+'\n');
console.log(JSON.stringify({workerSha256:sha(result),published:false}));
