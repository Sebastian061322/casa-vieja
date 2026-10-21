export async function checkContinuity(store){
  const adapter=CVContinuity.browserAdapter(indexedDB,location.origin);
  const list=await adapter.list();
  for(const item of list){const name=typeof item==='string'?item:item.name;
    if(!name||!/^cv-|^(inventory|commercial)-browser-/.test(name))continue;
    const state=await adapter.read(name);if(!state?.queue?.length&&!state?.adminQueue5d?.length)continue;
    if(name!==store.name)throw Error('OTHER_QUEUE_REVIEW_REQUIRED');
    if(state.zeroEngine!==4||CVContinuity.describe({name,engine:'V4',epoch:'TEST_ONLY_V3'},state,location.origin).status==='INCOMPATIBLE')throw Error('INCOMPATIBLE_QUEUE_REVIEW_REQUIRED');
  }
  // La comprobación solo acredita el origen actual; no certifica otros equipos.
  if(!document.getElementById('queue-review5d').checked)throw Error('OTHER_ORIGINS_REVIEW_REQUIRED');
}
