import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import vm from 'node:vm';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),base=path.resolve(root,'../fase5g');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
let backend=read('build/Candidate.gs'),worker=read('patches-ui/build/worker-bundle.mjs');
if(sha(backend)!=='0a64a97eabf93224e407de9f491c4b8c757d5742edb7ad1db5f42d0e8b8df604'||sha(worker)!=='b350fe05fadd3cdc72b7b8c17637674bbc53fe84bde462dd19f47941dc5b1676')throw Error('SOURCE_HASH_MISMATCH');
backend=backend.replaceAll('1CtK6KD995Pu2Fzc_na89Ajc0KQ0QLuGq3UFhj4UdLSA','1d-DLDxHdOBRJMT9JFtATNuvStu3NCw9qVtw3y8xJSGo').replaceAll('1m79GZ0TkADVZuji4E1XFnPmdMCAHCWI-FRZvawkx9vGnxzmao0NfPki3','1Cd6xNhxaLwbtzP50-amfkBlYizFmoG0ifR4X6ZyB9KFGfiEYKTTErgLC').replaceAll('CasaVieja_Pruebas_SINTETICA','CasaVieja_RECUPERACION_TEST_ONLY_5G').replaceAll('TEST_ONLY_ZERO_1','TEST_ONLY_DR_5G1');
backend+='\n'+fs.readFileSync(path.join(root,'restore.gs'),'utf8');new vm.Script(backend);
worker=worker.replaceAll('TEST_ONLY_ZERO_1','TEST_ONLY_DR_5G1');
worker=worker.replace("'configure','dashboard']","'configure','dashboard','recover']");
const match=worker.match(/const assets=(\{.*?\});\n/s);if(!match)throw Error('ASSETS_NOT_FOUND');
const assets=JSON.parse(match[1]);
assets['/entry.mjs']=assets['/entry.mjs'].replace('command = {...structuredClone(payload), operationId:',"command = {...structuredClone(payload), recoveryScope:'TEST_ONLY_DR_5G1', operationId:");
assets['/entry.mjs']=assets['/entry.mjs'].replace("'epoch','schemaVersion'].includes(k)","'epoch','schemaVersion','recoveryScope'].includes(k)");
assets['/client.js']=assets['/client.js'].replace('Object.assign({},copy(payload),{operationId:',"Object.assign({},copy(payload),{recoveryScope:'TEST_ONLY_DR_5G1',operationId:");
for(const k of ['/index.html','/'])assets[k]=assets[k].replace('Acceso al laboratorio','Recuperación aislada · TEST_ONLY').replace('Control de operaciones','Recuperación 5G.1');
// El client ID es público; la audiencia aprobada sigue verificándose en el Worker.
assets['/config.json']=JSON.stringify({...JSON.parse(assets['/config.json']),recoveryDestination:'TEST_ONLY_DR_5G1'});
assets['/entry.mjs']+=`\n// Panel exclusivo del destino DR. No importa ni transforma colas de otros orígenes.
const drPanel=document.createElement('details');drPanel.className='card';
drPanel.innerHTML='<summary>Recuperación aislada 5G.1</summary><p>Solo operationId del archivo sintético autorizado. Se conserva la identidad original.</p><label>Identificador de operación<input id="dr-operation-id" autocomplete="off"></label><button type="button" id="dr-check">Consultar recibo</button><button type="button" id="dr-recover">Recuperar PREPARED</button><pre id="dr-output" role="status"></pre>';
document.querySelector('main').append(drPanel);
for(const action of ['check','recover'])document.getElementById('dr-'+action).onclick=async()=>{
 const output=document.getElementById('dr-output'),id=document.getElementById('dr-operation-id').value.trim();
 try{if(!/^[a-zA-Z0-9:_-]{1,120}$/.test(id))throw Error('INVALID_ID');const actor=session.current();if(!actor)throw Error('REAUTHENTICATION_REQUIRED');
 const durable=new CVClient.IndexedStore('CV_DR_RECOVERY_5G1_'+actor.subject);const before=await session.invoke('status',id);
 if(!['PREPARED','COMMITTED','REJECTED'].includes(before.state))throw Error(before.error||'UNKNOWN_REQUIRES_REVIEW');
 if(action==='recover'){await durable.transact(s=>{s.drPending={operationId:id,subject:actor.subject,destination:'TEST_ONLY_DR_5G1'};});}
 const result=action==='check'?before:await session.invoke('recover',{operationId:id,destination:'TEST_ONLY_DR_5G1'});
 if(result.state==='COMMITTED'||result.state==='REJECTED')await durable.transact(s=>{s.receipts[id]=result;if(s.drPending?.operationId===id)delete s.drPending;});
 output.textContent=JSON.stringify(result,null,2);
 }catch(e){output.textContent=e.message+' · conserva el mismo operationId; no repitas la venta';}
};\n`;
worker=worker.replace(match[0],'const assets='+JSON.stringify(assets)+';\n');
// Guardas adicionales incluso si se introduce por error una variable de otro laboratorio.
worker=worker.replace('if(url.pathname===\'/api\')return apiWorker.fetch(request,env);',`if(url.origin!=='https://casa-vieja-dr-test-only-5g.portopelaez1009.workers.dev')return new Response('WRONG_ORIGIN',{status:403});if(env.DR_RELEASE_ENABLED!=='YES')return new Response('RECOVERY_NOT_CONFIGURED',{status:403});if(url.pathname==='/api'){if(env.FRONTEND_ORIGIN!==url.origin||env.DR_BACKEND_APPROVED!=='YES')return new Response('WRONG_DESTINATION',{status:403});return apiWorker.fetch(request,env);}`);
const out=path.join(root,'build');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'Candidate.gs'),backend);fs.writeFileSync(path.join(out,'worker-bundle.mjs'),worker);
const schema={environment:'TEST_ONLY',destination:'TEST_ONLY_DR_5G1',tabs:{Control:{B3:'TEST_ONLY'},RestoreInput:['archiveChunk'],DiarioInventarioV3:['ID','Tipo','JSON'],MovimientosInventarioV3:['ID','Tipo','JSON'],VerificacionesInventarioV3:['ID','Tipo','JSON']},properties:{ZERO_LAB_ENABLED:'NO until verified restoration',ZERO_APPROVED_SCRIPT_ID:'exact DR script',DR_ARCHIVE_SHA256:'independent catalogue hash',DR_RESTORE_STATE:'INCOMPLETE -> COMPLETE',ZERO_GATEWAY_SECRET:'OWNER_ENTRY_ONLY_NEW_SECRET',ZERO_USER_n:'private verified test identities',ZERO_POLICY_n:'versioned synthetic rules'},publicMaintenance:false};
fs.writeFileSync(path.join(out,'schema.json'),JSON.stringify(schema,null,2)+'\n');
const manifest={environment:'TEST_ONLY',status:'LOCAL_PREPARED_NOT_AUTHORIZED_FOR_DEPLOYMENT',sourceCommit:'4731cabf36eb8471b0c25354a75f47f879f9d583',destination:'TEST_ONLY_DR_5G1',workerName:'casa-vieja-dr-test-only-5g',workerOrigin:'https://casa-vieja-dr-test-only-5g.portopelaez1009.workers.dev',scriptName:'CasaVieja_DR_TEST_ONLY_5G',sheetName:'CasaVieja_RECUPERACION_TEST_ONLY_5G',monthlyAdditionalCostPEN:0,productionReady:false,files:Object.fromEntries(['Candidate.gs','worker-bundle.mjs','schema.json'].map(n=>[n,sha(fs.readFileSync(path.join(out,n)))])),endpointNotYetCreated:true,remoteRestorationExecuted:false};
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest));
