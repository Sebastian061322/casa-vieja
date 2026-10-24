/* Se monta dentro de la interfaz existente. No modifica precios, borradores o recibos. */
const oldOperation5g=operation;
operation=function(type,id){
 if(type==='RECEIVE_LOT'){const result=oldOperation5g(type,id);for(const name of ['grams','acquisition','freight','processing','name','origin','producer','coffeeType','documentRef']){const field=$('dialog-form').elements[name];if(field)field.value='';}const family=$('dialog-form').elements.family;family.insertAdjacentHTML('afterbegin','<option value="">Selecciona clasificación confirmada</option>');family.value='';family.required=true;$('dialog-form').elements.producer.required=true;return result;}
 if(!['MILL','ROAST','GRIND','PREPARE_BAGS'].includes(type))return oldOperation5g(type,id);
 if(!actor.capabilities.includes(type)){notice('Operación no autorizada para tu perfil.');return;}
 const unique=uuid(),saleId='future:'+unique,doc=label('documentRef','Referencia del proceso ficticio','text','','required');
 if(type==='PREPARE_BAGS'){
  const html=select('resourceId','Tostado con molienda registrada',resourceOptions(r=>r.stage==='BULK'&&['grano','molido'].includes(r.grind)&&r.qty>0))+select('grams','Gramaje',option(250,'250 g')+option(500,'500 g'))+label('bags','Bolsas preparadas','number','','min="1" required')+label('waste','Merma pesada (g)','number','','min="0" required')+select('bagId','Empaques de la presentación',resourceOptions(r=>r.stage==='SUPPLY'&&r.supplyKind!=='LABEL'))+select('labelId','Etiquetas',resourceOptions(r=>r.supplyKind==='LABEL'))+label('processing','Costo autorizado de preparación (S/)','number','','min="0" step="0.01" required')+doc;
  return openDialog('Preparar bolsas · solo laboratorio',html,f=>send({type,saleId,resourceId:f.resourceId,outputResourceId:'demo:packaged-'+unique,bagGrams:numInput(f.grams),grind:snapshot.resources[f.resourceId]?.grind,bags:numInput(f.bags,1),wasteGrams:numInput(f.waste),processingCents:cents(f.processing),materials:[{resourceId:f.bagId},{resourceId:f.labelId}],documentRef:f.documentRef}));
 }
 const from={MILL:'PARCHMENT',ROAST:'GREEN',GRIND:'BULK'}[type],title={MILL:'Pilado',ROAST:'Tostado',GRIND:'Molienda'}[type];
 const html='<p>Solo datos ficticios del ensayo. Ingresa pesos observados; no se presupone rendimiento.</p>'+select('resourceId','Lote y etapa de origen',resourceOptions(r=>r.stage===from&&(type!=='GRIND'||r.grind==='grano')&&r.qty>0))+label('input','Peso procesado (g)','number','','min="1" required')+label('output','Peso obtenido (g)','number','','min="1" required')+label('waste','Merma pesada (g)','number','','min="0" required')+label('cost','Costo autorizado del proceso (S/)','number','','min="0" step="0.01" required')+doc;
 return openDialog(title+' · solo laboratorio',html,f=>send({type,saleId,resourceId:f.resourceId,outputResourceId:'demo:process-'+unique,inputGrams:numInput(f.input,1),outputGrams:numInput(f.output,1),wasteGrams:numInput(f.waste),processingCents:cents(f.cost),documentRef:f.documentRef}));
};
const oldRender5g=render;
render=function(){const result=oldRender5g();if(view==='lots'&&actor.profile!=='seller'&&!$('process5g')){
 const box=document.createElement('div');box.id='process5g';box.className='card cv-card-gap';box.innerHTML='<h3>Procesamiento por etapa · laboratorio</h3><p>Pergamino → pilado / café verde → tostado en grano → molienda opcional → bolsas. Los 300 kg previstos no son existencias registradas.</p><div class="cv-toolbar"><button class="btn secondary" data-operation="MILL">Registrar pilado</button><button class="btn secondary" data-operation="GRIND">Registrar molienda</button></div>';$('lots').prepend(box);
 }
 if(view==='inventory'&&$('inventory-filter')&&!$('inventory-filter').elements.stage.querySelector('option[value="GREEN"]'))$('inventory-filter').elements.stage.insertAdjacentHTML('beforeend','<option value="GREEN">Café verde / pilado</option>');
 applyPolicyUI5g();
 return result;
};
const oldExplain5g=explain;
explain=function(error){const code=error?.message||error;return ({MASS_BALANCE_REQUIRED:'El peso procesado debe ser igual al obtenido más la merma.',INVALID_STAGE:'La etapa de origen no corresponde a este proceso. Revisa el pilado o la molienda.',GRIND_STAGE_MISMATCH:'La molienda debe registrarse antes de preparar estas bolsas.',PROCESS_STAGE_REQUIRED:'Esta partida necesita etapa y molienda verificadas antes de prepararse.',POLICY_APPROVAL_REQUIRED:'Esta operación permanece deshabilitada hasta aprobar su política.',OTHER_ORIGINS_REVIEW_REQUIRED:'Antes de registrar, revisa las colas del laboratorio y marca la casilla situada encima de Sincronizar.'})[code]||oldExplain5g(error);};

function applyPolicyUI5g(){
 if($('discount-panel'))$('discount-panel').hidden=true;
 if($('discount-form')?.closest('details'))$('discount-form').closest('details').hidden=true;
 document.querySelectorAll('[data-view="ads"],[data-home-view="ads"]').forEach(b=>b.hidden=true);
 document.querySelectorAll('[data-action="RETURN_SALE"],[data-action="CANCEL_SALE"],[data-operation="WASTE"],[data-operation="AUTHORIZE_DISCOUNT"]').forEach(b=>{b.disabled=true;b.title='Política comercial pendiente de aprobación';});
}
applyPolicyUI5g();
const oldDrawHome5g=drawHome;
drawHome=function(){const result=oldDrawHome5g();applyPolicyUI5g();return result;};
