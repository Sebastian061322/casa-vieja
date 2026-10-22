import {test} from 'node:test';import assert from 'node:assert/strict';
import {validateLabAccess} from '../web/validation.mjs';import {createSession} from '../web/session.mjs';import {context} from './fixture.mjs';
for(const [role,subject]of [['administrator','111111'],['operations','222222'],['seller','333333']])test('ensayo autenticado '+role+': denegaciones reales del adaptador, sin cambios de datos',async()=>{
 const f=context();f.f.properties.ZERO_LAB_ENABLED='YES';let tick=0;
 const session=createSession({send:async(_credential,action,payload)=>{const result=f.c.zeroRequest(await f.sign(subject,action,payload));if(result.error)throw Error(result.error);return result;}});
 await session.login('fictitious');const before=JSON.stringify(f.f.tabs),users=Object.fromEntries(Object.entries(f.f.properties).filter(([k])=>k.startsWith('ZERO_USER_')));
 const report=await validateLabAccess(session,{now:()=>++tick});assert.equal(report.passed,true);assert.equal(JSON.stringify(f.f.tabs),before);
 assert.deepEqual(Object.fromEntries(Object.entries(f.f.properties).filter(([k])=>k.startsWith('ZERO_USER_'))),users);
 assert.doesNotMatch(JSON.stringify(report),/google:|111111|222222|333333|fictitious|@|Bearer|costCents/);
});
test('ensayo no declara éxito si un rol restringido puede leer usuarios',async()=>{
 const actor={subject:'google:333333',profile:'seller'},view={uiVersion:'5D',profile:'seller',revision:1};
 const report=await validateLabAccess({current:()=>actor,invoke:async a=>{if(a==='snapshot')return view;if(a==='users')return {users:[]};throw Error(a==='execute'?'IDENTITY_SPOOFING':'PERMISSION_DENIED');}});
 assert.equal(report.passed,false);assert.equal(report.checks.find(c=>c.id==='deny-users').passed,false);
});
test('interrupción no produce informe aprobado y cambio de cuenta detiene ensayos',async()=>{
 let reads=0;const actor={subject:'google:333333',profile:'seller'};
 await assert.rejects(validateLabAccess({current:()=>++reads===1?actor:null,invoke:async()=>{throw Error('UNEXPECTED_CALL');}}),/SESSION_CHANGED/);
 await assert.rejects(validateLabAccess({current:()=>actor,invoke:async()=>{throw Error('OFFLINE');}}),/OFFLINE/);
});
