// Página coherente con una revisión. No sustituye aún el snapshot de la interfaz.
function commercialPage(request){return commercialReply_(()=>{
 if(!request||!['sales','effects','events'].includes(request.collection)||!Number.isSafeInteger(request.offset)||request.offset<0||!Number.isSafeInteger(request.limit)||request.limit<1||request.limit>100)throw Error('INVALID_PAGE');
 const s=commercialEngine_().state();if(request.revision!==undefined&&request.revision!==s.revision)throw Error('REVISION_CHANGED');
 const rows=request.collection==='sales'?Object.values(s.sales):request.collection==='effects'?s.effects:s.commerce.events;
 return {epoch:s.epoch,revision:s.revision,total:rows.length,offset:request.offset,next:request.offset+request.limit<rows.length?request.offset+request.limit:null,rows:rows.slice(request.offset,request.offset+request.limit)};
});}
