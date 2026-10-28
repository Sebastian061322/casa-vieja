'use strict';
// Servidor de revisión LOCAL y sin endpoint de escritura comercial.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {review}=require('./review.cjs');
const assets={'/':['ui/index.html','text/html; charset=utf-8'],'/review.css':['ui/review.css','text/css; charset=utf-8'],'/review.js':['ui/review.js','text/javascript; charset=utf-8'],'/approved.css':['../fase5d/web/approved.css','text/css; charset=utf-8'],'/sample.json':['ui/sample.json','application/json']};
function createPreview(){return http.createServer(async(req,res)=>{
 const headers={'cache-control':'no-store','x-content-type-options':'nosniff','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'",'referrer-policy':'no-referrer'};
 const send=(status,body,type='application/json')=>{res.writeHead(status,{...headers,'content-type':type});res.end(typeof body==='string'?body:JSON.stringify(body));};
 try{
  const host=req.headers.host;if(!/^127\.0\.0\.1:[0-9]+$/.test(host||''))return send(403,{error:'LOOPBACK_HOST_REQUIRED'});
  if(req.headers.origin&&req.headers.origin!=='http://'+host)return send(403,{error:'LOCAL_ORIGIN_REQUIRED'});
  if(req.method==='GET'&&assets[req.url]){const [file,type]=assets[req.url];return send(200,fs.readFileSync(path.join(__dirname,file),'utf8'),type);}
  if(req.method!=='POST'||req.url!=='/review')return send(404,{error:'REVIEW_ONLY_NO_EXECUTION_ENDPOINT'});
  if(!/^application\/json(?:;|$)/.test(req.headers['content-type']||''))return send(415,{error:'JSON_REQUIRED'});
  let data='';for await(const part of req){data+=part;if(Buffer.byteLength(data)>20000)return send(413,{error:'REVIEW_TOO_LARGE'});}
  return send(200,review(JSON.parse(data)));
 }catch(e){return send(400,{error:/^[A-Z_]+$/.test(e.message)?e.message:'INVALID_REVIEW_INPUT'});}
 });}
if(require.main===module){const server=createPreview();server.listen(8796,'127.0.0.1',()=>console.log('Revisión local TEST_ONLY: http://127.0.0.1:8796/; sin escrituras comerciales'));}
module.exports={createPreview};
