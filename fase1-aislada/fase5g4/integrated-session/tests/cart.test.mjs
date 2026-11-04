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
