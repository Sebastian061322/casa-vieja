 function customerFields64(draft){
  const options=customerOptions73(draft,'');
  return label('customerSearch73','Buscar cliente por nombre o teléfono','search','','autocomplete="off"')+
   select('previousOrder','Cliente existente',options)+
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

 function customerOptions73(draft,query){
  const all=customerChoices73(snapshot.sales,snapshot.customerRegistry65||[]);
  const found=customerChoices73(snapshot.sales,snapshot.customerRegistry65||[],query);
  const selected=all.find(c=>c.value===draft.previousOrder);
  if(selected){const index=found.findIndex(c=>c.value===selected.value);if(index>=0)found.splice(index,1);found.unshift(selected);}
  return option('','Cliente nuevo')+found.slice(0,100).map(c=>option(c.value,c.name+' · •••'+c.phone.slice(-3)+' · '+(c.date||c.value.slice(-6)))).join('');
 }
 document.addEventListener('input',event=>{
  if(event.target.name!=='customerSearch73'||!event.target.closest('#catalogue54-form'))return;
  const form=event.target.form,value=form.elements.previousOrder.value;
  form.elements.previousOrder.innerHTML=customerOptions73({previousOrder:value},event.target.value);
  form.elements.previousOrder.value=value;
 });
