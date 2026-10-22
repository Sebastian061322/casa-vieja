// Canonicalización de entradas nuevas, antes de asignar operationId. Nunca altera una cola guardada.
export function prepareCustomer(fields,profile){
 const zone=String(fields.zone??'').trim();if(profile==='seller'&&!zone)throw Error('SHIPPING_ZONE_REQUIRED');
 return {name:fields.customer,phone:fields.phone,zone,note:fields.note};
}
