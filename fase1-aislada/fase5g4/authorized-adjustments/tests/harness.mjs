import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {setup,ledger} from '../../../fase5g/tests/harness.mjs';import {fixture} from '../../../fase5g2/tests/fixture.mjs';
const require=createRequire(import.meta.url),{canonical}=require('../../../fase3/journal.js');
export const tabs=['TEST_ONLY_5G3_Diario','TEST_ONLY_5G3_Movimientos','TEST_ONLY_5G3_Verificaciones'];
export function sandbox({enabled=true,created=true,fixtureOptions={},serverNow='2026-11-01T05:00:00.000Z'}={}){
 const code=fs.readFileSync(new URL('../build/Candidate.gs',import.meta.url),'utf8'),f=setup(code),local=fixture(fixtureOptions);
 if(created)for(const name of tabs)f.f.tabs[name]=[['ID','Tipo','JSON']];
 // El mock anterior limita append a sus siete pestañas. Ampliación solo del fixture,
 // conservando la prueba de bloqueo y registrando cada escritura nueva.
 let locked=false;const oldLock=f.c.LockService.getScriptLock;
 f.c.LockService.getScriptLock=()=>{const l=oldLock();return {waitLock(n){l.waitLock(n);locked=true},releaseLock(){locked=false;l.releaseLock()}}};
 const open=f.c.SpreadsheetApp.openById;
 f.c.SpreadsheetApp.openById=id=>{const book=open(id);return {...book,getSheetByName(name){const sh=book.getSheetByName(name);if(!sh||!tabs.includes(name))return sh;return {...sh,appendRow(row){assert.equal(locked,true);assert.equal(row.length,3);f.f.tabs[name].push(structuredClone(row));f.f.writes.push(name);return this;}}}}};
 f.f.properties.CV_5G3_SCOPE_ENABLED=enabled?'YES':'NO';f.f.properties.CV_5G3_CONTINUITY_CONFIG=JSON.stringify(local.config);
 const fixed=Date.parse(serverNow);f.c.Date=class extends Date{constructor(...args){super(...(args.length?args:[fixed]))}static now(){return fixed}};
 f.c.Utilities.Charset={UTF_8:'UTF-8'};f.c.Utilities.DigestAlgorithm={SHA_256:'sha256'};f.c.Utilities.computeDigest=(_,x)=>[...crypto.createHash('sha256').update(x).digest()];
 const envelope=(action,payload,subject='111111')=>{const request={version:2,destination:'TEST_ONLY_ZERO_1',subject:'google:'+subject,issuedAt:fixed,expiresAt:fixed+20000,requestId:crypto.randomUUID(),action,payload};return {request,mac:crypto.createHmac('sha256',f.secret).update(canonical(request)).digest('base64')};};
 f.c.ContentService={MimeType:{JSON:'JSON'},createTextOutput:text=>({text,setMimeType(){return this}})};
 const call=(action,payload,subject)=>JSON.parse(f.c.doPost({postData:{contents:JSON.stringify(envelope(action,payload,subject))}}).text);
 const scope=p=>({...structuredClone(p),continuityScope:'TEST_ONLY_CONTINUITY_5G3',...(p.operationId?{operationId:p.operationId.replace('TEST_ONLY_5G2_','TEST_ONLY_5G3_')}: {})});
 const scopedLedger=()=>({journal:f.f.tabs[tabs[0]].slice(1).map(r=>JSON.parse(r[2])),effects:f.f.tabs[tabs[1]].slice(1).map(r=>JSON.parse(r[2]))});
 return {f,local,call,scope,envelope,scopedLedger,oldLedger:()=>ledger(f)};
}
