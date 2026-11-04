let selectedGroup56;
const groups56 = ['Gourmet', 'Monte Alto', 'Mixto'];
const groupLabel56 = group => group === 'Monte Alto' ? 'Monte Alto — Especialidad' : group;

function offerPicker56(offers, offer) {
  const group = selectedGroup56 || offerGroup(offer);
  const lineButtons = groups56.map(line =>
    `<button type="button" class="btn secondary" data-group56="${esc(line)}" aria-pressed="${line === group}">${esc(groupLabel56(line))}</button>`
  ).join('');
  const groupOffers = offers.filter(item => offerGroup(item) === group);
  const button = (item, label) => item
    ? `<button type="button" class="btn secondary" data-offer56="${esc(item.id)}" aria-pressed="${item.id === offer.id}">${esc(label)} · ${money(item.priceCents)}</button>`
    : `<button type="button" class="btn secondary" disabled>${esc(label)} · Pendiente de configurar</button>`;
  const options = group === 'Mixto'
    ? groupOffers.map(item => button(item, item.name))
    : [1, 2, 3].flatMap(count => [250, 500].map(grams => {
        const item = groupOffers.find(candidate => candidate.grams === grams && candidate.composition[group] === count);
        return button(item, ['Unitario', 'Dúo', 'Trío'][count - 1] + ' ' + grams + ' g');
      }));
  return `<div role="group" aria-label="Línea de café" style="display:flex;flex-wrap:wrap;gap:.5rem">${lineButtons}</div>
    <div role="group" aria-label="Presentaciones" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,10rem),1fr));gap:.5rem;margin:.75rem 0">${options.join('')}</div>`;
}

function renderAds56(filters = {}) {
  if (actor.profile === 'seller') return;
  const events = snapshot.commerce?.events || [];
  const campaigns = [...new Set(advertisingSummary(events).rows.map(event => event.campaign).filter(Boolean))].sort();
  const { rows, investment, messages, costPerMessage } = advertisingSummary(events, filters);
  $('ads56').innerHTML = `<section class="card"><h3>Publicidad / Meta Ads</h3>
    <p>Gastos manuales del diario de egresos. Usa el comprobante del gasto como referencia de conciliación.</p>
    <button type="button" class="btn" data-operation="RECORD_EXPENSE">Registrar gasto operativo</button>
    <p>Selecciona Publicidad manual en el formulario de egresos.</p>
    <form id="ads-filter56">${label('from','Desde','date',filters.from || '')}
    ${label('to','Hasta','date',filters.to || '')}
    ${select('campaign','Campaña',option('','Todas') + campaigns.map(c => option(c,c)).join(''))}
    <button type="submit" class="btn secondary">Filtrar</button></form>
    <p>Inversión: ${money(investment)} · Mensajes declarados: ${messages} · Costo por mensaje: ${costPerMessage === null ? 'Sin datos' : money(costPerMessage)}</p>
    <p>Costo por venta y ROAS requieren atribución verificada.</p>
    ${rows.map(e => `<article><strong>${esc(e.campaign || 'Sin campaña')}</strong> · ${esc(e.date.slice(0,10))} · ${money(e.amountCents)} · ${e.messages || 0} mensajes<p>${esc(e.documentRef)} · ${esc(e.description)}</p></article>`).join('') || '<p>Aún no hay gastos de publicidad en este período.</p>'}</section>`;
  $('ads-filter56').elements.campaign.value = filters.campaign || '';
}

document.addEventListener('submit', event => {
  if (event.target.id !== 'ads-filter56') return;
  event.preventDefault();
  const fields = new FormData(event.target);
  renderAds56({ from: fields.get('from'), to: fields.get('to'), campaign: fields.get('campaign') });
});
