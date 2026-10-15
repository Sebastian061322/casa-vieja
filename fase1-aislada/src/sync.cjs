'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
class Client {
  constructor(storage,destination='TEST_ONLY') {
    this.storage=storage;this.destination=destination;this.generation=0;this.remoteRevision=-1;
    this.queue=JSON.parse(storage.getItem('test-outbox')||'[]');this.data={};
  }
  enqueue(command) {
    const next=[...this.queue,{command:clone(command),destination:this.destination,state:'PENDING'}];
    // Persistencia antes de informar éxito; cuota agotada se propaga al usuario.
    this.storage.setItem('test-outbox',JSON.stringify(next));this.queue=next;this.generation++;
    return {queued:true,confirmed:false};
  }
  acknowledge(result) {
    const item=this.queue.find(x=>x.command.operationId===result.operationId);
    if(!item||result.state!=='COMMITTED'||!Number.isSafeInteger(result.revision)) throw Error('INVALID_ACK');
    const next=this.queue.filter(x=>x!==item);
    this.storage.setItem('test-outbox',JSON.stringify(next));this.queue=next;this.generation++;
  }
  async refresh(fetchSnapshot) {
    if(this.queue.length) return false;
    const generation=this.generation,destination=this.destination;
    const response=await fetchSnapshot();
    if(generation!==this.generation||destination!==this.destination||this.queue.length) return false;
    if(response.epoch!==destination||!Number.isSafeInteger(response.revision)||response.revision<this.remoteRevision) return false;
    this.data=clone(response.data);this.remoteRevision=response.revision;return true;
  }
}
module.exports={Client};
