import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {execFileSync} from 'node:child_process';
test('formulario real generado: gerente sin campo de descuento obtiene total y margen correctos',()=>{
 execFileSync(process.execPath,['fase1-aislada/fase5d/build-web.cjs']);const source=fs.readFileSync(new URL('../web/approved-app.js',import.meta.url),'utf8');
 const a=source.indexOf('function preview(){'),b=source.indexOf('\nfunction orderTable()',a),ca=source.indexOf('function cents('),cb=source.indexOf('\n',ca);
 let fields={deliveryCharged:'0',deliveryCost:'0'};const nodes={'sale-form':{},'sale-preview':{}};
 const c=vm.createContext({snapshot:{commerce:{offers:{offer:{priceCents:3500,bags:1}}},resources:{bag:{valueCents:1000,reservedValueCents:0,qty:5}}},items:()=>[{offerId:'offer',resourceId:'bag',quantity:1}],$:id=>nodes[id],formdata:()=>fields,numInput:(n,min=0)=>{if(!Number.isSafeInteger(n)||n<min)throw Error('INVALID');return n},money:x=>x,cards:x=>JSON.stringify(x)});
 vm.runInContext(source.slice(ca,cb)+'\n'+source.slice(a,b),c);c.preview();assert.deepEqual(JSON.parse(nodes['sale-preview'].innerHTML),[['Productos',3500],['Total con envío',3500],['Costo estimado',200],['Margen estimado',3300]]);
 fields={...fields,discount:'1.234'};c.preview();assert.match(nodes['sale-preview'].textContent,/máximo dos decimales/);
});
