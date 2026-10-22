// TEST_ONLY: el Worker retiene el ACK; el navegador obtiene solo un error temporal.
export function controlledResponse(transport, store, enabled = false) {
  let armed = false;
  return {
    arm() { if (!enabled) throw Error('LAB_FAULT_DISABLED'); armed = true; },
    async execute(command) {
      const target = enabled && armed;
      if (target && (command.type !== 'REGISTER_SALE' || !/^TEST_ONLY_5E_/.test(command.customer?.name || ''))) throw Error('SYNTHETIC_TEST_REQUIRED');
      if(target){
        if(typeof transport.armLoss!=='function')throw Error('LAB_NETWORK_FAULT_NOT_AVAILABLE');
        await store.transact(state=>{state.responseTest5e={operationId:command.operationId,saleId:command.saleId,epoch:command.epoch,state:'REQUESTED_NETWORK_ACK_LOSS'};});
        transport.armLoss();armed=false;
      }
      try{return await transport.execute(command)}catch(error){
        if(target&&error.message==='TEST_ONLY_RESPONSE_LOST')await store.transact(state=>{if(state.responseTest5e?.operationId===command.operationId)state.responseTest5e.state='WORKER_ACK_WITHHELD';});
        throw error;
      }
    },
    async status(id) {
      const result=await transport.status(id),saved=(await store.read()).responseTest5e;
      if(saved?.operationId===id&&['REQUESTED_NETWORK_ACK_LOSS','WORKER_ACK_WITHHELD'].includes(saved.state)&&result?.state==='COMMITTED'&&result.operationId===id&&result.epoch===saved.epoch&&result.saleId===saved.saleId&&Number.isSafeInteger(result.revision)&&result.revision>0&&Number.isSafeInteger(result.saleVersion)&&result.saleVersion>=1) {
        await store.transact(state=>{if(state.responseTest5e?.operationId===id){state.responseTest5e.state='RECOVERED_COMMITTED_BY_STATUS';state.responseTest5e.receipt=structuredClone(result);}});
      }
      return result;
    },
    snapshot: () => transport.snapshot()
  };
}
