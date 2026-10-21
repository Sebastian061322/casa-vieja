// Credencial solo en memoria. Cerrar sesión invalida respuestas en tránsito.
export function createSession({send, clearView = () => {}}) {
  let generation = 0, token = null, identity = null;
  const check = expected => { if (generation !== expected) throw Error('SESSION_CHANGED'); };
  function logout() { generation++; token = null; identity = null; clearView(); }
  async function sendCurrent(expected, credential, action, payload) {
    try { const result = await send(credential, action, payload); check(expected); return result; }
    catch (error) {
      check(expected);
      if (['ACCESS_DENIED','IDENTITY_REQUIRED'].includes(error.message)) logout();
      throw error;
    }
  }
  async function login(credential) {
    logout(); const expected = generation;
    const boot = await sendCurrent(expected, credential, 'bootstrap', null);
    check(expected);
    if (!/^google:[0-9]{5,64}$/.test(boot?.subject) ||
        !['administrator','operations','seller'].includes(boot.profile) ||
        boot.environment !== 'TEST_ONLY' || boot.destination !== 'TEST_ONLY_ZERO_1') throw Error('IDENTITY_REQUIRED');
    token = credential; identity = {subject:boot.subject, profile:boot.profile};
    return {...identity};
  }
  async function invoke(action, payload) {
    if (!token || !identity) throw Error('REAUTHENTICATION_REQUIRED');
    const expected = generation, credential = token, actor = {...identity};
    const boot = await sendCurrent(expected, credential, 'bootstrap', null); check(expected);
    if (boot?.subject !== actor.subject || boot?.profile !== actor.profile) {
      logout(); throw Error('ACCOUNT_OR_PROFILE_CHANGED');
    }
    const response = action === 'bootstrap' ? boot : await sendCurrent(expected, credential, action, payload);
    check(expected); return response;
  }
  return {login, logout, invoke, current:() => identity ? {...identity} : null};
}
