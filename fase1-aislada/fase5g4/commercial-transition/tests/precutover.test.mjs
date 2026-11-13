import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyCommercialPrecutover,rejectPrecutoverWrite} from '../precutover-core.mjs';
import fs from 'node:fs';

const control=[['Campo','Valor'],['Entorno','COMMERCIAL_PRE_CUTOVER'],['Estado','CARGADO_SIN_VENTAS_NUEVAS'],['Ventas nuevas habilitadas','NO'],['Escritor de stock autorizado','SISTEMA_ANTIGUO'],['Fuente antigua','SOLO_LECTURA'],['Ventas legado',328],['Movimientos solo auditoría',430]];
const opening=[['state','poolId','grams','unitCostPerKg','historicalSalesAlreadyDeducted'],['PREPARED_NOT_ACTIVE','CASA_VIEJA_COMMON_BLEND_2026_11',139500,36.35,true]];
const counts={sales:328,movements:430,expenses:17,ads:103};

test('verifica el destino separado sin habilitar ventas',()=>{
 const result=verifyCommercialPrecutover({control,opening,counts});
 assert.equal(result.status,'VERIFIED_READ_ONLY');
 assert.equal(result.newSalesEnabled,false);
 assert.equal(result.stockWriter,'OLD_SYSTEM_ONLY');
 assert.equal(result.opening.grams,139500);
});

test('rechaza cualquier escritura antes del corte',()=>{
 assert.deepEqual(rejectPrecutoverWrite(),{error:'CUTOVER_NOT_APPROVED',retryable:false,newSalesEnabled:false});
});

test('bloquea activar ventas mientras el sistema antiguo escribe',()=>{
 const changed=structuredClone(control);
 changed.find(row=>row[0]==='Ventas nuevas habilitadas')[1]='SI';
 assert.throws(()=>verifyCommercialPrecutover({control:changed,opening,counts}),/SALES_MUST_REMAIN_DISABLED/);
});

test('bloquea una apertura alterada',()=>{
 const changed=structuredClone(opening);changed[1][2]=139499;
 assert.throws(()=>verifyCommercialPrecutover({control,opening:changed,counts}),/OPENING_GRAMS_MISMATCH/);
});

test('el código versionado no expone el identificador de la hoja comercial',()=>{
 const source=fs.readFileSync(new URL('../CommercialPrecutover.gs',import.meta.url),'utf8');
 assert.doesNotMatch(source,/1dYnBH6EGHKHJpbc_Ktsc1ZnVEDyIxyg3sYDB_PTE6ew/);
 assert.match(source,/CV_COMMERCIAL_SHEET_ID/);
});
