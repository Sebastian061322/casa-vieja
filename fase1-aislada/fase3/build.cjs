const fs=require('node:fs'),path=require('node:path');const root=__dirname,read=p=>fs.readFileSync(path.join(root,p),'utf8');
const old=fs.readFileSync(path.join(root,'../fase2/apps-script/Code.gs'),'utf8').replace('function doGet(){','function doGetPhase2_(){');
const html=read('web/shell.html')+'\n<script>\n'+fs.readFileSync(path.join(root,'../fase2/client.js'),'utf8')+'\n'+read('scenario.js')+'\n'+read('web/app.js')+'\n</script></body></html>';
if(/TOKEN_SECRETO|apiPost|saveDB|casa_vieja_db/.test(html))throw Error('UNSAFE_FRONTEND');
const code=old+'\n'+read('journal.js')+'\n'+read('inventory.js')+'\n'+read('scenario.js')+'\n'+read('apps-script/Server.gs')+'\nconst INV_HTML_='+JSON.stringify(html)+';';
fs.writeFileSync(path.join(root,'apps-script/Code.gs'),code);fs.writeFileSync(path.join(root,'apps-script/Index.html'),html);fs.writeFileSync(path.join(root,'web/Bundle-source.txt'),code);console.log(JSON.stringify({bytes:code.length,html:html.length,legacyRoutesPreserved:true}));
