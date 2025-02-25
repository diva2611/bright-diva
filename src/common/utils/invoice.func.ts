export function normalizeInvoice(invoice: any): any {
  const normalized = { ...invoice };

  Object.keys(normalized).forEach((key) => {
    if (typeof normalized[key] === 'number') {
      normalized[key] = normalized[key].toFixed(2);
    }
  });

  return normalized;
}
