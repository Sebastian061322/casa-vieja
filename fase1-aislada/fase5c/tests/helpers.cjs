const {setup,now,clone}=require('../../fase4/tests/helpers.cjs'),A=require('../access.js');
const bindings={'google:111111':{role:'administrator',active:true},'google:222222':{role:'sales',active:true},'google:333333':{role:'sales',active:true},'google:444444':{role:'inventory',active:true}};
const policy={shippingByZone:{'Zona sintética':{costCents:500,chargedCents:700}},preparationByGrams:{500:{processingPerBagCents:100}}};
function fixture(){const f=setup();return {...f,actor:sub=>A.principal(sub,bindings),engine:(sub,hook)=>new A.Engine(f.store,undefined,hook,{actor:A.principal(sub,bindings),policy,now:()=>now}),sale:extra=>clone(f.sale({deliveryCostCents:undefined,deliveryChargedCents:undefined,customer:{name:'DEMO 5C',phone:'999000111',zone:'Zona sintética'},...extra}))};}
module.exports={fixture,bindings,policy,now,clone,A};
