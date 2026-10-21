import {test} from 'node:test';import assert from 'node:assert/strict';import {adminMutation} from '../web/admin-queue.mjs';
const memory=()=>{let state={};return {read:async()=>structuredClone(state),transact:async fn=>{const next=structuredClone(state);await fn(next);state=next;}};};
test('permiso con respuesta perdida conserva ID y recupera su recibo al reintentar',async()=>{
  const store=memory(),seen=[],payload={subject:'google:333333',role:'seller',active:false,expectedRevision:3};let lost=true;
  const send=async c=>{seen.push(structuredClone(c));if(lost){lost=false;throw Error('RESPONSE_LOST');}return {state:'COMMITTED',operationId:c.operationId,revision:4};};
  await assert.rejects(adminMutation({store,actor:'google:111111',payload,send,uuid:()=> 'fixed'}),/RESPONSE_LOST/);
  assert.equal((await store.read()).adminQueue5d.length,1);
  await adminMutation({store,actor:'google:111111',payload:{...payload,expectedRevision:4},send});assert.deepEqual(seen[0],seen[1]);
  const state=await store.read();assert.equal(state.adminQueue5d.length,0);assert.equal(state.adminReceipts5d['admin-fixed'].revision,4);
});
test('no sustituye un cambio de permiso pendiente por otro distinto',async()=>{
  const store=memory(),payload={subject:'google:333333',role:'seller',active:false,expectedRevision:3};
  await assert.rejects(adminMutation({store,actor:'google:111111',payload,send:async()=>{throw Error('OFFLINE');},uuid:()=> 'fixed'}),/OFFLINE/);
  await assert.rejects(adminMutation({store,actor:'google:111111',payload:{...payload,role:'administrator'},send:async()=>assert.fail()}),/ADMIN_PENDING_RECOVERY_REQUIRED/);
  assert.equal((await store.read()).adminQueue5d[0].command.role,'seller');
});
