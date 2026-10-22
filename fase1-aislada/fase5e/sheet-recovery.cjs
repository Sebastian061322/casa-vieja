'use strict';
// Transport for an explicitly approved, separate synthetic recovery workbook.
// This module performs no network calls and never overwrites existing rows.
const {canonical}=require('../fase3/journal.js');
const R=require('./recovery.cjs');
const DESTINATION='1zB8s5MZN-LGMpnHL3RkOvA802WVfPOPEkRgXmygNk0o';
const PREFIX='TEST_ONLY_5E_20261022_';
function guard(id,control){
  if(id!==DESTINATION||control?.[2]?.[1]!=='TEST_ONLY')throw Error('RECOVERY_DESTINATION_DENIED');
}
function encode(archive,expectedHash){
  R.verify(archive,expectedHash);
  const raw=Buffer.from(JSON.stringify(archive),'utf8').toString('base64');
  const chunks=raw.match(/.{1,16000}/g);
  const ledger=archive.payload.sections.ledger;
  const rows=list=>[['ID','Tipo','JSON'],...list.map(r=>[r.id,r.kind,JSON.stringify(r)])];
  return {
    [PREFIX+'ARCHIVE']:[['Parte','Total','SHA256','Base64'],...chunks.map((x,i)=>[i,chunks.length,expectedHash,x])],
    [PREFIX+'JOURNAL']:rows(ledger.journal),
    [PREFIX+'EFFECTS']:rows(ledger.effects),
    [PREFIX+'CONTROL']:[['Campo','Valor'],['Environment','TEST_ONLY'],['Expected archive',expectedHash],['Release',archive.payload.sections.release.commit],['State','INCOMPLETE']]
  };
}
function decode(tables,expectedHash){
  const rows=tables[PREFIX+'ARCHIVE'];
  if(!rows||canonical(rows[0])!==canonical(['Parte','Total','SHA256','Base64']))throw Error('ARCHIVE_HEADER');
  const parts=rows.slice(1);
  if(!parts.length||parts.some((r,i)=>r[0]!==i||r[1]!==parts.length||r[2]!==expectedHash||typeof r[3]!=='string'||!/^[A-Za-z0-9+/=]+$/.test(r[3])))throw Error('ARCHIVE_PARTS');
  const base64=parts.map(r=>r[3]).join(''),raw=Buffer.from(base64,'base64');
  if(raw.toString('base64')!==base64)throw Error('ARCHIVE_ENCODING');
  const archive=JSON.parse(raw.toString('utf8'));R.verify(archive,expectedHash);
  for(const [suffix,key]of [['JOURNAL','journal'],['EFFECTS','effects']]){
    const table=tables[PREFIX+suffix],expected=archive.payload.sections.ledger[key];
    if(!table||canonical(table[0])!==canonical(['ID','Tipo','JSON']))throw Error('LEDGER_HEADER');
    const parsed=table.slice(1).map(row=>{
      const item=JSON.parse(row[2]);if(row[0]!==item.id||row[1]!==item.kind)throw Error('LEDGER_COLUMNS');return item;
    });
    if(canonical(parsed)!==canonical(expected))throw Error('LEDGER_READBACK');
  }
  const control=tables[PREFIX+'CONTROL'];
  if(!control||control[1]?.[1]!=='TEST_ONLY'||control[2]?.[1]!==expectedHash||control[3]?.[1]!==archive.payload.sections.release.commit||control[4]?.[1]!=='INCOMPLETE'||![5,6].includes(control.length))throw Error('RECOVERY_CONTROL');
  if(control.length===6&&canonical(control[5])!==canonical(['VERIFIED',expectedHash]))throw Error('RECOVERY_CONTROL');
  return archive;
}
function missingRows(existing,expected){
  const plan=[];
  // Preflight every table before preparing any write: a later conflict blocks all.
  for(const name of Object.keys(existing))if(!(name in expected))throw Error('UNEXPECTED_RECOVERY_TAB');
  for(const [name,rows]of Object.entries(expected)){
    let old=existing[name]||[];
    if(name===PREFIX+'CONTROL'&&old.length===6&&canonical(old[5])===canonical(['VERIFIED',rows[2][1]]))old=old.slice(0,5);
    if(old.length>rows.length||old.some((r,i)=>canonical(r)!==canonical(rows[i])))throw Error('RESTORE_PREFIX_CONFLICT');
    if(old.length<rows.length)plan.push({sheet:name,startRow:old.length+1,rows:rows.slice(old.length)});
  }
  return plan;
}
module.exports={DESTINATION,PREFIX,guard,encode,decode,missingRows};
