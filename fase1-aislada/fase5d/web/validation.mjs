// Ensayos optativos de laboratorio. No recibe ni exporta credenciales o datos comerciales.
export async function validateLabAccess(session,{now=()=>performance.now(),onResult=()=>{}}={}){
 const actor=session.current();if(!actor)throw Error('REAUTHENTICATION_REQUIRED');
 const result={environment:'TEST_ONLY',profile:actor.profile,startedAt:new Date().toISOString(),checks:[]};
 const record=row=>{result.checks.push(row);onResult({...row});};
 const request=async(action,payload)=>{if(session.current()?.subject!==actor.subject||session.current()?.profile!==actor.profile)throw Error('SESSION_CHANGED');return session.invoke(action,payload);};
 const before=await request('snapshot',{format:'ui5d'});
 if(before.uiVersion!=='5D'||before.profile!==actor.profile)throw Error('LAB_RESPONSE_REQUIRED');
 if(actor.profile==='seller')record({id:'seller-response-redacted',passed:! /costCents|valueCents|profit|acquisitionCents|processingCents|financial|authorization|documents/i.test(JSON.stringify(before))});
 const denied=actor.profile==='seller'?['users','reports','dashboard','setUser','configure']:actor.profile==='operations'?['users','setUser','configure']:[];
 for(const action of denied){const started=now();let error=null;try{await request(action,{operationId:'INVALID_LAB_PROBE',role:'administrator'});}catch(e){error=e.message;}record({id:'deny-'+action,passed:error==='PERMISSION_DENIED',error,elapsedMs:Math.round(now()-started)});}
 // El campo de rol falsificado se rechaza antes de ejecutar o registrar un comando.
 const started=now();let error=null;try{await request('execute',{operationId:'INVALID_LAB_PROBE',type:'REGISTER_SALE',role:'administrator'});}catch(e){error=e.message;}
 record({id:'reject-forged-role',passed:error==='IDENTITY_SPOOFING',error,elapsedMs:Math.round(now()-started)});
 for(let i=0;i<3;i++){const start=now();const view=await request('snapshot',{format:'ui5d'});record({id:'read-snapshot-'+(i+1),passed:view.profile===actor.profile&&view.uiVersion==='5D',elapsedMs:Math.round(now()-start)});}
 const after=await request('snapshot',{format:'ui5d'});
 record({id:'journal-revision-unchanged',passed:after.revision===before.revision});
 result.completedAt=new Date().toISOString();result.passed=result.checks.every(c=>c.passed);return result;
}
export function mountLabValidation(session){
 if(new URLSearchParams(location.search).get('validation')!=='5d')return;
 const section=document.createElement('section');section.className='card';section.id='validation5d';
 const title=document.createElement('h2');title.textContent='Verificaciones de laboratorio';
 const help=document.createElement('p');help.textContent='Solo TEST_ONLY. Comprueba permisos y tiempos de consultas sin crear ventas, cambiar usuarios ni mostrar credenciales. No equivale a una prueba de carga ni de celulares.';
 const button=document.createElement('button');button.className='btn secondary';button.textContent='Comprobar permisos y consultas';
 const output=document.createElement('pre');output.setAttribute('role','status');output.style.whiteSpace='pre-wrap';
 button.onclick=async()=>{button.disabled=true;output.textContent='Ensayo en curso…';try{const result=await validateLabAccess(session,{onResult:r=>{output.textContent+='\n'+r.id+': '+(r.passed?'APROBADO':'FALLÓ')+(r.error?' · '+r.error:'');}});output.textContent=JSON.stringify(result,null,2);}catch(e){output.textContent+='\nEnsayo incompleto: '+e.message;}finally{button.disabled=false;}};
 section.append(title,help,button,output);document.getElementById('app').append(section);
}
