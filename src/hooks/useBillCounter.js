export function useBillCounter() {
  const getNext = () => {
    const current = parseInt(localStorage.getItem('sivam_bill_seq') || "0", 10);
    return "SS-" + String(current + 1).padStart(3, '0');
  };

  const commit = (billNo) => {
    if (!billNo || !billNo.startsWith('SS-')) return;
    const num = parseInt(billNo.replace('SS-', ''), 10);
    if (!isNaN(num)) {
      const current = parseInt(localStorage.getItem('sivam_bill_seq') || "0", 10);
      if (num > current) {
        localStorage.setItem('sivam_bill_seq', num.toString());
      }
    }
  };

  return { getNext, commit };
}
