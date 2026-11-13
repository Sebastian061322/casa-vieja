import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root=new URL('../pwa/',import.meta.url);
test('manifest instala Casa Vieja en modo independiente',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('manifest.webmanifest',root),'utf8'));
 assert.equal(manifest.display,'standalone');
 assert.equal(manifest.scope,'/');
 assert(manifest.icons.some(icon=>icon.sizes==='192x192'));
 assert(manifest.icons.some(icon=>icon.sizes==='512x512'));
});

test('service worker no intercepta API, HTML ni navegación',()=>{
 const worker=fs.readFileSync(new URL('service-worker.js',root),'utf8');
 assert.match(worker,/url\.pathname==='\/api'/);
 assert.match(worker,/url\.pathname==='\/'/);
 assert.match(worker,/endsWith\('\.html'\)/);
 const shell=/const SHELL=\[([^\]]+)\]/.exec(worker)?.[1]||'';
 assert.doesNotMatch(shell,/\/api/);
});
