import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {Script} from 'node:vm';
test('arranque único evita importaciones tras OAuth y conserva montaje autenticado',async()=>{
  execFileSync(process.execPath,['fase1-aislada/fase5d/build-web.cjs']);
  const {default:worker}=await import('../worker-bundle.mjs');
  const response=await worker.fetch(new Request('https://lab.example.test/entry.mjs'),{});
  assert.equal(response.status,200);
  assert.match(response.headers.get('content-type'),/javascript/);
  const source=await response.text();new Script(source);
  assert.doesNotMatch(source,/^import\s|\bimport\(/m);
  assert.match(source,/await session\.login\(response\.credential\)/);
  assert.match(source,/await window\.mount5D\(actor,session,store\)/);
  assert.match(source,/ADMIN_PENDING_RECOVERY_REQUIRED/);
  assert.match(source,/OTHER_QUEUE_REVIEW_REQUIRED/);
});
