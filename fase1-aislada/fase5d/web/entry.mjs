import {createSession} from './session.mjs';
const $=id=>document.getElementById(id),status=text=>$('auth-status').textContent=text;
let mounted=null;
const session=createSession({send:async(token,action,payload)=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);
  try{const response=await fetch('/api',{method:'POST',credentials:'omit',cache:'no-store',signal:controller.signal,
    headers:{'content-type':'application/json',authorization:'Bearer '+token},body:JSON.stringify({action,payload})});
    const body=await response.json();if(body.error){if(['ACCESS_DENIED','IDENTITY_REQUIRED'].includes(body.error)){session.logout();status('Vuelve a ingresar con una cuenta autorizada. Las colas se conservan.');}throw Error(body.error);}if(!response.ok)throw Error('SERVICE_UNAVAILABLE');return body;
  }finally{clearTimeout(timer);}
},clearView:()=>{
  $('app').hidden=true;document.querySelector('.mobile-tabs').hidden=true;$('logout5d').hidden=true;
  for(const dialog of document.querySelectorAll('dialog'))if(dialog.open)dialog.close();
  $('auth-gate').hidden=false;
}});
$('logout5d').onclick=()=>{session.logout();google.accounts.id.disableAutoSelect();location.reload();};
async function login(response){try{
  const identity=await session.login(response.credential),boot=await session.invoke('bootstrap',null);
  const actor={...identity,capabilities:boot.capabilities};
  if(mounted&&(mounted.subject!==actor.subject||mounted.profile!==actor.profile)){session.logout();location.reload();return;}
  if(!mounted){
    const store=new CVClient.IndexedStore('cv-zero-lab-v1-'+actor.subject);
    await store.transact(s=>{
      if(s.queue.length&&s.zeroEngine!==4)throw Error('INCOMPATIBLE_QUEUE_REVIEW_REQUIRED');
      if(s.zeroProfile!==actor.profile||s.snapshot?.uiVersion!=='5D'){s.snapshot=null;delete s.uxHome5a2;}
      s.zeroProfile=actor.profile;s.zeroEngine=4;
    });
    await import('./approved-app.js');await window.mount5D(actor,session,store);mounted=actor;
  }
  $('auth-gate').hidden=true;$('app').hidden=false;document.querySelector('.mobile-tabs').hidden=false;
  $('logout5d').hidden=false;$('identity5d').textContent=({administrator:'Administrador principal',operations:'Gerente operativo',seller:'Vendedor'})[actor.profile];
}catch(e){session.logout();status('Acceso no confirmado: '+e.message+'. Tus operaciones locales se conservan.');}}
async function start(){const config=await fetch('/config.json',{cache:'no-store'}).then(r=>r.json());
  if(config.environment!=='TEST_ONLY'||!config.enabled||!config.realAccountsAuthorized){status('Laboratorio en configuración. El acceso todavía está desactivado.');return;}
  await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.onload=resolve;script.onerror=reject;document.head.append(script);});
  google.accounts.id.initialize({client_id:config.googleClientId,auto_select:false,callback:login});
  google.accounts.id.renderButton($('google-button'),{theme:'outline',size:'large'});
  status('Ingresa con tu cuenta individual autorizada. Solo se utilizan datos ficticios.');
}
start().catch(()=>status('No se pudo abrir el acceso. No se confirmó ninguna operación.'));
