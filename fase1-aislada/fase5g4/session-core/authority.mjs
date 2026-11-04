// Candidate for the existing AUTH authority. The adapter must hold the script lock
// for each call and store only credential digests. Call issue after verified login.
const DIGEST = /^[a-f0-9]{64}$/;
const ROLES = new Set(['administrator', 'operations', 'seller']);

export function sessionAuthority({ store, lookupActor, now, idleMs, absoluteMs, renewAfterMs }) {
  if (![idleMs, absoluteMs, renewAfterMs].every(Number.isSafeInteger) ||
      renewAfterMs <= 0 || idleMs <= renewAfterMs || absoluteMs < idleMs) {
    throw Error('SESSION_POLICY_INVALID');
  }

  function activeActor(subject) {
    const actor = lookupActor(subject);
    return actor?.subject === subject && ROLES.has(actor.role) ? actor : null;
  }

  function issue(digest, verifiedSubject, identityExpiresAt) {
    const time = now();
    if (!DIGEST.test(digest) || !Number.isSafeInteger(identityExpiresAt) ||
        identityExpiresAt <= time || !activeActor(verifiedSubject) || store.get(digest)) {
      throw Error('SESSION_ISSUE_DENIED');
    }
    const session = {
      subject: verifiedSubject,
      absoluteExpiry: time + absoluteMs,
      idleExpiry: time + idleMs,
      renewedAt: time
    };
    store.put(digest, session);
    return session;
  }

  function resolve(digest) {
    if (!DIGEST.test(digest)) return null;
    const session = store.get(digest);
    if (!session) return null;
    const time = now();
    const actor = activeActor(session.subject);
    if (!actor || time >= session.idleExpiry || time >= session.absoluteExpiry) {
      store.remove(digest);
      return null;
    }
    if (time - session.renewedAt >= renewAfterMs) {
      session.idleExpiry = Math.min(time + idleMs, session.absoluteExpiry);
      session.renewedAt = time;
      store.put(digest, session);
    }
    return { subject: actor.subject, role: actor.role, expiresAt: session.idleExpiry };
  }

  function revoke(digest) {
    if (DIGEST.test(digest)) store.remove(digest);
  }

  return { issue, resolve, revoke };
}
