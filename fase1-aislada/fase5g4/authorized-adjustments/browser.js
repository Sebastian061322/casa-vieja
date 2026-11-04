 function adjustmentFields62(draft,offer) {
  if (!['administrator','operations'].includes(actor.profile)) return '';
  const saved=draft.adjustment62;
  const previous=saved?.offerId===offer.id && saved?.packs===draft.packs ? saved : {};
  const attributes='min="0" step="0.01" inputmode="decimal"';
  return '<fieldset><legend>Precio y delivery</legend>'+
   label('product62','Precio final de productos (S/)','number',previous.product||'',attributes)+
   label('delivery62','Delivery cobrado (S/)','number',previous.delivery||'',attributes)+
   label('reason62','Motivo del ajuste','text',previous.reason||'','maxlength="500"')+
   '<p>Deja los importes vacíos para usar el catálogo y la tarifa de la zona. Escribe 0 para delivery gratuito.</p><p id="adjustment-total62" role="status"></p></fieldset>';
 }
 function readAdjustment62(form) {
  const price=form.elements.product62?.value, delivery=form.elements.delivery62?.value;
  if (!price && !delivery) return null;
  const reason=form.elements.reason62.value.trim();
  if (!reason) throw Error('Escribe el motivo del ajuste');
  return {...(price?{productTotalCents:cents(price)}:{}),
   ...(delivery?{deliveryChargedCents:cents(delivery)}:{}),reason};
 }
 function renderAdjustment62(form,offer) {
  const result=$('adjustment-total62');
  if(!result || !offer) return;
  const reference=offer.priceCents*Number(form.elements.packs.value);
  const price=form.elements.product62.value, delivery=form.elements.delivery62.value;
  try {
   const applied=price?cents(price):reference;
   const difference=reference-applied;
   result.textContent='Precio de catálogo '+money(reference)+' · Productos '+money(applied)+
    (difference>0?' · Descuento '+money(difference):difference<0?' · Recargo '+money(-difference):'')+
    (delivery?' · Delivery '+money(cents(delivery))+' · Total '+money(applied+cents(delivery)):
     ' · El servidor confirma la tarifa y el total según la zona.');
  } catch {result.textContent='Revisa los importes ingresados.';}
 }
 document.addEventListener('input',event=>{
  if(!['product62','delivery62','reason62'].includes(event.target.name))return;
  const form=event.target.closest('#catalogue54-form'), draft=catalogueDraft54;
  if(!form||!draft)return;
  const offer=snapshot.catalogue54.offers.find(item=>item.id===form.elements.offer.value);
  draft.adjustment62={offerId:offer?.id,packs:Number(form.elements.packs.value),product:form.elements.product62.value,
   delivery:form.elements.delivery62.value,reason:form.elements.reason62.value};
  void store.transact(s=>s.catalogueDraft54=structuredClone(draft)).catch(error=>notice(explain(error)));
  renderAdjustment62(form,offer);
 });
