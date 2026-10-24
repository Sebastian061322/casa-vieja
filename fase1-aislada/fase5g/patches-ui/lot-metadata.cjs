'use strict';
function lotMetadata(lot, money) {
  const known = value => Number.isSafeInteger(value) && value >= 0;
  return `<p>Recibido: ${known(lot.receivedGrams) ? lot.receivedGrams + ' g' : 'No registrado'} · Adquisición inicial: ${known(lot.acquisitionCents) ? money(lot.acquisitionCents) : 'No registrado'} · Procesamiento inicial: ${known(lot.processingCents) ? money(lot.processingCents) : 'No registrado'}</p>`;
}
module.exports = {lotMetadata};
