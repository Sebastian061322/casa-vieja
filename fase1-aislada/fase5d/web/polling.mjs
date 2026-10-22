// Solo suspende consultas automáticas; no modifica colas, recibos ni confirmaciones.
export function startLabPolling({sync,allowed,documentRef=document,windowRef=window,navigatorRef=navigator,setIntervalFn=setInterval,clearIntervalFn=clearInterval}){
 let running=false,stopped=false;
 const tick=async()=>{if(stopped||running||documentRef.visibilityState!=='visible'||navigatorRef.onLine===false||!allowed())return;running=true;try{await sync();}finally{running=false;}};
 const onVisible=()=>{if(documentRef.visibilityState==='visible')void tick();};
 const onOnline=()=>void tick();
 const timer=setIntervalFn(()=>void tick(),30000);
 documentRef.addEventListener('visibilitychange',onVisible);windowRef.addEventListener('online',onOnline);
 return ()=>{stopped=true;clearIntervalFn(timer);documentRef.removeEventListener('visibilitychange',onVisible);windowRef.removeEventListener('online',onOnline);};
}
