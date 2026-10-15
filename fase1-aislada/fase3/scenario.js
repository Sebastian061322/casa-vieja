/* Receta de ensayo con datos ficticios, repetible con prefijo distinto. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CVScenario=api;})(typeof globalThis==='object'?globalThis:this,function(){
function commands(run){
 const key=n=>'demo:'+run+'-'+n,entity=n=>'future:'+run+'-'+n;let seq=0;
 const c=(name,type,data={})=>({epoch:'TEST_ONLY_V3',schemaVersion:2,operationId:run+'-'+(++seq),deviceId:'scenario-device',saleId:entity(name),type,date:'2026-10-15T12:00:00.000Z',responsible:'Responsable ficticio',...data});
 const mats=size=>[{resourceId:key('bag'+size)},{resourceId:key('label')}];
 return [
 c('lot','RECEIVE_LOT',{lotId:key('lot'),resourceId:key('parchment'),family:'Gourmet',origin:'Origen sintético',coffeeType:'Typica demo',grams:10000,acquisitionCents:20000,processingCents:1000}),
 c('special','RECEIVE_LOT',{lotId:key('special'),resourceId:key('special-parchment'),family:'Especialidad',origin:'Otro origen ficticio',coffeeType:'Caturra demo',grams:1000,acquisitionCents:4000,processingCents:0}),
 ...[250,500].map(size=>c('bag'+size,'RECEIVE_SUPPLY',{resourceId:key('bag'+size),lotId:key('supplies'),supplyKind:'BAG'+size,qty:30,totalCostCents:3000})),
 c('label','RECEIVE_SUPPLY',{resourceId:key('label'),lotId:key('labels'),supplyKind:'LABEL',qty:60,totalCostCents:600}),
 c('roast','ROAST',{resourceId:key('parchment'),outputResourceId:key('bulk'),outputGrams:8000,wasteGrams:2000,processingCents:3000}),
 c('prep500','PREPARE_BAGS',{resourceId:key('bulk'),outputResourceId:key('molido500'),bagGrams:500,grind:'molido',bags:6,wasteGrams:50,processingCents:600,materials:mats(500)}),
 c('prep250','PREPARE_BAGS',{resourceId:key('bulk'),outputResourceId:key('grano250'),bagGrams:250,grind:'grano',bags:8,wasteGrams:25,processingCents:400,materials:mats(250)}),
 c('reserve','RESERVE_SALE',{lines:[{resourceId:key('molido500'),qty:1}],totalCents:3300}),
 c('reserve','CANCEL_SALE',{expectedSaleVersion:1,reason:'Fin de reserva ficticia'}),
 c('tripack','REGISTER_SALE',{lines:[{resourceId:key('molido500'),qty:3},{resourceId:key('grano250'),qty:2}],totalCents:14000}),
 c('tripack','EDIT_SALE',{expectedSaleVersion:1,metadata:{customer:'Contacto demo editado'}}),
 c('tripack','PAY_SALE',{expectedSaleVersion:2}),
 c('tripack','DISPATCH_SALE',{expectedSaleVersion:3}),
 c('tripack','DELIVER_SALE',{expectedSaleVersion:4}),
 c('tripack','RETURN_SALE',{expectedSaleVersion:5,lines:[{resourceId:key('molido500'),qty:1}],reason:'Recepción física ficticia parcial'}),
 c('tripack','RETURN_SALE',{expectedSaleVersion:6,lines:[{resourceId:key('molido500'),qty:2},{resourceId:key('grano250'),qty:2}],reason:'Recepción física ficticia restante'}),
 c('waste','WASTE',{resourceId:key('bulk'),qty:10,reason:'Merma ficticia registrada'})
 ];
}
return {commands};});
