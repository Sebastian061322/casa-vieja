export function customerChoices73(sales,registry,query=''){
 const text=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const phone=value=>String(value||'').replace(/\D/g,'').replace(/^51(?=\d{9}$)/,'');
 const q=text(query).trim(),digits=phone(query),seen=new Set(),rows=[];
 const candidates=Object.values(sales).filter(s=>s.commercial&&s.status!=='CANCELLED'&&s.metadata?.phone)
  .sort((a,b)=>String(b.commercial.createdAt||b.metadata.date).localeCompare(String(a.commercial.createdAt||a.metadata.date)));
 for(const sale of candidates){
  const id=sale.commercial.customerId64||sale.id;if(seen.has(id))continue;seen.add(id);
  rows.push({value:sale.id,id,name:sale.metadata.customer,phone:sale.metadata.phone,date:sale.metadata.date});
 }
 for(const c of registry||[])if(!seen.has(c.id)){seen.add(c.id);rows.push({value:c.id,id:c.id,name:c.name,phone:c.phone,date:''});}
 return rows.filter(c=>!q||text(c.name).includes(q)||(digits&&/^[+\d ()-]+$/.test(query.trim())&&phone(c.phone).includes(digits)));
}

export function advertisingSummary73(events,filters={}){
 const rows=events.filter(e=>e.kind==='OPERATING_EXPENSE'&&e.category==='PUBLICIDAD'&&
  (!filters.from||e.date.slice(0,10)>=filters.from)&&(!filters.to||e.date.slice(0,10)<=filters.to)&&
  ['campaign','account','adSet','ad'].every(key=>!filters[key]||(e.adDetails65?.[key]||e[key])===filters[key]));
 const investment=rows.reduce((sum,e)=>sum+e.amountCents,0);
 const complete=rows.every(e=>Number.isSafeInteger(e.messages)&&e.messages>=0);
 const messages=rows.reduce((sum,e)=>sum+(Number.isSafeInteger(e.messages)?e.messages:0),0);
 return {rows,investment,messages,costPerMessage:complete&&messages>0?Math.round(investment/messages):null};
}
