'use strict';
// Frontera de confianza del futuro proxy. Sin red, secretos persistidos ni recursos creados.
const crypto=require('node:crypto'),{canonical}=require('../fase3/journal.js');
const sign=(payload,secret)=>crypto.createHmac('sha256',secret).update(canonical(payload)).digest('base64');
async function envelope({idToken,action,payload,verifyIdToken,audience,secret,now=Date.now}){
 if(typeof idToken!=='string'||!idToken||idToken.length>16000||typeof secret!=='string'||secret.length<32)throw Error('AUTH_CONFIGURATION');
 // En producción este adaptador debe usar google-auth-library, no decodificar JWT sin verificar.
 const claims=await verifyIdToken(idToken,audience),time=now();
 if(!claims||!['accounts.google.com','https://accounts.google.com'].includes(claims.iss)||claims.aud!==audience||typeof claims.sub!=='string'||!/^[0-9]{5,64}$/.test(claims.sub)||claims.email_verified!==true||!Number.isSafeInteger(claims.exp)||claims.exp*1000<=time||!Number.isSafeInteger(claims.iat)||claims.iat*1000>time+30000)throw Error('IDENTITY_REQUIRED');
 if(!['bootstrap','execute','status','snapshot','reports','dashboard'].includes(action)||JSON.stringify(payload??null).length>25000)throw Error('INVALID_REQUEST');
 const request={version:1,destination:'TEST_ONLY_V3',subject:'google:'+claims.sub,issuedAt:time,expiresAt:Math.min(time+60000,claims.exp*1000),requestId:crypto.randomUUID(),action,payload:payload??null};
 return {request,mac:sign(request,secret)};
}
function verify(envelope,{secret,now=Date.now}){
 const r=envelope?.request;if(!r||typeof envelope.mac!=='string'||typeof secret!=='string'||secret.length<32)throw Error('IDENTITY_REQUIRED');
 const expected=Buffer.from(sign(r,secret)),actual=Buffer.from(envelope.mac);if(expected.length!==actual.length||!crypto.timingSafeEqual(expected,actual))throw Error('IDENTITY_REQUIRED');
 const time=now();if(r.version!==1||r.destination!=='TEST_ONLY_V3'||!Number.isSafeInteger(r.issuedAt)||!Number.isSafeInteger(r.expiresAt)||r.issuedAt>time+30000||r.expiresAt<=time||r.expiresAt-r.issuedAt>60000||typeof r.subject!=='string'||!/^google:[0-9]{5,64}$/.test(r.subject)||typeof r.requestId!=='string'||r.requestId.length>120)throw Error('IDENTITY_REQUIRED');
 return JSON.parse(JSON.stringify(r));
}
module.exports={envelope,verify,sign};
