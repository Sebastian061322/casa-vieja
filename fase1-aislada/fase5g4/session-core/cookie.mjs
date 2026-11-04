const TOKEN = /^[a-f0-9]{64}$/;
const NAME = '__Host-cv-lab-session';

export async function createCredential() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = Array.from(bytes, b => b.toString(16).padStart(2,'0')).join('');
  return { token, digest: await credentialDigest(token) };
}

export async function credentialDigest(token) {
  if (typeof token !== 'string' || !TOKEN.test(token)) return null;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,'0')).join('');
}

export function sessionCookie(token, maxAge) {
  if (!Number.isSafeInteger(maxAge) || maxAge < 0 || (maxAge > 0 && !TOKEN.test(token))) {
    throw Error('SESSION_COOKIE_INVALID');
  }
  const value = maxAge ? token : '';
  return NAME + '=' + value + '; Path=/; Max-Age=' + maxAge + '; Secure; HttpOnly; SameSite=Strict';
}

export function readCredential(cookieHeader) {
  const values = (cookieHeader || '').split(';').map(v=>v.trim()).filter(v=>v.startsWith(NAME+'='));
  if (values.length !== 1) return null;
  const token = values[0].slice(NAME.length+1);
  return TOKEN.test(token) ? token : null;
}

export function isSameOriginMutation(request, origin) {
  return request.method === 'POST' && new URL(request.url).origin === origin &&
    request.headers.get('Origin') === origin;
}
