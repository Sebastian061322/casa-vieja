import {createRequire} from 'node:module';import {setup} from '../../fase5g/tests/harness.mjs';
const require=createRequire(import.meta.url),{prepare,hash}=require('../opening.cjs'),{createEngineClass,inspectContinuity}=require('../continuity-engine.cjs');
export const act=()=>({environment:'TEST_ONLY',status:'DRAFT',productionApproved:false,id:'TEST_ONLY:OPEN',effectiveAt:'2026-11-01T00:00:00-05:00',responsible:'TEST_ONLY:COUNTER',secondReviewer:'TEST_ONLY:REVIEWER',countEvidence:'TEST_ONLY:COUNT',rows:[
 {resourceId:'demo:opening-bags',lot:'demo:old-lot',product:'Gourmet molido 500 g',family:'Gourmet',stage:'PACKAGED',grind:'molido',grams:500,physical:4,reserved:1,unit:'unit',historicalValueCents:4003,costEvidence:'TEST_ONLY:COST',documentRef:'TEST_ONLY:LOT_DOC',availability:'AVAILABLE',pendingOrders:[{legacyRef:'TEST_ONLY:RESERVED',reserved:1}],countedAt:'2026-10-31T22:00:00-05:00',countEvidence:'TEST_ONLY:ROW'},
 {resourceId:'demo:held',lot:'demo:held-lot',product:'Especialidad grano 250 g',family:'Especialidad',stage:'PACKAGED',grind:'grano',grams:250,physical:2,reserved:0,unit:'unit',historicalValueCents:2000,costEvidence:'TEST_ONLY:HELD_COST',documentRef:'TEST_ONLY:HELD_DOC',availability:'HELD',pendingOrders:[],countedAt:'2026-10-31T22:00:00-05:00',countEvidence:'TEST_ONLY:HELD_ROW'}]});
export function obligation(ref,state='RESERVED',paidCents=1000){return {legacyRef:'TEST_ONLY:'+ref,state,totalCents:3500,paidCents,evidence:'TEST_ONLY:RECEIPT:'+ref,responsible:'TEST_ONLY:OPERATOR',origin:{system:'TEST_ONLY_LEGACY',recordId:'TEST_ONLY:'+ref,revision:1,evidenceHash:'a'.repeat(64)},lines:[{resourceId:'demo:opening-bags',qty:1}]};}
export const obligations=()=>({environment:'TEST_ONLY',status:'DRAFT',obligations:[obligation('RESERVED'),obligation('DISPATCHED','DISPATCHED_UNPAID',500),obligation('DELIVERY','DELIVERY_PENDING',3500)]});
export function fixture(options={}){
 const original=setup(),bundle=prepare(options.act||act(),options.obligations||obligations());
 const policies=Object.fromEntries(['OPEN_CONTINUITY','CONTINUITY_PAYMENT','CONTINUITY_DISPATCH','CONTINUITY_DELIVER','CONTINUITY_CANCEL'].map(type=>[type,{kind:'SYNTHETIC_TEST_APPROVAL',environment:'TEST_ONLY',version:'TEST_ONLY:POLICY:1',evidence:'TEST_ONLY:POLICY_EVIDENCE',effectiveAt:'2026-11-01T00:00:00-05:00',allowUnpaidDispatch:false}]));
 for(const p of Object.values(policies)){p.approvedBy='google:111111';p.approvedAt='2026-10-31T23:00:00-05:00';p.sha256=hash(p);}
 const config={environment:'TEST_ONLY',approvedBundleHash:bundle.bundleHash,policies,...options.config};
 const Engine=createEngineClass(original.c.CVZeroAccess,config),store={journal:[],effects:[],readJournal(){return structuredClone(this.journal)},readEffects(){return structuredClone(this.effects)},appendJournal(r){this.journal.push(structuredClone(r))},appendEffect(r){this.effects.push(structuredClone(r))}};
 let seq=0,now='2026-11-01T05:00:00.000Z',hook=()=>{};
 const engine=(role='administrator')=>new Engine(store,hook,{actor:{subject:{administrator:'google:111111',operations:'google:222222',seller:'google:333333'}[role],role},policy:{version:1,shippingByZone:{'Zona ficticia':{costCents:0,chargedCents:0}}},now:()=>now});
 const command=(type,extra={})=>{const n=++seq;return {schemaVersion:2,commercialVersion:4,epoch:'TEST_ONLY_V3',operationId:'TEST_ONLY_5G2_'+n,deviceId:'TEST_ONLY_DEVICE',saleId:'future:TEST_ONLY_5G2_'+n,date:'2026-11-01T05:00:00.000Z',responsible:'ignored browser value',type,...extra};};
 const opening=command('OPEN_CONTINUITY',{bundle});
 return {original,Engine,store,bundle,config,engine,command,opening,run:(c,role)=>engine(role).execute(c),state:()=>inspectContinuity(engine()),setHook:h=>hook=h,setNow:t=>now=t};
}
