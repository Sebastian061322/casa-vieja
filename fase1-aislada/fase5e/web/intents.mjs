const canonical = value => Array.isArray(value) ? '[' + value.map(canonical).join(',') + ']' : value && typeof value === 'object' ? '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}' : JSON.stringify(value);
const semantic = payload => Object.fromEntries(Object.entries(payload).filter(([k]) => !['date','responsible','operationId','deviceId','epoch','schemaVersion'].includes(k)));
const digest = async value => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical(semantic(value)))))].map(x => x.toString(16).padStart(2, '0')).join('');
export function intentClient(Base) {
  return class extends Base {
    async enqueue(payload) {
      const fingerprint = await digest(payload);
      const key = canonical([payload.type, payload.saleId, payload.expectedSaleVersion ?? null, payload.expectedOfferVersion ?? null]);
      let command, duplicate = false;
      await this.store.transact(state => {
        const prior = (state.intents5e || {})[key];
        const queued = state.queue.find(x => prior ? x.command.operationId === prior.operationId : x.command.type === payload.type && x.command.saleId === payload.saleId && (x.command.expectedSaleVersion ?? null) === (payload.expectedSaleVersion ?? null));
        if (prior) {
          if (prior.fingerprint !== fingerprint) throw Error('INTENT_CHANGED_REVIEW_REQUIRED');
          if (state.receipts[prior.operationId]) throw Error('OPERATION_ALREADY_CONFIRMED');
          if ((state.archived || []).some(x => x.command.operationId === prior.operationId)) throw Error('REJECTED_INTENT_REVIEW_REQUIRED');
          if (!queued) throw Error('INTENT_STATE_REVIEW_REQUIRED');
        }
        if (queued) {
          if (canonical(semantic(queued.command)) !== canonical(semantic(payload))) throw Error('INTENT_CHANGED_REVIEW_REQUIRED');
          command = structuredClone(queued.command); duplicate = true;
        } else {
          state.deviceId ||= this.uuid();
          command = {...structuredClone(payload), operationId:this.uuid(), deviceId:state.deviceId, epoch:this.destination, schemaVersion:2};
          state.queue.push({command:structuredClone(command), state:'PENDING', lastError:''});
        }
        state.intents5e ||= {};
        state.intents5e[key] = {operationId:command.operationId, fingerprint};
        state.generation++;
      });
      return {queued:true, confirmed:false, command, duplicate};
    }
  };
}
