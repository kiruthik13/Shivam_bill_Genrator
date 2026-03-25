import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './formatDate';
import { calcTotals } from './calcTotals';

export function generatePDF(bill, paperSize = 'A4') {
  const isA4 = paperSize === 'A4';
  const doc = new jsPDF({ 
    orientation: 'portrait', 
    unit: 'mm', 
    format: isA4 ? 'a4' : 'a5' 
  });
  
  const { rows, subtotal, total } = calcTotals(bill.items);
  const W = isA4 ? 210 : 148;
  const H = isA4 ? 297 : 210;

  // ── Thin orange top accent bar (xerox-safe)
  doc.setFillColor(232, 93, 4);
  doc.rect(0, 0, W, 4, 'F');

  // ── Company name (dark ink → prints black on xerox)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isA4 ? 20 : 16);
  doc.setTextColor(26, 26, 46);
  doc.text(bill.sellerName, 14, 14);

  // ── Address + phone
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isA4 ? 9 : 8);
  doc.setTextColor(100, 100, 120);
  doc.text(bill.sellerAddr, 14, 20);
  doc.text('Phone: ' + bill.phone, 14, 25);

  // ── INVOICE label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isA4 ? 18 : 14);
  doc.setTextColor(232, 93, 4);
  doc.text('INVOICE', W - 14, 18, { align: 'right' });

  // ── Orange divider
  doc.setDrawColor(232, 93, 4);
  doc.setLineWidth(0.8);
  doc.line(14, 30, W - 14, 30);

  // ── Meta row: Bill No | Date | Customer | Address
  doc.setFontSize(isA4 ? 8 : 7);
  doc.setTextColor(136, 144, 160);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL NO.', 14, 37);
  doc.text('DATE', isA4 ? 70 : 55, 37);
  doc.text('BILL TO', isA4 ? 120 : 85, 37);
  if (isA4) doc.text('ADDRESS', 168, 37);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isA4 ? 10 : 9);
  doc.setTextColor(26, 26, 46);
  doc.text(bill.billNo || '—', 14, 43);
  doc.text(formatDate(bill.date), isA4 ? 70 : 55, 43);
  doc.text(bill.custName || '—', isA4 ? 120 : 85, 43);
  
  // For A5, address goes below if it exists
  if (!isA4 && bill.custAddr) {
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 120);
    doc.text(bill.custAddr, 85, 47, { maxWidth: 50 });
  } else if (isA4) {
    doc.text(bill.custAddr || '—', 168, 43, { maxWidth: 30 });
  }

  // ── Thin grey divider below meta
  doc.setDrawColor(232, 235, 242);
  doc.setLineWidth(0.4);
  doc.line(14, isA4 ? 49 : 52, W - 14, isA4 ? 49 : 52);

  // ── Build table body rows
  const tableBody = rows.map((r, i) => [
    i + 1,
    r.description || '',
    r.qty || '',
    r.rate ? parseFloat(r.rate).toFixed(2) : '—',
    r.amount > 0 ? r.amount.toFixed(2) : '—',
  ]);

  // ── Append Subtotal & TOTAL as table rows
  tableBody.push(
    [
      { content: '', colSpan: 3, styles: { fillColor: [255, 255, 255], lineWidth: 0 } },
      {
        content: 'Subtotal',
        styles: { halign: 'right', fontStyle: 'bold', fontSize: isA4 ? 9 : 8, fillColor: [247, 249, 252], textColor: [74, 74, 106], lineColor: [232, 235, 242] },
      },
      {
        content: 'Rs. ' + subtotal.toFixed(2),
        styles: { halign: 'right', fontSize: isA4 ? 9 : 8, fillColor: [247, 249, 252], textColor: [26, 26, 46], lineColor: [232, 235, 242] },
      },
    ],
    [
      { content: '', colSpan: 3, styles: { fillColor: [255, 255, 255], lineWidth: 0 } },
      {
        content: 'TOTAL',
        styles: { halign: 'right', fontStyle: 'bold', fontSize: isA4 ? 11 : 10, fillColor: [255, 244, 238], textColor: [232, 93, 4], lineColor: [232, 93, 4], lineWidth: { top: 0.8, bottom: 0.2, left: 0.2, right: 0.2 } },
      },
      {
        content: 'Rs. ' + total.toFixed(2),
        styles: { halign: 'right', fontStyle: 'bold', fontSize: isA4 ? 11 : 10, fillColor: [255, 244, 238], textColor: [232, 93, 4], lineColor: [232, 93, 4], lineWidth: { top: 0.8, bottom: 0.2, left: 0.2, right: 0.2 } },
      },
    ]
  );

  // ── Draw the full table
  autoTable(doc, {
    startY: isA4 ? 53 : 58,
    head: [['S.No', 'Description', 'Qty', 'Rate (Rs.)', 'Amount (Rs.)']],
    body: tableBody,
    headStyles: { fillColor: [255, 244, 238], textColor: [26, 26, 46], fontStyle: 'bold', fontSize: isA4 ? 9 : 8 },
    alternateRowStyles: { fillColor: [247, 249, 252] },
    styles: { fontSize: isA4 ? 9.5 : 8.5, cellPadding: isA4 ? 3.5 : 2.5, textColor: [26, 26, 46], lineColor: [232, 235, 242], lineWidth: 0.2 },
    columnStyles: {
      0: { halign: 'center', cellWidth: isA4 ? 15 : 12 },
      1: { halign: 'left' },
      2: { halign: 'center', cellWidth: isA4 ? 22 : 18 },
      3: { halign: 'right', cellWidth: isA4 ? 32 : 28 },
      4: { halign: 'right', cellWidth: isA4 ? 35 : 30 },
    },
    margin: { left: 14, right: 14 },
  });

  let afterTable = doc.lastAutoTable.finalY + 6;

  // ── Notes block
  if (bill.notes && bill.notes.trim()) {
    const noteWidth = W - 28;
    doc.setFillColor(247, 249, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, afterTable, noteWidth, 15, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    doc.text('NOTES & TERMS', 18, afterTable + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(102, 102, 102);
    doc.text(bill.notes, 18, afterTable + 11, { maxWidth: noteWidth - 8 });
    afterTable += 20;
  }

  // ── Watermark
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isA4 ? 90 : 60);
  doc.setTextColor(232, 93, 4);
  try {
    doc.setGState(new doc.GState({ opacity: 0.04 }));
    doc.text('SS', W - 18, H - 25, { align: 'right' });
    doc.setGState(new doc.GState({ opacity: 1 }));
  } catch (_) {}

  // ── Footer Signature (Pushed further from bottom to ensure xerox/printer safety)
  const footY = H - 15;
  doc.setDrawColor(232, 235, 242);
  doc.setLineWidth(0.4);
  doc.line(14, footY - 4, W - 14, footY - 4);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(isA4 ? 9 : 8);
  doc.setTextColor(136, 144, 160);
  doc.text('Thank you for your business!', 14, footY + 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isA4 ? 8.5 : 7.5);
  doc.setTextColor(26, 26, 46);
  doc.text('For ' + bill.sellerName, W - 14, footY - 1, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isA4 ? 7.5 : 6.5);
  doc.setTextColor(140, 140, 140);
  doc.text('Authorised Signatory', W - 14, footY + 4, { align: 'right' });

  // ── Save file
  const dateStr = formatDate(bill.date).replace(/\//g, '-');
  const noStr = (bill.billNo || 'BILL').replace(/-/g, '');
  doc.save(`Sivam_Stationery_Bill_${noStr}_${dateStr}.pdf`);
}
