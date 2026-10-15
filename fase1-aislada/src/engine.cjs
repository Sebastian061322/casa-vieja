'use strict';
// Modelo de referencia local. Sin red, credenciales, Sheets ni DOM.
const {createHash} = require('node:crypto');
const copy = x => JSON.parse(JSON.stringify(x));
const canonical = x => Array.isArray(x) ? '['+x.map(canonical).join(',')+']' : x && typeof x==='object' ? '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}' : JSON.stringify(x);
const hash = x => createHash('sha256').update(canonical(x)).digest('hex');
function check(ok, reason) { if(!ok) throw Error(reason); }
function integer(x,min=0) { check(Number.isSafeInteger(x)&&x>=min,'INVALID_INTEGER'); return x; }
class Journal {
  constructor(rows=[]) { this.rows=copy(rows); }
  append(row) { this.rows.push(copy(row)); }
}
class Engine {
  constructor(journal,opening) {
    check(opening.environment==='synthetic' && opening.epoch==='TEST_ONLY','NOT_A_SANDBOX');
    this.journal=journal; this.opening=copy(opening);
    Object.values(this.opening.resources).forEach(r=>{integer(r.qty);integer(r.unitCostCents);check(r.lot&&r.family&&r.unit,'INVALID_RESOURCE');});
  }
  state() {
    const s={revision:0,resources:copy(this.opening.resources),sales:{}};
    for(const row of this.journal.rows) if(row.type==='COMMITTED') {
      const prep=this.journal.rows.find(x=>x.type==='PREPARED'&&x.id===row.id);
      check(prep && prep.result.revision===s.revision+1,'CORRUPT_JOURNAL');
      for(const [key,delta] of Object.entries(prep.plan.deltas)) s.resources[key].qty+=delta;
      s.sales[prep.plan.saleId]=copy(prep.plan.sale);
      s.revision++;
    }
    return s;
  }
  status(id) {
    const row=this.journal.rows.find(x=>x.id===id&&x.type==='COMMITTED');
    const prep=this.journal.rows.find(x=>x.id===id&&x.type==='PREPARED');
    return row ? copy(prep.result) : {operationId:id,state:prep?'PREPARED':'UNKNOWN'};
  }
  execute(command, failAt='') {
    const c=copy(command); check(c.schemaVersion===1&&c.epoch==='TEST_ONLY','PROTOCOL_REJECTED');
    check(typeof c.operationId==='string'&&c.operationId.length>0&&typeof c.deviceId==='string'&&c.deviceId,'IDENTITY_REQUIRED');
    const digest=hash(c); const id=c.operationId;
    const existing=this.journal.rows.find(x=>x.id===id&&x.type==='PREPARED');
    if(existing) check(existing.digest===digest,'IDEMPOTENCY_CONFLICT');
    if(this.status(id).state==='COMMITTED') return this.status(id);
    // Un único escritor simulado. Un PREPARED bloquea nuevos comandos hasta recuperarse.
    check(!this.journal.rows.some(x=>x.type==='PREPARED'&&x.id!==id&&this.status(x.id).state!=='COMMITTED'),'RECOVERY_REQUIRED');
    if(!existing) {
      const s=this.state(); integer(c.expectedVersion);
      check(c.expectedVersion===s.revision,'VERSION_CONFLICT');
      const plan=this.plan(s,c);
      if(failAt==='beforePrepare') throw Error('INJECTED');
      this.journal.append({type:'PREPARED',id,digest,command:c,plan,result:{operationId:id,state:'COMMITTED',revision:s.revision+1}});
    }
    if(failAt==='afterPrepare') throw Error('INJECTED');
    // El plan completo es el efecto durable; no se escriben saldos parciales.
    this.journal.append({type:'COMMITTED',id});
    if(failAt==='afterCommit') throw Error('INJECTED');
    return this.status(id);
  }
  recover() {
    for(const row of [...this.journal.rows]) if(row.type==='PREPARED'&&this.status(row.id).state!=='COMMITTED') this.execute(row.command);
  }
  plan(s,c) {
    check(typeof c.saleId==='string'&&c.saleId.startsWith('future:'),'LEGACY_WRITE_FORBIDDEN');
    const old=s.sales[c.saleId]; const deltas={}; let sale;
    if(c.type==='RESERVE') {
      check(!old,'SALE_EXISTS'); check(Array.isArray(c.lines)&&c.lines.length,'LINES_REQUIRED');
      const lines=c.lines.map(line=>{
        const resource=s.resources[line.resourceId]; check(resource&&resource.active,'RESOURCE_OR_LOT_UNAVAILABLE');
        const qty=integer(line.qty,1);
        check(resource.unit==='bag'&&resource.family===line.family&&resource.lot===line.lot,'RESOURCE_MISMATCH');
        return {resourceId:line.resourceId,qty,unitCostCents:resource.unitCostCents,lot:resource.lot,family:resource.family,grams:resource.grams,grind:resource.grind};
      });
      const totals={}; for(const l of lines) totals[l.resourceId]=(totals[l.resourceId]||0)+l.qty;
      for(const [key,qty] of Object.entries(totals)) {
        const reserved=Object.values(s.sales).filter(x=>x.status==='RESERVED').flatMap(x=>x.lines).filter(x=>x.resourceId===key).reduce((n,x)=>n+x.qty,0);
        check(s.resources[key].qty-reserved>=qty,'INSUFFICIENT_STOCK');
      }
      const revenue=integer(c.totalCents); const charged=integer(c.deliveryChargedCents||0); const shipping=integer(c.deliveryCostCents||0);
      const cost=lines.reduce((n,x)=>n+x.qty*x.unitCostCents,0); integer(cost);
      sale={status:'RESERVED',lines,totalCents:revenue,deliveryChargedCents:charged,deliveryCostCents:shipping,costCents:cost,profitCents:revenue+charged-shipping-cost,version:1};
    } else {
      check(old,'FUTURE_SALE_NOT_FOUND'); sale=copy(old);
      if(c.type==='CANCEL') {
        check(old.status==='RESERVED','CANNOT_CANCEL'); sale.status='CANCELLED';
      } else if(c.type==='DISPATCH') {
        check(old.status==='RESERVED','CANNOT_DISPATCH');
        for(const l of old.lines) deltas[l.resourceId]=(deltas[l.resourceId]||0)-l.qty;
        for(const [key,delta] of Object.entries(deltas)) check(s.resources[key].qty+delta>=0,'INSUFFICIENT_STOCK');
        sale.status='DISPATCHED';
      } else if(c.type==='EDIT_CONTACT') {
        check(typeof c.customer==='string','INVALID_CONTACT');sale.customer=c.customer;
      } else if(c.type==='PAY') { check(!old.paid&&old.status!=='CANCELLED','INVALID_PAYMENT');sale.paid=true;
      } else { throw Error('COMMAND_NOT_ALLOWED'); }
      sale.version++;
    }
    return {saleId:c.saleId,sale,deltas};
  }
}
module.exports={Engine,Journal,canonical};
