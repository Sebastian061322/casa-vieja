'use strict';
const fs=require('node:fs'),path=require('node:path');const root=__dirname,read=p=>fs.readFileSync(path.join(root,p),'utf8');
const guard=read('../fase2/apps-script/Server.gs').split('function cvReadRows_')[0];
const inventory=read('../fase3/apps-script/Server.gs').split('function invReply_')[0];
let routes=read('../fase4/apps-script/Server.gs').split('function commercialSaveReport')[0];
const html=read('../fase5a/apps-script/Index.html');
const code=[guard,read('../fase3/journal.js'),read('../fase3/inventory.js'),read('../fase4/commercial.js'),inventory,routes,read('apps-script/ReadApi.gs'),"function doGet(){cvOwner_();return HtmlService.createHtmlOutput(COMMERCIAL_HTML_).setTitle('Casa Vieja · Candidato restringido de laboratorio');}",'const COMMERCIAL_HTML_='+JSON.stringify(html)+';'].join('\n');
const allowed=['commercialInitialize','commercialExecute','commercialStatus','commercialSnapshot','commercialReports','commercialPage','doGet'];
const vm=require('node:vm'),scope=vm.createContext({});vm.runInContext(code,scope);const exposed=Object.keys(scope).filter(n=>typeof scope[n]==='function'&&!n.endsWith('_'));
if(exposed.some(n=>!allowed.includes(n)))throw Error('UNEXPECTED_RPC:'+exposed);
fs.writeFileSync(path.join(root,'apps-script/Candidate.gs'),code);
fs.writeFileSync(path.join(root,'apps-script/rpc-manifest.json'),JSON.stringify({environment:'TEST_ONLY',deployableToProduction:false,ownerOnly:true,exposed,maintenanceIncluded:false,legacyRPCIncluded:false},null,2)+'\n');
// Proyecto de prueba: conserva escenarios; no se cambia el despliegue privado.
fs.writeFileSync(path.join(root,'apps-script/Laboratory.gs'),read('../fase5a/apps-script/Code.gs').replace('function sandboxExecute(command){','function sandboxExecuteBefore5B_(command){')+'\n'+read('apps-script/ReadApi.gs')+'\n'+read('apps-script/Benchmark.gs'));
console.log(JSON.stringify({exposed,productionEnabled:false}));
