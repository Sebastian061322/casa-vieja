/* Solo dentro del ScriptLock, después de verificar HMAC y vigencia.
 * El correo proviene del token Google verificado por Worker, no del payload.
 * Los perfiles se obtienen exclusivamente de configuración privada del servidor. */
function zeroActor_(request, users, properties) {
  const events = users.read();
  if (events.some(row => row.target === request.subject)) {
    return CVZeroAccess.principal(request.subject, events);
  }
  if (request.action !== 'bootstrap') throw Error('ACCESS_DENIED');
  const email = request.verifiedEmail;
  if (typeof email !== 'string' || email.length > 254 || email !== email.toLowerCase()) throw Error('ACCESS_DENIED');
  const raw = properties.getProperty('ZERO_ENROLLMENT_EMAILS');
  if (!raw) throw Error('ACCESS_DENIED');
  const allowed = JSON.parse(raw);
  const roles = ['administrator','operations','seller'];
  if (!Array.isArray(allowed) || allowed.length !== 3 ||
      new Set(allowed.map(x=>x.email)).size !== 3 ||
      roles.some(role => allowed.filter(x=>x.role===role).length !== 1) ||
      allowed.some(x=>typeof x.email !== 'string' || x.email !== x.email.toLowerCase())) throw Error('ENROLLMENT_CONFIG_INVALID');
  const binding = allowed.find(row => row.email === email);
  if (!binding || events.some(row => row.enrollmentEmail === email)) throw Error('ACCESS_DENIED');
  users.append({kind:'ENROLLMENT',target:request.subject,role:binding.role,active:true,
    enrollmentEmail:email,actor:'AUTHORIZED_LAB_CONFIGURATION',serverAt:new Date().toISOString(),
    revision:events.length+1,operationId:'enroll-'+request.subject.slice(7)});
  return CVZeroAccess.principal(request.subject, users.read());
}
