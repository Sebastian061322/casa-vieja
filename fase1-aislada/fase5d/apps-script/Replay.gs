/* Consumir dentro del mismo ScriptLock que protege el diario.
 * El nonce protege transporte; operationId protege la operación comercial.
 * Solo caducan metadatos de transporte, nunca registros comerciales. */
function zeroConsumeNonce_(request, properties, now) {
  if (request.expiresAt <= now || request.issuedAt > now + 30000 ||
      request.expiresAt - request.issuedAt > 30000 ||
      !/^[a-zA-Z0-9_-]{8,120}$/.test(request.requestId)) throw Error('IDENTITY_REQUIRED');
  const key = 'ZERO_REPLAY_WINDOW';
  const raw = properties.getProperty(key);
  const saved = raw ? JSON.parse(raw) : [];
  if (!Array.isArray(saved) || saved.some(x => !Array.isArray(x) ||
      typeof x[0] !== 'string' || !Number.isSafeInteger(x[1]))) throw Error('REPLAY_STATE_INVALID');
  const active = saved.filter(x => x[1] > now);
  if (active.some(x => x[0] === request.requestId)) throw Error('REQUEST_REPLAYED');
  if (active.length >= 64) throw Error('REPLAY_WINDOW_FULL');
  active.push([request.requestId, request.expiresAt]);
  const next = JSON.stringify(active);
  if (next.length > 7500) throw Error('REPLAY_WINDOW_FULL');
  properties.setProperty(key, next);
  if (properties.getProperty(key) !== next) throw Error('REPLAY_STATE_NOT_DURABLE');
}
