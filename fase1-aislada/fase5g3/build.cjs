'use strict';
// Solo genera un artefacto local. No crea pestañas, despliega ni accede a Google.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=__dirname,sha=x=>crypto.createHash('sha256').update(x).digest('hex');
let base=fs.readFileSync(path.join(root,'../fase5g2/build/Candidate.gs'),'utf8');
if(sha(base)!=='080a6e6e0cb0813cb8741a3d7b63a3cf0c30c943150a11369c0490b46e9dc31c')throw Error('BASE_CHANGED_REVIEW_REQUIRED');
const original=base.match(/function invEngine_\(\)\{[\s\S]*?\n\}/)?.[0];
if(!original||!original.includes('EFFECT_NOT_DURABLE'))throw Error('STORE_ADAPTER_CHANGED');
const needle="getProperty('CV_5G2_CONTINUITY_CONFIG')";
if(base.split(needle).length!==2)throw Error('CONFIG_ADAPTER_CHANGED');
base=base.replace(needle,"getProperty(CV_SCOPE53_ACTIVE?'CV_5G3_CONTINUITY_CONFIG':'CV_5G2_CONTINUITY_CONFIG')");
const names=['TEST_ONLY_5G3_Diario','TEST_ONLY_5G3_Movimientos','TEST_ONLY_5G3_Verificaciones'];
const scoped=original.replace('function invEngine_()','function cvScopedEngine53_()').replaceAll('INV_TABS_','CV_SCOPE53_TABS');
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'catalogue-source.json'),'utf8'));
const catalogueModule=fs.readFileSync(path.join(root,'catalogue-sale.cjs'),'utf8');
const code=base+'\n'+`/* 5G.3: aislamiento TEST_ONLY explícito, apagado por defecto. */
var CV_SCOPE53_ACTIVE=false;
const CV_SCOPE53_TABS=${JSON.stringify(names)};
INV_TABS_.push(...CV_SCOPE53_TABS);
// El ensayo previo al lanzamiento usa la fecha real del servidor y un acta
// TEST_ONLY anterior. No falsear el reloj de autenticación ni el de auditoría.
const CV53PriorOpeningVerify=CV52BaseOpening.verify;
CV52BaseOpening.verify=function(act){
 if(!CV_SCOPE53_ACTIVE)return CV53PriorOpeningVerify(act);
 const date=act?.effectiveAt;
 if(typeof date!=='string'||!/^\\d{4}-\\d{2}-\\d{2}T00:00:00-05:00$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(Date.parse(date)-18000000).toISOString().slice(0,10)!==date.slice(0,10))throw Error('SYNTHETIC_ACT_DATE_INVALID');
 const result=CV53PriorOpeningVerify({...act,effectiveAt:'2026-11-01T00:00:00-05:00'});
 return {...result,sha256:CV52Bundle.hash(act)};
};
${scoped}
const CV53OriginalEngine=invEngine_;
invEngine_=function(){return CV_SCOPE53_ACTIVE?cvScopedEngine53_():CV53OriginalEngine();};
const CV53OriginalRequest=zeroRequest;
zeroRequest=function(envelope){
 const prior=CV_SCOPE53_ACTIVE;
 try{
  const r=zeroProof_(envelope),p=r.payload;
  const id=r.action==='status'?p:p?.operationId;
  const prefixed=typeof id==='string'&&id.startsWith('TEST_ONLY_5G3_');
  const explicit=p&&typeof p==='object'&&p.continuityScope==='TEST_ONLY_CONTINUITY_5G3';
  const newType=r.action==='execute'&&['OPEN_CONTINUITY','CONTINUITY_PAYMENT','CONTINUITY_DISPATCH','CONTINUITY_DELIVER','CONTINUITY_CANCEL'].includes(p?.type);
  if(p?.continuityScope&&!explicit)throw Error('LAB_SCOPE_INVALID');
  if((prefixed&&!explicit&&r.action!=='status')||(newType&&!explicit))throw Error('LAB_SCOPE_REQUIRED');
  const scoped=explicit||(r.action==='status'&&prefixed);
  if(scoped){
   if(!['execute','status','snapshot','reports'].includes(r.action))throw Error('LAB_SCOPE_ACTION_FORBIDDEN');
   if(r.action==='execute'&&!prefixed)throw Error('LAB_OPERATION_PREFIX_REQUIRED');
   if(cvProps5g_().getProperty('CV_5G3_SCOPE_ENABLED')!=='YES')throw Error('LAB_SCOPE_DISABLED');
   const ss=cvBook_();for(const name of CV_SCOPE53_TABS){const sh=ss.getSheetByName(name);if(!sh)throw Error('LAB_SCOPE_SETUP_REQUIRED');const h=sh.getRange(1,1,1,3).getValues()[0];if(JSON.stringify(h)!==JSON.stringify(['ID','Tipo','JSON']))throw Error('LAB_SCOPE_HEADER_INVALID');}
  }
  CV_SCOPE53_ACTIVE=scoped;
  const result=CV53OriginalRequest(envelope);
  if(result?.error&&/^(CATALOGUE_|BUNDLE_COMPOSITION_|COMMERCIAL_LOT_|COMMERCIAL_LINE_|INVALID_PACK_COUNT$|INVALID_SELECTION|INTERNAL_OFFER_)/.test(result.error))return {...result,retryable:false};
  return result;
 }catch(e){return {error:/^[A-Z_]+$/.test(e.message)?e.message:'SERVER_UNAVAILABLE',retryable:false};}
 finally{CV_SCOPE53_ACTIVE=prior;}
};
const CV53CatalogueSource=${JSON.stringify(catalogue)};
const CV53CatalogueRules=(()=>{const module={exports:{}};const require=n=>{if(n==='../fase3/journal.js')return CVInventoryBase;if(n==='../fase5g2/opening.cjs')return CV52Bundle;throw Error('LOCAL_DEPENDENCY_FORBIDDEN')};\n${catalogueModule}\nreturn module.exports;})();
const CV53PlanBeforeCatalogue=CVZeroAccess.Engine.prototype.plan;
CVZeroAccess.Engine.prototype.plan=function(state,command){
 if(!CV_SCOPE53_ACTIVE)return CV53PlanBeforeCatalogue.call(this,state,command);
 if(command.type==='CONFIGURE_OFFER'&&command.offer?.id?.startsWith('demo:cv53_internal_'))throw Error('INTERNAL_OFFER_FORBIDDEN');
 if(['REGISTER_SALE','RESERVE_SALE'].includes(command.type)){
  const raw=cvProps5g_().getProperty('CV_5G3_CATALOGUE_CONFIG'),cfg=raw?JSON.parse(raw):null;
  if(cfg?.enabled===true||command.catalogueOfferId!==undefined){const prepared=CV53CatalogueRules.prepareSale(state,command,cfg,CV53CatalogueSource,this.context.now());const plan=CV53PlanBeforeCatalogue.call(this,prepared.state,prepared.command);plan.catalogueRef=prepared.catalogueRef;plan.sale.commercial.catalogueRef=prepared.catalogueRef;return plan;}
 }
 return CV53PlanBeforeCatalogue.call(this,state,command);
};
`;
fs.mkdirSync(path.join(root,'build'),{recursive:true});fs.writeFileSync(path.join(root,'build/Candidate.gs'),code);
const manifest={environment:'TEST_ONLY',status:'LOCAL_PREPARATION_NOT_RC',baseSha256:'080a6e6e0cb0813cb8741a3d7b63a3cf0c30c943150a11369c0490b46e9dc31c',backendSha256:sha(code),proposedTabs:names,defaultEnabled:false,tabsCreated:false,remoteChanged:false,workerChanged:false,commercialReady:false};
fs.writeFileSync(path.join(root,'build/manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest));
