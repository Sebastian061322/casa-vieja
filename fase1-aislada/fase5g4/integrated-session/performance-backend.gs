function cvEffectiveRequest72_(request, properties, users){
 if(request.sessionLookup72!==true)return request;
 if(request.subject!=='google:00000'||typeof request.sessionDigest63!=='string'||!/^[a-f0-9]{64}$/.test(request.sessionDigest63))throw Error('IDENTITY_REQUIRED');
 const session=cvSessions63_(properties,users).resolve(request.sessionDigest63);
 if(!session)throw Error('IDENTITY_REQUIRED');
 return {...request,sessionLookup72:false,subject:session.subject,sessionExpiresAt72:session.expiresAt};
}
