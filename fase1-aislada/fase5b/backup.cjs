'use strict';
// Archivo local de laboratorio: no contiene conectores ni destinos de producción.
const crypto=require('node:crypto'),{Engine}=require('../fase4/commercial.js'),{canonical,clone,EPOCH}=require('../fase3/journal.js');
const digest=x=>crypto.createHash('sha256').update(canonical(x)).digest('hex');
function inspect(payload){
 if(payload.format!=='CV_BACKUP_1'||payload.epoch!==EPOCH||payload.environment!=='TEST_ONLY')throw Error('BACKUP_PROTOCOL');
 const store={readJournal:()=>clone(payload.journal),readEffects:()=>clone(payload.effects)};
 const engine=new Engine(store);const state=engine.state();
 const prepared=new Map(engine.records().filter(r=>r.kind==='PREPARED').map(r=>[r.id,r]));
 for(const effect of engine.effects()){const p=prepared.get(effect.operationId);if(!p||!p.plan.effects.some(e=>canonical(e)===canonical(effect)))throw Error('ORPHAN_EFFECT');}
 for(const p of prepared.values())if(p.fingerprint!==canonical(p.command))throw Error('FINGERPRINT_MISMATCH');
 return {revision:state.revision,pending:[...prepared.keys()].filter(id=>engine.status(id).state==='PREPARED'),state};
}
function backup(store){const payload={format:'CV_BACKUP_1',environment:'TEST_ONLY',epoch:EPOCH,journal:clone(store.readJournal()),effects:clone(store.readEffects())};inspect(payload);return {payload,sha256:digest(payload)};}
function verify(archive){if(!archive||digest(archive.payload)!==archive.sha256)throw Error('BACKUP_CHECKSUM');return inspect(archive.payload);}
function restore(archive,target){
 verify(archive);
 if(target.environment!=='TEST_ONLY'||target.sourceId===target.destinationId||!target.destinationId)throw Error('RESTORE_DESTINATION');
 // La repetición solo valida una restauración idéntica; nunca fusiona ni sobrescribe.
 const j=target.readJournal(),e=target.readEffects();
 if(j.length||e.length){if(canonical(j)===canonical(archive.payload.journal)&&canonical(e)===canonical(archive.payload.effects))return {alreadyRestored:true,...verify(archive)};throw Error('RESTORE_REQUIRES_EMPTY_DESTINATION');}
 target.writeEmpty(clone(archive.payload.journal),clone(archive.payload.effects));
 if(canonical(target.readJournal())!==canonical(archive.payload.journal)||canonical(target.readEffects())!==canonical(archive.payload.effects))throw Error('RESTORE_READBACK');
 return {alreadyRestored:false,...verify(archive)};
}
module.exports={backup,verify,restore,digest};
