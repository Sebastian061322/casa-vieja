 const draftApproval63 = draft => (snapshot.adjustmentApprovals63||[]).find(r=>r.saleId===draft?.saleId&&r.state!=='REJECTED');
 function approvalPanel63(draft) {
  if(actor.profile!=='seller')return '';
  const r=draftApproval63(draft);
  if(r)return '<p role="status">Ajuste '+(r.state==='APPROVED'?'aprobado. Registra el pedido con la misma selección.':'pendiente de aprobación.')+'</p>';
  return '<button type="button" class="btn secondary" data-approval-request63>Solicitar aprobación de ajuste</button>';
 }
 function renderApprovalReview63() {
  if(actor.profile==='seller')return;
  const rows=(snapshot.adjustmentApprovals63||[]).filter(r=>r.state==='PENDING');
  $('approvals63').innerHTML='<section class="card"><h3>Ajustes pendientes de aprobación</h3>'+
   (rows.map(r=>'<article><h4>'+esc(r.saleId)+'</h4><p>Productos '+money(r.catalogueProductCents)+
    ' → '+money(r.adjustment.productTotalCents??r.catalogueProductCents)+' · Delivery '+money(r.referenceDeliveryCents)+
    ' → '+money(r.adjustment.deliveryChargedCents??r.referenceDeliveryCents)+'</p><p>'+esc(r.adjustment.reason)+'</p>'+
    '<button type="button" class="btn" data-approval-id63="'+esc(r.id)+'" data-approval-decision63="APPROVED">Aprobar importes</button> '+
    '<button type="button" class="btn secondary" data-approval-id63="'+esc(r.id)+'" data-approval-decision63="REJECTED">Rechazar</button></article>').join('')||
    '<p>Sin solicitudes pendientes.</p>')+'</section>';
 }
