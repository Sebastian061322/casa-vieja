import assert from 'node:assert/strict';import {setup,receive,process} from './harness.mjs';
export async function prepared(){const f=setup();await receive(f,10000);for(const c of [process(f,'MILL','demo:5g-pergamino','demo:5g-verde',10000,8000,2000,100),process(f,'ROAST','demo:5g-verde','demo:5g-tostado',8000,7000,1000,200),process(f,'GRIND','demo:5g-tostado','demo:5g-molido',4000,4000,0,100)])assert.equal((await f.call('execute',c)).state,'COMMITTED');
 for(const [resourceId,out,grams,bags,grind]of [['demo:5g-molido','demo:5g-pack500',500,8,'molido'],['demo:5g-tostado','demo:5g-pack250',250,8,'grano']])assert.equal((await f.call('execute',f.cmd('PREPARE_BAGS',{resourceId,outputResourceId:out,bagGrams:grams,bags,grind,wasteGrams:0,processingCents:0,materials:[{resourceId:'demo:commercial-bag'+grams},{resourceId:'demo:commercial-label'}],documentRef:'TEST_ONLY_'+out}))).state,'COMMITTED');
 return f;
}
export const single={offerId:'demo:single',offerVersion:1,resourceId:'demo:5g-pack500',quantity:1};export const grain={offerId:'demo:grain',offerVersion:1,resourceId:'demo:5g-pack250',quantity:1};
export function sale(f,items=[single]){return f.cmd('REGISTER_SALE',{items,customer:{name:'TEST_ONLY_5G_ORDER',zone:'Zona ficticia'},channel:'WhatsApp'});}
