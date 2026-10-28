// Web Crypto local. No claves en red, almacenamiento del navegador o consola.
const canonical=x=>Array.isArray(x)?'['+x.map(canonical).join(',')+']':x&&typeof x==='object'?'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}':JSON.stringify(x);
const utf8=new TextEncoder(),hex=bytes=>[...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,'0')).join('');
const b64=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes))),unb64=s=>Uint8Array.from(atob(s),x=>x.charCodeAt(0));
const digest=async value=>hex(await crypto.subtle.digest('SHA-256',utf8.encode(canonical(value))));
const fileHash=async text=>hex(await crypto.subtle.digest('SHA-256',utf8.encode(text)));
export async function verifyArchive54(archive){
 if(archive?.environment!=='TEST_ONLY'||archive.schemaVersion!==1)throw Error('TEST_ONLY_BACKUP_REQUIRED');const {sha256,...body}=archive;
 if(await digest(body)!==sha256)throw Error('BACKUP_HASH_MISMATCH');
 for(const section of Object.values(archive.sections))if(await digest(section.value)!==section.sha256)throw Error('SECTION_HASH_MISMATCH');
 return {archiveHash:sha256,journal:archive.sections.journal.value.length,effects:archive.sections.effects.value.length,environment:'TEST_ONLY'};
}
export async function encryptArchive54(archive){
 const verified=await verifyArchive54(archive),raw=crypto.getRandomValues(new Uint8Array(32)),iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['encrypt']);
 const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:utf8.encode('CV_TEST_ONLY_5G2'),tagLength:128},key,utf8.encode(JSON.stringify(archive))));
 const sealed={schemaVersion:1,environment:'TEST_ONLY',algorithm:'AES-256-GCM',iv:b64(iv),tag:b64(encrypted.slice(-16)),ciphertext:b64(encrypted.slice(0,-16))};
 const keyBase64=b64(raw);raw.fill(0);
 const fileText=JSON.stringify(sealed);return {sealed,fileText,keyBase64,encryptedFileHash:await fileHash(fileText),...verified};
}
export async function decryptArchive54(sealed,keyBase64,expectedEncryptedHash){
 if(!/^[a-f0-9]{64}$/.test(expectedEncryptedHash||'')||await fileHash(JSON.stringify(sealed))!==expectedEncryptedHash)throw Error('INDEPENDENT_FILE_HASH_REQUIRED');
 if(sealed?.environment!=='TEST_ONLY'||sealed.schemaVersion!==1||sealed.algorithm!=='AES-256-GCM')throw Error('ENCRYPTED_SCHEMA_REJECTED');
 const raw=unb64(keyBase64);if(raw.length!==32)throw Error('KEY_REQUIRED');
 const key=await crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt']);raw.fill(0);
 const data=new Uint8Array([...unb64(sealed.ciphertext),...unb64(sealed.tag)]);
 const clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(sealed.iv),additionalData:utf8.encode('CV_TEST_ONLY_5G2'),tagLength:128},key,data);
 const archive=JSON.parse(new TextDecoder().decode(clear));return {archive,verified:await verifyArchive54(archive)};
}
export async function decryptFile54(text,keyBase64,expectedHash){if(await fileHash(text)!==expectedHash)throw Error('INDEPENDENT_FILE_HASH_REQUIRED');return decryptArchive54(JSON.parse(text),keyBase64,expectedHash);}
