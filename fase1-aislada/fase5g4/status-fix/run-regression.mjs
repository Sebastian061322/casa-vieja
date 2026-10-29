// Copia temporal sin private/evidencias. No modifica ni reconstruye fases originales.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';import crypto from 'node:crypto';
const root=path.dirname(fileURLToPath(import.meta.url)),lab=path.resolve(root,'../..');
const shadow=fs.mkdtempSync(path.join(os.tmpdir(),'cv5g4-catalogue-fix-'));
fs.cpSync(lab,shadow,{recursive:true,filter:p=>!p.split(path.sep).some(x=>['private','evidencia-local','outputs','.git'].includes(x))&&!/\.(png|jpg|pdf)$/.test(p)});
const seed=spawnSync(process.execPath,[path.join(shadow,'fase5e/build.cjs')],{encoding:'utf8'});if(seed.status!==0)throw Error(seed.stderr||seed.stdout);
fs.copyFileSync(path.join(shadow,'fase5g/patches-ui/build/worker-bundle.mjs'),path.join(shadow,'fase5g/build/worker-bundle.mjs'));
const tests=fs.readdirSync(shadow,{recursive:true}).filter(p=>/\.test\.(cjs|mjs)$/.test(p)||/(^|\/)acceptance\.cjs$/.test(p)||p==='fase5g1/tests.mjs').sort().map(p=>path.join(shadow,p));
const run=spawnSync(process.execPath,['--require',path.join(root,'../../fase5g3/network-guard.cjs'),'--test',...tests],{encoding:'utf8',maxBuffer:32*1024*1024});
const output=(run.stdout||'')+(run.stderr||''),count=k=>Number(new RegExp('(?:#|ℹ) '+k+' (\\d+)').exec(output)?.[1]||0);
const files=['build/worker-bundle.mjs','status54.mjs','build.cjs'];
const hashes=Object.fromEntries(files.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')]));
const report={executedAtUTC:new Date().toISOString(),scope:'Historical regression plus scoped UI single-flight synchronization and truthful queue notices; no backend changes; not Google or physical acceptance',environment:'LOCAL_SYNTHETIC',tests:count('tests'),passed:count('pass'),failed:count('fail'),files:tests.length,exitCode:run.status,privateFilesExcluded:true,originalSourcesUnchanged:true,outboundFetchHttpLimitedToLoopback:true,actualGoogle:false,physicalDevices:false,remoteChanged:false,hashes};
fs.writeFileSync(path.join(root,'tests/regression.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(root,'tests/regression.txt'),output);console.log(JSON.stringify(report));if(run.status!==0)console.log(output.split('\n').filter(l=>/not ok|✖|Error|expected|actual/.test(l)).slice(-35).join('\n'));process.exitCode=run.status??1;
