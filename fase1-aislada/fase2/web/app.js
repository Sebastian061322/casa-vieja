'use strict';
const epoch='TEST_ONLY_V2';
const uuid=()=>crypto.randomUUID();
const rpc=(name,arg)=>new Promise((resolve,reject)=>{
 const timer=setTimeout(()=>reject(Error('CONNECTION_TIMEOUT')),name==='recovery'?120000:25000);
 const runner=google.script.run.withSuccessHandler(r=>{clearTimeout(timer);resolve(r);}).withFailureHandler(()=>{clearTimeout(timer);reject(Error('CONNECTION_FAILED'));});
 if(name==='report')runner.sandboxSaveReport(arg);else if(name==='recovery')runner.sandboxRecovery();else if(name==='snapshot')runner.sandboxSnapshot();else if(name==='status')runner.sandboxStatus(arg);else runner.sandboxExecute(arg);
});
const client=new CVClient.Client(new CVClient.IndexedStore('cv-sales-sandbox-v2-owner'),{execute:c=>rpc('execute',c),status:id=>rpc('status',id),snapshot:()=>rpc('snapshot')},epoch,uuid);
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'S/ '+(n/100).toFixed(2);
let snapshot=null,busy=false,lastCommand=null;
function notice(t){$('sync-notice').textContent=t;}
function toggleMobileNav(){document.querySelector('.sidebar').classList.toggle('mobile-open');}
function switchView(name){notice(name==='ventas'?'Ventas de pruebas. Usa únicamente datos ficticios.':'Este módulo queda fuera de la Fase 2.');}
function cents(id){const raw=$(id).value;if(!/^\d+(\.\d{1,2})?$/.test(raw))throw Error('Revisa los importes: máximo dos decimales.');const [whole,dec='']=raw.split('.');return Number(whole)*100+Number(dec.padEnd(2,'0'));}
function lines(){const combo=$('sf-combo-toggle').checked;const qty=Number($('sf-qty').value);if(!Number.isSafeInteger(qty)||qty<1)throw Error('Cantidad inválida');if(combo)return [{resourceId:'demo:molido',qty:Number($('combo-molido').value)},{resourceId:'demo:grano',qty:Number($('combo-grano').value)}].filter(l=>l.qty>0);return [{resourceId:$('sf-product').value,qty:qty*Number($('sf-pack').value)}];}
async function render(){
 const local=await client.view();snapshot=local.snapshot;
 $('pending-count').textContent=String(local.queue.length);
 $('queue').innerHTML=local.queue.map(q=>`<p>${esc(q.command.operationId)} · ${esc(q.state)} ${esc(q.lastError)} ${q.state==='REJECTED'?`<button class="btn small secondary" data-archive="${esc(q.command.operationId)}">Archivar rechazo sin borrar su registro</button>`:''}</p>`).join('')||'<p>Sin operaciones pendientes.</p>';
 $('queue').querySelectorAll('[data-archive]').forEach(b=>b.onclick=async()=>{try{await client.archiveRejected(b.dataset.archive);notice('Rechazo conservado en el archivo local. Puedes registrar una operación nueva.');await synchronize();}catch(e){notice(e.message);}});
 const sales=snapshot?Object.values(snapshot.sales):[];
 $('history').innerHTML=sales.map(s=>`<details class="card"><summary>${esc(s.metadata.customer||'Sin cliente')} · ${money(s.totalCents)} · ${esc(s.status)}</summary><p>${s.lines.map(l=>`${esc(l.grind)} × ${l.qty} (${esc(l.lot)})`).join(' + ')}</p><p>Costo: ${money(s.costCents)} · Ganancia: ${money(s.profitCents)}</p><button class="btn small" data-edit="${esc(s.id)}">Editar contacto</button> <button class="btn small danger" data-cancel="${esc(s.id)}" ${s.status!=='REGISTERED'?'disabled':''}>Cancelar venta</button></details>`).join('')||'<p class="hint">Sin ventas confirmadas en la descarga actual.</p>';
 const resources=snapshot?snapshot.resources:{};$('stock').textContent=Object.entries(resources).map(([k,r])=>`${k}: ${r.qty} bolsas`).join(' · ')||'Stock pendiente de descargar';
 $('history').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>edit(b.dataset.edit));
 $('history').querySelectorAll('[data-cancel]').forEach(b=>b.onclick=()=>cancel(b.dataset.cancel));
 $('connStatus').textContent=local.queue.length?`${local.queue.length} operación(es) pendiente(s)`:'Entorno de pruebas';
}
async function synchronize(){
 if(busy)return;busy=true;
 try{await client.flush();const refreshed=await client.refresh();await render();if(refreshed&&!(await client.view()).queue.length)notice('Conectado al entorno de pruebas.');}catch(e){notice(e.message);}finally{busy=false;}
}
async function send(payload){
 try{const queued=await client.enqueue(payload);lastCommand=queued.command;notice('Guardada en este dispositivo. Pendiente de confirmación del servidor.');await render();await synchronize();const local=await client.view();notice(local.receipts[queued.command.operationId]?'Venta u operación confirmada por el servidor.':'Operación pendiente o rechazada. Revisa la cola.');return queued.command;}catch(e){notice('No confirmada: '+e.message);throw e;}
}
async function register(){
 $('register').disabled=true;try{
 const saleLines=lines();if(!saleLines.length||saleLines.some(l=>!Number.isSafeInteger(l.qty)||l.qty<=0))throw Error('Revisa las cantidades del combo.');
 await send({type:'REGISTER_SALE',saleId:'future:'+uuid(),lines:saleLines,totalCents:cents('sf-price'),deliveryCostCents:cents('sf-delcost'),deliveryChargedCents:cents('sf-delcharged'),metadata:{customer:$('sf-customer').value,phone:$('sf-phone').value,zone:$('sf-zone').value,date:$('sf-date').value}});
 }catch(e){notice('No confirmada: '+e.message);}finally{$('register').disabled=false;}
}
async function edit(id){const s=snapshot.sales[id],customer=prompt('Nombre del cliente (solo datos ficticios)',s.metadata.customer||'');if(customer===null)return;await send({type:'EDIT_SALE',saleId:id,expectedSaleVersion:s.version,metadata:{customer}});}
async function cancel(id){const s=snapshot.sales[id],reason=prompt('Motivo de cancelación. Se registrará la compensación de stock.');if(!reason)return;await send({type:'CANCEL_SALE',saleId:id,expectedSaleVersion:s.version,reason});}
$('sf-combo-toggle').onchange=()=>{$('sf-combo-block').style.display=$('sf-combo-toggle').checked?'block':'none';};
$('register').onclick=register;$('retry').onclick=synchronize;
window.addEventListener('online',synchronize);window.addEventListener('focus',synchronize);
setInterval(synchronize,15000);
$('sf-date').value=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
render().then(synchronize).catch(e=>notice('No se pudo abrir el almacenamiento local: '+e.message));
