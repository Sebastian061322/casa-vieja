const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createHash}=require('node:crypto');
const {spawnSync}=require('node:child_process');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
function patch(s,a,b){if(s.split(a).length!==2)throw Error('PATCH_BOUNDARY '+a.slice(0,90));return s.replace(a,()=>b);}
const backendBase=read('../authorized-adjustments/build/Candidate.gs');
const workerBase=read('../authorized-adjustments/build/worker-bundle.mjs');
if(hash(backendBase)!=='60976701d0d3c34a019b48a8b54ee850ee0b56f039c6acf035c66e617cae3976'||
   hash(workerBase)!=='22036ac43f91a1653804cc3e2c95629adc0242dac6f859cddfe8dd7b0ce0565f')throw Error('BASE_CHANGED');
let backend=patch(backendBase,
 "const actor5e=zeroActor_(current,zeroPropertyLog_('ZERO_USER_'),p);zeroConsumeNonce_(current,p,Date.now());",
 "const users63=zeroPropertyLog_('ZERO_USER_');zeroConsumeNonce_(current,p,Date.now());const sessionResult63=cvSessionDispatch63_(current,p,users63);if(sessionResult63)return sessionResult63;const actor5e=zeroActor_(current,users63,p);");
backend=patch(backend,"const actor=zeroActor_(zeroProof_(envelope),zeroPropertyLog_('ZERO_USER_'),props);",
 "const request63=zeroProof_(envelope),users63=zeroPropertyLog_('ZERO_USER_');cvSessionDispatch63_(request63,props,users63);const actor=zeroActor_(request63,users63,props);");
backend=patch(backend,'return service.handle(envelope);',
 `const result63=service.handle(envelope);
 if(current.action==='bootstrap'&&current.issueDigest63&&!result63.error){
  const issued63=cvSessions63_(p,users63).issue(current.issueDigest63,actor5e.subject,current.expiresAt,current.previousDigest63);
  return {...result63,sessionExpiresAt63:issued63.idleExpiry};
 }
 return result63;`);
backend=patch(backend,'if(cfg?.enabled===true||command.catalogueOfferId!==undefined){const prepared=CV53CatalogueRules.prepareSale(state,command,cfg,CV53CatalogueSource,this.context.now());',
 'if(cfg?.enabled===true||command.catalogueOfferId!==undefined||Object.hasOwn(command,"catalogueCart")){const prepared=Object.hasOwn(command,"catalogueCart")?cvPrepareCart63_(state,command,cfg,CV53CatalogueSource,this.context.now()):CV53CatalogueRules.prepareSale(state,command,cfg,CV53CatalogueSource,this.context.now());');
backend=patch(backend,'if(!CV_SCOPE53_ACTIVE)return CV53PlanBeforeCatalogue.call(this,state,command);',
 'if(!CV_SCOPE53_ACTIVE)return CV53PlanBeforeCatalogue.call(this,state,command);if(["REQUEST_COMMERCIAL_ADJUSTMENT","REVIEW_COMMERCIAL_ADJUSTMENT"].includes(command.type))return cvApprovalPlan63_(this,state,command);if(command.type==="REGISTER_CUSTOMER")return cvRegisterCustomer65_(this,command);if(command.type==="CORRECT_AD_EXPENSE")return cvCorrectAd65_(this,state,command);');
backend=patch(backend,'function cvAuthorizedAdjustment62_(engine, command, prepared) {','function cvAuthorizedAdjustment62_(engine, command, prepared, approved) {');
backend=patch(backend,'const adjustment = command.commercialAdjustment;', 'const adjustment = approved?.adjustment || command.commercialAdjustment;');
backend=patch(backend,"if (!manager) return null;","if (!manager && !approved) return null;");
backend=patch(backend,"if (!own('commercialAdjustment')) return null;","if (!own('commercialAdjustment') && !approved) return null;");
backend=patch(backend,'const adjustment=cvAuthorizedAdjustment62_(this,command,prepared);const plan=CV53PlanBeforeCatalogue.call(this,prepared.state,prepared.command);',
 `const approved=cvApprovedAdjustment63_(this,command,prepared), adjustment=cvAuthorizedAdjustment62_(this,command,prepared,approved);
 let plan; const previousPolicy=this.policy;
 if(approved){
  delete prepared.command.deliveryCostCents;delete prepared.command.deliveryChargedCents;
  const zone=command.customer.zone, tariff=this.policy.shippingByZone[zone];
  this.policy={...this.policy,shippingByZone:{...this.policy.shippingByZone,[zone]:{...tariff,chargedCents:adjustment.appliedDeliveryCents}}};
  adjustment.approvedBy=approved.reviewer;adjustment.approvalId=approved.id;
 }
 try{plan=CV53PlanBeforeCatalogue.call(this,prepared.state,prepared.command);}finally{this.policy=previousPolicy;}`);
backend=patch(backend,"['name','phone','zone','note'].includes(k)","['name','phone','zone','note','address','previousOrder','registryId'].includes(k)");
backend=patch(backend,'try{plan=CV53PlanBeforeCatalogue.call(this,prepared.state,prepared.command);}finally{this.policy=previousPolicy;}',
 'try{plan=CV53PlanBeforeCatalogue.call(this,prepared.state,prepared.command);cvLinkCustomer64_(this,state,command,plan);}finally{this.policy=previousPolicy;}');
backend=patch(backend,'const key=phone||sale.id;',
 'const key=sale.commercial.customerId64||sale.id;');
backend=patch(backend,"if(e.kind==='DISCOUNT_USED')s.commerce.authorizations[e.authorizationId].usedBy=e.operationId;}}return s;}",
 "if(e.kind==='DISCOUNT_USED')s.commerce.authorizations[e.authorizationId].usedBy=e.operationId;}}return CV_SCOPE53_ACTIVE?cvProjectAds65_(s):s;}");
backend=patch(backend,'p.policyRef={version:this.policy.version||0,',
 `if(CV_SCOPE53_ACTIVE&&c.type==='RECORD_EXPENSE'&&Object.hasOwn(c,'adDetails')){
  if(c.category!=='PUBLICIDAD')throw Error('INVALID_AD_DETAILS');
  const details=cvAdsDetails65_(c.adDetails);
  Object.assign(p.commerceEvents[0],{adDetails65:details,messages:details.messages,campaign:details.campaign});
 }p.policyRef={version:this.policy.version||0,`);
backend+='\n'+read('ads.gs');
backend+='\n'+read('customer.gs');
backend+='\n'+read('approval.gs');
backend+='\n'+read('cart.gs');
backend+='\n'+read('../session-core/authority.mjs').replace('export function sessionAuthority','function sessionAuthority63_')+'\n'+read('backend.gs');
new vm.Script(backend);
const marker='\nconst assets=',start=workerBase.indexOf(marker)+marker.length,end=workerBase.indexOf(';\nexport default',start);
const assets=JSON.parse(workerBase.slice(start,end));
let prefix=workerBase.slice(0,start);
prefix=patch(prefix,'async function proof(identity,action,payload,secret,now=Date.now)', 'async function proof(identity,action,payload,secret,now=Date.now,sessionFields63={})');
prefix=patch(prefix,'action,payload:payload??null};check(request.expiresAt>time);','action,payload:payload??null,...sessionFields63};check(request.expiresAt>time);');
const workerHandlerStart=prefix.indexOf(" const header=request.headers.get('authorization')||'';");
const workerHandlerEnd=prefix.indexOf(" if(fault&&result?.state==='COMMITTED'",workerHandlerStart);
if(workerHandlerStart<0||workerHandlerEnd<=workerHandlerStart)throw Error('WORKER_HANDLER_BOUNDARY');
prefix=prefix.slice(0,workerHandlerStart)+read('worker-handler.js')+'\n'+prefix.slice(workerHandlerEnd);
prefix=patch(prefix,'return out(result,200,origin,metrics.traceId);',
 "const answer63=out(result,200,origin,metrics.traceId);if(cookie63)answer63.headers.set('set-cookie',cookie63);return answer63;");
prefix=read('../session-core/cookie.mjs').replace(/^export /gm,'')+'\n'+prefix;
function installCart63(s){
 s=patch(s,' function adjustmentFields62(draft,offer) {',read('cart-browser.js')+'\n function adjustmentFields62(draft,offer) {');
 s=patch(s,'const reference=offer.priceCents*Number(form.elements.packs.value);',
  'const rows=cartRows63(catalogueDraft54);const reference=rows.length?cartPrice63(rows,snapshot.catalogue54.offers):offer.priceCents*Number(form.elements.packs.value);');
 s=patch(s,'locked||matchesPicker60(offer)?', 'locked||matchesPicker60(offer)||cartRows63(draft).length?');
 s=patch(s,'${adjustmentFields62(draft,offer)}<p><strong>',
  '${cartPanel63(draft,offers,locked)}${adjustmentFields62(draft,offer)}<p><strong>');
 s=patch(s,'${money(offer.priceCents*draft.packs)}</strong>',
  '${money(cartRows63(draft).length?cartPrice63(cartRows63(draft),offers):offer.priceCents*draft.packs)}</strong>');
 s=patch(s,'<button class="btn" type="submit">Registrar y reservar</button>',
  '<button class="btn secondary" type="button" data-cart-add63>Añadir oferta al carrito</button> <button class="btn" type="submit">${cartRows63(draft).length?"Registrar carrito":"Registrar y reservar"}</button>');
 s=patch(s,'el.value=draft.selected[i];});','el.value=draft.selected[i];if(cartRows63(draft).length)el.required=false;});');
 s=patch(s,'const enough = checkSelection55(selected, snapshot.resources) && matchingGroup;',
  'const cart=cartRows63(catalogueDraft54);const enough=cart.length?checkSelection55(cartUnits63(cart),snapshot.resources):checkSelection55(selected,snapshot.resources)&&matchingGroup;');
 s=patch(s,"textContent = !matchingGroup ? 'Elige una presentación de la línea seleccionada.'",
  "textContent = !cart.length&&!matchingGroup ? 'Elige una presentación de la línea seleccionada.'");
 const start=s.indexOf("if(selected.some(id=>!id))throw Error('Selecciona la partida de cada bolsa');");
 const end=s.indexOf(' const adjustment62=readAdjustment62(form);',start);
 if(start<0||end<=start)throw Error('CART_SUBMIT_BOUNDARY');
 s=s.slice(0,start)+`d.customer=form.elements.customer.value;d.zone=form.elements.zone.value;
 const rows=cartRows63(d);
 if(rows.length){if(!checkSelection55(cartUnits63(rows),snapshot.resources))throw Error('Stock insuficiente para el carrito');}
 else {cartLine63(form,snapshot.catalogue54.offers.find(o=>o.id===d.offerId));if(!checkSelection55(selected,snapshot.resources))throw Error('La cantidad supera el saldo mostrado para una partida');}
 d.selected=selected;await store.transact(s=>s.catalogueDraft54=structuredClone(d));dirty=false;
 const command62=rows.length?cartCommand63(d,snapshot.catalogue54.version):catalogueCommand54(d,selected,snapshot.catalogue54.version,actor.profile);
`+s.slice(end);
 s=patch(s,"if(b.hasAttribute('data-new-catalogue54'))",`if(b.hasAttribute('data-cart-add63')||b.dataset.cartRemove63!==undefined){
  const form=$('catalogue54-form'),d=await draft54();
  if(!form||form.querySelector('fieldset').disabled)return;
  const rows=[...cartRows63(d)];
  if(b.hasAttribute('data-cart-add63')){
   const row=cartLine63(form,snapshot.catalogue54.offers.find(o=>o.id===form.elements.offer.value));
   rows.push(row);
   if(rows.reduce((n,r)=>n+r.selections.length,0)>8)throw Error('Máximo 8 partidas de oferta por pedido');
   if(!checkSelection55(cartUnits63(rows),snapshot.resources))throw Error('Stock insuficiente para el carrito');
  }else rows.splice(Number(b.dataset.cartRemove63),1);
  d.customer=form.elements.customer.value;d.zone=form.elements.zone.value;d.cart63=rows;d.adjustment62=null;
  d.selected=[...form.querySelectorAll('[data-catalogue-resource54]')].map(el=>el.value);
  await store.transact(s=>s.catalogueDraft54=structuredClone(d));dirty=true;await catalogueForm54();return;
 }
 if(b.hasAttribute('data-new-catalogue54'))`);
 return s;
}
function installApproval63(s){
 s=patch(s,' const cartRows63 =',read('approval-browser.js')+'\n const cartRows63 =');
 s=patch(s,"if (!['administrator','operations'].includes(actor.profile)) return '';","const approval63=actor.profile==='seller'?draftApproval63(draft):null;");
 s=patch(s,"const previous=saved?.offerId===offer.id && saved?.packs===draft.packs ? saved : {};",
  "const previous=approval63?{product:approval63.adjustment.productTotalCents===undefined?'':String(approval63.adjustment.productTotalCents/100),delivery:approval63.adjustment.deliveryChargedCents===undefined?'':String(approval63.adjustment.deliveryChargedCents/100),reason:approval63.adjustment.reason}:saved?.offerId===offer.id&&saved?.packs===draft.packs?saved:{};");
 s=patch(s,"return '<fieldset><legend>Precio y delivery</legend>'+",
  "return '<fieldset '+(approval63?'disabled':'')+'><legend>'+(actor.profile==='seller'?'Solicitar ajuste de precio y delivery':'Precio y delivery')+'</legend>'+");
 s=patch(s,'${adjustmentFields62(draft,offer)}<p><strong>','${adjustmentFields62(draft,offer)}${approvalPanel63(draft)}<p><strong>');
 s=patch(s,'if(adjustment62)command62.commercialAdjustment=adjustment62;',
  `if(actor.profile==='seller'){
   const approval=draftApproval63(d);
   if(approval?.state==='APPROVED')command62.commercialApprovalId=approval.id;
   else if(approval||adjustment62)throw Error('Espera la aprobación del ajuste antes de registrar');
  }else if(adjustment62)command62.commercialAdjustment=adjustment62;`);
 s=patch(s,"if(actor.profile!=='seller')nav54('ads56','Publicidad / Meta Ads');",
  "if(actor.profile!=='seller'){nav54('ads56','Publicidad / Meta Ads');nav54('approvals63','Aprobaciones comerciales');}");
 s=patch(s,"if(view==='ads56'){renderAds56();return;}","if(view==='approvals63'){renderApprovalReview63();return;}if(view==='ads56'){renderAds56();return;}");
 s=patch(s,"if(b.hasAttribute('data-new-catalogue54'))",`if(b.hasAttribute('data-approval-request63')){
  if(actor.profile!=='seller')return;
  const form=$('catalogue54-form'),d=await draft54();
  if(!form||form.querySelector('fieldset').disabled||draftApproval63(d))return;
  if(!form.elements.customer.reportValidity()||!form.elements.zone.reportValidity())return;
  const adjustment=readAdjustment62(form);if(!adjustment)throw Error('Ingresa un importe y el motivo');
  d.customer=form.elements.customer.value;d.zone=form.elements.zone.value;
  const rows=cartRows63(d);
  const order=rows.length?cartCommand63(d,snapshot.catalogue54.version):{
   ...cartLine63(form,snapshot.catalogue54.offers.find(o=>o.id===form.elements.offer.value)),
   saleId:d.saleId,catalogueVersion:snapshot.catalogue54.version,customer:prepareCustomer({customer:d.customer,zone:d.zone},actor.profile),channel:d.channel};
  const {type,offerId,...proposal}=order;if(offerId)proposal.catalogueOfferId=offerId;
  await store.transact(s=>s.catalogueDraft54=structuredClone(d));
  await send({type:'REQUEST_COMMERCIAL_ADJUSTMENT',saleId:d.saleId,proposal,commercialAdjustment:adjustment});
  await catalogueForm54();return;
 }
 if(b.dataset.approvalId63){
  if(actor.profile==='seller')return;
  const approval=(snapshot.adjustmentApprovals63||[]).find(r=>r.id===b.dataset.approvalId63);
  if(!approval||approval.state!=='PENDING')return;
  b.disabled=true;
  try{await send({type:'REVIEW_COMMERCIAL_ADJUSTMENT',saleId:approval.saleId,requestId:approval.id,decision:b.dataset.approvalDecision63});}
  finally{if(b.isConnected)b.disabled=false;}
  return;
 }
 if(b.hasAttribute('data-new-catalogue54'))`);
 return s;
}
function installCustomer64(s){
 s=patch(s,' function cartLine63(',read('report-browser.js')+'\n function cartLine63(');
 s=patch(s,'function renderCustomers(){',` function customerHistory64(customer){
  const ids=new Set(customer.orders);
  const last=(snapshot.commerce?.events||[]).filter(e=>e.kind==='DISPATCH_RECOGNIZED'&&ids.has(e.saleId))
   .reduce((latest,e)=>e.date>latest?e.date:latest,'');
  const pending=customer.orders.filter(id=>snapshot.sales[id]?.status==='RESERVED').length;
  return '<p>Última compra despachada '+esc(last.slice(0,10)||'Sin despacho')+' · '+pending+' pedido(s) reservado(s)</p>';
 }
function renderCustomers(){`);
 s=patch(s,'<div id="customer-list"></div>', '${customerRegistration65()}<div id="customer-list"></div>');
 s=patch(s,'function renderCustomers(){',`function customerRegistration65(){
  return '<details class="card"><summary>Alta de cliente</summary><form id="customer-register65" class="form-grid">'+
   [['name','Nombre','text'],['phone','Teléfono','tel'],['address','Dirección','text'],['zone','Zona','text']]
    .map(([key,title,type])=>label(key,title,type,'','required maxlength="200"')).join('')+
   '<button class="btn" type="submit">Guardar cliente</button></form></details>';
 }
 document.addEventListener('submit',async event=>{
  if(event.target.id!=='customer-register65')return;
  event.preventDefault();
  const form=event.target,button=form.querySelector('button');
  button.disabled=true;
  try{await send({type:'REGISTER_CUSTOMER',saleId:'future:'+uuid(),customer:Object.fromEntries(new FormData(form))});}
  catch(error){notice(explain(error));}
  finally{button.disabled=false;}
 });
 function renderCustomers(){`);
 s=patch(s,".filter(c=>`${c.name} ${c.phone}`.toLowerCase().includes(q))",
  ".filter(c=>c.name.toLowerCase().includes(q)||(/^\\+?[\\d ()-]+$/.test(q)&&c.phone.replace(/\\D/g,'').replace(/^51(?=\\d{9}$)/,'').includes(q.replace(/\\D/g,'').replace(/^51(?=\\d{9}$)/,''))))");
 s=patch(s,'<p>Importe neto de pedidos:','${customerHistory64(c)}<p>Importe neto de pedidos:');
 s=patch(s,'function renderAds56(filters = {}) {',read('ads-browser.js')+'\nfunction renderAds56(filters = {}) {');
 s=patch(s,'const { rows, investment, messages, costPerMessage } = advertisingSummary(events, filters);',
  'const { rows, investment, messages, costPerMessage } = advertisingSummary(events.map(e=>e.adDetails65?{...e,date:e.adDetails65.date}:e), filters);');
 s=patch(s,'<p>Selecciona Publicidad manual en el formulario de egresos.</p>','${adForm65()}');
 s=patch(s,'${esc(e.description)}</p></article>','${esc(e.description)}</p>${adHistory65(events,e)}</article>');
 s=patch(s,'<p>Costo por venta y ROAS requieren atribución verificada.</p>',
  '<p>Costo por venta atribuible: N/D · ROAS atribuible: N/D. Requieren atribución verificada.</p>');
 s=patch(s,"nav54('approvals63','Aprobaciones comerciales');","nav54('approvals63','Aprobaciones comerciales');nav54('order-report64','Reporte por producto y lote');");
 s=patch(s,"if(view==='approvals63'){renderApprovalReview63();return;}","if(view==='order-report64'){renderOrderReport64();return;}if(view==='approvals63'){renderApprovalReview63();return;}");
 s=patch(s,' function cartLine63(form,offer) {',read('customer-browser.js')+'\n function cartLine63(form,offer) {');
 s=patch(s,"${label('customer','Cliente','text',draft.customer,'required')}","${customerFields64(draft)}");
 s=patch(s,"const form=$('catalogue54-form');if(catalogueDraft54){catalogueDraft54.customer=form.elements.customer.value;catalogueDraft54.zone=form.elements.zone.value;",
  "const form=$('catalogue54-form');if(catalogueDraft54){readCustomer64(form,catalogueDraft54);");
 s=s.replaceAll('d.customer=form.elements.customer.value;d.zone=form.elements.zone.value;','readCustomer64(form,d);');
 s=patch(s,' const adjustment62=readAdjustment62(form);',' bindCustomer64(command62,d);const adjustment62=readAdjustment62(form);');
 s=patch(s,'const {type,offerId,...proposal}=order;','const {type,offerId,...proposal}=bindCustomer64(order,d);');
 s=patch(s,'el.value=draft.selected[i];if(cartRows63(draft).length)el.required=false;});',
  "el.value=draft.selected[i];if(cartRows63(draft).length)el.required=false;});$('catalogue54-form').elements.previousOrder.value=draft.previousOrder||'';");
 return s;
}
for(const key of ['/entry.mjs','/approved-app.js'])assets[key]=installCustomer64(installApproval63(installCart63(assets[key])));
let entry=assets['/entry.mjs'];
entry=patch(entry,"method:'POST',credentials:'omit',cache:'no-store',signal:controller.signal,", "method:'POST',credentials:'same-origin',cache:'no-store',signal:controller.signal,");
entry=patch(entry,"authorization:'Bearer '+token,...(fault?", "...(token===COOKIE_MODE63?{}:{authorization:'Bearer '+token}),...(fault?");
entry=patch(entry,"const session=createSession({send:", "const COOKIE_MODE63='CV_COOKIE_SESSION';\nconst session=createSession({send:");
entry=patch(entry,"$('logout5d').onclick=()=>{loginFlow.invalidate();session.logout();google.accounts.id.disableAutoSelect();location.reload();};",
 `$('logout5d').onclick=async()=>{const button=$('logout5d');button.disabled=true;
  try{await sessionRequest63('sessionEnd63');loginFlow.invalidate();session.logout();window.google?.accounts.id.disableAutoSelect();location.reload();}
  catch{noticeLogout63('No se confirmó el cierre. Conéctate y vuelve a intentarlo.');button.disabled=false;}
 };`);
entry=patch(entry,"function login(response){return loginFlow.run(response.credential);}",read('browser.js'));
entry=patch(entry,"  await new Promise((resolve,reject)=>{const script=document.createElement('script');", "  if(await loginFlow.run(COOKIE_MODE63))return;\n  await new Promise((resolve,reject)=>{const script=document.createElement('script');");
entry=patch(entry,"ajustes-62 · Backend requiere paquete de ajustes","cierre-66.3 · Backend de laboratorio");
const checked=spawnSync(process.execPath,['--input-type=module','--check'],{input:entry,encoding:'utf8'});
if(checked.status!==0)throw Error(checked.stderr);
assets['/entry.mjs']=entry;
// /approved-app.js contains the mounted catalogue UI and its build label.
assets['/approved-app.js']=patch(assets['/approved-app.js'],"ajustes-62 · Backend requiere paquete de ajustes","cierre-66.3 · Backend de laboratorio");
assets['/backup54.mjs']=read('../backup54.mjs');
const backupStart='const CV54Phone=(()=>{',backupEnd='return {encryptArchive54};})();';
const embeddedBackup=assets['/entry.mjs'].match(/const CV54Phone=\(\(\)=>\{[\s\S]*?return \{encryptArchive54\};\}\)\(\);/);
if(!embeddedBackup)throw Error('EMBEDDED_BACKUP_BOUNDARY');
assets['/entry.mjs']=patch(assets['/entry.mjs'],embeddedBackup[0],
 backupStart+assets['/backup54.mjs'].replace(/^export /gm,'')+'\n'+backupEnd);
assets['/session.mjs']=patch(assets['/session.mjs'],'    return {...identity};','    return {...identity,capabilities:boot.capabilities};');
for(const key of ['/entry.mjs','/login-flow.mjs']){
 assets[key]=patch(assets[key], "        const boot=await session.invoke('bootstrap',null);if(!current())return false;\n        const actor={...identity,capabilities:boot.capabilities};", '        const actor=identity;');
}
const worker=prefix+JSON.stringify(assets)+workerBase.slice(end);
const syntax=spawnSync(process.execPath,['--input-type=module','--check'],{input:worker,encoding:'utf8'});
if(syntax.status!==0)throw Error(syntax.stderr);
const output=path.join(__dirname,'build');
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'Candidate.gs'),backend);
fs.writeFileSync(path.join(output,'worker-bundle.mjs'),worker);
const manifest={environment:'TEST_ONLY',baseBackend:7,baseWorker:'52a8512a',backendSha256:hash(backend),workerSha256:hash(worker),deployed:false};
fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(manifest);
