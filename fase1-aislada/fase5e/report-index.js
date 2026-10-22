(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CV5EReports=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const contexts=new WeakMap();
function withState(state,fn){
  if(contexts.has(state))return fn();
  const index=new Map();for(const event of state.commerce.events){const rows=index.get(event.saleId)||[];rows.push(event);index.set(event.saleId,rows);}
  contexts.set(state,index);try{return fn()}finally{contexts.delete(state)}
}
function attach(Engine){
  const report=Engine.prototype.reports,financial=Engine.prototype.financial;
  Engine.prototype.reports=function(state,...args){return withState(state,()=>report.call(this,state,...args));};
  Engine.prototype.financial=function(state,id){const index=contexts.get(state);return financial.call(this,index?{...state,commerce:{...state.commerce,events:index.get(id)||[]}}:state,id);};
}
return {withState,attach};
});
