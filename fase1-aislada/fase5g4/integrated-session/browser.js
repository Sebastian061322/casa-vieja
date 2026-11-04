async function sessionRequest63(action,credential){
 const response=await fetch('/api',{method:'POST',credentials:'same-origin',cache:'no-store',
  headers:{'content-type':'application/json',...(credential?{authorization:'Bearer '+credential}:{})},
  body:JSON.stringify({action,payload:null}),signal:AbortSignal.timeout(45000)});
 if(action==='sessionEnd63'&&response.status===401)return {sessionEnded:true};
 const result=await readLabResponse(response,action);
 if(action==='sessionEnd63'&&!result.sessionEnded)throw Error('SESSION_END_FAILED');
 return result;
}
function noticeLogout63(message){
 const button=$('logout5d');
 let notice=$('session-exit-status63');
 if(!notice){notice=document.createElement('span');notice.id='session-exit-status63';notice.setAttribute('role','status');button.after(notice);}
 notice.textContent=message;
}
async function login(response){
 try{
  await sessionRequest63('sessionStart63',response.credential);
  return await loginFlow.run(COOKIE_MODE63);
 }catch(error){status('Acceso no confirmado: '+error.message+'. Tus operaciones locales se conservan.');}
}
