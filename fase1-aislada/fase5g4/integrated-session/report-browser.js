 function renderOrderReport64(filters={}){
  if(actor.profile==='seller')return;
  const sales=Object.values(snapshot.sales).filter(s=>s.commercial);
  const stock=Object.values(snapshot.resources).filter(r=>r.stage==='PACKAGED');
  const values=(rows,key)=>[...new Set(rows.map(row=>row[key]).filter(value=>value!==undefined&&value!==''))].sort();
  const lineOf=row=>snapshot.resourceLines54?.[row.resourceId||row.id]?.line||
   row.family;
  const lines=[...stock,...sales.flatMap(s=>s.lines)].map(row=>({...row,line:lineOf(row)}));
  const dimensions=[['family','Línea',values(lines,'line')],['grams','Presentación (g)',values(lines,'grams')],
   ['product','Producto',values(stock,'product')],['lot','Lote',values(lines,'lot')],
   ['channel','Canal',[...new Set(sales.map(s=>s.commercial.channel))].sort()]];
  const matches=line=>(!filters.family||lineOf(line)===filters.family)&&(!filters.grams||String(line.grams)===filters.grams)&&
   (!filters.lot||line.lot===filters.lot)&&(!filters.product||(line.product||snapshot.resources[line.resourceId]?.product)===filters.product);
  const orders=sales.filter(s=>(!filters.channel||s.commercial.channel===filters.channel)&&s.lines.some(matches));
  const ids=new Set(orders.map(s=>s.id));
  const events=(snapshot.commerce?.events||[]).filter(e=> (!filters.from||e.date.slice(0,10)>=filters.from)&&(!filters.to||e.date.slice(0,10)<=filters.to));
  const selected=events.filter(e=>ids.has(e.saleId));
  const periodIds=new Set(selected.map(e=>e.saleId));
  const sum=(kind,field='amountCents')=>selected.filter(e=>e.kind===kind).reduce((total,e)=>total+(e[field]||0),0);
  const count=kind=>selected.filter(e=>e.kind===kind).length;
  const revenue=sum('DISPATCH_RECOGNIZED')-sum('RETURN_CREDIT');
  const costs=sum('DISPATCH_RECOGNIZED','costCents')-sum('RETURN_CREDIT','costCents');
  const ads=events.filter(e=>e.kind==='OPERATING_EXPENSE'&&e.category==='PUBLICIDAD').reduce((n,e)=>n+e.amountCents,0);
  const other=events.filter(e=>e.kind==='OPERATING_EXPENSE'&&e.category!=='PUBLICIDAD').reduce((n,e)=>n+e.amountCents,0);
  const dimensionFiltered=dimensions.some(([key])=>filters[key]);
  const loss=events.filter(e=>e.kind==='STOCK_LOSS').reduce((n,e)=>n+e.amountCents,0);
  $('order-report64').innerHTML='<section class="card"><h3>Pedidos, inventario y rentabilidad</h3><form id="report-filter64" class="form-grid">'+
   label('from','Desde','date',filters.from||'')+label('to','Hasta','date',filters.to||'')+
   dimensions.map(([key,title,choices])=>select(key,title,option('','Todos')+choices.map(v=>option(v,v)).join(''))).join('')+
   '<button class="btn" type="submit">Aplicar filtros</button></form>'+
   '<p>Los filtros de producto y lote seleccionan pedidos completos, incluidos los packs. Los importes corresponden al pedido completo.</p>'+
   '<p>Pedidos registrados '+count('ORDER_REGISTERED')+' · Despachos '+count('DISPATCH_RECOGNIZED')+' · Entregas '+count('DELIVERY_RECORDED')+'</p>'+
   '<p>Ingreso reconocido '+money(revenue)+' · Cobros '+money(sum('PAYMENT'))+' · Reembolsos '+money(sum('REFUND'))+'</p>'+
   '<p>Saldo actual de pedidos coincidentes '+money(orders.reduce((n,s)=>n+(s.financial?.outstandingCents||0),0))+' · Costo histórico '+money(costs)+' · Margen bruto '+money(revenue-costs)+'</p>'+
   '<p>Gastos de todo el período · Publicidad '+money(ads)+' · Otros '+money(other)+' · Resultado estimado '+(dimensionFiltered?'N/D para el segmento':money(revenue-costs-sum('DISPATCH_RECOGNIZED','distributionCents')-ads-other-loss))+'</p>'+
   '<h4>Stock envasado actual por lote</h4>'+stock.filter(matches).map(r=>'<p>'+esc(r.product)+' · '+esc(r.lot)+' · '+r.qty+' disponibles</p>').join('')+
   '<h4>Partidas de pedidos coincidentes</h4>'+orders.filter(s=>periodIds.has(s.id)).slice(0,50).map(s=>'<details><summary>'+esc(s.id)+'</summary>'+
    s.lines.filter(matches).map(l=>'<p>'+esc(l.lot)+' · '+esc(lineOf(l))+' · '+l.qty+' bolsa(s) · Costo histórico '+money(l.totalCostCents)+'</p>').join('')+'</details>').join('')+'</section>';
  for(const [key] of dimensions)$('report-filter64').elements[key].value=filters[key]||'';
 }
 document.addEventListener('submit',event=>{
  if(event.target.id!=='report-filter64')return;
  event.preventDefault();
  const filters=Object.fromEntries(new FormData(event.target));
  if(filters.from&&filters.to&&filters.from>filters.to){notice('La fecha inicial debe ser anterior o igual a la fecha final.');return;}
  renderOrderReport64(filters);
 });
