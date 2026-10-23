// Una medición por invocación; solo ID aleatorio y duraciones, sin identidad ni payload.
const CV5EMetrics={current:null,measure(name,fn){const start=Date.now();try{return fn()}finally{if(this.current)this.current[name]=(this.current[name]||0)+Math.max(0,Date.now()-start);}}};
function cvLocked_(fn){const lock=LockService.getScriptLock();CV5EMetrics.measure('lockWaitMs',()=>lock.waitLock(30000));try{return CV5EMetrics.measure('lockHeldMs',fn)}finally{lock.releaseLock()}}
function invRead_(ss,name){return CV5EMetrics.measure('sheetReadMs',()=>invReadBase5e_(ss,name));}
function invAppend_(ss,name,row){return CV5EMetrics.measure('sheetWriteMs',()=>invAppendBase5e_(ss,name,row));}
function zeroRequest(envelope){
  const start=Date.now();CV5EMetrics.current={};let result;
  try{result=zeroRequestBase5e_(envelope);
    if(CV5EMetrics.current.adminProbe===true&&result?.profile==='administrator'&&result.uiVersion==='5D'&&!result.error){
      const durations={};for(const key of ['proofMs','lockWaitMs','lockHeldMs','sheetReadMs','sheetWriteMs','sheetReadbackMs','reconstructMs','reportsMs'])durations[key]=CV5EMetrics.current[key]||0;
      result={...result,diagnostics5e:{kind:'CV_5E_READ_TIMING',traceId:envelope.request.requestId,totalMs:Math.max(0,Date.now()-start),...durations}};
    }
    return result}
  finally{
    const metrics=CV5EMetrics.current;CV5EMetrics.current=null;
    // No publicar tiempos de peticiones sin prueba de identidad válida.
    if(metrics.authorized===true){delete metrics.authorized;delete metrics.adminProbe;console.log(JSON.stringify({kind:'CV_5E_TIMING',traceId:envelope.request.requestId,totalMs:Math.max(0,Date.now()-start),...metrics}));}
  }
}
