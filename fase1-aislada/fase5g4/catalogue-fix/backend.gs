/* Decoración HTTP explícita. Solo fuente/configuración TEST_ONLY verificadas. */
function cvCatalogueUtf8Hash54_(value){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,CVInventoryBase.canonical(value),Utilities.Charset.UTF_8).map(x=>('0'+((x+256)%256).toString(16)).slice(-2)).join('');}
const CV54StableHttpGateway_=zeroRequest;
function cvHttpGateway54_(envelope){
 const result=CV54StableHttpGateway_(envelope),request=envelope?.request;
 if(result?.error||request?.action!=='snapshot'||request.payload?.continuityScope!=='TEST_ONLY_CONTINUITY_5G3')return result;
 if(!result||result.uiVersion!=='5D'||!['administrator','operations','seller'].includes(result.profile))return {error:'SNAPSHOT_CONTRACT_INVALID',retryable:false};
 try{
  const raw=PropertiesService.getScriptProperties().getProperty('CV_5G3_CATALOGUE_CONFIG'),cfg=raw?JSON.parse(raw):{},serverHash=cvCatalogueUtf8Hash54_(CV53CatalogueSource);
  const before={present:!!result.catalogue54,enabled:result.catalogue54?.enabled===true};
  const enabled=cfg.environment==='TEST_ONLY'&&cfg.enabled===true&&cfg.approvalKind==='SYNTHETIC_TEST_APPROVAL'&&cfg.catalogueHash===serverHash;
  const next={...result,catalogue54:{version:CV53CatalogueSource.version,enabled,offers:CVInventoryBase.clone(CV53CatalogueSource.offers)},resourceLines54:Object.fromEntries(Object.entries(cfg.resourceLines||{}).filter(([id,b])=>result.resources[id]&&b.lot===result.resources[id].lot&&b.grams===result.resources[id].grams&&b.grind===result.resources[id].grind&&['Gourmet','Monte Alto'].includes(b.line)).map(([id,b])=>[id,{line:b.line,lot:b.lot,grams:b.grams,grind:b.grind}]))};
  if(request.payload.diagnostics54===true){
   if(result.profile!=='administrator')return {error:'PERMISSION_DENIED',retryable:false};
   next.catalogueDiagnostics54={kind:'CV_5G4_CATALOGUE_CONTRACT',environment:'TEST_ONLY',configurationPresent:!!raw,environmentMatches:cfg.environment==='TEST_ONLY',enabledFlag:cfg.enabled===true,approvalKindMatches:cfg.approvalKind==='SYNTHETIC_TEST_APPROVAL',configuredHash:cfg.catalogueHash||null,serverUtf8Hash:serverHash,legacyHash:CV52Bundle.hash(CV53CatalogueSource),hashMatches:cfg.catalogueHash===serverHash,sourceVersion:CV53CatalogueSource.version,offers:CV53CatalogueSource.offers.length,resourceBindings:Object.keys(next.resourceLines54).length,resources:Object.keys(result.resources).length,priorDecorator:before,catalogueEnabled:enabled};
  }
  return next;
 }catch{return {error:'CATALOGUE_CONFIG_INVALID',retryable:false};}
}
const CV54BeforeCreditGuard_=CVZeroAccess.Engine.prototype.plan;
CVZeroAccess.Engine.prototype.plan=function(state,command){
 const scopedDispatch=CV_SCOPE53_ACTIVE&&command.type==='DISPATCH_SALE';
 if(scopedDispatch&&state.sales[command.saleId]?.commercial&&this.financial(state,command.saleId).outstandingCents>0)throw Error('CREDIT_POLICY_REQUIRED');
 const plan=CV54BeforeCreditGuard_.call(this,state,command);
 if(scopedDispatch)plan.creditControl54={version:'NO_UNAPPROVED_CREDIT_1',outstandingBeforeCents:0,environment:'TEST_ONLY',productionApproved:false};
 return plan;
};
