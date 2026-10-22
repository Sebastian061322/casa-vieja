// Solo localhost. Sin tokens, cuentas, servicios remotos ni borrados de IndexedDB.
import http from 'node:http';import fs from 'node:fs';
const paths=new Map([['/','./storage-browser.html'],['/client.js','../../fase2/client.js'],['/private-projections.mjs','../web/private-projections.mjs'],['/intents.mjs','../web/intents.mjs']]);
const server=http.createServer((req,res)=>{const file=paths.get(new URL(req.url,'http://127.0.0.1').pathname);if(!file){res.writeHead(404);res.end();return;}res.writeHead(200,{'content-type':file.endsWith('.html')?'text/html;charset=utf-8':'text/javascript;charset=utf-8','cache-control':'no-store','content-security-policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'none'; frame-ancestors 'none'"});res.end(fs.readFileSync(new URL(file,import.meta.url)));});
server.listen(0,'127.0.0.1',()=>console.log('TEST_ONLY storage http://127.0.0.1:'+server.address().port));
