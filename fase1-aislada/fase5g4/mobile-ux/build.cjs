const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {spawnSync} = require('node:child_process');
const read = file => fs.readFileSync(path.join(__dirname,file),'utf8');
const hash = s => createHash('sha256').update(s).digest('hex');
const base = read('../comercial-final/build/worker-bundle.mjs');
const baseSha = '31b5741550e62a17575640a0cb9170c3c21b5c60b3ca290671774614cfa63a41';
if (hash(base) !== baseSha) throw Error('BASE_CHANGED');
const marker = '\nconst assets=';
const start = base.indexOf(marker) + marker.length;
const end = base.indexOf(';\nexport default',start);
const assets = JSON.parse(base.slice(start,end));
const buildId = 'mobile-ux-' + hash(read('picker.js') + read('mobile.css') + read('build.cjs')).slice(0,8);
function replaceOnce(source, before, after) {
  if (!before || source.split(before).length !== 2) throw Error('PATCH_BOUNDARY ' + before.slice(0,80));
  return source.replace(before, () => after);
}
for (const key of ['/entry.mjs','/approved-app.js']) {
  let s = assets[key];
  const pickerStart = s.indexOf('let selectedGroup56;');
  const pickerEnd = s.indexOf('function renderAds56(',pickerStart);
  if (pickerStart < 0 || pickerEnd <= pickerStart) throw Error('PICKER_BOUNDARY');
  s = s.slice(0,pickerStart) + read('picker.js') + '\n' + s.slice(pickerEnd);
  s = replaceOnce(s, "if(b.dataset.group56){selectedGroup56=b.dataset.group56;await catalogueForm54();return;}", `if(b.dataset.group56 || b.dataset.count60 || b.dataset.size60){
   if(b.dataset.group56){selectedGroup56=b.dataset.group56;selectedCount60=0;selectedSize60=0;}
   if(b.dataset.count60){selectedCount60=Number(b.dataset.count60);selectedSize60=0;}
   if(b.dataset.size60)selectedSize60=Number(b.dataset.size60);
   if(selectedGroup56 && selectedCount60 && selectedSize60){
    const matching = snapshot.catalogue54.offers.filter(matchesPicker60);
    const form = $('catalogue54-form');
    if(matching.length===1 && form && form.elements.offer.value!==matching[0].id){
     form.elements.offer.value=matching[0].id;
     form.elements.offer.dispatchEvent(new Event('change',{bubbles:true}));
     return;
    }
   }
   await catalogueForm54();
   return;
  }`);
  s = replaceOnce(s, 'const matchingGroup = !selectedGroup56 || (currentOffer && offerGroup(currentOffer) === selectedGroup56);', 'const matchingGroup = matchesPicker60(currentOffer);');
  s = replaceOnce(s, "if(selectedGroup56 && offerGroup(snapshot.catalogue54.offers.find(item=>item.id===d.offerId))!==selectedGroup56)", "if(!matchesPicker60(snapshot.catalogue54.offers.find(item=>item.id===d.offerId)))");
  s = replaceOnce(s, "label('customer','Cliente ficticio','text',draft.customer", "label('customer','Cliente','text',draft.customer");
  s = replaceOnce(s, '<p>Solo clientes ficticios. Catálogo', '<p><strong>ENTORNO DE PRUEBAS — NO REGISTRA VENTAS REALES</strong><br>Catálogo');
  s = replaceOnce(s, "</div>${label('packs','Cantidad de packs'", "</div><div ${locked||matchesPicker60(offer)?'':'hidden'}>${label('packs','Cantidad de packs'");
  s = replaceOnce(s, '<p id="catalogue-stock55" role="status"></p><button class="btn" type="submit">Registrar y reservar</button></fieldset>', '<button class="btn" type="submit">Registrar y reservar</button></div><p id="catalogue-stock55" role="status"></p></fieldset>');
  const info = "nav54('info60','Versión de Casa Vieja');";
  s = replaceOnce(s, "if(actor.profile!=='seller')nav54('ads56','Publicidad / Meta Ads');", info+"if(actor.profile!=='seller')nav54('ads56','Publicidad / Meta Ads');");
  s = replaceOnce(s, "if(view==='ads56'){renderAds56();return;}", "if(view==='info60'){$('info60').textContent='Laboratorio · "+buildId+" · Backend compatible: Apps Script 7';return;}if(view==='ads56'){renderAds56();return;}");
  const checked = spawnSync(process.execPath,['--input-type=module','--check'],{input:s,encoding:'utf8'});
  if (checked.status !== 0) throw Error(checked.stderr || 'INVALID_MODULE');
  assets[key] = s;
}
assets['/index.html'] = replaceOnce(assets['/index.html'],'</head>','<style>'+read('mobile.css')+'</style></head>');
const worker = base.slice(0,start)+JSON.stringify(assets)+base.slice(end);
fs.mkdirSync(path.join(__dirname,'build'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'build/worker-bundle.mjs'),worker);
const manifest={environment:'TEST_ONLY',buildId,baseVersion:'5758768b',baseSha256:baseSha,workerSha256:hash(worker),backendVersion:7,deployed:false};
fs.writeFileSync(path.join(__dirname,'build/manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(manifest);
