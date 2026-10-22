// Regresión local reproducible. No despliega ni contacta Google/Cloudflare.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';
const here=path.dirname(fileURLToPath(import.meta.url)),workspace=path.resolve(here,'../../..'),lab=path.join(workspace,'fase1-aislada'),candidate=path.join(here,'../apps-script/Candidate.gs');
const before=fs.existsSync(candidate)?fs.readFileSync(candidate):null;
let exitCode=1;
try{
 const build=spawnSync(process.execPath,[path.join(here,'../build.cjs')],{cwd:workspace,encoding:'utf8'});if(build.status!==0)throw Error(build.stderr||'TEST_BUILD_FAILED');
 const tests=fs.readdirSync(lab,{recursive:true}).filter(name=>/\.test\.(?:cjs|mjs)$/.test(name)||/(?:^|\/)acceptance\.cjs$/.test(name)).map(name=>path.join(lab,name)).sort();
 const result=spawnSync(process.execPath,['--test',...tests],{cwd:workspace,encoding:'utf8',maxBuffer:16*1024*1024});
 const output=(result.stdout||'')+(result.stderr||'');fs.writeFileSync(path.join(here,'resultados.txt'),output);console.log(output.trim().split('\n').slice(-9).join('\n'));if(result.error)throw result.error;exitCode=result.status??1;
}finally{if(before)fs.writeFileSync(candidate,before);}
process.exitCode=exitCode;
