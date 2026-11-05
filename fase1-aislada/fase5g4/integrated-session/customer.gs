function cvLinkCustomer64_(engine,state,command,plan){
 const customer=command.customer||{};
 let id=plan.sale.id;
 if(Object.hasOwn(customer,'registryId')){
  if(engine.actor.role==='seller'||Object.hasOwn(customer,'previousOrder'))throw Error('CUSTOMER_LINK_UNAVAILABLE');
  const entry=cvCustomerRegistry65_(engine)[customer.registryId];
  if(!entry?.id||entry.name!==customer.name||entry.phone!==customer.phone)throw Error('CUSTOMER_CONTACT_MISMATCH');
  id=entry.id;
 }else if(Object.hasOwn(customer,'previousOrder')){
  const previous=Object.hasOwn(state.sales,customer.previousOrder)?state.sales[customer.previousOrder]:null;
  if(!previous?.commercial||previous.status==='CANCELLED')throw Error('CUSTOMER_LINK_UNAVAILABLE');
  if(engine.actor.role==='seller'){
   const own=engine.records().some(row=>row.kind==='PREPARED'&&row.id===previous.originOperationId&&row.plan.audit?.subject===engine.actor.subject);
   if(!own)throw Error('CUSTOMER_LINK_UNAVAILABLE');
  }
  if(!customer.name||!customer.phone||customer.name!==previous.metadata.customer||customer.phone!==previous.metadata.phone)
   throw Error('CUSTOMER_CONTACT_MISMATCH');
  id=previous.commercial.customerId64||previous.id;
 }
 plan.sale.commercial.customerId64=id;
 plan.sale.metadata.address64=customer.address||'';
}

function cvCustomerRegistry65_(engine){
 const records=engine.records(), committed=new Set(records.filter(r=>r.kind==='COMMITTED').map(r=>r.id));
 return Object.fromEntries(records.filter(r=>r.kind==='PREPARED'&&r.plan?.customerRegistration65&&committed.has(r.id))
  .map(r=>[r.plan.customerRegistration65.id,r.plan.customerRegistration65]));
}

function cvRegisterCustomer65_(engine,command){
 if(engine.actor.role==='seller')throw Error('PERMISSION_DENIED');
 if(command.commercialVersion!==4)throw Error('COMMERCIAL_VERSION_REQUIRED');
 const input=command.customer;
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['name','phone','address','zone'].includes(k))||
    !['name','phone','address','zone'].every(k=>typeof input[k]==='string'&&input[k].trim()&&input[k].length<=200))
  throw Error('INVALID_CUSTOMER');
 const phone=input.phone.trim();
 if(!/^\+?[\d ()-]+$/.test(phone)||phone.replace(/\D/g,'').length<7||phone.replace(/\D/g,'').length>15)
  throw Error('INVALID_CUSTOMER');
 const {subject,role}=engine.actor,serverAt=engine.context.now();
 const customer={id:'customer:'+command.operationId,name:input.name.trim(),phone,address:input.address.trim(),zone:input.zone.trim()};
 return {sale:{id:command.saleId,version:1,entityType:'inventory'},resources:[],lots:[],effects:[],commerceEvents:[],
  customerRegistration65:customer,audit:{subject,role,serverAt,type:command.type,operationId:command.operationId}};
}
