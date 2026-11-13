import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {prepareCommercialMigration,applyMigrationInMemory} from '../migration.mjs';

const privatePackage=new URL('../../../../../private/commercial-opening-november/migracion-julio-noviembre.json',import.meta.url);
const fixtureRows=(section,count)=>Array.from({length:count},(_,index)=>({sourceRef:`legacy:synthetic:${section}:${index}`,id:`${section}-${index}`}));
const synthetic=()=>({
 status:'PREPARED_NOT_IMPORTED',source:{sourceUnchanged:true,workbookSha256:'a'.repeat(64)},
 policy:{historicalRowsImmutable:true,historicalInventoryEffects:false,oldSystemRemainsActive:true,noDualStockWritersBeforeCutover:true},
 opening:{poolId:'CASA_VIEJA_COMMON_BLEND_2026_11',asOf:'2026-11-01',operationalOpeningKg:200,novemberConsumedKg:60.5,availableKgAtSourceSnapshot:139.5,lot:'Lote-09',sharedAcrossCommercialFamilies:true},
 costPolicy:{coffeePerKg:36.35},sales:fixtureRows('Ventas',328),expenses:fixtureRows('Egresos',17),ads:fixtureRows('Ads',103),movementsAuditOnly:fixtureRows('Movimientos',430)
});
const load=()=>fs.existsSync(privatePackage)?JSON.parse(fs.readFileSync(privatePackage,'utf8')):synthetic();

test('prepara historia sin efectos de stock y una apertura neta',()=>{
 const plan=prepareCommercialMigration(load());
 assert.equal(plan.guards.oldSystemActive,true);
 assert.equal(plan.guards.newSalesEnabled,false);
 assert.equal(plan.events.filter(event=>event.kind==='LEGACY_SALE_IMPORTED').length,328);
 assert.equal(plan.events.filter(event=>event.kind==='COMMERCIAL_INVENTORY_OPENED').length,1);
 assert(plan.events.filter(event=>event.kind.startsWith('LEGACY_')).every(event=>event.inventoryEffects===false));
 assert.equal(plan.events.find(event=>event.kind==='COMMERCIAL_INVENTORY_OPENED').grams,139500);
});
test('reanuda una importación interrumpida sin duplicar',()=>{
 const plan=prepareCommercialMigration(load());
 const first=applyMigrationInMemory(null,plan,{interruptAfter:41});
 assert.equal(first.status,'INCOMPLETE');
 const second=applyMigrationInMemory(first.state,plan);
 assert.equal(second.status,'COMPLETE');
 assert.equal(new Set(second.state.events.map(event=>event.sourceRef)).size,second.state.events.length);
 const third=applyMigrationInMemory(second.state,plan);
 assert.equal(third.applied,0);
 assert.equal(third.state.events.length,second.state.events.length);
});

test('reimportar con sourceRefs existentes no genera eventos repetidos',()=>{
 const source=load(),first=prepareCommercialMigration(source);
 const second=prepareCommercialMigration(source,{existingSourceRefs:first.events.map(event=>event.sourceRef)});
 assert.equal(second.events.length,0);
 assert.equal(second.skipped.length,first.events.length);
});
