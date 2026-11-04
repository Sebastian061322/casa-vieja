const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const vm=require('node:vm');
const {spawnSync}=require('node:child_process');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
function patch(s,a,b){if(s.split(a).length!==2)throw Error('PATCH_BOUNDARY '+a.slice(0,90));return s.replace(a,()=>b);}
const backendBase=read('../backup-fix/build/Candidate.gs');
const workerBase=read('../mobile-ux/build/worker-bundle.mjs');
if(hash(backendBase)!=='203e16feb5dffb5360fa2eee96d07d931efd8480ab4416a67dd30be655a306d5'||
   hash(workerBase)!=='7de8966c2eaf12a3695761d211f9320aa34a93c704fe6d927074fc441364406b')throw Error('BASE_CHANGED');
const prepare='const plan=CV53PlanBeforeCatalogue.call(this,prepared.state,prepared.command);plan.catalogueRef=prepared.catalogueRef;';
const backend=patch(backendBase,prepare,
  'const adjustment=cvAuthorizedAdjustment62_(this,command,prepared);'+prepare+
  "if(adjustment){plan.sale.commercial.adjustment=adjustment;plan.audit.commercialAdjustment=adjustment;plan.audit.adjustmentMarginWarning=plan.sale.profitCents<0?'NEGATIVE_MARGIN':null;}");
const code=backend+'\n'+read('backend.gs');
new vm.Script(code);
const marker='\nconst assets=', start=workerBase.indexOf(marker)+marker.length,end=workerBase.indexOf(';\nexport default',start);
const assets=JSON.parse(workerBase.slice(start,end));
for (const key of ['/entry.mjs','/approved-app.js']) {
 let s=assets[key];
 const orderSubmit='await send(catalogueCommand54(d,selected,snapshot.catalogue54.version,actor.profile));';
 s=patch(s,orderSubmit,`const command62=catalogueCommand54(d,selected,snapshot.catalogue54.version,actor.profile);
 const adjustment62=readAdjustment62(form);
 if(adjustment62)command62.commercialAdjustment=adjustment62;
 await send(command62);`);
 s=patch(s,' async function catalogueForm54(){',read('browser.js')+'\n async function catalogueForm54(){');
 const detail="<p><strong>Subtotal de productos: ${money(offer.priceCents*draft.packs)}</strong>";
 s=patch(s,detail,'${adjustmentFields62(draft,offer)}'+detail);
 s=patch(s,"$('catalogue54-form').elements.offer.value=draft.offerId;",
  "$('catalogue54-form').elements.offer.value=draft.offerId;renderAdjustment62($('catalogue54-form'),offer);");
 // Use a distinct build label for the new frontend/backend pair.
 s=patch(s,'mobile-ux-5e417ee1 · Backend compatible: Apps Script 7','ajustes-62 · Backend requiere paquete de ajustes');
 const checked=spawnSync(process.execPath,['--input-type=module','--check'],{input:s,encoding:'utf8'});
 if(checked.status!==0)throw Error(checked.stderr);
 assets[key]=s;
}
const worker=workerBase.slice(0,start)+JSON.stringify(assets)+workerBase.slice(end);
const output=path.join(__dirname,'build');
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'Candidate.gs'),code);
fs.writeFileSync(path.join(output,'worker-bundle.mjs'),worker);
const manifest={environment:'TEST_ONLY',baseBackend:7,baseWorker:'52a8512a',backendSha256:hash(code),workerSha256:hash(worker),deployed:false};
fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(manifest);
