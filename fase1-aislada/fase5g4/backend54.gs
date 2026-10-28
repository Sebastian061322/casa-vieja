/* Solo ámbito TEST_ONLY ya firmado; ninguna función RPC adicional. */
var CV54VerifiedPolicyApproval=null;
function cvPolicyConfig54_(config){
 if(!CV_SCOPE53_ACTIVE||!CV54VerifiedPolicyApproval)return config;
 const next=CVInventoryBase.clone(config),approval=CV54VerifiedPolicyApproval;
 for(const policy of Object.values(next.policies||{})){
  delete policy.sha256;policy.approvedBy=approval.subject;policy.approvedAt=approval.serverAt;
  policy.evidence='TEST_ONLY:AUTHORIZATION:'+approval.operationId;
  policy.version=policy.version+':AUTH:'+approval.operationId;policy.sha256=CV52Bundle.hash(policy);
 }
 return next;
}
(function(){
 const check=(ok,error)=>{if(!ok)throw Error(error)},copy=CVInventoryBase.clone;
 for(const role of ['administrator','operations'])CVZeroAccess.roles[role].push('REVIEW_OPENING');
 CVZeroAccess.roles.administrator.push('AUTHORIZE_OPENING');
 const beforeState=CVZeroAccess.Engine.prototype.state;
 CVZeroAccess.Engine.prototype.state=function(){
  const state=beforeState.call(this);if(!CV_SCOPE53_ACTIVE)return state;
  state.openingControl54={reviews:{},approvals:{}};
  const prepared=new Map(this.records().filter(r=>r.kind==='PREPARED').map(r=>[r.id,r]));
  for(const r of this.records().filter(r=>r.kind==='COMMITTED')){
   const event=prepared.get(r.id)?.plan.openingControl54;if(!event)continue;
   state.openingControl54[event.kind==='REVIEW'?'reviews':'approvals'][r.id]=copy(event);
  }
  return state;
 };
 const beforePlan=CVZeroAccess.Engine.prototype.plan;
 CVZeroAccess.Engine.prototype.plan=function(state,command){
  if(!CV_SCOPE53_ACTIVE)return beforePlan.call(this,state,command);
  if(['REVIEW_OPENING','AUTHORIZE_OPENING'].includes(command.type)){
   check(command.commercialVersion===4,'COMMERCIAL_VERSION_REQUIRED');
   check(['administrator','operations'].includes(this.actor.role),'PERMISSION_DENIED');
   check(!state.continuity.opening,'OPENING_ALREADY_APPLIED');
   const cfg=JSON.parse(cvProps5g_().getProperty('CV_5G3_CONTINUITY_CONFIG')||'{}');
   check(cfg.environment==='TEST_ONLY'&&cfg.approvedBundleHash===command.bundleHash&&/^[a-f0-9]{64}$/.test(command.actHash||''),'OPENING_APPROVAL_REQUIRED');
   check(/^TEST_ONLY:/.test(command.evidence||'')&&command.evidence.length<=500,'REVIEW_EVIDENCE_REQUIRED');
   const event={kind:'REVIEW',operationId:command.operationId,bundleHash:command.bundleHash,actHash:command.actHash,subject:this.actor.subject,role:this.actor.role,serverAt:this.context.now(),evidence:command.evidence};
   if(command.type==='AUTHORIZE_OPENING'){
    check(this.actor.role==='administrator','PERMISSION_DENIED');
    check(Array.isArray(command.reviewOperationIds)&&command.reviewOperationIds.length===2&&new Set(command.reviewOperationIds).size===2,'TWO_VERIFIED_REVIEWS_REQUIRED');
    const reviews=command.reviewOperationIds.map(id=>state.openingControl54.reviews[id]);
    check(reviews.every(r=>r&&r.bundleHash===command.bundleHash&&r.actHash===command.actHash)&&new Set(reviews.map(r=>r.subject)).size===2,'TWO_VERIFIED_REVIEWS_REQUIRED');
    event.kind='AUTHORIZATION';event.reviews=copy(reviews);event.productionApproved=false;
   }
   return {sale:{id:command.saleId,entityType:'inventory',version:1},resources:[],lots:[],effects:[],commerceEvents:[],continuityEvents:[],openingControl54:event,audit:{subject:this.actor.subject,role:this.actor.role,serverAt:event.serverAt,type:command.type,operationId:command.operationId}};
  }
  if(command.type==='OPEN_CONTINUITY'){
   const approval=state.openingControl54.approvals[command.approvalOperationId];
   check(approval&&approval.role==='administrator'&&approval.bundleHash===command.bundle?.bundleHash&&approval.actHash===command.bundle?.actHash,'VERIFIED_OPENING_AUTHORIZATION_REQUIRED');
   const previous=CV54VerifiedPolicyApproval;try{CV54VerifiedPolicyApproval=approval;const plan=beforePlan.call(this,state,command);plan.verifiedOpeningAuthorization54=copy(approval);return plan;}finally{CV54VerifiedPolicyApproval=previous;}
  }
  const approval=Object.values(state.openingControl54.approvals).find(a=>a.bundleHash===state.continuity.opening?.bundleHash),previous=CV54VerifiedPolicyApproval;
  try{CV54VerifiedPolicyApproval=approval||null;return beforePlan.call(this,state,command);}finally{CV54VerifiedPolicyApproval=previous;}
 };
})();
const CV54BeforeRequest=zeroRequest;
zeroRequest=function(envelope){
 const result=CV54BeforeRequest(envelope);
 if(result?.error&&/^(TWO_VERIFIED_REVIEWS_REQUIRED|VERIFIED_OPENING_AUTHORIZATION_REQUIRED|REVIEW_EVIDENCE_REQUIRED|OPENING_APPROVAL_REQUIRED)$/.test(result.error))return {...result,retryable:false};
 if(envelope?.request?.action!=='snapshot'||envelope.request.payload?.continuityScope!=='TEST_ONLY_CONTINUITY_5G3'||result.error)return result;
 try{
 const props=PropertiesService.getScriptProperties(),catalog=JSON.parse(props.getProperty('CV_5G3_CATALOGUE_CONFIG')||'{}');
 result.catalogue54={version:CV53CatalogueSource.version,enabled:catalog.enabled===true&&catalog.environment==='TEST_ONLY'&&catalog.approvalKind==='SYNTHETIC_TEST_APPROVAL'&&catalog.catalogueHash===CV52Bundle.hash(CV53CatalogueSource),offers:CVInventoryBase.clone(CV53CatalogueSource.offers)};
 result.resourceLines54=Object.fromEntries(Object.entries(catalog.resourceLines||{}).filter(([id,b])=>result.resources[id]&&b.lot===result.resources[id].lot&&b.grams===result.resources[id].grams&&b.grind===result.resources[id].grind&&['Gourmet','Monte Alto'].includes(b.line)).map(([id,b])=>[id,{line:b.line,lot:b.lot,grams:b.grams,grind:b.grind}]));
 if(result.profile!=='seller'){
  const raw=props.getProperty('CV_5G4_OPENING_PROPOSAL');
  if(raw){const prior=CV_SCOPE53_ACTIVE;try{CV_SCOPE53_ACTIVE=true;const bundle=CV52Bundle.verifyBundle(JSON.parse(raw));result.openingProposal54=bundle;}catch{result.openingProposalError54='OPENING_PROPOSAL_INVALID';}finally{CV_SCOPE53_ACTIVE=prior;}}
 }
 if(envelope.request.payload.backup54===true){
  if(result.profile!=='administrator')return {error:'PERMISSION_DENIED',retryable:false};
  const prior=CV_SCOPE53_ACTIVE;try{
   CV_SCOPE53_ACTIVE=true;
   result.backupArchive54=cvLocked_(()=>{
    const actor=zeroActor_(zeroProof_(envelope),zeroPropertyLog_('ZERO_USER_'),props);
    if(actor.role!=='administrator')throw Error('PERMISSION_DENIED');
    const proposal=props.getProperty('CV_5G4_OPENING_PROPOSAL'),backend=props.getProperty('CV_5G4_BACKEND_SHA256'),worker=props.getProperty('CV_5G4_WORKER_SHA256');
    if(!proposal||! /^[a-f0-9]{64}$/.test(backend||'')||! /^[a-f0-9]{64}$/.test(worker||''))throw Error('BACKUP_VERSION_REQUIRED');
    const store=invEngine_().store,journal=store.readJournal(),effects=store.readEffects();
    return CV54Backup.pack({environment:'TEST_ONLY',syntheticOnly:true,journal,effects,configuration:{continuity:JSON.parse(props.getProperty('CV_5G3_CONTINUITY_CONFIG')||'{}'),catalogue:JSON.parse(props.getProperty('CV_5G3_CATALOGUE_CONFIG')||'{}'),schema:'SCOPED_5G4_V1'},openingBundle:CV52Bundle.verifyBundle(JSON.parse(proposal)),codeHashes:{backend,worker},operationMetadata:{preparedIds:journal.filter(r=>r.kind==='PREPARED').map(r=>r.id),source:'SERVER_JOURNAL_ONLY',browserPendingQueuesIncluded:false}});
   });
  }catch(e){return {error:/^[A-Z_]+$/.test(e.message)?e.message:'BACKUP_UNAVAILABLE',retryable:false};}finally{CV_SCOPE53_ACTIVE=prior;}
 }
 return result;
 }catch{return {error:'LAB_CONFIG_INVALID',retryable:false};}
};
