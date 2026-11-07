function operationTitle73(type){return {REGISTER_SALE:'Registrar pedido',REQUEST_COMMERCIAL_ADJUSTMENT:'Solicitar ajuste',REVIEW_COMMERCIAL_ADJUSTMENT:'Revisar ajuste',REGISTER_CUSTOMER:'Guardar cliente',RECORD_PAYMENT:'Registrar cobro',DISPATCH_SALE:'Despachar',DELIVER_SALE:'Confirmar entrega',RECORD_EXPENSE:'Registrar gasto',CORRECT_AD_EXPENSE:'Corregir publicidad'}[type]||type;}
function operationState73(state){return {PENDING:'Pendiente de confirmación',UNKNOWN:'Consultando confirmación',PREPARED:'Servidor procesando',REJECTED:'Rechazo confirmado',COMMITTED:'Confirmado por el servidor'}[state]||state;}
function errorMessage73(code){return {
 SHIPPING_POLICY_REQUIRED:'La zona no tiene una tarifa de envío aprobada. Conserva el borrador y consulta al gerente.',
 COMMERCIAL_APPROVAL_REQUIRED:'El ajuste necesita aprobación para este pedido y esta selección.',
 APPROVAL_ALREADY_EXISTS:'Ya existe una solicitud vigente para este pedido. Revisa su estado antes de continuar.',
 APPROVAL_NOT_PENDING:'La solicitud ya cambió o venció. Actualiza su estado antes de decidir.',
 CREDIT_POLICY_REQUIRED:'El pedido tiene saldo pendiente. Completa el cobro antes del despacho.',
 CUSTOMER_CONTACT_MISMATCH:'El contacto no coincide con el cliente vinculado. Revisa nombre y teléfono.',
 CUSTOMER_LINK_UNAVAILABLE:'Ese cliente o pedido anterior no está disponible para tu perfil.',
 AD_REVISION_CONFLICT:'Otro usuario corrigió este gasto. Actualiza y revisa el importe vigente.',
 AD_AMOUNT_CONFLICT:'El importe entra en conflicto con pagos registrados. Revisa el comprobante antes de corregir.',
 ACCOUNT_OR_PROFILE_CHANGED:'Tu cuenta o perfil cambió. Vuelve a ingresar con la cuenta correspondiente.',
 REAUTHENTICATION_REQUIRED:'Vuelve a ingresar con Google. Tus operaciones guardadas se conservan.',
 IDENTITY_REQUIRED:'La sesión necesita validación. Vuelve a ingresar con Google.',
 ACCESS_DENIED:'Tu cuenta no tiene acceso autorizado. Consulta al administrador.',
 PERMISSION_DENIED:'Tu perfil no tiene permiso para esta acción.',
 OPERATION_ALREADY_CONFIRMED:'El servidor ya confirmó esta operación. Revisa su pedido y recibo.',
 INCOMPATIBLE_QUEUE_REVIEW_REQUIRED:'Hay operaciones de otra versión por revisar. Conserva la cola y consulta al administrador.',
 CONTINUITY_REVIEW_REQUIRED:'Revisa las colas de los otros equipos antes de registrar una operación nueva.'
 }[code];}
function orderReceipt73(sale,local){
 if(!sale)return '';
 const receipt=Object.values(local.receipts||{}).find(r=>r.saleId===sale.id&&r.state==='COMMITTED');
 const id=sale.originOperationId||receipt?.operationId;
 const state={RESERVED:'Reserva confirmada',DISPATCHED:'Despacho confirmado',PART_RETURNED:'Devolución parcial confirmada',RETURNED:'Devolución confirmada',CANCELLED:'Cancelación confirmada'}[sale.status]||'Pedido confirmado';
 return '<details class="card"><summary>Confirmación del pedido</summary><p>Pedido '+esc(sale.id)+'</p>'+
  (id?'<p>Operación '+esc(id)+'</p>':'<p>Pedido consultado al servidor. El recibo local se conserva en el equipo que lo registró.</p>')+
  (sale.commercial?.createdAt?'<p>Fecha de registro '+esc(sale.commercial.createdAt)+'</p>':'')+
  '<p>Total de productos '+money(sale.totalCents)+' · Delivery '+money(sale.deliveryChargedCents||0)+
  ' · Total '+money(sale.totalCents+(sale.deliveryChargedCents||0))+'</p><p>'+esc(state)+'. Cobros y despachos conservan sus propios registros.</p></details>';
}
function adsFilterFields73(events){
 return [['account','Cuenta publicitaria'],['adSet','Conjunto'],['ad','Anuncio']].map(([key,title])=>{
  const values=[...new Set(events.filter(e=>e.kind==='OPERATING_EXPENSE'&&e.category==='PUBLICIDAD').map(e=>e.adDetails65?.[key]).filter(Boolean))].sort();
  return select(key,title,option('','Todos')+values.map(value=>option(value,value)).join(''));
 }).join('');
}
