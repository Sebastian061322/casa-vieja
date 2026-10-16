/* Se instala antes del código 5A. Conserva sus bases y comandos; bloquea escrituras nuevas hasta revisar continuidad. */
const cv5cReview=()=>CVContinuity.scan(CVContinuity.browserAdapter(indexedDB,location.origin));
const cv5cContinuity=cv5cReview();
const CV5CBaseClient=CVClient.Client;
CVClient.Client=class extends CV5CBaseClient{
 async continuityCheck(){const report=await cv5cReview();if(report.blocked)throw Error('CONTINUITY_REVIEW_REQUIRED');document.getElementById('continuity-review')?.remove();}
 async enqueue(payload){await this.continuityCheck();return super.enqueue(payload)}
 async flush(){const local=await this.view();const version=CVContinuity.versions.find(v=>v.name===this.store.name);if(!version||CVContinuity.describe(version,local,location.origin).status==='INCOMPATIBLE')throw Error('INCOMPATIBLE_ENGINE');return super.flush()}
};
document.addEventListener('DOMContentLoaded',async()=>{
 const report=await cv5cContinuity;if(!report.blocked)return;
 const box=document.createElement('section');box.className='card';box.setAttribute('role','alert');box.id='continuity-review';
 const title=document.createElement('h2');title.textContent='Revisión de operaciones pendientes';box.append(title);
 const text=document.createElement('p');text.textContent='La actualización está bloqueada hasta verificar las colas de este equipo y los demás dispositivos. No se borró ni transformó ninguna operación.';box.append(text);
 for(const db of report.databases){const row=document.createElement('p');row.textContent=db.name+': '+db.status+' · '+db.pending.length+' pendiente(s)';box.append(row)}
 const warning=document.createElement('p');warning.textContent='Las colas de otros dominios o perfiles del navegador deben revisarse desde su versión original. La ausencia de bases aquí no confirma que esos equipos estén cerrados.';box.append(warning);
 const exportButton=document.createElement('button');exportButton.className='btn secondary';exportButton.textContent='Guardar respaldo de este equipo';exportButton.onclick=async()=>{try{const exported=await CVContinuity.exportDevice(CVContinuity.browserAdapter(indexedDB,location.origin));const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([JSON.stringify(exported,null,2)],{type:'application/json'}));link.download='CasaVieja-colas-laboratorio.json';link.click();URL.revokeObjectURL(link.href);}catch(e){warning.textContent='No se pudo respaldar. Conserva este navegador y sus datos.';}};box.append(exportButton);document.body.prepend(box);
});
