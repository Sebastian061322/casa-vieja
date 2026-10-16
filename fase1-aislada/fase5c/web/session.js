/* La identidad inicial proviene del backend autenticado. Nunca se toma de un selector de perfil. */
(function(root){
 async function start({root:container,transport,continuity}){
  let identity,verified=true;try{identity=await transport.request('bootstrap');if(identity.error)throw Error(identity.error);sessionStorage.setItem('cv5c.presentationIdentity',JSON.stringify({subject:identity.subject,profile:identity.profile}));}catch(error){verified=false;try{identity=JSON.parse(sessionStorage.getItem('cv5c.presentationIdentity')||'null')}catch(e){}if(!identity)throw error;}if(identity.error||!['sales','inventory'].includes(identity.profile)||!/^google:[0-9]{5,64}$/.test(identity.subject))throw Error('IDENTITY_REQUIRED');
  const subject=identity.subject,name='cv-commercial-sandbox-v5c-'+subject,baseStore=new CVClient.IndexedStore(name);
  const store={name,read:async()=>{const data=await baseStore.read();if(data.subject&&data.subject!==subject)throw Error('ACCOUNT_CHANGED');if(data.profile&&data.profile!==identity.profile)throw Error('PROFILE_CHANGED_REVIEW_REQUIRED');return data},transact:fn=>baseStore.transact(data=>{if(data.subject&&data.subject!==subject)throw Error('ACCOUNT_CHANGED');if(data.profile&&data.profile!==identity.profile)throw Error('PROFILE_CHANGED_REVIEW_REQUIRED');data.subject=subject;data.profile=identity.profile;fn(data)})};
  const ensureIdentity=async()=>{const current=await transport.request('bootstrap');if(current.error)throw Error(current.error);if(current.subject!==subject||current.profile!==identity.profile)throw Error('ACCOUNT_CHANGED_PENDING_PRESERVED');verified=true;};
  const currentTransport={execute:async c=>{await ensureIdentity();return transport.request('execute',c)},status:async id=>{await ensureIdentity();const r=await transport.request('status',id);if(r.error)throw Error(r.error);return r},snapshot:async p=>{await ensureIdentity();return transport.request('snapshot',p)}};
  const client=new CVClient.Client(store,currentTransport,'TEST_ONLY_V3',()=>crypto.randomUUID()),enqueue=client.enqueue.bind(client);
  client.enqueue=async payload=>{const review=await continuity();if(review.blocked)throw Error('CONTINUITY_REVIEW_REQUIRED');return enqueue(payload)};
  // Las confirmaciones propias pueden recuperarse aunque esté bloqueada la creación de pedidos nuevos.
  await client.flush();CVRoleUI.mount(container,identity,client,currentTransport);return {identity,client,verified,reauthenticate:async next=>{const verified=await next.request('bootstrap');if(verified.subject!==subject||verified.profile!==identity.profile)throw Error('ACCOUNT_CHANGED_PENDING_PRESERVED');transport=next;return client.flush()}};
 }
 root.CVRoleSession={start};
})(typeof globalThis==='object'?globalThis:this);
