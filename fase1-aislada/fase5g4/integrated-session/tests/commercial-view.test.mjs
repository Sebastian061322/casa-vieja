import test from 'node:test';
import assert from 'node:assert/strict';
import {customerChoices73,advertisingSummary73} from '../commercial-view.mjs';

test('recompra agrupa solo vínculo explícito y busca teléfonos normalizados',()=>{
 const sale=(id,link,phone,date)=>({id,status:'RESERVED',commercial:{customerId64:link,createdAt:date},metadata:{customer:'María',phone,date}});
 const sales={a:sale('a','customer:a','+51 999 000 001','2026-11-01'),b:sale('b','customer:a','+51 999 000 001','2026-11-02'),c:sale('c',null,'999000001','2026-11-03')};
 assert.deepEqual(customerChoices73(sales,[]).map(c=>c.value),['c','b']);
 assert.equal(customerChoices73(sales,[],'MARIA').length,2);
 assert.equal(customerChoices73(sales,[],'999-000-001').length,2);
 assert.equal(customerChoices73(sales,[],'+51 999 000 001').length,2);
 assert.equal(customerChoices73(sales,[],'otro').length,0);
 assert.equal(customerChoices73(sales,[{id:'customer:a',name:'María',phone:'999000001'}]).length,2);
});

test('Ads filtra dimensiones del gasto vigente y excluye correcciones y pagos',()=>{
 const expense={kind:'OPERATING_EXPENSE',category:'PUBLICIDAD',date:'2026-11-07',amountCents:1500,messages:6,adDetails65:{account:'A',campaign:'Campaña',adSet:'Grupo',ad:'Anuncio'}};
 const events=[expense,{...expense,adDetails65:{...expense.adDetails65,ad:'Otro'}},{...expense,kind:'AD_EXPENSE_CORRECTED'},{...expense,kind:'EXPENSE_PAYMENT'}];
 const result=advertisingSummary73(events,{from:'2026-11-07',to:'2026-11-07',account:'A',campaign:'Campaña',adSet:'Grupo',ad:'Anuncio'});
 assert.deepEqual(result,{rows:[expense],investment:1500,messages:6,costPerMessage:250});
 assert.equal(advertisingSummary73([{...expense,messages:undefined}]).costPerMessage,null);
 assert.equal(advertisingSummary73(events,{account:'B'}).investment,0);
});

test('el recibo visual usa solo IDs confirmados y escapa datos antes de mostrarlos',async()=>{
 const fs=await import('node:fs'),vm=await import('node:vm');
 const context=vm.createContext({esc:s=>String(s).replaceAll('<','&lt;').replaceAll('>','&gt;'),money:n=>(n/100).toFixed(2)});
 vm.runInContext(fs.readFileSync(new URL('../usability-browser.js',import.meta.url),'utf8'),context);
 const sale={id:'future:<test>',totalCents:9500,deliveryChargedCents:0,commercial:{createdAt:'2026-11-07'}};
 const local={receipts:{pending:{saleId:sale.id,state:'PENDING',operationId:'unconfirmed'},done:{saleId:sale.id,state:'COMMITTED',operationId:'confirmed'}}};
 const before=JSON.stringify({sale,local});
 const text=context.orderReceipt73(sale,local);
 assert.ok(text.includes('confirmed'));assert.ok(!text.includes('unconfirmed'));
 assert.ok(text.includes('future:&lt;test&gt;'));assert.ok(!text.includes('future:<test>'));
 assert.ok(text.includes('95.00'));assert.equal(JSON.stringify({sale,local}),before);
 assert.equal(context.operationState73('REJECTED'),'Rechazo confirmado');
 assert.ok(context.errorMessage73('CREDIT_POLICY_REQUIRED').includes('saldo pendiente'));
});

test('la búsqueda conserva al cliente seleccionado aunque quede fuera de los primeros cien',async()=>{
 const fs=await import('node:fs'),vm=await import('node:vm');
 const registry=Array.from({length:105},(_,i)=>({id:'customer:'+i,name:'Persona '+i,phone:'999000'+String(i).padStart(3,'0')}));
 const context=vm.createContext({snapshot:{sales:{},customerRegistry65:registry},customerChoices73,document:{addEventListener(){}},option:(v,t)=>'<option value="'+v+'">'+t+'</option>'});
 vm.runInContext(fs.readFileSync(new URL('../customer-browser.js',import.meta.url),'utf8'),context);
 const html=context.customerOptions73({previousOrder:'customer:104'},'');
 assert.ok(html.includes('value="customer:104"'));
 assert.equal((html.match(/value="customer:104"/g)||[]).length,1);
 assert.equal((html.match(/<option/g)||[]).length,101);
});

test('la confirmación respeta cancelaciones y despachos y no promete una reserva activa',async()=>{
 const fs=await import('node:fs'),vm=await import('node:vm');
 const context=vm.createContext({esc:String,money:String});
 vm.runInContext(fs.readFileSync(new URL('../usability-browser.js',import.meta.url),'utf8'),context);
 for(const [status,label] of Object.entries({RESERVED:'Reserva confirmada',DISPATCHED:'Despacho confirmado',CANCELLED:'Cancelación confirmada',PART_RETURNED:'Devolución parcial confirmada'})){
  const html=context.orderReceipt73({id:'test',status,totalCents:2200},{receipts:{}});
  assert.ok(html.includes(label));
  if(status!=='RESERVED')assert.ok(!html.includes('Reserva confirmada'));
 }
});

test('ambas interfaces compiladas muestran recibo separado de la selección y avisan del nuevo borrador',async()=>{
 const fs=await import('node:fs');
 const source=fs.readFileSync(new URL('../build/worker-bundle.mjs',import.meta.url),'utf8');
 const marker='\nconst assets=',start=source.indexOf(marker)+marker.length;
 const assets=JSON.parse(source.slice(start,source.indexOf(';\nexport default',start)));
 for(const key of ['/entry.mjs','/approved-app.js']){
  assert.ok(assets[key].includes('Ver selección del pedido confirmado'));
  assert.ok(assets[key].includes('Nuevo borrador local. Aún no se ha enviado ningún pedido.'));
  assert.ok(assets[key].includes('orderReceipt73(sale,local)'));
  assert.ok(assets[key].includes('found.unshift(selected)'));
  assert.ok(assets[key].includes('escape(operationTitle73(item.command.type))'));
  assert.ok(assets[key].includes('escape(operationState73(item.state))'));
 }
});
