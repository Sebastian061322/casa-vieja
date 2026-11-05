 function customerFields64(draft){
  const candidates=Object.values(snapshot.sales).filter(s=>s.commercial&&s.status!=='CANCELLED'&&s.metadata?.phone)
   .sort((a,b)=>String(b.metadata.date).localeCompare(String(a.metadata.date))).slice(0,100);
  const registered=(snapshot.customerRegistry65||[]).map(c=>option(c.id,c.name+' · •••'+c.phone.slice(-3))).join('');
  const options=candidates.map(s=>option(s.id,s.metadata.customer+' · •••'+s.metadata.phone.slice(-3)+' · '+s.metadata.date)).join('');
  return select('previousOrder','Cliente existente',option('','Cliente nuevo')+registered+options)+
   label('customer','Cliente','text',draft.customer,'required')+
   label('phone','Teléfono','tel',draft.phone||'')+
   label('address','Dirección','text',draft.address||'')+
   label('channel','Canal de venta','text',draft.channel||'Otro');
 }
 function readCustomer64(form,draft){
  for(const key of ['customer','phone','address','previousOrder','channel','zone'])draft[key]=form.elements[key].value.trim();
 }
 function bindCustomer64(command,draft){
  command.customer={...command.customer,phone:draft.phone||'',address:draft.address||'',
   ...(draft.previousOrder?(draft.previousOrder.startsWith('customer:')?{registryId:draft.previousOrder}:{previousOrder:draft.previousOrder}):{})};
  command.channel=draft.channel||'Otro';
  return command;
 }
 document.addEventListener('change',event=>{
  if(event.target.name!=='previousOrder'||!event.target.closest('#catalogue54-form'))return;
  const form=event.target.form,sale=snapshot.sales[event.target.value];
  const registered=(snapshot.customerRegistry65||[]).find(c=>c.id===event.target.value);
  const contact=registered|| (sale?{name:sale.metadata.customer,phone:sale.metadata.phone,address:sale.metadata.address64,zone:sale.metadata.zone}:null);
  if(!contact)return;
  for(const [field,value] of Object.entries({customer:contact.name,phone:contact.phone,address:contact.address,zone:contact.zone}))
   form.elements[field].value=value||'';
 },true);
