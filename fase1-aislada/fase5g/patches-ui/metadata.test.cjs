'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {lotMetadata}=require('./lot-metadata.cjs');
const money=n=>'S/ '+(n/100).toFixed(2);
test('Opening metadata remains unavailable; never substitutes zero cost',()=>{const html=lotMetadata({},money);assert.equal((html.match(/No registrado/g)||[]).length,3);assert.doesNotMatch(html,/NaN|undefined|S\/ 0/);});
test('Explicit zero is displayed as a known value',()=>assert.equal(lotMetadata({receivedGrams:0,acquisitionCents:0,processingCents:0},money),'<p>Recibido: 0 g · Adquisición inicial: S/ 0.00 · Procesamiento inicial: S/ 0.00</p>'));
test('Known receipt weight and cost are preserved exactly',()=>assert.match(lotMetadata({receivedGrams:10000,acquisitionCents:11000,processingCents:0},money),/10000 g · Adquisición inicial: S\/ 110.00 · Procesamiento inicial: S\/ 0.00/));
test('Null, text and non-finite metadata cannot fabricate costs or HTML',()=>{const html=lotMetadata({receivedGrams:'<img>',acquisitionCents:null,processingCents:Infinity},money);assert.equal((html.match(/No registrado/g)||[]).length,3);assert.doesNotMatch(html,/<img|Infinity/);});
test('Filtering order cards cannot re-enable unapproved cancellation or returns',()=>{
 const bundle=fs.readFileSync(path.join(__dirname,'build/worker-bundle.mjs'),'utf8'),marker='\nconst assets=',a=bundle.indexOf(marker),b=bundle.indexOf(';\nexport default',a),assets=JSON.parse(bundle.slice(a+marker.length,b));
 const fn=assets['/approved-app.js'].split('\n').find(l=>l.startsWith('function orderTable()'));
 const sales=['RESERVED','DISPATCHED','PART_RETURNED'].map((status,i)=>({id:'TEST_ONLY_'+i,status,metadata:{customer:'TEST_ONLY',phone:'',zone:'',note:''},commercial:{channel:'TEST_ONLY'},financial:{outstandingCents:0,cashCents:0,refundableCents:0},lines:[],totalCents:3500,deliveryChargedCents:0,costCents:1172,profitCents:2328}));
 const context=vm.createContext({$:()=>({value:''}),commercialSales:()=>sales,esc:String,money,statusName:{RESERVED:'Reservado',DISPATCHED:'Despachado',PART_RETURNED:'Devuelto parcialmente'}});
 vm.runInContext(fn,context);
 for(const html of [context.orderTable(),context.orderTable()])for(const type of ['CANCEL_SALE','RETURN_SALE']){const buttons=html.match(new RegExp('<button[^>]+data-action="'+type+'"[^>]*>','g'));assert.equal(buttons.length,3);assert.ok(buttons.every(b=>b.includes('disabled')));}
});
