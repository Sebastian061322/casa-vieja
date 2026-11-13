import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const worker=fs.readFileSync(new URL('../build/worker-bundle.mjs',import.meta.url),'utf8');
const marker='\nconst assets=',start=worker.indexOf(marker)+marker.length,end=worker.indexOf(';\nexport default',start);
const assets=JSON.parse(worker.slice(start,end));

test('candidato PWA conserva el backend y añade instalación móvil',()=>{
 assert.match(assets['/index.html'],/apple-mobile-web-app-capable/);
 assert.match(assets['/index.html'],/manifest\.webmanifest/);
 assert.match(assets['/entry.mjs'],/serviceWorker\.register/);
 assert(assets['/icon-192.png'].startsWith('base64:'));
 assert(assets['/icon-512.png'].startsWith('base64:'));
});

test('PWA no elimina las barreras TEST_ONLY antes del corte',()=>{
 assert.match(assets['/index.html'],/Solo datos ficticios/);
 assert.match(worker,/SYNTHETIC_TEST_REQUIRED/);
 assert.match(worker,/TEST_ONLY_V3/);
});
