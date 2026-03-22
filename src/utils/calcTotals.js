export function calcTotals(items) {
  let subtotal = 0;
  const rows = items.map(item => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const amount = qty * rate;
    subtotal += amount;
    return { ...item, amount };
  });
  return {
    rows,
    subtotal,
    total: subtotal
  };
}
