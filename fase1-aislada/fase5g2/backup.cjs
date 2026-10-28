'use strict';
// Archivos ficticios solamente; la clave se entrega por parámetro, nunca se registra.
const crypto=require('node:crypto'),{canonical,clone}=require('../fase3/journal.js');
const check=(ok,e)=>{if(!ok)throw Error(e)};
const hash=x=>crypto.createHash('sha256').update(canonical(x)).digest('hex');
function rejectCredentials(x){if(!x||typeof x!=='object')return;for(const[k,v]of Object.entries(x)){check(!/secret|token|password|privatekey/i.test(k),'CREDENTIAL_FIELD_FORBIDDEN');rejectCredentials(v);}}
function pack(data){
 check(data?.environment==='TEST_ONLY'&&data.syntheticOnly===true,'TEST_ONLY_REQUIRED');rejectCredentials(data);
 check(Array.isArray(data.journal)&&Array.isArray(data.effects)&&data.configuration&&data.codeHashes&&data.openingBundle,'BACKUP_SECTIONS_REQUIRED');
 const seen=new Set(),pre=new Map(),commits=new Set();for(const r of data.journal){const k=r.kind+':'+r.id;check(['PREPARED','COMMITTED','REJECTED'].includes(r.kind)&&!seen.has(k),'JOURNAL_CONFLICT');seen.add(k);
  if(r.kind==='PREPARED'||r.kind==='REJECTED')check(canonical(r.command)===r.fingerprint,'FINGERPRINT_MISMATCH');
  if(r.kind==='PREPARED'){check(!seen.has('REJECTED:'+r.id),'CONFLICTING_TERMINAL_STATE');pre.set(r.id,r);}if(r.kind==='COMMITTED'){check(pre.has(r.id)&&!seen.has('REJECTED:'+r.id)&&canonical(pre.get(r.id).result)===canonical(r.result),'INVALID_COMMIT');commits.add(r.id);}
  if(r.kind==='REJECTED')check(!pre.has(r.id),'CONFLICTING_TERMINAL_STATE');
 }
 const ids=new Set();for(const e of data.effects){check(!ids.has(e.id),'DUPLICATE_EFFECT');ids.add(e.id);check(pre.get(e.operationId)?.plan.effects.some(p=>canonical(p)===canonical(e)),'ORPHAN_EFFECT');}
 for(const id of commits)for(const e of pre.get(id).plan.effects)check(data.effects.some(x=>canonical(x)===canonical(e)),'INCOMPLETE_COMMIT');
 const sections=Object.fromEntries(Object.entries(data).map(([k,v])=>[k,{sha256:hash(v),value:clone(v)}]));const body={schemaVersion:1,environment:'TEST_ONLY',sections};return {...body,sha256:hash(body)};
}
function unpack(archive){check(archive?.schemaVersion===1&&archive.environment==='TEST_ONLY','BACKUP_SCHEMA_REJECTED');const {sha256,...body}=archive;check(hash(body)===sha256,'BACKUP_HASH_MISMATCH');const data={};for(const[k,s]of Object.entries(archive.sections)){check(hash(s.value)===s.sha256,'SECTION_HASH_MISMATCH');data[k]=clone(s.value);}check(pack(data).sha256===sha256,'BACKUP_INVALID');return data;}
function encrypt(archive,key){check(Buffer.isBuffer(key)&&key.length===32,'KEY_REQUIRED');unpack(archive);const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key,iv);cipher.setAAD(Buffer.from('CV_TEST_ONLY_5G2'));const ciphertext=Buffer.concat([cipher.update(JSON.stringify(archive),'utf8'),cipher.final()]);return {schemaVersion:1,environment:'TEST_ONLY',algorithm:'AES-256-GCM',iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),ciphertext:ciphertext.toString('base64')};}
function decrypt(sealed,key){check(sealed?.schemaVersion===1&&sealed.environment==='TEST_ONLY'&&sealed.algorithm==='AES-256-GCM','ENCRYPTED_SCHEMA_REJECTED');check(Buffer.isBuffer(key)&&key.length===32,'KEY_REQUIRED');const d=crypto.createDecipheriv('aes-256-gcm',key,Buffer.from(sealed.iv,'base64'));d.setAAD(Buffer.from('CV_TEST_ONLY_5G2'));d.setAuthTag(Buffer.from(sealed.tag,'base64'));const out=JSON.parse(Buffer.concat([d.update(Buffer.from(sealed.ciphertext,'base64')),d.final()]).toString('utf8'));unpack(out);return out;}
function restore(archive,target,{writer,expectedHash,stopAfter=null}={}){
 check(writer==='NONE','STOP_WRITES_BEFORE_RESTORE');check(/^[a-f0-9]{64}$/.test(expectedHash||'')&&archive.sha256===expectedHash,'INDEPENDENT_BACKUP_HASH_REQUIRED');const data=unpack(archive);
 check(target.environment==='TEST_ONLY'&&Array.isArray(target.journal)&&Array.isArray(target.effects),'TEST_ONLY_REQUIRED');
 for(const name of ['journal','effects']){check(target[name].length<=data[name].length,'RESTORE_CONFLICT');for(let i=0;i<target[name].length;i++)check(canonical(target[name][i])===canonical(data[name][i]),'RESTORE_CONFLICT');}
 if(target.configuration)check(canonical(target.configuration)===canonical(data.configuration),'RESTORE_CONFIG_CONFLICT');
 target.restoreState='INCOMPLETE';let n=0;
 for(const name of ['journal','effects'])for(let i=target[name].length;i<data[name].length;i++){target[name].push(clone(data[name][i]));if(++n===stopAfter)throw Error('TEST_ONLY_RESTORE_INTERRUPTED');}
 target.configuration=clone(data.configuration);target.openingBundle=clone(data.openingBundle);target.codeHashes=clone(data.codeHashes);target.operationMetadata=clone(data.operationMetadata||{});target.archiveHash=archive.sha256;target.restoreState='COMPLETE';return {state:'COMPLETE',journal:target.journal.length,effects:target.effects.length,archiveHash:archive.sha256};
}
function requireReady(target){check(target.restoreState==='COMPLETE','RESTORE_INCOMPLETE');}
module.exports={pack,unpack,encrypt,decrypt,restore,requireReady,hash};
