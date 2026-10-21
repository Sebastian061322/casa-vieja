// Conserva el paquete probado de 5C; prepara únicamente controles adicionales.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const read = p => fs.readFileSync(path.join(__dirname, p), 'utf8');
const base = '../fase5c/multiusuario-gratuito/';
let code = read(base + 'apps-script/Candidate.gs');
function replaceOnce(before, after) {
  if (code.split(before).length !== 2) throw Error('BASE_CHANGED_REVIEW_REQUIRED');
  code = code.replace(before, after);
}
const ownerGuard = read('../fase2/apps-script/Server.gs').split('function cvOwner_(){')[1].split('function cvLocked_')[0];
replaceOnce('function cvOwner_(){' + ownerGuard, '');
if (process.argv.includes('--authorized-script')) {
  const approved = JSON.parse(read('CONFIGURACION-PROPUESTA.json')).appsScriptId;
  if (approved !== '1m79GZ0TkADVZuji4E1XFnPmdMCAHCWI-FRZvawkx9vGnxzmao0NfPki3') throw Error('APPROVED_LAB_REQUIRED');
  replaceOnce("const CV_TEST_SCRIPT_ID_ = 'ZERO_NOT_APPROVED_SCRIPT';", 'const CV_TEST_SCRIPT_ID_ = '+JSON.stringify(approved)+';');
}
replaceOnce('owns(this,c.operationId);return super.execute(c);',
  "const prior=this.records().find(r=>r.id===c.operationId&&['PREPARED','REJECTED'].includes(r.kind));if(prior)check((prior.plan?.audit||prior.audit)?.subject===this.actor.subject,'OPERATION_ACTOR_MISMATCH');owns(this,c.operationId);return super.execute(c);");
replaceOnce("if(!approved||ScriptApp.getScriptId()!==approved)throw Error('APPROVED_LAB_REQUIRED');const service=",
  "if(!approved||ScriptApp.getScriptId()!==approved)throw Error('APPROVED_LAB_REQUIRED');const current=zeroProof_(envelope);CVZeroAccess.principal(current.subject,zeroPropertyLog_('ZERO_USER_').read());zeroConsumeNonce_(current,p,Date.now());const service=");
code += '\n' + read('apps-script/Replay.gs');
const context = vm.createContext({});
vm.runInContext(code, context);
const exposed = Object.keys(context).filter(k => typeof context[k] === 'function' && !k.endsWith('_'));
if (JSON.stringify(exposed) !== JSON.stringify(['zeroRequest','doPost','doGet'])) throw Error('RPC_EXPOSURE');
fs.writeFileSync(path.join(__dirname,'apps-script/Candidate.gs'),code);
console.log(JSON.stringify({environment:'TEST_ONLY',deploymentEnabled:false,exposed}));
