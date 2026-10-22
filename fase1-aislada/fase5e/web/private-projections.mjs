// Solo se retiran cachés reconstruibles. Comandos, recibos y borradores permanecen durables.
const clone = value => structuredClone(value);
const cacheKeys = ['snapshot', 'uxHome5a2'];
export class PrivateProjectionStore {
  constructor(base, profile) { this.base = base; this.name = base.name; this.private = profile !== 'seller'; this.cache = {}; }
  async initialize() {
    if (this.private) await this.base.transact(state => { for (const key of cacheKeys) delete state[key]; });
    return this;
  }
  async read() {
    const state = await this.base.read();
    if (this.private) { for (const key of cacheKeys) delete state[key]; Object.assign(state, clone(this.cache)); }
    return state;
  }
  async transact(fn) {
    if (!this.private) return this.base.transact(fn);
    let next;
    await this.base.transact(state => {
      for (const key of cacheKeys) delete state[key];
      Object.assign(state, clone(this.cache));
      fn(state);
      next = {};
      for (const key of cacheKeys) { if (key in state) next[key] = clone(state[key]); delete state[key]; }
    });
    // Un fallo de persistencia no debe publicar una proyección que no se guardó.
    this.cache = next;
  }
  clearMemory() { this.cache = {}; }
}
