import fs from 'node:fs';import vm from 'node:vm';import {context} from '../../fase5d/tests/fixture.mjs';
export const root=new URL('../',import.meta.url),source=fs.readFileSync(new URL('build/Candidate.gs',root),'utf8');
export function setup(code=source){const f=context();const scriptId=JSON.parse(code.match(/const CV_TEST_SCRIPT_ID_ = ('[^']+'|"[^"]+");/)[1].replaceAll("'",'"'));f.f.properties.ZERO_APPROVED_SCRIPT_ID=scriptId;f.f.properties.ZERO_LAB_ENABLED='YES';
 const c=vm.createContext(Object.fromEntries(['SpreadsheetApp','LockService','Session','PropertiesService','Utilities'].map(k=>[k,f.c[k]])));c.ScriptApp={getScriptId:()=>scriptId};c.console={log(){}};vm.runInContext(code,c);let n=0;
 const cmd=(type,extra={})=>({schemaVersion:2,commercialVersion:4,epoch:'TEST_ONLY_V3',operationId:'TEST_ONLY_5G_'+(++n),deviceId:'TEST_ONLY_5G_DEVICE',saleId:'future:TEST_ONLY_5G_'+n,date:'2026-10-23T15:00:00.000Z',responsible:'ignored browser value',type,...extra});
 const call=async(action,payload,subject='111111')=>c.zeroRequest(await f.sign(subject,action,payload));
 return {...f,c,cmd,call};
}
export function ledger(f){return {journal:f.f.tabs.DiarioInventarioV3.slice(1).map(r=>JSON.parse(r[2])),effects:f.f.tabs.MovimientosInventarioV3.slice(1).map(r=>JSON.parse(r[2]))};}
export async function receive(f,grams=300000){const command=f.cmd('RECEIVE_LOT',{resourceId:'demo:5g-pergamino',lotId:'demo:5g-lot',family:'Gourmet',origin:'TEST_ONLY_FICTITIOUS_ORIGIN',coffeeType:'TEST_ONLY',producer:'TEST_ONLY_SUPPLIER',grams,acquisitionCents:900000,freightCents:10000,processingCents:0,documentRef:'TEST_ONLY_RECEIPT'});const result=await f.call('execute',command);if(result.state!=='COMMITTED')throw Error(result.error);return command;}
export function process(f,type,resourceId,outputResourceId,inputGrams,outputGrams,wasteGrams,processingCents=0){return f.cmd(type,{resourceId,outputResourceId,inputGrams,outputGrams,wasteGrams,processingCents,documentRef:'TEST_ONLY_'+outputResourceId});}
