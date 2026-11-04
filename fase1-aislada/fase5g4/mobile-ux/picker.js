let selectedGroup56, selectedSize60, selectedCount60;
const groups56 = ['Gourmet', 'Monte Alto', 'Mixto'];
const groupLabel56 = group => group === 'Monte Alto' ? 'Monte Alto — Especialidad' : group;
const bagCount60 = offer => Object.values(offer.composition).reduce((total, count) => total + count, 0);

function matchesPicker60(offer) {
  return !!offer && (!selectedGroup56 || (selectedCount60 && selectedSize60 && offerGroup(offer) === selectedGroup56)) &&
    (!selectedCount60 || bagCount60(offer) === selectedCount60) &&
    (!selectedSize60 || offer.grams === selectedSize60);
}

function offerPicker56(offers, offer) {
  const group = selectedGroup56 || offerGroup(offer);
  const count = selectedCount60 || (!selectedGroup56 ? bagCount60(offer) : 0);
  const size = selectedSize60 || (!selectedGroup56 ? offer.grams : 0);
  const button = (field, value, label, pressed) =>
    `<button type="button" class="btn secondary" data-${field}="${esc(value)}" aria-pressed="${pressed}">${esc(label)}</button>`;
  const groupButtons = groups56.map(line => button('group56', line, groupLabel56(line), line === group));
  const counts = group === 'Mixto' ? [2, 3] : [1, 2, 3];
  const countButtons = counts.map(n => button('count60', n, ['Unitario','Dúo','Tripack'][n-1], n === count));
  const sizes = [250, 500].map(n => button('size60', n, n + ' g', n === size));
  const choices = count && size ? offers.filter(item => offerGroup(item) === group && item.grams === size && bagCount60(item) === count) : [];
  const options = choices.map(item => button('offer56', item.id, item.name + ' · ' + money(item.priceCents), item.id === offer.id && matchesPicker60(offer)));
  const field = (label, buttons) => `<div class="cv-picker-step60" role="group" aria-label="${label}"><strong>${label}</strong><div>${buttons.join('')}</div></div>`;
  return field('Línea de café', groupButtons) + field('Presentación', countButtons) +
    (count ? field('Gramaje', sizes) : '') +
    (count && size ? field('Oferta de catálogo', options.length ? options : ['<button class="btn secondary" type="button" disabled>Pendiente de configurar</button>']) : '');
}
