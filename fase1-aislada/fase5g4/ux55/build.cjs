const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawnSync} = require('node:child_process');

const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const base = fs.readFileSync(path.join(__dirname, '../queue-view-fix/build/worker-bundle.mjs'), 'utf8');
if (sha(base) !== '766f8682deacc69de92a053462be2b10532aafa5b9ce6deda0c2af081697eecf') throw Error('BASE_CHANGED');
const marker = '\nconst assets=';
const start = base.indexOf(marker) + marker.length;
const end = base.indexOf(';\nexport default', start);
const assets = JSON.parse(base.slice(start, end));
function replaceOnce(source, before, after) {
  if (source.split(before).length !== 2) throw Error('PATCH_BOUNDARY');
  return source.replace(before, () => after);
}
const customer = "${label('customer','Cliente ficticio','text',draft.customer,'required')}";
const zone = "${label('zone','Zona de envío ficticia','text',draft.zone,'required')}";
for (const key of ['/entry.mjs', '/approved-app.js']) {
  let source = assets[key];
  source = replaceOnce(source, customer + zone + '<div class="form-grid">${selections}</div>', '<div class="form-grid">${selections}</div>' + zone);
  source = replaceOnce(source, "${select('offer','Producto / pack'", customer + "${select('offer','Producto / pack'");
  source = replaceOnce(source, '<p>Productos: ${money(offer.priceCents*draft.packs)}. Envío según política del servidor; este importe no acredita pago.</p>', '<p><strong>Subtotal de productos: ${money(offer.priceCents*draft.packs)}</strong><br>El servidor confirma el envío y el total al registrar el pedido.</p><p id="catalogue-stock55" role="status"></p>');
  const guard = ` const checkSelection55 = (selected, resources) => {
  const demand = new Map();
  for (const id of selected) {
   if (!id) continue;
   demand.set(id, (demand.get(id) || 0) + 1);
   if (demand.get(id) > (resources[id]?.qty || 0)) return false;
  }
  return true;
 };
 function renderStock55(form) {
  const selected = [...form.querySelectorAll('[data-catalogue-resource54]')].map(el => el.value);
  const enough = checkSelection55(selected, snapshot.resources);
  form.querySelector('button[type="submit"]').disabled = !enough;
  $('catalogue-stock55').textContent = enough ? '' : 'La cantidad supera el saldo mostrado para una partida. Selecciona otra partida o reduce la cantidad.';
 }
`;
  source = replaceOnce(source, ' async function catalogueForm54(){', guard + ' async function catalogueForm54(){');
  const restore = "if([...el.options].some(o=>o.value===draft.selected[i]))el.value=draft.selected[i];});";
  source = replaceOnce(source, restore, restore + "\n  renderStock55($('catalogue54-form'));");
  source = replaceOnce(source, 'dirty=true;if(changed)await catalogueForm54();', 'dirty=true;if(changed)await catalogueForm54();else if(form.isConnected)renderStock55(form);');
  const old = "const quantities={};for(const id of selected)quantities[id]=(quantities[id]||0)+1;d.selected=selected;";
  source = replaceOnce(source, old, "if(!checkSelection55(selected,snapshot.resources))throw Error('La cantidad supera el saldo mostrado para una partida');d.selected=selected;");
  const check = spawnSync(process.execPath, ['--input-type=module', '--check'], {input: source, encoding: 'utf8'});
  if (check.status !== 0) throw Error(check.stderr || 'INVALID_MODULE');
  assets[key] = source;
}
const worker = base.slice(0, start) + JSON.stringify(assets) + base.slice(end);
fs.mkdirSync(path.join(__dirname, 'build'), {recursive: true});
fs.writeFileSync(path.join(__dirname, 'build/worker-bundle.mjs'), worker);
console.log(sha(worker));
