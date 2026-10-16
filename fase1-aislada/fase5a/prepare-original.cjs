// Optional read-only source input. Generates a blocked, isolated visual reference.
// Usage: node prepare-original.cjs /path/to/read-only/original-index.html
const fs=require('node:fs'),path=require('node:path');const input=process.argv[2];if(!input)throw Error('Provide original source path; never use a live production browser.');let s=fs.readFileSync(input,'utf8');
s=s.replace(/https?:\/\/[^"'`\s<>\\)]+/g,'#RECURSO_BLOQUEADO').replace(/const STORE_KEY\s*=\s*[^;]+;/,"const STORE_KEY='cv-original-synthetic-5a';").replace(/const CONN_KEY\s*=\s*[^;]+;/,"const CONN_KEY='cv-original-no-connection-5a';");
s=s.replace('<head>',`<head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'">`);
s=s.replace('</body>',`<script>getConnConfig=()=>({url:'',token:''});saveConnConfig=()=>{};isConnected=()=>false;apiGet=async()=>null;apiPost=async()=>null;document.body.insertAdjacentHTML('afterbegin','<div style="background:#624820;color:white;padding:8px">REFERENCIA ORIGINAL AISLADA · datos ficticios · conexiones bloqueadas</div>');</script></body>`);
s=s.replace('let DB = loadDB();','let DB = Object.assign(defaultDB(), '+fs.readFileSync(path.join(__dirname,'tests/original-fixture.json'),'utf8')+');');
fs.writeFileSync(path.join(__dirname,'tests/original-sanitizado.html'),s);
