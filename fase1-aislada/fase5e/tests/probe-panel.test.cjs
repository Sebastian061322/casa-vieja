const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('evidencia visible espera recuperación en curso y se actualiza después de sincronizar',async()=>{
  const nodes=[],create=tag=>{const node={tag,children:[],append(...children){this.children.push(...children)},setAttribute(k,v){this[k]=v}};nodes.push(node);return node};
  let state={responseTest5e:{operationId:'TEST_ONLY_OP',state:'WORKER_ACK_WITHHELD'}},finish;const running=new Promise(resolve=>finish=resolve);
  const c=vm.createContext({URLSearchParams,location:{search:'?recovery=5e'},document:{createElement:create},$:()=>({append(){}}),store:{read:async()=>structuredClone(state)},client:{running},responseProbe:{arm(){}},explain:x=>String(x),sync:async()=>{state.responseTest5e.state='RECOVERED_COMMITTED_BY_STATUS';finish()}});
  vm.runInContext(fs.readFileSync(__dirname+'/../web/recovery-panel.js','utf8'),c);const status=nodes.find(x=>x.role==='status');assert.equal(status.textContent,undefined);await c.sync();assert.match(status.textContent,/RECOVERED_COMMITTED_BY_STATUS/);assert.doesNotMatch(status.textContent,/WORKER_ACK_WITHHELD/);
});
