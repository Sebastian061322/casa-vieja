function cvAdsDetails65_(data){
 if(!data||typeof data!=='object'||Array.isArray(data)||
    Object.keys(data).some(k=>!['date','account','campaign','adSet','ad','observations','messages'].includes(k)))
  throw Error('INVALID_AD_DETAILS');
 for(const key of ['account','campaign','adSet','ad','observations'])
  if(typeof data[key]!=='string'||data[key].length>200||(key!=='observations'&&!data[key].trim()))throw Error('INVALID_AD_DETAILS');
 if(typeof data.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(data.date)||
    !Number.isFinite(Date.parse(data.date))||new Date(data.date).toISOString().slice(0,10)!==data.date||
    !Number.isSafeInteger(data.messages)||data.messages<0)throw Error('INVALID_AD_DETAILS');
 return CVInventoryBase.clone(data);
}

function cvCorrectAd65_(engine,state,command){
 if(engine.actor.role==='seller')throw Error('PERMISSION_DENIED');
 if(command.commercialVersion!==4)throw Error('COMMERCIAL_VERSION_REQUIRED');
 const {subject,role}=engine.actor,now=engine.context.now();
 const current=state.commerce.events.find(e=>e.kind==='OPERATING_EXPENSE'&&e.category==='PUBLICIDAD'&&e.operationId===command.sourceOperationId);
 if(!current)throw Error('AD_EXPENSE_NOT_FOUND');
 if((current.adRevision65||0)!==command.expectedAdRevision)throw Error('AD_REVISION_CONFLICT');
 if(typeof command.reason!=='string'||!command.reason.trim()||command.reason.length>500)throw Error('INVALID_CORRECTION_REASON');
 const amount=command.amountCents;
 const paid=state.commerce.events.filter(e=>e.kind==='EXPENSE_PAYMENT'&&e.sourceOperationId===current.operationId)
  .reduce((n,e)=>n+e.amountCents,0);
 if(!Number.isSafeInteger(amount)||amount<Math.max(paid,1)||amount>100000000000||
    (current.paid&&amount!==current.amountCents))throw Error('AD_AMOUNT_CONFLICT');
 const after=cvAdsDetails65_(command.adDetails),revision=(current.adRevision65||0)+1;
 const event={id:command.operationId+':commercial:0',kind:'AD_EXPENSE_CORRECTED',date:now,operationId:command.operationId,
  sourceOperationId:current.operationId,actorRole:role,subject,reason:command.reason.trim(),revision,
  previous:{amountCents:current.amountCents,messages:current.messages,details:current.adDetails65||null},next:{amountCents:amount,details:after}};
 return {sale:{id:command.saleId,version:1,entityType:'inventory'},resources:[],lots:[],effects:[],commerceEvents:[event],
  audit:{subject,role,serverAt:now,type:command.type,operationId:command.operationId}};
}

function cvProjectAds65_(state){
 const expenses=new Map();
 for(const event of state.commerce.events){
  if(event.kind==='OPERATING_EXPENSE'&&event.category==='PUBLICIDAD')expenses.set(event.operationId,event);
  if(event.kind!=='AD_EXPENSE_CORRECTED')continue;
  const expense=expenses.get(event.sourceOperationId);
  if(!expense||event.revision!==(expense.adRevision65||0)+1)throw Error('AD_REVISION_CONFLICT');
  Object.assign(expense,{adRevision65:event.revision,adDetails65:event.next.details,amountCents:event.next.amountCents,
   campaign:event.next.details.campaign,messages:event.next.details.messages});
 }
 return state;
}
