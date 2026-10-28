// Solo para consola UI del perfil/equipo autorizado. No pegar en otra web.
// No red, aperturas de bases, lecturas de credenciales ni escrituras de almacenamiento.
(async () => {
  if (location.origin !== 'https://sebastian061322.github.io' || location.pathname !== '/casa-vieja/') {
    console.log('CV_5G2_CENSUS', {status:'WRONG_ORIGIN_OR_PATH'}); return;
  }
  const queues = ['casa_vieja_outbox','casa_vieja_failed_ops'].map(key => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return {key,present:false,count:0,states:{}};
      let rows;
      try { rows = JSON.parse(raw); } catch { return {key,present:true,count:null,error:'MALFORMED_JSON'}; }
      if (!Array.isArray(rows)) return {key,present:true,count:null,error:'UNKNOWN_SCHEMA'};
      const states = {};
      for (const row of rows) {
        const value = row?.state ?? row?.status;
        const state = ['PENDING','PREPARED','COMMITTED','REJECTED','UNKNOWN'].includes(value) ? value : 'STATE_NOT_RECORDED';
        states[state] = (states[state] || 0) + 1;
      }
      return {key,present:true,count:rows.length,states};
    } catch { return {key,count:null,error:'STORAGE_UNAVAILABLE'}; }
  });
  let databases = null, databaseStatus = 'UNSUPPORTED';
  try {
    if (typeof indexedDB !== 'undefined' && typeof indexedDB.databases === 'function') {
      databases = (await indexedDB.databases()).map(x=>({name:x.name,version:x.version}));
      databaseStatus = 'NAMES_VERSIONS_ONLY';
    }
  } catch { databaseStatus = 'METADATA_UNAVAILABLE'; }
  console.log('CV_5G2_CENSUS', JSON.stringify({origin:location.origin,path:location.pathname,readOnly:true,queues,databases,databaseStatus,indexedDbContentsRead:false,receipts:'NOT_ESTABLISHED',lastSync:'NOT_ESTABLISHED',endpoint:'NOT_READ',effectiveVersion:'NOT_ESTABLISHED'}));
})();
