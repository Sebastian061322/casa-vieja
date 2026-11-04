 const cartRows63 = draft => Array.isArray(draft?.cart63) ? draft.cart63 : [];
 const cartUnits63 = rows => rows.flatMap(row=>row.selections.flatMap(item=>Array(item.quantity).fill(item.resourceId)));
 const cartPrice63 = (rows,offers) => rows.reduce((sum,row)=>sum+(offers.find(o=>o.id===row.offerId)?.priceCents||0)*row.packs,0);
 function cartPanel63(draft,offers,locked) {
  const rows=cartRows63(draft);
  if(!rows.length)return '';
  return '<section aria-label="Carrito"><h4>Carrito</h4>'+rows.map((row,index)=>{
   const offer=offers.find(o=>o.id===row.offerId);
   return '<p>'+esc(offer?.name||'Oferta sin vigencia')+' × '+row.packs+
    ' · '+money((offer?.priceCents||0)*row.packs)+' <button type="button" class="btn secondary" data-cart-remove63="'+index+'" '+(locked?'disabled':'')+'>Quitar</button></p>';
  }).join('')+'<strong>Subtotal del carrito: '+money(cartPrice63(rows,offers))+'</strong></section>';
 }
 function cartLine63(form,offer) {
  if(!matchesPicker60(offer))throw Error('Elige una oferta vigente');
  const selected=[...form.querySelectorAll('[data-catalogue-resource54]')].map(el=>el.value);
  if(!selected.length||selected.some(id=>!id))throw Error('Selecciona la partida de cada bolsa');
  const counts=new Map();
  for(const id of selected)counts.set(id,(counts.get(id)||0)+1);
  return {offerId:offer.id,packs:numInput(form.elements.packs.value,1),selections:[...counts].map(([resourceId,quantity])=>({resourceId,quantity}))};
 }
 function cartCommand63(draft,version) {
  return {type:'REGISTER_SALE',saleId:draft.saleId,catalogueVersion:version,catalogueCart:structuredClone(cartRows63(draft)),
   customer:prepareCustomer({customer:draft.customer,zone:draft.zone},actor.profile),channel:draft.channel};
 }
