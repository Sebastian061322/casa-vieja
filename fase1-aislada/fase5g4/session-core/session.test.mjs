import test from 'node:test';
import assert from 'node:assert/strict';
import {sessionAuthority} from './authority.mjs';
import {createCredential, credentialDigest, sessionCookie, readCredential, isSameOriginMutation} from './cookie.mjs';

function fixture() {
  const sessions = new Map();
  const actors = new Map([['google:111111',{subject:'google:111111',role:'administrator'}],['google:222222',{subject:'google:222222',role:'seller'}]]);
  let time = 1000;
  const authority = () => sessionAuthority({
    store:{get:k=>structuredClone(sessions.get(k)),put:(k,v)=>sessions.set(k,structuredClone(v)),remove:k=>sessions.delete(k)},
    lookupActor:s=>actors.get(s), now:()=>time, idleMs:600, absoluteMs:1200, renewAfterMs:200
  });
  return {authority,sessions,actors,setTime:value=>{time=value}};
}

test('reapertura y renovación respetan expiración absoluta y comprueban el rol actual', async()=>{
  const f=fixture(), {token,digest}=await createCredential();
  f.authority().issue(digest,'google:111111',1100);
  const cookie=sessionCookie(token,1);
  const recovered=await credentialDigest(readCredential(cookie.split(';')[0]));
  f.setTime(1300);
  assert.deepEqual(f.authority().resolve(recovered),{subject:'google:111111',role:'administrator',expiresAt:1900});
  f.actors.set('google:111111',{subject:'google:111111',role:'seller'});
  f.setTime(1750);
  assert.deepEqual(f.authority().resolve(recovered),{subject:'google:111111',role:'seller',expiresAt:2200});
  f.setTime(2200);
  assert.equal(f.authority().resolve(recovered),null);
  assert.ok(!JSON.stringify([...f.sessions]).includes(token));
});

test('cierre voluntario invalida la cookie anterior y conserva la otra identidad',async()=>{
  const f=fixture(), a=await createCredential(), b=await createCredential();
  f.authority().issue(a.digest,'google:111111',1300);
  f.authority().issue(b.digest,'google:222222',1300);
  f.authority().revoke(a.digest);
  assert.equal(f.authority().resolve(await credentialDigest(a.token)),null);
  assert.equal(f.authority().resolve(b.digest).subject,'google:222222');
  assert.match(sessionCookie('',0),/Max-Age=0; Secure; HttpOnly; SameSite=Strict$/);
  f.actors.delete('google:222222');
  assert.equal(f.authority().resolve(b.digest),null);
});

test('rechaza identidad vencida, cookies duplicadas y mutaciones de otro origen',async()=>{
  const f=fixture(), {token,digest}=await createCredential();
  assert.throws(()=>f.authority().issue(digest,'google:111111',1000),/SESSION_ISSUE_DENIED/);
  const cookie=sessionCookie(token,1).split(';')[0];
  assert.equal(readCredential(cookie+'; '+cookie),null);
  const origin='https://lab.example';
  assert.equal(isSameOriginMutation(new Request(origin+'/session',{method:'POST',headers:{Origin:origin}}),origin),true);
  assert.equal(isSameOriginMutation(new Request(origin+'/session',{method:'POST',headers:{Origin:'https://other.example'}}),origin),false);
  assert.equal(isSameOriginMutation(new Request(origin+'/session'),origin),false);
});
