// Todo el acceso nuevo exige identidad nativa del propietario o prueba firmada del proxy.
// El modo externo permanece apagado. No hay RPC de administración de usuarios.
function cv5cProof_(envelope,configuration){
 const c=configuration||{enabled:PropertiesService.getScriptProperties().getProperty('PHASE5C_AUTH_MODE')==='SIGNED_GATEWAY',secret:PropertiesService.getScriptProperties().getProperty('PHASE5C_GATEWAY_SECRET'),now:Date.now()};
 if(!c.enabled||!c.secret||c.secret.length<32||!envelope?.request||typeof envelope.mac!=='string'||JSON.stringify(envelope).length>32000)throw Error('IDENTITY_REQUIRED');
 const r=envelope.request,expected=Utilities.base64Encode(Utilities.computeHmacSha256Signature(CVInventoryBase.canonical(r),c.secret,Utilities.Charset.UTF_8));
 let different=expected.length^envelope.mac.length;for(let i=0;i<expected.length;i++)different|=expected.charCodeAt(i)^(envelope.mac.charCodeAt(i)||0);if(different)throw Error('IDENTITY_REQUIRED');
 if(r.version!==1||r.destination!=='TEST_ONLY_V3'||!Number.isSafeInteger(r.issuedAt)||!Number.isSafeInteger(r.expiresAt)||r.issuedAt>c.now+30000||r.expiresAt<=c.now||r.expiresAt-r.issuedAt>60000||typeof r.subject!=='string'||!/^google:[0-9]{5,64}$/.test(r.subject)||typeof r.requestId!=='string'||r.requestId.length>120)throw Error('IDENTITY_REQUIRED');
 return r;
}
function cv5cBindings_(){const raw=PropertiesService.getScriptProperties().getProperty('PHASE5C_ROLE_BINDINGS');if(!raw)throw Error('ACCESS_DENIED');return JSON.parse(raw);}
function cv5cEngine_(actor,policy){const base=invEngine_();return new CVAccess.Engine(base.store,base.opening,undefined,{actor,policy:policy||{},now:()=>new Date().toISOString()});}
function cv5cPolicy_(){return JSON.parse(PropertiesService.getScriptProperties().getProperty('PHASE5C_APPROVED_POLICY')||'{}');}
function cv5cDispatch_(request,actor,policy){
 if(request.action==='bootstrap')return {subject:actor.subject,profile:actor.role,capabilities:CVAccess.roles[actor.role],epoch:'TEST_ONLY_V3',commercialVersion:4,release:CV5C_RELEASE_};
 const e=cv5cEngine_(actor,policy);
 if(request.action==='execute')return e.execute(request.payload);
 if(request.action==='status')return e.status(request.payload);
 if(request.action==='snapshot')return CVAccess.snapshot(e,request.payload||{});
 if(request.action==='dashboard'){if(actor.role!=='administrator')throw Error('PERMISSION_DENIED');const p=request.payload;if(!p||!/^\d{4}-\d{2}-\d{2}$/.test(p.from)||!/^\d{4}-\d{2}-\d{2}$/.test(p.to)||p.from>p.to||!/^\d{4}-\d{2}-\d{2}$/.test(p.today)||!Array.isArray(p.days)||p.days.length>7||!p.days.every(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&d>=p.from&&d<=p.to))throw Error('INVALID_PERIOD');const state=e.state();if(p.revision!==state.revision)throw Error('REVISION_CHANGED');return {revision:state.revision,range:e.reports(state,p.from,p.to),today:e.reports(state,p.today,p.today),month:e.reports(state,p.today.slice(0,7)+'-01',p.today),daily:p.days.map(day=>({day,report:e.reports(state,day,day)}))};}
 if(request.action==='reports'){if(actor.role!=='administrator')throw Error('PERMISSION_DENIED');const p=request.payload;if(!p||!/^\d{4}-\d{2}-\d{2}$/.test(p.from)||!/^\d{4}-\d{2}-\d{2}$/.test(p.to)||p.from>p.to)throw Error('INVALID_PERIOD');return e.reports(e.state(),p.from,p.to);}
 throw Error('PERMISSION_DENIED');
}
function cv5cError_(e){return {error:/^[A-Z][A-Z_]+$/.test(e.message)?e.message:'SERVER_UNAVAILABLE',retryable:true};}
function secureRequest(envelope){try{const r=cv5cProof_(envelope),actor=CVAccess.principal(r.subject,cv5cBindings_());return cvLocked_(()=>cv5cDispatch_(r,actor,cv5cPolicy_()));}catch(e){return cv5cError_(e);}}
function ownerRequest(request){try{cvOwner_();return cvLocked_(()=>cv5cDispatch_(request,{subject:'native:sandbox-owner',role:'administrator'},cv5cPolicy_()));}catch(e){return cv5cError_(e);}}
