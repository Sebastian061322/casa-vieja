'use strict';
const el=id=>document.getElementById(id),money=n=>(n/100).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2});
const clear=()=>{el('output').hidden=true;el('status').textContent='Sin validación vigente. Modificar el texto invalida la revisión anterior.';};
el('input').addEventListener('input',clear);
el('sample').onclick=async()=>{try{el('input').value=JSON.stringify(await(await fetch('/sample.json')).json(),null,2);clear();}catch{el('status').textContent='No se pudo cargar el ejemplo local.';}};
el('review').onclick=async()=>{clear();el('review').disabled=true;try{
 const input=el('input').value;const response=await fetch('/review',{method:'POST',headers:{'content-type':'application/json'},body:input});const r=await response.json();if(!response.ok)throw Error(r.error);
 // Una respuesta tardía no valida un borrador que cambió durante la consulta.
 if(input!==el('input').value){el('status').textContent='El borrador cambió. Vuelve a validar.';return;}
 el('approval').textContent=`Acta ${r.actId} · Fecha efectiva ${r.effectiveAt} · Revisor: ${r.responsible} · Segundo: ${r.secondReviewer}. Identidades de prueba, sin firma verificada.`;
 el('hash').textContent='Hash del paquete: '+r.bundleHash;
 el('totals').textContent=`Café: ${r.totals.coffeeGrams} g · Valor histórico: S/${money(r.totals.valueCents)}. Sin recepción asumida de 300 kg.`;
 el('rows').replaceChildren();for(const row of r.rows){const tr=document.createElement('tr');for(const value of [`${row.product} / ${row.lot}`,row.availability,`${row.physical} ${row.unit}`,`${row.reserved} ${row.unit}`,`${row.available} ${row.unit}`,row.coffeeGrams,money(row.historicalValueCents)]){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}el('rows').append(tr);}
 el('obligations').replaceChildren();for(const o of r.obligations){const li=document.createElement('li');li.textContent=`${o.legacyRef} · ${o.state} · Saldo S/${money(o.outstandingCents)} · Responsable ${o.responsible}. No recrea venta histórica.`;el('obligations').append(li);}
 el('output').hidden=false;el('status').textContent='Paquete válido para revisión sintética. No aprobado, no confirmado y sin cambios de inventario.';
 }catch(e){el('status').textContent='Revisión bloqueada: '+e.message;}finally{el('review').disabled=false;}};
