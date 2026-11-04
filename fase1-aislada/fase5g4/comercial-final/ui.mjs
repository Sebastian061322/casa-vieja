export function offerGroup(offer) {
  const lines = Object.keys(offer.composition);
  return lines.length > 1 ? 'Mixto' : lines[0];
}

export function advertisingSummary(events, { from = '', to = '', campaign = '' } = {}) {
  const rows = events.filter(event =>
    event.kind === 'OPERATING_EXPENSE' && event.category === 'PUBLICIDAD' &&
    (!from || event.date.slice(0, 10) >= from) &&
    (!to || event.date.slice(0, 10) <= to) &&
    (!campaign || event.campaign === campaign)
  );
  const investment = rows.reduce((sum, event) => sum + event.amountCents, 0);
  const messages = rows.reduce((sum, event) => sum + (event.messages || 0), 0);
  return { rows, investment, messages, costPerMessage: messages > 0 ? Math.round(investment / messages) : null };
}
