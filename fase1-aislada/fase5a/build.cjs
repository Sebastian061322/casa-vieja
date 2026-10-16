// Compile an isolated review candidate. No upload or deployment.
const fs=require('node:fs'),path=require('node:path');const root=__dirname,read=p=>fs.readFileSync(path.join(root,p),'utf8');
const suffix='/* GENERATED_REFINEMENT_5A2 */';
const baseUX=read('web/ux.js').split(suffix)[0];fs.writeFileSync(path.join(root,'web/ux.js'),baseUX+suffix+'\n'+read('refinamiento-5a2/components.js')+'\n'+read('refinamiento-5a2/refinement.js'));
const cssMarker='/* GENERATED_STYLE_5A2 */',baseCSS=read('web/ux.css').split(cssMarker)[0];fs.writeFileSync(path.join(root,'web/ux.css'),baseCSS+cssMarker+'\n'+read('refinamiento-5a2/refinement.css'));
let shell=read('web/shell.html');const marker=shell.indexOf('/* Evolución visual'),end=shell.indexOf('</style>',marker);if(marker<0||end<0)throw Error('CSS_MARKER');shell=shell.slice(0,marker)+read('web/ux.css')+shell.slice(end);fs.writeFileSync(path.join(root,'web/shell.html'),shell);
const html=shell+'<script>'+read('../fase2/client.js')+'\n'+read('web/app.js')+'\n'+read('web/ux.js')+'</script></body></html>';
if(/https:\/\/script.google.com\/macros\/|TOKEN_SECRETO|cv_script_token|Windsor.*(?:token|key)/.test(html))throw Error('UNSAFE_FRONTEND');
const previous=read('../fase4/apps-script/Code.gs'),cut=previous.lastIndexOf('const COMMERCIAL_HTML_=');if(cut<0)throw Error('MISSING_BASE_HTML');const code=previous.slice(0,cut)+'const COMMERCIAL_HTML_='+JSON.stringify(html)+';';fs.mkdirSync(path.join(root,'apps-script'),{recursive:true});fs.writeFileSync(path.join(root,'apps-script/Index.html'),html);fs.writeFileSync(path.join(root,'apps-script/Code.gs'),code);console.log(JSON.stringify({previousBackendPreserved:true,newWriteDestinations:0,deployed:false,htmlChars:html.length,codeChars:code.length}));
