function adForm65(expense){
 const details=expense?.adDetails65||{};
 return '<details><summary>'+ (expense?'Corregir asiento':'Registrar inversión')+'</summary><form class="form-grid" data-ad65="'+esc(expense?.operationId||'')+'" data-ad-revision="'+(expense?.adRevision65||0)+'">'+
  label('date','Fecha de publicidad','date',details.date||expense?.date.slice(0,10)||'','required')+
  [['account','Cuenta publicitaria'],['campaign','Campaña'],['adSet','Conjunto'],['ad','Anuncio']].map(([k,title])=>
   label(k,title,'text',details[k]||expense?.[k]||'','required maxlength="200"')).join('')+
  label('amount','Inversión (S/)','number',expense?expense.amountCents/100:'','required step="0.01" min="0.01"')+
  label('messages','Mensajes','number',expense?.messages??'','required step="1" min="0"')+
  label('observations','Observaciones','text',details.observations||'','maxlength="200"')+
  (expense?label('reason','Motivo de corrección','text','','required maxlength="500"'):
   label('documentRef','Referencia única del comprobante','text','','required maxlength="100"'))+
  '<button class="btn" type="submit">'+(expense?'Guardar corrección':'Registrar inversión')+'</button></form></details>';
}
document.addEventListener('submit',async event=>{
 const form=event.target;
 if(!form.matches('form[data-ad65]'))return;
 event.preventDefault();
 const f=Object.fromEntries(new FormData(form)),button=form.querySelector('button');
 button.disabled=true;
 try{
  const adDetails={date:f.date,account:f.account,campaign:f.campaign,adSet:f.adSet,ad:f.ad,observations:f.observations,messages:Number(f.messages)};
  const amountCents=Math.round(Number(f.amount)*100),sourceOperationId=form.dataset.ad65;
  const base={saleId:'future:'+uuid(),amountCents,adDetails};
  if(sourceOperationId){
   const expense=snapshot.commerce.events.find(e=>e.operationId===sourceOperationId&&e.kind==='OPERATING_EXPENSE');
   if(!expense)throw Error('AD_EXPENSE_NOT_FOUND');
   await send({...base,type:'CORRECT_AD_EXPENSE',sourceOperationId,expectedAdRevision:Number(form.dataset.adRevision),reason:f.reason});
  }else{
   await send({...base,type:'RECORD_EXPENSE',category:'PUBLICIDAD',documentRef:f.documentRef,description:f.observations||'Inversión publicitaria'});
  }
 }catch(error){notice(explain(error));}
 finally{button.disabled=false;}
});
function adHistory65(events,expense){
 const corrections=events.filter(e=>e.kind==='AD_EXPENSE_CORRECTED'&&e.sourceOperationId===expense.operationId);
 return '<p>'+esc([expense.adDetails65?.account,expense.adDetails65?.adSet,expense.adDetails65?.ad].filter(Boolean).join(' · '))+'</p>'+
  (corrections.length?'<details><summary>Historial de correcciones</summary>'+
   corrections.map(e=>'<p>'+esc(e.date)+' · '+esc(e.actorRole)+' · '+money(e.previous.amountCents)+' → '+money(e.next.amountCents)+' · '+esc(e.reason)+'</p>').join('')+'</details>':'')+adForm65(expense);
}
