'use strict';
const crypto=require('node:crypto'),{canonical,clone}=require('../fase3/journal.js'),{inspect}=require('./integrity.cjs');
const hash=x=>crypto.createHash('sha256').update(canonical(x)).digest('hex');
const sections=['ledger','configuration','release','devices'];
function safe(value){if(!value||typeof value!=='object')return;for(const [k,v]of Object.entries(value)){if(/password|secret|token|credential|private.?key/i.test(k))throw Error('SECRET_FORBIDDEN');safe(v)}}
function verify(archive,expectedHash){
  if(!expectedHash||archive?.sha256!==expectedHash||hash(archive.payload)!==expectedHash)throw Error('INDEPENDENT_HASH_REQUIRED');
  const p=archive.payload;
  if(p.format!=='CV_RECOVERY_5E'||p.environment!=='TEST_ONLY'||typeof p.sourceId!=='string'||!p.sourceId.startsWith('TEST_ONLY:')||!p.createdAt||Number.isNaN(Date.parse(p.createdAt)))throw Error('BACKUP_PROTOCOL');
  if(Object.keys(p.sections).sort().join()!==sections.slice().sort().join())throw Error('MISSING_SECTION');
  for(const name of sections)if(hash(p.sections[name])!==p.hashes[name])throw Error('SECTION_CHECKSUM');
  safe(p.sections.configuration);safe(p.sections.devices);
  const release=p.sections.release;
  if(!release.commit||!Array.isArray(release.files)||!release.files.length||new Set(release.files.map(f=>f.path)).size!==release.files.length)throw Error('RELEASE_REQUIRED');
  for(const f of release.files)if(typeof f.content!=='string'||hash(f.content)!==f.sha256)throw Error('RELEASE_CHECKSUM');
  const devices=p.sections.devices;
  if(!Array.isArray(devices)||new Set(devices.map(d=>d.id)).size!==devices.length)throw Error('DEVICE_METADATA_REQUIRED');
  for(const d of devices){if(!d.id||!d.origin||!d.engine||!d.epoch||!['METADATA_ONLY','COMPLETE_SYNTHETIC_STATE'].includes(d.coverage))throw Error('DEVICE_METADATA_REQUIRED');if(d.coverage==='COMPLETE_SYNTHETIC_STATE'&&(!d.state||!Array.isArray(d.state.queue)||!d.state.receipts))throw Error('DEVICE_STATE_REQUIRED');}
  return inspect(p.sections.ledger);
}
function create({sourceId,createdAt,ledger,configuration,release,devices}){
  const payload={format:'CV_RECOVERY_5E',environment:'TEST_ONLY',sourceId,createdAt,sections:{ledger:clone(ledger),configuration:clone(configuration),release:{...clone(release),files:release.files.map(f=>({...f,sha256:hash(f.content)}))},devices:clone(devices)}};
  payload.hashes=Object.fromEntries(sections.map(k=>[k,hash(payload.sections[k])]));const archive={payload,sha256:hash(payload)};verify(archive,archive.sha256);return archive;
}
function restore(archive,target,expectedHash){
  const expected=verify(archive,expectedHash),p=archive.payload;
  if(target.environment!=='TEST_ONLY'||!target.id?.startsWith('TEST_ONLY:')||target.id===p.sourceId)throw Error('ISOLATED_DESTINATION_REQUIRED');
  if(target.keys().some(k=>!sections.includes(k)&&k!=='complete'))throw Error('NONEMPTY_DESTINATION');
  // Primero comprobar TODOS los prefijos: nunca escribir sobre una recuperación divergente.
  for(const name of sections){const old=target.read(name);if(old!==undefined&&hash(old)!==p.hashes[name])throw Error('RESTORE_CONFLICT');}
  const done=target.read('complete');if(done!==undefined&&done!==archive.sha256)throw Error('RESTORE_CONFLICT');
  for(const name of sections){if(target.read(name)===undefined)target.writeAbsent(name,clone(p.sections[name]));if(hash(target.read(name))!==p.hashes[name])throw Error('RESTORE_READBACK');}
  const actual=inspect(target.read('ledger'));
  if(canonical(actual)!==canonical(expected))throw Error('RESTORE_STATE_MISMATCH');
  if(done===undefined)target.writeAbsent('complete',archive.sha256);
  if(target.read('complete')!==archive.sha256)throw Error('RESTORE_READBACK');
  return {state:actual,sha256:archive.sha256,complete:true};
}
module.exports={hash,create,verify,restore};
