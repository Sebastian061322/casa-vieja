import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {sandbox} from './harness.mjs';
import {authorize} from '../../tests/opening-helpers.mjs';
const require=createRequire(import.meta.url),{hash}=require('../../../fase5g2/opening.cjs');
const catalogue=JSON.parse(fs.readFileSync(new URL('../../../fase5g3/catalogue-source.json',import.meta.url)));
function fixture(){
 const s=sandbox(), props=s.f.f.properties;
 props.CV_5G4_OPENING_PROPOSAL=JSON.stringify(s.local.bundle);
 props.CV_5G3_CATALOGUE_CONFIG=JSON.stringify({environment:'TEST_ONLY',enabled:true,approvalKind:'SYNTHETIC_TEST_APPROVAL',catalogueHash:hash(catalogue),validFrom:'2026-10-28',validUntil:'2026-11-30',resourceLines:{'demo:opening-bags':{line:'Gourmet',lot:'demo:old-lot',grams:500,grind:'molido'}}});
 const a=authorize(s);
 assert.equal(s.call('execute',s.scope(s.local.command('OPEN_CONTINUITY',{bundle:s.local.bundle,approvalOperationId:a.operationId}))).state,'COMMITTED');
 const command=(extras={})=>s.scope(s.local.command('REGISTER_SALE',{saleId:'future:'+crypto.randomUUID(),catalogueOfferId:'gourmet-tripack',catalogueVersion:catalogue.version,packs:1,selections:[{resourceId:'demo:opening-bags',quantity:3}],customer:{name:'TEST_ONLY',zone:'Zona ficticia'},...extras}));
 return {s,command};
}
test('gerente ajusta tripack y delivery gratuito con motivo, costo real y auditoría',()=>{
 const {s,command}=fixture(), c=command({commercialAdjustment:{productTotalCents:9500,deliveryChargedCents:0,reason:'TEST_ONLY Promoción'}});
 const result=s.call('execute',c,'222222');assert.equal(result.state,'COMMITTED',JSON.stringify(result));
 const p=s.scopedLedger().journal.find(r=>r.kind==='PREPARED'&&r.id===c.operationId).plan;
 assert.equal(p.sale.totalCents,9500);assert.equal(p.sale.deliveryChargedCents,0);assert.equal(p.catalogueRef.totalCents,9900);
 assert.equal(p.audit.commercialAdjustment.subject,'google:222222');
 assert.equal(p.audit.commercialAdjustment.productDifferenceCents,-400);
 assert.equal(p.audit.commercialAdjustment.realDeliveryCostCents,p.sale.deliveryCostCents);
 const before=JSON.stringify(s.scopedLedger());assert.equal(s.call('execute',c,'222222').operationId,result.operationId);
 assert.equal(JSON.stringify(s.scopedLedger()),before);
 assert.equal(s.call('execute',{...c,commercialAdjustment:{...c.commercialAdjustment,productTotalCents:9600}},'222222').error,'IDEMPOTENCY_CONFLICT');
});
test('vendedor no puede enviar ajustes ni importes crudos',()=>{
 const {s,command}=fixture();
 assert.equal(s.call('execute',command({commercialAdjustment:{productTotalCents:9500,reason:'TEST_ONLY'}}),'333333').error,'COMMERCIAL_APPROVAL_REQUIRED');
 assert.equal(s.call('execute',command({deliveryCostCents:0}),'222222').error,'CATALOGUE_BROWSER_PRICE_FORBIDDEN');
});
test('requiere motivo e importe entero no negativo y conserva alerta de margen',()=>{
 const {s,command}=fixture();
 for(const commercialAdjustment of [{productTotalCents:-1,reason:'TEST_ONLY'},{deliveryChargedCents:1.5,reason:'TEST_ONLY'},{productTotalCents:9500,reason:' '}])
  assert.equal(s.call('execute',command({commercialAdjustment})).error,'COMMERCIAL_ADJUSTMENT_INVALID');
 const c=command({commercialAdjustment:{productTotalCents:0,deliveryChargedCents:0,reason:'TEST_ONLY margen negativo'}});
 assert.equal(s.call('execute',c).state,'COMMITTED');
 const p=s.scopedLedger().journal.find(r=>r.kind==='PREPARED'&&r.id===c.operationId).plan;
 assert.equal(p.audit.adjustmentMarginWarning,'NEGATIVE_MARGIN');
});
