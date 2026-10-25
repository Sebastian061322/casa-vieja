import fs from 'node:fs';import {archiveFixture} from './fixture.mjs';
const dir=new URL('private/',import.meta.url);fs.mkdirSync(dir,{recursive:true,mode:0o700});
const subjects=JSON.parse(fs.readFileSync(new URL('verified-lab-subjects.json',dir),'utf8'));
const {archive,lost,pending,rejected}=await archiveFixture(subjects);
// Datos totalmente ficticios; solo los subjects de cuentas de laboratorio verificadas son privados.
const target=new URL('archive.json',dir);fs.writeFileSync(target,JSON.stringify(archive),{mode:0o600,flag:'wx'});
const catalogue={environment:'TEST_ONLY',archiveSha256:archive.sha256,syntheticData:true,containsVerifiedTestSubjectIds:true,containsCredentials:false,sourceIsProduction:false,sourceIsLiveLabSnapshot:false,sourceDescription:'New local synthetic rehearsal, built with unchanged 5G engine and verified test subjects before any remote writes',journalRows:archive.payload.sections.ledger.journal.length,movements:archive.payload.sections.ledger.effects.length,lostOperationId:lost.operationId,preparedOperationId:pending.operationId,rejectedOperationId:rejected.operationId,policyStatus:'DRAFT',createdAt:archive.payload.createdAt};
fs.writeFileSync(new URL('catalogue.json',dir),JSON.stringify(catalogue,null,2)+'\n',{mode:0o600,flag:'wx'});
console.log(JSON.stringify({archiveSha256:archive.sha256,journalRows:catalogue.journalRows,movements:catalogue.movements,private:true,remoteWrites:false}));
