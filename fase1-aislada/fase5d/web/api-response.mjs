// Conserva el recibo de negocio sin confundirlo con errores de identidad o red.
export async function readLabResponse(response,action){
 const body=await response.json();
 if(body?.error){const error=Error(body.error);
  if(response.ok&&['execute','status'].includes(action)&&!['ACCESS_DENIED','IDENTITY_REQUIRED'].includes(body.error)&&typeof body.retryable==='boolean'){error.serverResult=body;error.permanent=body.retryable===false;}
  throw error;
 }
 if(!response.ok)throw Error('SERVICE_UNAVAILABLE');return body;
}
export async function operationResult(call){try{return await call();}catch(error){if(error.serverResult)return error.serverResult;throw error;}}
