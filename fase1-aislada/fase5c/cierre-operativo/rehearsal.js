/* SIMULACRO TEST_ONLY. No abre archivos, no autentica usuarios, no tiene destinos productivos. */
(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('../access.js'):root.CVAccess,typeof module==='object'&&module.exports?require('../../fase3/journal.js'):root.CVInventoryBase);if(typeof module==='object'&&module.exports)module.exports=api;else root.CVRehearsal=api;})(typeof globalThis==='object'?globalThis:this,function(A,B){
'use strict';const {clone,canonical,uint}=B,check=(x,e)=>{if(!x)throw Error(e)};
class LabEngine extends A.Engine{
 constructor(store,hook,ctx){super(store,undefined,hook,ctx);this.lab=ctx.lab;}
 plan(s,c){let p;if(c.type==='OPEN_LAB_INVENTORY'){
  check(this.actor.role==='administrator'&&this.lab?.environment==='TEST_ONLY'&&this.lab.openingAllowed===true,'LAB_OPENING_DENIED');check(c.cutoverId===this.lab.run&&c.countDigest===this.lab.countDigest,'COUNT_APPROVAL_REQUIRED');check(!c.rows,'CLIENT_OPENING_FORBIDDEN');
  const rows=this.lab.count;check(Array.isArray(rows)&&rows.length>0&&new Set(rows.map(r=>r.id)).size===rows.length,'INVALID_COUNT');const resources=[],effects=[],lots=[];
  for(const r of rows){check(r.id.startsWith('demo:'+this.lab.run+'-')&&!s.resources[r.id],'INVALID_OPENING_SCOPE');uint(r.qty,1);uint(r.valueCents);check(['PACKAGED','BULK','SUPPLY'].includes(r.stage)&&r.reserved===0&&r.lot.startsWith('demo:'),'INVALID_COUNT');if(r.stage!=='SUPPLY')check(['Gourmet','Especialidad'].includes(r.family),'INVALID_FAMILY');if(r.stage==='PACKAGED')check([250,500].includes(r.grams)&&['molido','grano'].includes(r.grind)&&r.unit==='unit','INVALID_COUNT');else check(r.unit===(r.stage==='BULK'?'g':'unit'),'INVALID_COUNT');
   const {qty,valueCents,...attributes}=r;resources.push({...attributes,physical:0,reserved:0,qty:0,valueCents:0,reservedValueCents:0});if(!lots.some(l=>l.id===r.lot))lots.push({id:r.lot,family:r.family||'Insumo',origin:'ACTA FICTICIA',cutoverId:c.cutoverId});effects.push({id:c.operationId+':'+effects.length,operationId:c.operationId,saleId:c.saleId,date:this.context.now(),responsible:this.actor.subject,lot:r.lot,product:r.product,unit:r.unit,resourceId:r.id,kind:'LAB_OPENING',qtyDelta:qty,reservedDelta:0,valueDelta:valueCents,reservedValueDelta:0,cutoverId:c.cutoverId,countDigest:c.countDigest});}
  p={sale:{id:c.saleId,version:1,entityType:'inventory'},resources,lots,effects,commerceEvents:[],audit:{subject:this.actor.subject,role:this.actor.role,serverAt:this.context.now(),type:c.type,operationId:c.operationId}};
 }else p=super.plan(s,c);
 p.policyRef={version:1,sha256:this.lab.policyDigest,environment:'TEST_ONLY',approvedBy:'fictitious-owner'};p.policySnapshot=clone(this.lab.policy);return p;
 }
}
const policy={collections:'ADMIN_ONLY_TEST',dispatch:'PHYSICAL_ON_DISPATCH_TEST',discounts:'ADMIN_AUTHORIZATION_TEST',cancellations:'RELEASE_BEFORE_DISPATCH_TEST',preparation:'NOT_USED',returns:'BLOCKED_PENDING_POLICY',lots:'SYNTHETIC_ONLY',adjustments:'NO_ARBITRARY_BALANCE',backups:'BEFORE_AND_AFTER_DRILL'};
function count(run){return [
 {id:'demo:'+run+'-g500',lot:'demo:'+run+'-gourmet',stage:'PACKAGED',product:'bolsa500',family:'Gourmet',grind:'molido',grams:500,unit:'unit',qty:6,reserved:0,valueCents:18000},
 {id:'demo:'+run+'-e250',lot:'demo:'+run+'-especial',stage:'PACKAGED',product:'bolsa250',family:'Especialidad',grind:'grano',grams:250,unit:'unit',qty:4,reserved:0,valueCents:12000},
 {id:'demo:'+run+'-bulk',lot:'demo:'+run+'-bulk-lot',stage:'BULK',product:'tostado',family:'Gourmet',unit:'g',qty:1000,reserved:0,valueCents:6000},
 {id:'demo:'+run+'-bags',lot:'demo:'+run+'-supplies',stage:'SUPPLY',product:'BAG500',supplyKind:'BAG500',unit:'unit',qty:10,reserved:0,valueCents:2000}];}
class Runner{
 constructor(io){check(io.environment==='TEST_ONLY','TEST_ONLY_REQUIRED');this.io=io;}
 metadata(){return clone(this.io.meta.read());}
 initialize(run,now){check(/^drill5c-[a-zA-Z0-9_-]{3,70}$/.test(run),'INVALID_RUN');check(Number.isFinite(Date.parse(now)),'INVALID_DATE');if(this.io.meta.read()){check(this.io.meta.read().run===run,'ACTIVE_RUN_EXISTS');return this.metadata();}const m={environment:'TEST_ONLY',run,now,step:0,oldClosed:false,newHalted:false,writer:'OLD',checks:[],oldInitialDigest:null,newInitialDigest:this.io.hash(canonical({j:this.io.next.readJournal(),e:this.io.next.readEffects()}))};this.io.meta.write(m);return this.metadata();}
 command(m,name,type,data={}){return {epoch:'TEST_ONLY_V3',schemaVersion:2,commercialVersion:4,operationId:m.run+'-'+name,deviceId:'synthetic-transition',saleId:'future:'+m.run+'-'+name,date:m.now,responsible:'Ficticio',type,...data};}
 engine(m,which,hook){const run=m.run+(which==='old'?'-old':'-new'),rows=count(run),lab={environment:'TEST_ONLY',run,openingAllowed:true,count:rows,countDigest:this.io.hash(canonical(rows)),policy,policyDigest:this.io.hash(canonical(policy))};return new LabEngine(which==='old'?this.io.old:this.io.next,hook,{actor:{subject:'google:111111',role:'administrator'},now:()=>m.now,lab});}
 execute(m,which,c,hook){if(which==='old')check(!m.oldClosed&&m.writer==='OLD','LEGACY_WRITE_CLOSED');else check(m.oldClosed&&m.writer==='NEW'&&!m.newHalted,'NEW_WRITE_CLOSED');return this.engine(m,which,hook).execute(c);}
 step(){const m=this.metadata();check(m,'SETUP_REQUIRED');if(m.step>=21)return m;const old=this.engine(m,'old'),next=this.engine(m,'new'),cmd=(name,type,data)=>this.command(m,name,type,data),resource=which=>'demo:'+m.run+'-'+which+'-g500',offer=which=>'demo:'+m.run+'-'+which+'-offer';const sale=(which,name)=>cmd(name,'REGISTER_SALE',{channel:'Otro',customer:{name:'CLIENTE FICTICIO',zone:'DEMO'},items:[{offerId:offer(which),offerVersion:1,resourceId:resource(which),quantity:1}]});
 const opening=which=>{const e=this.engine(m,which);return cmd(which+'-opening','OPEN_LAB_INVENTORY',{cutoverId:e.lab.run,countDigest:e.lab.countDigest});};
 const offerCommand=which=>cmd(which+'-offer','CONFIGURE_OFFER',{expectedOfferVersion:0,offer:{id:offer(which),name:'OFERTA FICTICIA',family:'Gourmet',grind:'molido',grams:500,bags:1,priceCents:3500,validFrom:'2020-01-01',validUntil:'2099-12-31',active:true}});
 const assert=(name,ok)=>{check(ok,'DRILL_ASSERTION_FAILED');if(!m.checks.some(c=>c.name===name))m.checks.push({name,passed:true});};
 const fail=()=>{let injected=false;return point=>{if(point==='afterEffect'&&!injected){injected=true;throw Error('INJECTED_PARTIAL')}};};
 const cancel=name=>cmd(name+'-cancel','CANCEL_SALE',{saleId:'future:'+m.run+'-'+name,expectedSaleVersion:1,reason:'Cierre ficticio previo al conteo'});
 const takeBackup=label=>{const payload={environment:'TEST_ONLY',label,run:m.run,meta:clone(m),policy:clone(policy),old:{journal:this.io.old.readJournal(),effects:this.io.old.readEffects()},next:{journal:this.io.next.readJournal(),effects:this.io.next.readEffects()},release:this.io.release};const archive={payload,sha256:this.io.hash(canonical(payload))};return this.io.backup(archive);};
 switch(m.step){
 case 0:this.execute(m,'old',opening('old'));assert('Origen simulado separado del diario nuevo',this.io.old!==this.io.next);break;
 case 1:this.execute(m,'old',offerCommand('old'));break;
 case 2:this.execute(m,'old',sale('old','lost'));assert('Confirmación perdida conserva recibo',old.status(m.run+'-lost').state==='COMMITTED');break;
 case 3:try{this.execute(m,'old',sale('old','partial'),fail())}catch(e){if(e.message!=='INJECTED_PARTIAL')throw e}assert('Operación antigua parcial recuperable',['PREPARED','COMMITTED'].includes(old.status(m.run+'-partial').state));break;
 case 4:m.beforeBackup=takeBackup('BEFORE_PENDING_RECOVERY');assert('Respaldo anterior incluye PREPARED',this.io.old.readJournal().some(r=>r.kind==='PREPARED'&&r.id===m.run+'-partial'));break;
 case 5:assert('Recibo perdido recuperado sin venta nueva',this.execute(m,'old',sale('old','lost')).operationId===m.run+'-lost');break;
 case 6:this.execute(m,'old',sale('old','partial'));assert('Reintento parcial original confirmado',old.status(m.run+'-partial').state==='COMMITTED');break;
 case 7:this.execute(m,'old',cancel('lost'));break;
 case 8:this.execute(m,'old',cancel('partial'));assert('Reservas antiguas cerradas antes de apertura',old.state().resources[resource('old')].reserved===0);break;
 case 9:{const j=old.records();assert('Ninguna operación antigua PREPARED sin COMMITTED',j.filter(r=>r.kind==='PREPARED').every(p=>j.some(c=>c.id===p.id&&c.kind==='COMMITTED')));m.oldClosed=true;m.writer='NEW';m.oldInitialDigest=this.io.hash(canonical({j:this.io.old.readJournal(),e:this.io.old.readEffects()}));m.countAct={id:m.run+'-count',approvedBy:'FICTITIOUS_OWNER',environment:'TEST_ONLY',rows:count(m.run+'-new'),sha256:next.lab.countDigest};try{this.execute(m,'old',sale('old','late'));assert('Escritor antiguo bloqueado',false)}catch(e){assert('Escritor antiguo bloqueado',e.message==='LEGACY_WRITE_CLOSED')}break;}
 case 10:try{this.execute(m,'new',opening('new'),fail())}catch(e){if(e.message!=='INJECTED_PARTIAL')throw e}assert('Apertura parcial recuperable',['PREPARED','COMMITTED'].includes(next.status(m.run+'-new-opening').state));break;
 case 11:this.execute(m,'new',opening('new'));assert('Apertura nueva consume acta una sola vez',next.state().resources[resource('new')].physical===6);break;
 case 12:this.execute(m,'new',offerCommand('new'));break;
 case 13:this.execute(m,'new',sale('new','new-sale'));assert('Reserva no descuenta físico',next.state().resources[resource('new')].physical===6&&next.state().resources[resource('new')].reserved===1);break;
 case 14:{const receipt=next.status(m.run+'-new-sale');const again=this.execute(m,'new',sale('new','new-sale'));assert('Recibo nuevo recuperado con mismo ID',canonical(receipt)===canonical(again));break;}
 case 15:this.execute(m,'new',cmd('payment','RECORD_PAYMENT',{saleId:'future:'+m.run+'-new-sale',expectedSaleVersion:1,amountCents:3500,documentRef:'DEMO-'+m.run+'-PAY'}));assert('Cobro no vuelve a consumir',next.state().resources[resource('new')].physical===6);break;
 case 16:try{this.execute(m,'new',cmd('dispatch','DISPATCH_SALE',{saleId:'future:'+m.run+'-new-sale',expectedSaleVersion:2}),fail())}catch(e){if(e.message!=='INJECTED_PARTIAL')throw e}assert('Despacho parcial recuperable',['PREPARED','COMMITTED'].includes(next.status(m.run+'-dispatch').state));break;
 case 17:this.execute(m,'new',cmd('dispatch','DISPATCH_SALE',{saleId:'future:'+m.run+'-new-sale',expectedSaleVersion:2}));assert('Despacho único: 5 físicas, cero reservadas',next.state().resources[resource('new')].physical===5&&next.state().resources[resource('new')].reserved===0);break;
 case 18:m.newHalted=true;m.writer='NONE';try{this.execute(m,'new',sale('new','halted'));assert('Contingencia detiene altas nuevas',false)}catch(e){assert('Contingencia detiene altas nuevas',e.message==='NEW_WRITE_CLOSED')}assert('Origen antiguo permanece inmutable',m.oldInitialDigest===this.io.hash(canonical({j:this.io.old.readJournal(),e:this.io.old.readEffects()})));break;
 case 19:{m.afterBackup=takeBackup('AFTER_HALT');const rows=count(m.run+'-new'),s=next.state(),grams=rows.filter(r=>r.stage!=='SUPPLY').reduce((n,r)=>n+s.resources[r.id].physical*(r.unit==='g'?1:r.grams),0);assert('Conservación: 5000 g iniciales = 4500 g + 500 g despachados',grams===4500);assert('Costo histórico confirmado 3000 céntimos',s.sales['future:'+m.run+'-new-sale'].costCents===3000&&s.resources[resource('new')].valueCents===15000);m.balances=rows.map(r=>({resourceId:r.id,physical:s.resources[r.id].physical,reserved:s.resources[r.id].reserved,available:s.resources[r.id].qty,valueCents:s.resources[r.id].valueCents}));break;}
 case 20:assert('Una apertura y un despacho nuevos por identificador',next.records().filter(r=>r.kind==='COMMITTED'&&[m.run+'-new-opening',m.run+'-dispatch'].includes(r.id)).length===2);m.done=true;m.passed=true;break;
 }
 m.step++;this.io.meta.write(m);return clone(m);
 }
}
function memoryStore(){const j=[],e=[];return {readJournal:()=>clone(j),readEffects:()=>clone(e),appendJournal:r=>j.push(clone(r)),appendEffect:r=>e.push(clone(r))};}
return {Runner,LabEngine,count,policy,memoryStore};});
