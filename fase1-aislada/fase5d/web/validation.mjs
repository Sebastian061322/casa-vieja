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
 const output=document.createElement('ul');output.setAttribute('aria-live','polite');
 const line=text=>{const row=document.createElement('li');row.textContent=text;output.append(row);};
 const describe=r=>r.id+': '+(r.passed?'APROBADO':'FALLÓ')+(r.error?' · '+r.error:'')+(Number.isFinite(r.elapsedMs)?' · '+r.elapsedMs+' ms':'');
 button.onclick=async()=>{button.disabled=true;output.replaceChildren();line('Ensayo en curso…');try{const result=await validateLabAccess(session,{onResult:r=>line(describe(r))});output.replaceChildren();line('Resultado: '+(result.passed?'APROBADO':'FALLÓ')+' · '+result.profile+' · TEST_ONLY');line('Inicio UTC: '+result.startedAt);for(const row of result.checks)line(describe(row));line('Fin UTC: '+result.completedAt);}catch(e){line('Ensayo incompleto: '+e.message);}finally{button.disabled=false;}};
 section.append(title,help,button,output);
 if(session.current()?.profile==='administrator'&&new URLSearchParams(location.search).get('performance')==='5e'){
  const measure=document.createElement('button');measure.className='btn secondary';measure.textContent='Medir consulta sintética (3 muestras)';
  const timing=document.createElement('pre');timing.setAttribute('aria-live','polite');timing.style.whiteSpace='pre-wrap';
  measure.onclick=async()=>{measure.disabled=true;const samples=[];timing.textContent='Medición de lectura en curso… No registra ventas.';try{
   for(let i=0;i<3;i++){const started=performance.now(),snapshot=await session.invoke('snapshot',{format:'ui5d',metricsProbe:true});
    const d=snapshot.diagnostics5e;if(snapshot.profile!=='administrator'||d?.kind!=='CV_5E_READ_TIMING'||d.traceId!==d.worker?.traceId)throw Error('CORRELATED_TIMING_REQUIRED');
    samples.push({sample:i+1,revision:snapshot.revision,browserWithBootstrapMs:Math.round(performance.now()-started),...d});
    timing.textContent=JSON.stringify({environment:'TEST_ONLY',scope:'Read-only; browser includes bootstrap, stage durations overlap',samples},null,2);
   }
  }catch(e){timing.textContent=JSON.stringify({environment:'TEST_ONLY',samples,error:e.message},null,2);}finally{measure.disabled=false;}};
  section.append(measure,timing);
 }
 document.getElementById('main-content').append(section);
}
