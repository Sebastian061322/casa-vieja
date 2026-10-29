import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const assets=s=>{const m='\nconst assets=',a=s.indexOf(m),b=s.indexOf(';\nexport default',a);return JSON.parse(s.slice(a+m.length,b));};
test('paquete solo modifica dos vistas scoped; no cambia API, credenciales ni recursos estáticos',()=>{
 const before=read('../../status-fix/build/worker-bundle.mjs'),after=read('../build/worker-bundle.mjs'),a=assets(before),b=assets(after);
 assert.equal(createHash('sha256').update(before).digest('hex'),'cf780ac29bbe21f45c3a5ebdd7d94de43c62ee9b16cb854e4c2fb1f05019cba3');
 assert.deepEqual(Object.keys(a),Object.keys(b));assert.deepEqual(Object.keys(a).filter(k=>a[k]!==b[k]).sort(),['/approved-app.js','/entry.mjs']);
 assert.equal(before.slice(0,before.indexOf('\nconst assets=')),after.slice(0,after.indexOf('\nconst assets=')));
 for(const k of ['/entry.mjs','/approved-app.js']){const syntax=spawnSync(process.execPath,['--input-type=module','--check'],{input:b[k],encoding:'utf8'});assert.equal(syntax.status,0,syntax.stderr);assert.equal(b[k].split('const beforeQueueViewSync54=').length,2);assert.match(b[k],/if\(scopedAdapter\)\{/);}
});
