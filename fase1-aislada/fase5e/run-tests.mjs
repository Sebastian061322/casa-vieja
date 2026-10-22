// Resultado propio de 5E; conserva el informe histórico de pruebas de 5D.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';
const root=path.dirname(fileURLToPath(import.meta.url)),lab=path.resolve(root,'..'),workspace=path.resolve(lab,'..'),candidate=path.join(lab,'fase5d/apps-script/Candidate.gs'),before=fs.existsSync(candidate)?fs.readFileSync(candidate):null;
let code=1;
try{
  for(const [file,args]of [[path.join(root,'build.cjs'),process.argv.slice(2)],[path.join(lab,'fase5d/build.cjs'),[]]]){const r=spawnSync(process.execPath,[file,...args],{cwd:workspace,encoding:'utf8'});if(r.status!==0)throw Error(r.stderr||'BUILD_FAILED')}
  const tests=fs.readdirSync(lab,{recursive:true}).filter(n=>/\.test\.(cjs|mjs)$/.test(n)||/(^|\/)acceptance\.cjs$/.test(n)).map(n=>path.join(lab,n)).sort();
  const result=spawnSync(process.execPath,['--test',...tests],{cwd:workspace,encoding:'utf8',maxBuffer:16*1024*1024});const output=(result.stdout||'')+(result.stderr||'');fs.writeFileSync(path.join(root,'tests/resultados.txt'),output);console.log(output.trim().split('\n').slice(-9).join('\n'));code=result.status??1;
}finally{if(before)fs.writeFileSync(candidate,before)}
process.exitCode=code;
