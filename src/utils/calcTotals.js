export function calcTotals(items) {
  let subtotal = 0;
  items.forEach(item => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    subtotal += qty * rate;
  });
  return {
    subtotal,
    total: subtotal
  };
}
