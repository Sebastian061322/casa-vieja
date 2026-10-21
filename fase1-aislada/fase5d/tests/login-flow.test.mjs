import {test} from 'node:test';import assert from 'node:assert/strict';
import {createSession} from '../web/session.mjs';import {createLoginFlow} from '../web/login-flow.mjs';
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}};
const actor=(profile='operations')=>({subject:'google:222222',profile,environment:'TEST_ONLY',destination:'TEST_ONLY_ZERO_1',capabilities:[]});
for(const outcome of ['resolve','reject'])test('inicio anterior '+outcome+' no cierra el inicio Google más reciente',async()=>{
  const old=deferred();let shown=0,errors=0;
  const session=createSession({send:async token=>token==='old'?old.promise:actor()});
  const flow=createLoginFlow({session,prepare:async()=>{},show:()=>shown++,onError:()=>errors++});
  const previous=flow.run('old');assert.equal(await flow.run('new'),true);
  old[outcome](outcome==='resolve'?actor():Error('ACCESS_DENIED'));
  assert.equal(await previous,false);assert.equal(shown,1);assert.equal(errors,0);assert.equal(session.current().profile,'operations');
});
test('cerrar sesión durante preparación impide mostrar datos tardíos',async()=>{
  const preparing=deferred();let shown=0;
  const session=createSession({send:async()=>actor()});
  const flow=createLoginFlow({session,prepare:()=>preparing.promise,show:()=>shown++,onError:()=>{}});
  const result=flow.run('credential');await new Promise(r=>setImmediate(r));flow.invalidate();session.logout();preparing.resolve();
  assert.equal(await result,false);assert.equal(shown,0);assert.equal(session.current(),null);
});
test('denegación actual cierra sesión y se comunica; no se suprime como carrera',async()=>{
  let revoked=false,error;
  const session=createSession({send:async()=>{if(revoked)throw Error('ACCESS_DENIED');return actor()}});
  const flow=createLoginFlow({session,prepare:async()=>{},show:()=>{},onError:e=>error=e.message});
  assert.equal(await flow.run('credential'),true);revoked=true;assert.equal(await flow.run('credential'),false);
  assert.equal(error,'ACCESS_DENIED');assert.equal(session.current(),null);
});

test('callback Google repetido en tránsito comparte ingreso y monta una sola vez',async()=>{
  const preparing=deferred();let logins=0,mounts=0,shown=0;
  const session=createSession({send:async()=>{logins++;return actor()}});
  const flow=createLoginFlow({session,prepare:()=>{mounts++;return preparing.promise},show:()=>shown++,onError:()=>{}});
  const first=flow.run('same-memory-credential');await new Promise(r=>setImmediate(r));
  const duplicate=flow.run('same-memory-credential');assert.equal(first,duplicate);preparing.resolve();
  assert.equal(await first,true);assert.equal(mounts,1);assert.equal(shown,1);assert.equal(logins,2);
});
