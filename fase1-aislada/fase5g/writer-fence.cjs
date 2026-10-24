'use strict';
// Coordinador de simulacro. Una única autoridad/lock compartida es precondición.
const {canonical,clone}=require('../fase3/journal.js');
const check=(x,e)=>{if(!x)throw Error(e)};
class Fence{
 constructor(io){check(io.environment==='TEST_ONLY'&&io.lock&&io.read&&io.append&&io.authorize,'TEST_ONLY_REQUIRED');this.io=io;}
 state(){const rows=this.io.read();let state={revision:0,generation:0,writer:'OLD',newActivated:false};for(const r of rows){check(r.revision===state.revision+1&&r.generation===state.generation+1&&['OLD','NONE','NEW'].includes(r.writer)&&typeof r.newActivated==='boolean','FENCE_CORRUPT');state=r;}return clone(state);}
 change(expectedRevision,event,actor){return this.io.lock(()=>{check(this.io.authorize(actor,'CHANGE_WRITER')===true,'PERMISSION_DENIED');const s=this.state();check(expectedRevision===s.revision,'FENCE_VERSION_CONFLICT');
  let writer,newActivated=s.newActivated;
  if(event.type==='CLOSE_OLD'){check(s.writer==='OLD','INVALID_TRANSITION');check(event.evidence?.allRoutesClosed===true&&event.evidence.pending===0&&event.evidence.backupVerified===true&&typeof event.evidence.lastConfirmedId==='string'&&event.evidence.lastConfirmedId,'CLOSURE_EVIDENCE_REQUIRED');writer='NONE';}
  else if(event.type==='OPEN_NEW'){check(s.writer==='NONE'&&!s.newActivated,'INVALID_TRANSITION');check(event.evidence?.syntheticOwnerApproval===true&&event.evidence.recoveryVerified===true&&/^[a-f0-9]{64}$/.test(event.evidence.actHash||'')&&/^[a-f0-9]{64}$/.test(event.evidence.releaseHash||''),'OPENING_EVIDENCE_REQUIRED');writer='NEW';newActivated=true;}
  else if(event.type==='HALT'){check(s.writer==='NEW','INVALID_TRANSITION');writer='NONE';}
  else throw Error('AUTOMATIC_ROLLBACK_FORBIDDEN');
  const row={environment:'TEST_ONLY',revision:s.revision+1,generation:s.generation+1,writer,newActivated,type:event.type,evidence:clone(event.evidence||{})};this.io.append(row);check(canonical(this.io.read().at(-1))===canonical(row),'FENCE_NOT_DURABLE');return clone(row);
 });}
 run(writer,generation,fn){return this.io.lock(()=>{check(['OLD','NEW'].includes(writer),'INVALID_WRITER');const s=this.state();check(s.writer===writer&&generation===s.generation,'WRITER_FENCED');return fn();});}
}
module.exports={Fence};
