import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {target} from '../tests.mjs';
const source=fs.readFileSync(new URL('../build/worker-bundle.mjs',import.meta.url),'utf8'),patched=fs.readFileSync(new URL('build/worker-bundle.mjs',import.meta.url),'utf8');
const split=s=>{const m=s.match(/const assets=(\{.*?\});\n/s);return {assets:JSON.parse(m[1]),before:s.slice(0,m.index),after:s.slice(m.index+m[0].length)}};
const a=split(source),b=split(patched);
for(const [subject,profile]of [['111111','administrator'],['222222','operations'],['333333','seller']])test('Harness DR real compilado: '+profile,async()=>{
 const d=target();d.install();d.enable();const before=JSON.stringify(d.f.f.tabs),c=vm.createContext({performance,Date});
 vm.runInContext(b.assets['/validation.mjs'].replaceAll('export ','')+';globalThis.validate=validateLabAccess;',c);
 const session={current:()=>({subject:'google:'+subject,profile}),invoke:async(action,payload)=>{const r=d.call(action,payload,subject);if(r.error)throw Error(r.error);return r;}};
 const result=await c.validate(session);assert.equal(result.passed,true);assert.equal(result.checks.find(x=>x.id==='reject-forged-role').error,'IDENTITY_SPOOFING');assert.equal(result.checks.find(x=>x.id==='reject-source-command').error,'SOURCE_COMMAND_FORBIDDEN');assert.equal(JSON.stringify(d.f.f.tabs),before);
});
test('Solo cambian dos módulos de ensayo, no API/autenticación ni interfaz comercial',()=>{assert.equal(a.before,b.before);assert.equal(a.after,b.after);const changed=Object.keys(a.assets).filter(k=>a.assets[k]!==b.assets[k]);assert.deepEqual(changed.sort(),['/entry.mjs','/validation.mjs']);for(const k of changed){assert.ok(b.assets[k].includes("recoveryScope:'TEST_ONLY_DR_5G1'"));assert.ok(b.assets[k].includes("id:'reject-source-command'"));}});
test('Modo de verificación sigue siendo explícito y no cambia los permisos',()=>{assert.ok(b.assets['/validation.mjs'].includes("get('validation')!=='5d'"));assert.equal(a.assets['/index.html'],b.assets['/index.html']);assert.equal(a.assets['/client.js'],b.assets['/client.js']);});
