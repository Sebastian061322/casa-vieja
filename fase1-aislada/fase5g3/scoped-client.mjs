// Adaptador de la cola existente: identidad verificada por createSession,
// base distinta y ámbito firmado por el Worker. No migra otras colas.
import {PrivateProjectionStore} from '../fase5e/web/private-projections.mjs';
import {operationResult} from '../fase5d/web/api-response.mjs';
const scope='TEST_ONLY_CONTINUITY_5G3',prefix='TEST_ONLY_5G3_',copy=x=>structuredClone(x);
const check=(ok,e)=>{if(!ok)throw Error(e)};
export async function createScopedClient({Client,IndexedStore,session,uuid}){
 const actor=session.current();check(/^google:[0-9]{5,64}$/.test(actor?.subject||'')&&['administrator','operations','seller'].includes(actor.profile),'VERIFIED_SESSION_REQUIRED');
 const guard=()=>{const now=session.current();check(now?.subject===actor.subject&&now?.profile===actor.profile,'ACCOUNT_OR_PROFILE_CHANGED');};
 const name='cv-zero-lab-5g3-v1-'+actor.subject;
 const store=await new PrivateProjectionStore(new IndexedStore(name),actor.profile).initialize();
 await store.transact(s=>{check(!s.continuityScope||s.continuityScope===scope,'INCOMPATIBLE_QUEUE_REVIEW_REQUIRED');check(!s.queue.length||s.zeroEngine===4&&s.continuityScope===scope&&s.queue.every(x=>x.command?.operationId?.startsWith(prefix)&&x.command.continuityScope===scope),'INCOMPATIBLE_QUEUE_REVIEW_REQUIRED');s.continuityScope=scope;s.zeroEngine=4;s.scopedDraftIds=s.scopedDraftIds||{};});
 const invoke=async(action,payload)=>{guard();const result=await (['execute','status'].includes(action)?operationResult(()=>session.invoke(action,payload)):session.invoke(action,payload));guard();return result;};
 const transport={status:id=>{check(typeof id==='string'&&id.startsWith(prefix),'SCOPED_OPERATION_REQUIRED');return invoke('status',id)},execute:c=>{check(c.operationId?.startsWith(prefix)&&c.continuityScope===scope,'SCOPED_OPERATION_REQUIRED');return invoke('execute',c)},snapshot:()=>invoke('snapshot',{format:'ui5d',continuityScope:scope})};
 const id=()=>prefix+uuid();const client=new Client(store,transport,'TEST_ONLY_V3',id);
 // Un draftId persistente identifica la intención; doble clic/reinicio no crea
 // otra operación. Una intención distinta necesita un draftId nuevo explícito.
 client.enqueue=async(payload,draftId)=>{guard();check(typeof draftId==='string'&&/^TEST_ONLY_DRAFT_[a-zA-Z0-9_-]{1,100}$/.test(draftId),'PERSISTENT_DRAFT_ID_REQUIRED');let answer;
  await store.transact(s=>{guard();const previous=s.scopedDraftIds[draftId];if(previous){check(previous.payload===JSON.stringify(payload),'DRAFT_CONTENT_CHANGED');const receipt=s.receipts[previous.operationId],pending=s.queue.find(x=>x.command.operationId===previous.operationId),archived=(s.archived||[]).find(x=>x.command.operationId===previous.operationId);answer={queued:!!pending,confirmed:!!receipt,operationId:previous.operationId,receipt:copy(receipt||null),state:pending?.state||archived?.state||(receipt?'COMMITTED':'UNKNOWN')};return;}
   check(!['operationId','deviceId','epoch','schemaVersion','continuityScope','role','subject','actor'].some(k=>k in payload),'CLIENT_IDENTITY_FIELDS_FORBIDDEN');
   s.deviceId=s.deviceId||id();const operationId=id(),command={...copy(payload),saleId:payload.saleId||'future:'+operationId,operationId,deviceId:s.deviceId,epoch:'TEST_ONLY_V3',schemaVersion:2,commercialVersion:4,continuityScope:scope};
   s.queue.push({command,state:'PENDING',lastError:''});s.scopedDraftIds[draftId]={operationId,payload:JSON.stringify(payload)};s.generation++;answer={queued:true,confirmed:false,operationId,command:copy(command),state:'PENDING'};
  });guard();return answer;
 };
 return {client,store,name,actor:copy(actor),scope,clearMemory:()=>store.clearMemory()};
}
