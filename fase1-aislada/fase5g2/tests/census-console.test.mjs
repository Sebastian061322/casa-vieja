import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../census-console.js',import.meta.url),'utf8');
async function run({location={origin:'https://sebastian061322.github.io',pathname:'/casa-vieja/'},raw=null}={}){
 const reads=[],logs=[];let opened=0;
 const c=vm.createContext({location,localStorage:{getItem(k){reads.push(k);return raw},setItem(){throw Error('WRITE_FORBIDDEN')}},indexedDB:{databases:async()=>[{name:'TEST_ONLY_DB',version:4}],open(){opened++;throw Error('OPEN_FORBIDDEN')}},console:{log(...args){logs.push(args)}}});
 await vm.runInContext(source,c);return {reads,logs,opened};
}
test('sonda UI limita lecturas a las dos colas y metadatos, sin payloads ni abrir IndexedDB',async()=>{const r=await run({raw:JSON.stringify([{id:'PRIVATE_TEST_ONLY_ID',customer:'PRIVATE_TEST_ONLY_PERSON',state:'PENDING'}])});assert.deepEqual(r.reads,['casa_vieja_outbox','casa_vieja_failed_ops']);assert.equal(r.opened,0);const result=JSON.parse(r.logs[0][1]);assert.equal(result.queues[0].count,1);assert.equal(result.queues[0].states.PENDING,1);assert.equal(result.databases[0].version,4);assert.equal(JSON.stringify(r.logs).includes('PRIVATE_TEST_ONLY'),false);});
test('sonda UI no lee nada en otro origen/ruta y no transforma corrupción en cero',async()=>{for(const location of [{origin:'https://other.test',pathname:'/casa-vieja/'},{origin:'https://sebastian061322.github.io',pathname:'/other/'}]){const r=await run({location});assert.equal(r.reads.length,0);assert.equal(r.logs[0][1].status,'WRONG_ORIGIN_OR_PATH');}for(const raw of ['{','{}']){const r=await run({raw});assert.equal(JSON.parse(r.logs[0][1]).queues[0].count,null);}});
