import {createSession} from './session.mjs';
import {createLoginFlow} from './login-flow.mjs';
import {mountLabValidation} from './validation.mjs';
import {readLabResponse} from './api-response.mjs';
import {PrivateProjectionStore} from '../../fase5e/web/private-projections.mjs';
const $=id=>document.getElementById(id),status=text=>$('auth-status').textContent=text;
let mounted=null,activeStore=null,loseNextResponse5e=false;
function armNetworkLoss5e(){if(new URLSearchParams(location.search).get('recovery')!=='5e')throw Error('LAB_FAULT_DISABLED');loseNextResponse5e=true;}
const session=createSession({send:async(token,action,payload)=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),45000);
  try{const fault=action==='execute'&&loseNextResponse5e;if(fault)loseNextResponse5e=false;const response=await fetch('/api',{method:'POST',credentials:'omit',cache:'no-store',signal:controller.signal,
    headers:{'content-type':'application/json',authorization:'Bearer '+token,...(fault?{'x-cv-lab-fault':'DROP_COMMITTED_ACK_5E'}:{})},body:JSON.stringify({action,payload})});
    return await readLabResponse(response,action);
  }finally{clearTimeout(timer);}
},clearView:()=>{
  activeStore?.clearMemory();
  $('app').hidden=true;document.querySelector('.mobile-tabs').hidden=true;$('logout5d').hidden=true;
  for(const dialog of document.querySelectorAll('dialog'))if(dialog.open)dialog.close();
  $('auth-gate').hidden=false;
}});
$('logout5d').onclick=()=>{loginFlow.invalidate();session.logout();google.accounts.id.disableAutoSelect();location.reload();};
const loginFlow=createLoginFlow({session,prepare:async(actor,current)=>{
  if(mounted&&(mounted.subject!==actor.subject||mounted.profile!==actor.profile)){loginFlow.invalidate();session.logout();location.reload();return;}
  if(!mounted){
    const store=await new PrivateProjectionStore(new CVClient.IndexedStore('cv-zero-lab-v1-'+actor.subject),actor.profile).initialize();
    activeStore=store;
    await store.transact(s=>{
      if(s.queue.length&&s.zeroEngine!==4)throw Error('INCOMPATIBLE_QUEUE_REVIEW_REQUIRED');
      if(s.zeroProfile!==actor.profile||s.snapshot?.uiVersion!=='5D'){s.snapshot=null;delete s.uxHome5a2;}
      s.zeroProfile=actor.profile;s.zeroEngine=4;
    });
    if(!current())return;await import('./approved-app.js');if(!current())return;mounted=actor;await window.mount5D(actor,session,store);mountLabValidation(session);if(!current())return;
  }
},show:actor=>{
  $('auth-gate').hidden=true;$('app').hidden=false;document.querySelector('.mobile-tabs').hidden=false;
  $('logout5d').hidden=false;$('identity5d').textContent=({administrator:'Administrador principal',operations:'Gerente operativo',seller:'Vendedor'})[actor.profile];
},onError:e=>status('Acceso no confirmado: '+e.message+'. Tus operaciones locales se conservan.')});
function login(response){return loginFlow.run(response.credential);}
async function start(){const config=await fetch('/config.json',{cache:'no-store'}).then(r=>r.json());
  if(config.environment!=='TEST_ONLY'||!config.enabled||!config.realAccountsAuthorized){status('Laboratorio en configuración. El acceso todavía está desactivado.');return;}
  await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.onload=resolve;script.onerror=reject;document.head.append(script);});
  google.accounts.id.initialize({client_id:config.googleClientId,auto_select:false,callback:login});
  google.accounts.id.renderButton($('google-button'),{theme:'outline',size:'large'});
  status('Ingresa con tu cuenta individual autorizada. Solo se utilizan datos ficticios.');
}
start().catch(()=>status('No se pudo abrir el acceso. No se confirmó ninguna operación.'));
