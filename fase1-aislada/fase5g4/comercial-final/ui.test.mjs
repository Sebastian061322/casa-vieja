import test from 'node:test';
import assert from 'node:assert/strict';
import {offerGroup, advertisingSummary} from './ui.mjs';
import candidate from './build/worker-bundle.mjs';
import baseline from '../ux55/build/worker-bundle.mjs';

test('líneas derivadas de la composición explícita del catálogo', () => {
  assert.equal(offerGroup({composition:{Gourmet:2}}), 'Gourmet');
  assert.equal(offerGroup({composition:{'Monte Alto':3}}), 'Monte Alto');
  assert.equal(offerGroup({composition:{Gourmet:2,'Monte Alto':1}}), 'Mixto');
});
test('publicidad se calcula desde egresos canónicos y excluye pagos y otros gastos', () => {
  const event = {kind:'OPERATING_EXPENSE',category:'PUBLICIDAD',date:'2026-11-04T11:30:00Z',campaign:'A',amountCents:2500,messages:10};
  const result = advertisingSummary([event,{...event,kind:'EXPENSE_PAYMENT'},{...event,category:'OTROS'},{...event,campaign:'B'},{...event,date:'2026-11-05'}],{from:'2026-11-04',to:'2026-11-04',campaign:'A'});
  assert.deepEqual(result, {rows:[event],investment:2500,messages:10,costPerMessage:250});
  assert.equal(advertisingSummary([{...event,messages:0}]).costPerMessage,null);
});
test('Worker conserva respuestas de seguridad y archivos de respaldo',async()=>{
  for (const p of ['/api','/config.json','/backup54.mjs','/verify-backup.html','/verify-backup54.mjs']) {
    const req = () => new Request('https://example.test'+p);
    const before = await baseline.fetch(req(),{});
    const after = await candidate.fetch(req(),{});
    assert.equal(after.status,before.status);
    assert.equal(await after.text(),await before.text());
  }
});
