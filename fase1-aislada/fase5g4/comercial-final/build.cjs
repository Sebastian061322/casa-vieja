const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');
const read = file => fs.readFileSync(path.join(__dirname, file), 'utf8');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const base = read('../ux55/build/worker-bundle.mjs');
if (sha(base) !== '344d3b2cd3ac57e66313df4ef6d3c78eb00ab9abf10c345bcbb8580d23c47d9c') throw Error('BASE_CHANGED');
const marker = '\nconst assets=';
const start = base.indexOf(marker) + marker.length;
const end = base.indexOf(';\nexport default', start);
const assets = JSON.parse(base.slice(start, end));
function replaceOnce(source, before, after) {
  if (source.split(before).length !== 2) throw Error('PATCH_BOUNDARY: ' + before.slice(0, 90));
  return source.replace(before, () => after);
}
for (const key of ['/entry.mjs', '/approved-app.js']) {
  let source = assets[key];
  const anchor = ' const choices54=';
  source = replaceOnce(source, anchor,
    read('ui.mjs').replace(/^export /gm, '') + '\n' + read('browser.js') +
    "\n if(actor.profile!=='seller')nav54('ads56','Publicidad / Meta Ads');\n" + anchor);
  const beforeForm = "${select('offer','Producto / pack',offers.map(o=>option(o.id,`${o.name} · ${money(o.priceCents)}`)).join(''))}";
  source = replaceOnce(source, beforeForm, '${offerPicker56(offers,offer)}<div hidden>' + beforeForm + '</div>');
  const renderAnchor = "if(view==='opening54'){openingForm54();return;}";
  source = replaceOnce(source, renderAnchor, renderAnchor + "if(view==='ads56'){renderAds56();return;}");
  const guard = 'const enough = checkSelection55(selected, snapshot.resources);';
  source = replaceOnce(source, guard, `const currentOffer = snapshot.catalogue54.offers.find(item => item.id === form.elements.offer.value);
  const matchingGroup = !selectedGroup56 || (currentOffer && offerGroup(currentOffer) === selectedGroup56);
  const enough = checkSelection55(selected, snapshot.resources) && matchingGroup;`);
  source = replaceOnce(source, "textContent = enough ? '' :", "textContent = !matchingGroup ? 'Elige una presentación de la línea seleccionada.' : enough ? '' :");
  const submit = "if(selected.some(id=>!id))throw Error('Selecciona la partida de cada bolsa');";
  source = replaceOnce(source, submit, submit + "if(selectedGroup56 && offerGroup(snapshot.catalogue54.offers.find(item=>item.id===d.offerId))!==selectedGroup56)throw Error('Elige una presentación de la línea seleccionada');");
  const click = "if(b.hasAttribute('data-new-catalogue54'))";
  source = replaceOnce(source, click, `if(b.dataset.group56){selectedGroup56=b.dataset.group56;await catalogueForm54();return;}
  if(b.dataset.offer56){
   const form=$('catalogue54-form');
   if(!form || form.elements.offer.disabled)return;
   form.elements.offer.value=b.dataset.offer56;
   form.elements.offer.dispatchEvent(new Event('change',{bubbles:true}));
   return;
  }
  ` + click);
  const checked = spawnSync(process.execPath, ['--input-type=module', '--check'], {input:source,encoding:'utf8'});
  if (checked.status !== 0) throw Error(checked.stderr || 'INVALID_MODULE');
  assets[key] = source;
}
const worker = base.slice(0,start) + JSON.stringify(assets) + base.slice(end);
fs.mkdirSync(path.join(__dirname,'build'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'build/worker-bundle.mjs'),worker);
console.log(sha(worker));
