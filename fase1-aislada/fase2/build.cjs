const fs=require('node:fs'),path=require('node:path');
const root=__dirname;const read=p=>fs.readFileSync(path.join(root,p),'utf8');
let code=read('transactions.js')+'\n'+read('apps-script/Server.gs');
const html=read('web/shell.html')+'\n<script>\n'+read('client.js')+'\n'+read('web/app.js')+'\n'+read('web/verification.js')+'\n</script>\n</body></html>\n';
if(/script\.google\.com\/macros\/|TOKEN_SECRETO|casa_vieja_db|apiPost|saveDB|migrateFromBlob/.test(html))throw Error('UNSAFE_FRONTEND');
code=code.replace("HtmlService.createHtmlOutputFromFile('Index')",'HtmlService.createHtmlOutput(CV_HTML_)');
code='/* CV_BUNDLE_START */\n'+code+'\nconst CV_HTML_ = '+JSON.stringify(html)+';\n/* CV_BUNDLE_END */';
fs.writeFileSync(path.join(root,'apps-script/Code.gs'),code);fs.writeFileSync(path.join(root,'web/Bundle-source.txt'),code);fs.writeFileSync(path.join(root,'apps-script/Index.html'),html);
console.log(JSON.stringify({codeBytes:code.length,htmlBytes:html.length,productionConnections:0}));
