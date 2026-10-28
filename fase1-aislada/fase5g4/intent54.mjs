// Enlaza la UI existente con draftId estable; fecha del primer envío permanece.
const canonical=x=>Array.isArray(x)?'['+x.map(canonical).join(',')+']':x&&typeof x==='object'?'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}':JSON.stringify(x);
const semantic=p=>Object.fromEntries(Object.entries(p).filter(([k])=>!['date','responsible'].includes(k)));
export async function enqueueUi54(adapter,payload,uuid){
 const key=canonical([payload.type,payload.saleId,payload.legacyRef??null,payload.expectedVersion??null,payload.expectedSaleVersion??null,payload.expectedOfferVersion??null]);
 let saved;await adapter.store.transact(s=>{s.uiIntents54=s.uiIntents54||{};const old=s.uiIntents54[key];if(old&&canonical(semantic(old.payload))!==canonical(semantic(payload)))throw Error('INTENT_CHANGED_REVIEW_REQUIRED');saved=old||{draftId:'TEST_ONLY_DRAFT_'+uuid(),payload:structuredClone(payload)};s.uiIntents54[key]=saved;});
 return adapter.client.enqueue(saved.payload,saved.draftId);
}
