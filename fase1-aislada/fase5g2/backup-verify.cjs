'use strict';
// Reproductor local: el material de prueba llega por stdin y nunca se imprime.
const fs=require('node:fs'),B=require('./backup.cjs');
if(require.main===module){try{const key=Buffer.from(fs.readFileSync(0,'utf8').trim(),'base64'),sealed=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),archive=B.decrypt(sealed,key),data=B.unpack(archive);if(!/^[a-f0-9]{64}$/.test(process.argv[3]||'')||process.argv[3]!==archive.sha256)throw Error('INDEPENDENT_HASH_REQUIRED');console.log(JSON.stringify({environment:'TEST_ONLY',sha256:archive.sha256,journal:data.journal.length,effects:data.effects.length,keyPrinted:false}));key.fill(0);}catch{console.error('TEST_ONLY_BACKUP_VERIFICATION_FAILED');process.exitCode=1;}}
