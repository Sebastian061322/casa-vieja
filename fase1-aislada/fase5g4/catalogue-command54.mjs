import {prepareCustomer} from '../fase5d/web/customer.mjs';
export function catalogueCommand54(draft,selected,version,profile){
 if(!Array.isArray(selected)||!selected.length||selected.some(id=>!id))throw Error('SELECTION_REQUIRED');
 const quantities={};for(const id of selected)quantities[id]=(quantities[id]||0)+1;
 return {type:'REGISTER_SALE',saleId:draft.saleId,catalogueOfferId:draft.offerId,catalogueVersion:version,packs:draft.packs,selections:Object.entries(quantities).map(([resourceId,quantity])=>({resourceId,quantity})),customer:prepareCustomer({customer:draft.customer,zone:draft.zone},profile),channel:draft.channel};
}
