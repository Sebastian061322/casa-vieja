 const header=request.headers.get('authorization')||'';
 const token63=readCredential(request.headers.get('cookie'));
 if(!header&&!token63)return out({error:'IDENTITY_REQUIRED',retryable:true},401,origin);
 if(header&&(!header.startsWith('Bearer ')||header.length>16007))return out({error:'IDENTITY_REQUIRED',retryable:true},401,origin);
 const data=await bounded(request,26000);
 if(!data||(!actions.has(data.action)&&!['sessionStart63','sessionEnd63'].includes(data.action))||
    Object.keys(data).some(k=>!['action','payload'].includes(k)))return out({error:'INVALID_REQUEST',retryable:true},400,origin);
 const fault=request.headers.get('x-cv-lab-fault');
 if(fault&&(fault!=='DROP_COMMITTED_ACK_5E'||data.action!=='execute'||data.payload?.type!=='REGISTER_SALE'||
    data.payload?.epoch!=='TEST_ONLY_V3'||!/^TEST_ONLY_5E_/.test(data.payload?.customer?.name||'')))return out({error:'SYNTHETIC_TEST_REQUIRED',retryable:true},400,origin);

 async function backend63(signed) {
  if(bridge)return timed('backendMs',()=>bridge(signed));
  const url=new URL(env.APPS_SCRIPT_URL);
  if(url.protocol!=='https:'||url.hostname!=='script.google.com'||!/^\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(url.pathname)||url.search)throw Error('BACKEND_NOT_CONFIGURED');
  stage='BACKEND_CONNECTION';
  const text=await timed('backendMs',async()=>{
   const response=await fetcher(url.href,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(signed),redirect:'follow'});
   if(!response.ok)throw Error('BACKEND_UNAVAILABLE');
   const value=await response.text();
   if(value.length>2000000)throw Error('RESPONSE_TOO_LARGE');
   return value;
  });
  stage='BACKEND_RESPONSE';
  return timed('responseParseMs',()=>JSON.parse(text));
 }

 const digest63=token63?await credentialDigest(token63):null;
 const service63={subject:'google:00000',expiresAt:now()+30000};
 const sign63=(identity,action,payload,fields)=>proof(identity,action,payload,env.GATEWAY_SECRET,now,fields);
 let identity, fields63={}, issued63, cookie63, session63;
 if(data.action==='sessionEnd63'){
  if(header||!digest63)return out({error:'IDENTITY_REQUIRED',retryable:false},401,origin);
  const ended=await backend63(await sign63(service63,'sessionEnd63',{digest:digest63}));
  if(!ended?.sessionEnded)return out({error:ended?.error||'SESSION_END_FAILED',retryable:true},503,origin);
  const reply=out({sessionEnded:true},200,origin);
  reply.headers.set('set-cookie',sessionCookie('',0));
  return reply;
 }
 if(header){
  if(!verify||audience!==env.GOOGLE_CLIENT_ID){audience=env.GOOGLE_CLIENT_ID;verify=verifier({audience,fetcher,now});}
  stage='GOOGLE_IDENTITY';
  identity=await timed('identityMs',()=>verify(header.slice(7)));
  if(data.action==='sessionStart63'){
   issued63=await createCredential();
   fields63={issueDigest63:issued63.digest,previousDigest63:digest63};
  }
 } else {
  if(data.action==='sessionStart63')return out({error:'IDENTITY_REQUIRED',retryable:false},401,origin);
  const resolved=await backend63(await sign63(service63,'sessionResolve63',{digest:digest63}));
  if(resolved?.error==='IDENTITY_REQUIRED'){
   const reply=out({error:'IDENTITY_REQUIRED',retryable:false},401,origin);
   reply.headers.set('set-cookie',sessionCookie('',0));
   return reply;
  }
  if(!resolved?.session)throw Error(resolved?.error||'SESSION_LOOKUP_UNAVAILABLE');
  session63=resolved.session;
  identity={subject:session63.subject,expiresAt:session63.expiresAt};
  fields63={sessionDigest63:digest63};
 }
 stage='GATEWAY_SIGNATURE';
 const signed=await timed('signingMs',()=>sign63(identity,issued63?'bootstrap':data.action,issued63?null:data.payload,fields63));
 metrics.traceId=signed.request.requestId;
 metrics.action=data.action;
 let result=await backend63(signed);
 if(issued63&&!result?.error){
  if(!Number.isSafeInteger(result?.sessionExpiresAt63)||result.sessionExpiresAt63<=now())throw Error('SESSION_NOT_DURABLE');
  cookie63=sessionCookie(issued63.token,Math.max(1,Math.ceil((result.sessionExpiresAt63-now())/1000)));
  const {sessionExpiresAt63,...publicResult}=result;
  result=publicResult;
 }else if(session63&&!result?.error&&session63.expiresAt>now()){
  cookie63=sessionCookie(token63,Math.max(1,Math.ceil((session63.expiresAt-now())/1000)));
 }
