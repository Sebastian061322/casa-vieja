import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import candidate from './build/worker-bundle.mjs';
import previous from '../comercial-final/build/worker-bundle.mjs';

const catalog = JSON.parse(fs.readFileSync(new URL('../../fase5g3/catalogue-source.json', import.meta.url)));
const picker = fs.readFileSync(new URL('./picker.js', import.meta.url), 'utf8');
const offer = catalog.offers.find(o => o.id === 'gourmet-tripack');

function context() {
  return vm.createContext({
    offerGroup: o => Object.keys(o.composition).length > 1 ? 'Mixto' : Object.keys(o.composition)[0],
    esc: String, money: cents => (cents / 100).toFixed(2), catalog, offer
  });
}

test('una selección incompleta no puede enviar la oferta anterior', () => {
  const ctx = context();
  vm.runInContext(picker, ctx);
  assert.equal(Boolean(vm.runInContext("selectedGroup56='Gourmet';matchesPicker60(offer)",ctx)),false);
  assert.equal(vm.runInContext('selectedCount60=3;selectedSize60=500;matchesPicker60(offer)',ctx),true);
  assert.equal(vm.runInContext('selectedSize60=250;matchesPicker60(offer)',ctx),false);
});

test('Mixto solo muestra las ofertas de la presentación y gramaje seleccionados', () => {
  const ctx = context();
  vm.runInContext(picker, ctx);
  const html=vm.runInContext("selectedGroup56='Mixto';selectedCount60=3;selectedSize60=500;offerPicker56(catalog.offers,offer)",ctx);
  assert.equal((html.match(/data-offer56=/g)||[]).length,2);
  assert.doesNotMatch(html,/Dúo Encuentro|Tripack Gourmet/);
  const unpriced=vm.runInContext("selectedGroup56='Monte Alto';selectedCount60=2;selectedSize60=250;offerPicker56(catalog.offers,offer)",ctx);
  assert.match(unpriced,/disabled>Pendiente de configurar/);
  assert.doesNotMatch(unpriced,/data-offer56=/);
});

test('se preservan las respuestas de autenticación y el verificador del respaldo', async () => {
  for (const route of ['/api','/config.json','/verify-backup.html','/verify-backup54.mjs','/backup54.mjs']) {
    const req=()=>new Request('https://example.test'+route);
    const [a,b]=await Promise.all([previous.fetch(req(),{}),candidate.fetch(req(),{})]);
    assert.equal(b.status,a.status);
    assert.equal(await b.text(),await a.text());
  }
});
