import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {sandbox} from './harness.mjs';
import {authorize} from '../../tests/opening-helpers.mjs';
import {act} from '../../../fase5g2/tests/fixture.mjs';
const require=createRequire(import.meta.url),{hash}=require('../../../fase5g2/opening.cjs');
const catalogue=JSON.parse(fs.readFileSync(new URL('../../../fase5g3/catalogue-source.json',import.meta.url)));
const row=(offerId,resourceId,quantity,packs=1)=>({offerId,packs,selections:[{resourceId,quantity}]});
function fixture(){
 const opening=act();
 opening.rows.push({...structuredClone(opening.rows[1]),resourceId:'demo:monte',lot:'demo:monte-lot',product:'TEST_ONLY Monte Alto 250 g',availability:'AVAILABLE',grams:250,physical:3,reserved:0,pendingOrders:[],historicalValueCents:6000});
 const s=sandbox({fixtureOptions:{act:opening}}),props=s.f.f.properties;
 props.CV_5G4_OPENING_PROPOSAL=JSON.stringify(s.local.bundle);
 props.CV_5G3_CATALOGUE_CONFIG=JSON.stringify({environment:'TEST_ONLY',enabled:true,approvalKind:'SYNTHETIC_TEST_APPROVAL',catalogueHash:hash(catalogue),validFrom:'2026-10-28',validUntil:'2026-11-30',
  resourceLines:{'demo:opening-bags':{line:'Gourmet',lot:'demo:old-lot',grams:500,grind:'molido'},'demo:monte':{line:'Monte Alto',lot:'demo:monte-lot',grams:250,grind:'grano'}}});
 const a=authorize(s);
 assert.equal(s.call('execute',s.scope(s.local.command('OPEN_CONTINUITY',{bundle:s.local.bundle,approvalOperationId:a.operationId}))).state,'COMMITTED');
 const command=(catalogueCart,extras={})=>s.scope(s.local.command('REGISTER_SALE',{saleId:'future:'+crypto.randomUUID(),catalogueVersion:catalogue.version,catalogueCart,customer:{name:'TEST_ONLY',zone:'Zona ficticia'},...extras}));
 return {s,command};
}
test('tripack Gourmet y unitario Monte Alto se reservan en un pedido y un solo recibo',()=>{
 const {s,command}=fixture(),c=command([row('gourmet-tripack','demo:opening-bags',3),row('monte-alto-250','demo:monte',1)]);
 const result=s.call('execute',c,'333333');assert.equal(result.state,'COMMITTED',JSON.stringify(result));
 const plan=s.scopedLedger().journal.find(r=>r.kind==='PREPARED'&&r.id===c.operationId).plan;
 assert.equal(plan.catalogueRef.totalCents,13600);assert.equal(plan.sale.totalCents,13600);
 assert.equal(plan.catalogueRef.offers.length,2);
 assert.deepEqual(plan.sale.lines.map(l=>l.qty).sort(),[1,3]);
 const before=JSON.stringify(s.scopedLedger());assert.equal(s.call('execute',c,'333333').operationId,result.operationId);assert.equal(JSON.stringify(s.scopedLedger()),before);
});
test('demanda acumulada sobre un lote impide reservar cualquier línea',()=>{
 const {s,command}=fixture(),c=command([row('monte-alto-250','demo:monte',1),row('gourmet-tripack','demo:opening-bags',3),row('gourmet-500','demo:opening-bags',1)]);
 const effects=s.scopedLedger().effects.length;
 assert.equal(s.call('execute',c,'333333').error,'INSUFFICIENT_STOCK');
 assert.equal(s.scopedLedger().effects.length,effects);
 assert.ok(!s.scopedLedger().journal.some(r=>r.id===c.operationId&&r.kind==='COMMITTED'));
});
test('carrito rechaza precio enviado por el navegador y una combinación ambigua',()=>{
 const {s,command}=fixture(),rows=[row('gourmet-500','demo:opening-bags',1)];
 assert.equal(s.call('execute',command([{...rows[0],priceCents:1}]),'333333').error,'CATALOGUE_CART_INVALID');
 assert.equal(s.call('execute',command(rows,{catalogueOfferId:'gourmet-500'}),'333333').error,'CATALOGUE_CART_INVALID');
});

test('aprobación se vincula a vendedor, pedido y selección exactos',()=>{
 const {s,command}=fixture();
 const sale=command([row('gourmet-tripack','demo:opening-bags',3),row('monte-alto-250','demo:monte',1)]);
 const proposal=Object.fromEntries(['saleId','catalogueVersion','catalogueCart','customer'].map(k=>[k,sale[k]]));
 const request=s.scope(s.local.command('REQUEST_COMMERCIAL_ADJUSTMENT',{saleId:sale.saleId,proposal,commercialAdjustment:{productTotalCents:13000,deliveryChargedCents:0,reason:'TEST_ONLY'}}));
 const review=subject=>s.scope(s.local.command('REVIEW_COMMERCIAL_ADJUSTMENT',{saleId:sale.saleId,requestId:request.operationId,decision:'APPROVED',subject}));
 const effects=s.scopedLedger().effects.length;
 assert.equal(s.call('execute',request,'333333').state,'COMMITTED');
 const sellerReview=review(undefined);delete sellerReview.subject;
 assert.equal(s.call('execute',sellerReview,'333333').error,'PERMISSION_DENIED');
 const managerReview=review(undefined);delete managerReview.subject;
 assert.equal(s.call('execute',managerReview,'222222').state,'COMMITTED');
 assert.equal(s.scopedLedger().effects.length,effects);
 const wrong={...sale,operationId:sale.operationId+'_changed',customer:{name:'TEST_ONLY cambiado',zone:'Zona ficticia'},commercialApprovalId:request.operationId};
 assert.equal(s.call('execute',wrong,'333333').error,'COMMERCIAL_APPROVAL_REQUIRED');
 assert.equal(s.scopedLedger().effects.length,effects);
 const approved={...sale,commercialApprovalId:request.operationId};
 const result=s.call('execute',approved,'333333');
 assert.equal(result.state,'COMMITTED',JSON.stringify(result));
 const plan=s.scopedLedger().journal.find(r=>r.kind==='PREPARED'&&r.id===sale.operationId).plan;
 assert.equal(plan.sale.totalCents,13000);assert.equal(plan.sale.deliveryChargedCents,0);
 assert.equal(plan.audit.commercialAdjustment.approvedBy,'google:222222');
 assert.equal(plan.audit.commercialAdjustment.subject,'google:333333');
 const ledger=JSON.stringify(s.scopedLedger());assert.equal(s.call('execute',approved,'333333').operationId,result.operationId);
 assert.equal(JSON.stringify(s.scopedLedger()),ledger);
 const view=s.call('snapshot',{format:'ui5d',continuityScope:'TEST_ONLY_CONTINUITY_5G3'},'333333');
 assert.equal(view.adjustmentApprovals63[0].state,'APPROVED');
 assert.equal(view.sales[sale.saleId].costCents,undefined);
});

test('clientes homónimos conservan IDs distintos y la recompra exige un pedido accesible y contacto exacto',()=>{
 const {s,command}=fixture(),rows=[row('monte-alto-250','demo:monte',1)];
 const customer={name:'TEST_ONLY Cliente',phone:'999000001',zone:'Zona ficticia',address:'Dirección ficticia'};
 const order=(extras={})=>command(rows,{customer:{...customer,...extras}});
 const first=order(),second=order();
 assert.equal(s.call('execute',first,'333333').state,'COMMITTED');
 assert.equal(s.call('execute',second,'111111').state,'COMMITTED');
 const snapshot=()=>s.call('snapshot',{format:'ui5d',continuityScope:'TEST_ONLY_CONTINUITY_5G3'});
 assert.notEqual(snapshot().sales[first.saleId].commercial.customerId64,snapshot().sales[second.saleId].commercial.customerId64);
 assert.equal(s.call('execute',order({previousOrder:second.saleId}),'333333').error,'CUSTOMER_LINK_UNAVAILABLE');
 assert.equal(s.call('execute',order({previousOrder:first.saleId,phone:'999000002'}),'333333').error,'CUSTOMER_CONTACT_MISMATCH');
 const repeat=order({previousOrder:first.saleId});
 assert.equal(s.call('execute',repeat,'333333').state,'COMMITTED');
 const view=snapshot();
 assert.equal(view.sales[repeat.saleId].commercial.customerId64,first.saleId);
 assert.equal(view.sales[repeat.saleId].metadata.address64,customer.address);
 assert.deepEqual(view.reports.customers.find(c=>c.id===first.saleId).orders.sort(),[first.saleId,repeat.saleId].sort());
});

test('alta separada de cliente y recompra con permisos sin movimientos previos',()=>{
 const {s,command}=fixture();
 const create=(type,fields)=>s.scope(s.local.command(type,{saleId:'future:'+crypto.randomUUID(),...fields}));
 const customer={name:'TEST_ONLY Alta',phone:'+51 999000003',address:'Dirección ficticia',zone:'Zona ficticia'};
 const initial=s.scopedLedger().effects.length;
 assert.equal(s.call('execute',create('REGISTER_CUSTOMER',{customer}),'333333').error,'PERMISSION_DENIED');
 const registration=create('REGISTER_CUSTOMER',{customer});
 assert.equal(s.call('execute',registration,'222222').state,'COMMITTED');
 assert.equal(s.scopedLedger().effects.length,initial);
 const snapshot=(subject)=>s.call('snapshot',{format:'ui5d',continuityScope:'TEST_ONLY_CONTINUITY_5G3'},subject);
 const id=snapshot('222222').customerRegistry65[0].id;
 assert.equal(snapshot('333333').customerRegistry65,undefined);
 const c=command([row('monte-alto-250','demo:monte',1)],{customer:{...customer,registryId:id}});
 assert.equal(s.call('execute',c,'222222').state,'COMMITTED');
 assert.deepEqual(snapshot('222222').reports.customers.find(c=>c.id===id).orders,[c.saleId]);
});

test('Ads conserva comprobante único, revisiones auditadas y un solo gasto en reportes',()=>{
 const {s}=fixture();
 const create=(type,fields)=>s.scope(s.local.command(type,{saleId:'future:'+crypto.randomUUID(),...fields}));
 const adDetails={date:'2026-11-01',account:'TEST_ONLY cuenta',campaign:'TEST_ONLY campaña',adSet:'Conjunto',ad:'Anuncio',messages:5,observations:''};
 const expense={category:'PUBLICIDAD',amountCents:1200,description:'Ads ficticio',documentRef:'TEST_ONLY_AD_65',adDetails};
 const source=create('RECORD_EXPENSE',expense);
 assert.equal(s.call('execute',source,'222222').state,'COMMITTED');
 assert.equal(s.call('execute',create('RECORD_EXPENSE',expense),'222222').error,'DUPLICATE_DOCUMENT');
 const change={sourceOperationId:source.operationId,expectedAdRevision:0,reason:'TEST_ONLY comprobante revisado',amountCents:1500,adDetails:{...adDetails,messages:6}};
 assert.equal(s.call('execute',create('CORRECT_AD_EXPENSE',change),'333333').error,'PERMISSION_DENIED');
 const correction=create('CORRECT_AD_EXPENSE',change);
 assert.equal(s.call('execute',correction,'222222').state,'COMMITTED');
 assert.equal(s.call('execute',create('CORRECT_AD_EXPENSE',change),'222222').error,'AD_REVISION_CONFLICT');
 const view=s.call('snapshot',{format:'ui5d',continuityScope:'TEST_ONLY_CONTINUITY_5G3'},'222222');
 assert.equal(view.reports.operatingExpenseCents,1500);
 assert.equal(view.commerce.events.filter(e=>e.kind==='OPERATING_EXPENSE').length,1);
 assert.equal(view.commerce.events.find(e=>e.kind==='OPERATING_EXPENSE').messages,6);
 assert.equal(view.commerce.events.find(e=>e.kind==='AD_EXPENSE_CORRECTED').previous.amountCents,1200);
 assert.equal(s.scopedLedger().journal.find(r=>r.id===source.operationId&&r.kind==='PREPARED').plan.commerceEvents[0].amountCents,1200);
});

test('reportes separan cobros, despacho, descuento y costo histórico del lote',()=>{
 const {s,command}=fixture();
 const sale=command([row('monte-alto-250','demo:monte',1)],{commercialAdjustment:{productTotalCents:3500,deliveryChargedCents:0,reason:'TEST_ONLY'}});
 const call=c=>s.call('execute',c,'222222');
 const read=()=>s.call('snapshot',{format:'ui5d',continuityScope:'TEST_ONLY_CONTINUITY_5G3'},'222222');
 const next=(type,fields={})=>s.scope(s.local.command(type,{saleId:sale.saleId,expectedSaleVersion:read().sales[sale.saleId].version,...fields}));
 assert.equal(call(sale).state,'COMMITTED');
 const pay=(amountCents,documentRef)=>call(next('RECORD_PAYMENT',{amountCents,documentRef}));
 assert.equal(pay(1200,'TEST_ONLY_PAGO_1').state,'COMMITTED');
 assert.equal(read().sales[sale.saleId].financial.outstandingCents,2300);
 assert.equal(read().reports.revenueCents,0);
 assert.equal(call(next('DISPATCH_SALE')).error,'CREDIT_POLICY_REQUIRED');
 assert.equal(pay(2300,'TEST_ONLY_PAGO_2').state,'COMMITTED');
 assert.equal(call(next('DISPATCH_SALE')).state,'COMMITTED');
 const view=read();
 assert.equal(view.reports.collectionsCents,3500);
 assert.equal(view.reports.revenueCents,3500);
 assert.equal(view.reports.cogsCents,2000);
 assert.equal(view.reports.grossMarginCents,1500);
 assert.equal(view.sales[sale.saleId].lines[0].lot,'demo:monte-lot');
 assert.equal(view.sales[sale.saleId].lines[0].totalCostCents,2000);
});

test('el candidato verifica y cifra un respaldo que incluye el alta independiente',async()=>{
 const {s}=fixture();
 const manifest=JSON.parse(fs.readFileSync(new URL('../build/manifest.json',import.meta.url)));
 s.f.f.properties.CV_5G4_BACKEND_SHA256=manifest.backendSha256;
 s.f.f.properties.CV_5G4_WORKER_SHA256=manifest.workerSha256;
 const customer={name:'TEST_ONLY Respaldo',phone:'999000006',address:'Dirección ficticia',zone:'Zona ficticia'};
 const registration=s.scope(s.local.command('REGISTER_CUSTOMER',{saleId:'future:'+crypto.randomUUID(),customer}));
 assert.equal(s.call('execute',registration).state,'COMMITTED');
 const before=JSON.stringify(s.scopedLedger());
 const payload={format:'ui5d',continuityScope:'TEST_ONLY_CONTINUITY_5G3',backup54:true};
 assert.equal(s.call('snapshot',payload,'222222').error,'PERMISSION_DENIED');
 const archive=s.call('snapshot',payload).backupArchive54;
 const {encryptArchive54,decryptFile54}=await import('../../backup54.mjs');
 const sealed=await encryptArchive54(archive);
 const restored=await decryptFile54(sealed.fileText,sealed.keyBase64,sealed.encryptedFileHash);
 assert.equal(restored.verified.archiveHash,archive.sha256);
 const target={environment:'TEST_ONLY',journal:[],effects:[]};
 const backup=require('../../../fase5g2/backup.cjs');
 backup.restore(archive,target,{writer:'NONE',expectedHash:archive.sha256});
 assert.ok(target.journal.some(r=>r.plan?.customerRegistration65?.name===customer.name));
 assert.equal(JSON.stringify(s.scopedLedger()),before);
});

test('el módulo servido cifra y descifra un respaldo superior al límite de argumentos',async()=>{
 const worker=fs.readFileSync(new URL('../build/worker-bundle.mjs',import.meta.url),'utf8');
 const begin='\nconst assets=';
 const assets=JSON.parse(worker.slice(worker.indexOf(begin)+begin.length,worker.indexOf(';\nexport default')));
 const embedded=assets['/entry.mjs'].match(/const CV54Phone=\(\(\)=>\{[\s\S]*?return \{encryptArchive54\};\}\)\(\);/);
 assert.ok(embedded);
 const module=source=>import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const {CV54Phone}=await module(embedded[0]+' export {CV54Phone};');
 const {decryptFile54}=await module(assets['/backup54.mjs']);
 const payload='Café · respaldo '.repeat(30000);
 const backup=require('../../../fase5g2/backup.cjs');
 const archive=backup.pack({environment:'TEST_ONLY',syntheticOnly:true,journal:[],effects:[],configuration:{payload},openingBundle:{},codeHashes:{backend:'a'.repeat(64)},operationMetadata:{}});
 const encrypted=await CV54Phone.encryptArchive54(archive);
 assert.ok(encrypted.fileText.length>500000);
 const recovered=await decryptFile54(encrypted.fileText,encrypted.keyBase64,encrypted.encryptedFileHash);
 assert.equal(recovered.archive.sections.configuration.value.payload,payload);
 await assert.rejects(()=>decryptFile54(encrypted.fileText+' ',encrypted.keyBase64,encrypted.encryptedFileHash),/INDEPENDENT_FILE_HASH_REQUIRED/);
});

test('la reapertura usa un bootstrap y conserva capacidades del servidor',async()=>{
 const worker=fs.readFileSync(new URL('../build/worker-bundle.mjs',import.meta.url),'utf8');
 const marker='\nconst assets=';
 const assets=JSON.parse(worker.slice(worker.indexOf(marker)+marker.length,worker.indexOf(';\nexport default')));
 const load=source=>import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const {createSession}=await load(assets['/session.mjs']);
 const {createLoginFlow}=await load(assets['/login-flow.mjs']);
 const calls=[],capabilities=['TEST_ONLY'];
 const session=createSession({send:async(_,action)=>{
  calls.push(action);
  return {subject:'google:111111',profile:'administrator',environment:'TEST_ONLY',destination:'TEST_ONLY_ZERO_1',capabilities};
 }});
 const flow=createLoginFlow({session,prepare:async actor=>assert.deepEqual(actor.capabilities,capabilities),show(){},onError:assert.fail});
 assert.equal(await flow.run('CV_COOKIE_SESSION'),true);
 assert.deepEqual(calls,['bootstrap']);
 assert.ok(!assets['/entry.mjs'].includes("const boot=await session.invoke('bootstrap',null);if(!current())return false;"));
});

test('la lectura directa comprueba el perfil actual antes de publicar una proyección',async()=>{
 const worker=fs.readFileSync(new URL('../build/worker-bundle.mjs',import.meta.url),'utf8'),marker='\nconst assets=';
 const assets=JSON.parse(worker.slice(worker.indexOf(marker)+marker.length,worker.indexOf(';\nexport default')));
 const {createSession}=await import('data:text/javascript;base64,'+Buffer.from(assets['/session.mjs']).toString('base64'));
 let changed=false;const calls=[];
 const session=createSession({send:async(_,action)=>{
  calls.push(action);
  if(action==='bootstrap')return {subject:'google:111111',profile:'administrator',environment:'TEST_ONLY',destination:'TEST_ONLY_ZERO_1'};
  return {resources:{},__cvActor72:{subject:'google:111111',profile:changed?'seller':'administrator'}};
 }});
 await session.login('CV_COOKIE_SESSION');calls.length=0;
 assert.deepEqual(await session.invoke('snapshot',{}),{resources:{}});
 assert.deepEqual(calls,['snapshot']);
 changed=true;
 await assert.rejects(()=>session.invoke('snapshot',{}),/ACCOUNT_OR_PROFILE_CHANGED/);
 assert.equal(session.current(),null);
 assert.ok(assets['/entry.mjs'].includes("if(['snapshot','reports','dashboard'].includes(action))"));
});
