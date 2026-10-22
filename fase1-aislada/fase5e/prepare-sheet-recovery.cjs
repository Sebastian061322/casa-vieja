'use strict';
// Prepares reviewable files only. Never connects to Google or creates resources.
const fs=require('node:fs'),path=require('node:path'),R=require('./recovery.cjs'),S=require('./sheet-recovery.cjs');
const root=__dirname,dir=path.join(root,'evidencia-local');
const outputs=['google-recovery-archive.json','google-recovery-tables.json','google-recovery-plan.json'].map(p=>path.join(dir,p));
outputs.push(path.join(root,'tests/google-recovery-plan.json'));
if(outputs.some(p=>fs.existsSync(p)))throw Error('EXISTING_RECOVERY_PLAN_PRESERVED');
const baseHash='3a0a65e6af1f25f3eb58d0ca15978f9c9dd8dfa2c3aa4fc23343ca2b841cceb4';
const base=JSON.parse(fs.readFileSync(path.join(dir,'backup-'+baseHash+'.json'),'utf8'));R.verify(base,baseHash);
const files=['integrity.cjs','recovery.cjs','report-index.js','sheet-recovery.cjs','apps-script/Candidate.gs','../fase5d/worker-bundle.mjs','../fase5d/apps-script/appsscript.candidate.json'].map(p=>({path:p,content:fs.readFileSync(path.join(root,p),'utf8')}));
const archive=R.create({sourceId:'TEST_ONLY:5e-google-recovery-fixture',createdAt:new Date().toISOString(),ledger:base.payload.sections.ledger,configuration:base.payload.sections.configuration,devices:base.payload.sections.devices,release:{commit:'4c2a04c5b43858db32d9e130e2590c25b92d6522',files,scope:'Deployed code plus local recovery tools; synthetic configuration, not actual account provisioning'}});
const tables=S.encode(archive,archive.sha256);S.decode(tables,archive.sha256);
const plan={environment:'TEST_ONLY',executed:false,approved:false,destination:S.DESTINATION,preserveExistingTabs:['Control','DiarioInventarioV3','MovimientosInventarioV3'],sourceId:archive.payload.sourceId,sha256:archive.sha256,release:archive.payload.sections.release.commit,tables:Object.entries(tables).map(([name,rows])=>({name,rows:rows.length,columns:rows[0].length})),containsRealUsers:false,containsProductionData:false,containsSecrets:false,accountsRestored:false,oauthRestored:false};
for(const [file,data]of [['google-recovery-archive.json',archive],['google-recovery-tables.json',tables],['google-recovery-plan.json',plan]])fs.writeFileSync(path.join(dir,file),JSON.stringify(data),{mode:0o600,flag:'wx'});
fs.writeFileSync(path.join(root,'tests/google-recovery-plan.json'),JSON.stringify(plan,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(plan));
