'use strict';
// Preload de pruebas: fetch/HTTP salientes solo hacia 127.0.0.1.
const http=require('node:http'),https=require('node:https');
const local=input=>{const u=new URL(typeof input==='string'||input instanceof URL?input:input.url);if(u.protocol!=='http:'||u.hostname!=='127.0.0.1')throw Error('TEST_EXTERNAL_NETWORK_FORBIDDEN');};
const originalFetch=globalThis.fetch;globalThis.fetch=(input,...args)=>{local(input);return originalFetch(input,...args)};
for(const module of [http,https])for(const name of ['request','get']){const base=module[name];module[name]=function(input,...args){if(typeof input==='string'||input instanceof URL)local(input);else if(module===https||input.hostname!=='127.0.0.1')throw Error('TEST_EXTERNAL_NETWORK_FORBIDDEN');return base.call(this,input,...args);};}
