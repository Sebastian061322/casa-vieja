// Prueba de red explícita: solo claves públicas y firma ficticia inválida.
const keys=await (await fetch('https://www.googleapis.com/oauth2/v3/certs',{signal:AbortSignal.timeout(15000)})).json();
const b=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
const token=b({alg:'RS256',kid:keys.keys[0].kid})+'.'+b({sub:'123456',aud:'synthetic-invalid',iss:'https://accounts.google.com'})+'.'+Buffer.alloc(256).toString('base64url');
const r=await fetch('https://casa-vieja-lab-auth.portopelaez1009.workers.dev/api',{method:'POST',signal:AbortSignal.timeout(45000),headers:{origin:'https://casa-vieja-lab-auth.portopelaez1009.workers.dev','content-type':'application/json',authorization:'Bearer '+token},body:JSON.stringify({action:'bootstrap',payload:null})});
console.log(JSON.stringify({syntheticInvalidSignature:true,status:r.status,result:await r.json()}));
