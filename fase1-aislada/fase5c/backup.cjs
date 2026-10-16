'use strict';
const crypto=require('node:crypto'),{canonical,clone}=require('../fase3/journal.js'),v3=require('../fase5b/backup.cjs'),{Engine:Legacy}=require('../fase2/transactions.js');
const digest=x=>crypto.createHash('sha256').update(typeof x==='string'?x:canonical(x)).digest('hex');
function noSecrets(value){if(value&&typeof value==='object')for(const [key,v]of Object.entries(value)){if(/^(password|accessToken|idToken|refreshToken|secret|PHASE5C_GATEWAY_SECRET|SANDBOX_OWNER_EMAIL)$/i.test(key))throw Error('SECRET_IN_BACKUP');noSecrets(v)}}
const rows=(p,name)=>{const table=p.tables[name];if(!Array.isArray(table))throw Error('MISSING_TABLE');return table.slice(1).map(r=>JSON.parse(r[2]));};
function verify(archive){
 if(!archive?.payload||digest(archive.payload)!==archive.sha256)throw Error('BACKUP_CHECKSUM');const p=archive.payload;
 if(p.format!=='CV_COMPLETE_5C'||p.environment!=='TEST_ONLY'||!p.release||!p.config||!p.clients||!Array.isArray(p.clients.origins)||!Array.isArray(p.clients.states))throw Error('BACKUP_PROTOCOL');noSecrets(p.config);noSecrets(p.clients);
 for(const file of p.release.files){if(typeof file.path!=='string'||typeof file.content!=='string'||digest(file.content)!==file.sha256)throw Error('RELEASE_CHECKSUM');}
 if(digest(p.release.files.map(({path,sha256})=>({path,sha256})))!==p.release.sha256)throw Error('RELEASE_CHECKSUM');
 for(const state of p.clients.states){if(typeof state.origin!=='string'||!state.name||!state.data||!Array.isArray(state.data.queue))throw Error('QUEUE_BACKUP_INVALID');for(const item of state.data.queue)if(!item.command?.operationId||!item.command?.epoch)throw Error('QUEUE_BACKUP_INVALID');}
 const store={readJournal:()=>rows(p,'DiarioInventarioV3'),readEffects:()=>rows(p,'MovimientosInventarioV3')};const inventory=v3.verify(v3.backup(store));
 const opening=rows(p,'AperturaV2'),j=rows(p,'DiarioV2'),e=rows(p,'EfectosV2');let legacy=null;
 if(opening.length){if(opening.length!==1)throw Error('INVALID_LEGACY_OPENING');legacy=new Legacy({readJournal:()=>clone(j),readEffects:()=>clone(e)},opening[0]).state();}else if(j.length||e.length)throw Error('MISSING_LEGACY_OPENING');
 return {revision:inventory.revision,pending:inventory.pending,legacy,inventory:inventory.state,clientsCovered:p.clients.scope,release:p.release.sha256};
}
function create({tables,config,clients,files,createdAt}){
 const releaseFiles=files.map(f=>({path:f.path,content:f.content,sha256:digest(f.content)})).sort((a,b)=>a.path.localeCompare(b.path));
 const payload={format:'CV_COMPLETE_5C',environment:'TEST_ONLY',createdAt,config:clone(config),clients:clone(clients),tables:clone(tables),release:{files:releaseFiles,sha256:digest(releaseFiles.map(({path,sha256})=>({path,sha256})))}};
 const archive={payload,sha256:digest(payload)};verify(archive);return archive;
}
function restore(archive,target){const before=verify(archive);if(!target.expectedArchiveSha||target.expectedArchiveSha!==archive.sha256||!target.expectedRelease||target.expectedRelease!==archive.payload.release.sha256)throw Error('UNTRUSTED_SNAPSHOT');if(target.environment!=='TEST_ONLY'||!target.destinationId||target.destinationId===target.sourceId)throw Error('RESTORE_DESTINATION');const existing=target.read();if(existing&&digest(existing)!==digest(archive))throw Error('RESTORE_NONEMPTY_CONFLICT');if(!existing)target.write(clone(archive));const restored=target.read();if(digest(restored)!==digest(archive))throw Error('RESTORE_READBACK');const after=verify(restored);if(canonical(before)!==canonical(after))throw Error('RESTORE_STATE_MISMATCH');return after;}
module.exports={digest,create,verify,restore};
