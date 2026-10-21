// Solo el intento más reciente puede montar la interfaz o cerrar su sesión.
export function createLoginFlow({session,prepare,show,onError}) {
  let sequence=0,inFlight=null;
  return {
    invalidate(){sequence++;},
    run(credential){
      if(inFlight?.credential===credential)return inFlight.promise;
      const promise=execute(credential),item={credential,promise};inFlight=item;
      const clear=()=>{if(inFlight===item)inFlight=null;};promise.then(clear,clear);
      return promise;
    }
  };
  async function execute(credential){
      const attempt=++sequence,current=()=>attempt===sequence;
      try {
        const identity=await session.login(credential);if(!current())return false;
        const boot=await session.invoke('bootstrap',null);if(!current())return false;
        const actor={...identity,capabilities:boot.capabilities};
        await prepare(actor,current);if(!current())return false;
        show(actor);return true;
      }catch(error){
        if(!current()||error.message==='SESSION_CHANGED')return false;
        session.logout();onError(error);return false;
      }
    }
}
