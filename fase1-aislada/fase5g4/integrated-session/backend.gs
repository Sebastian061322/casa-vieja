function cvSessions63_(properties, users) {
 const key = 'CV_TEST_ONLY_SESSION_REGISTRY_63';
 const records = JSON.parse(properties.getProperty(key) || '{}');
 const now = Date.now();
 const save = () => {
  const value = JSON.stringify(records);
  if (value.length > 7500) throw Error('LAB_SESSION_CAPACITY');
  properties.setProperty(key,value);
  if (properties.getProperty(key) !== value) throw Error('SESSION_NOT_DURABLE');
 };
 const actor = subject => {
  try {return CVZeroAccess.principal(subject,users.read());} catch {return null;}
 };
 const authority = sessionAuthority63_({
  store:{
   get:d=>records[d],
   put:(d,v)=>{records[d]=v;save();},
   remove:d=>{if(Object.hasOwn(records,d)){delete records[d];save();}}
  },
  lookupActor:actor,now:()=>now,idleMs:8*3600000,absoluteMs:7*86400000,renewAfterMs:15*60000
 });
 return {
  issue(digest,subject,expiresAt,previousDigest){
   for(const [d,s] of Object.entries(records))
    if(s.idleExpiry<=now || s.absoluteExpiry<=now || d===previousDigest)delete records[d];
   if(Object.keys(records).length>=24)throw Error('LAB_SESSION_CAPACITY');
   return authority.issue(digest,subject,expiresAt);
  },
  resolve:authority.resolve,revoke:authority.revoke
 };
}

function cvSessionDispatch63_(request, properties, users) {
 const valid = digest => typeof digest==='string' && /^[a-f0-9]{64}$/.test(digest);
 if(['sessionResolve63','sessionEnd63'].includes(request.action)){
  if(request.subject!=='google:00000'||!valid(request.payload?.digest))throw Error('IDENTITY_REQUIRED');
  const sessions=cvSessions63_(properties,users);
  if(request.action==='sessionEnd63'){
   sessions.revoke(request.payload.digest);
   return {sessionEnded:true};
  }
  const session=sessions.resolve(request.payload.digest);
  if(!session)throw Error('IDENTITY_REQUIRED');
  return {session};
 }
 if(Object.hasOwn(request,'sessionDigest63')){
  if(!valid(request.sessionDigest63))throw Error('IDENTITY_REQUIRED');
  const session=cvSessions63_(properties,users).resolve(request.sessionDigest63);
  if(!session || session.subject!==request.subject)throw Error('IDENTITY_REQUIRED');
 }
 return null;
}
