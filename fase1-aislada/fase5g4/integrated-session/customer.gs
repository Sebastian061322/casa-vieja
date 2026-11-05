function cvLinkCustomer64_(engine,state,command,plan){
 const customer=command.customer||{};
 let id=plan.sale.id;
 if(Object.hasOwn(customer,'previousOrder')){
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
