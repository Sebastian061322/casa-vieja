import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import candidate from './build/worker-bundle.mjs';
import baseline from '../queue-view-fix/build/worker-bundle.mjs';

const request = path => new Request('https://example.test' + path);

test('el pedido muestra primero al cliente y bloquea reservas sobre el saldo agregado', async () => {
  for (const path of ['/entry.mjs', '/approved-app.js']) {
    const script = await (await candidate.fetch(request(path), {})).text();
    const start = script.indexOf('const checkSelection55');
    const end = script.indexOf('function renderStock55', start);
    const check = vm.runInNewContext(script.slice(start, end) + '\ncheckSelection55');
    assert.equal(check(['a', 'a'], { a: { qty: 1 } }), false);
    assert.equal(check(['a', 'b'], { a: { qty: 1 }, b: { qty: 1 } }), true);
    assert.equal(check(['missing'], {}), false);
    const form = script.split('<form id="catalogue54-form">')[1].split('</form>')[0];
    assert.ok(form.indexOf("label('customer'") < form.indexOf("select('offer'"));
    assert.ok(form.indexOf('selections') < form.indexOf("label('zone'"));
  }
});

test('el paquete conserva la entrada HTML y el verificador de respaldo', async () => {
  for (const path of ['/', '/config.json', '/backup54.mjs', '/verify-backup.html', '/verify-backup54.mjs']) {
    const before = await baseline.fetch(request(path), {});
    const after = await candidate.fetch(request(path), {});
    assert.equal(after.status, before.status);
    assert.equal(await after.text(), await before.text());
  }
});
