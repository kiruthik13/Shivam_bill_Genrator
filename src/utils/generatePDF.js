import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './formatDate';
import { calcTotals } from './calcTotals';

export function generatePDF(bill) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const { rows, subtotal, total } = calcTotals(bill.items);
  const W = 210;

  // ── Thin orange top accent bar (xerox-safe)
  doc.setFillColor(232, 93, 4);
  doc.rect(0, 0, W, 4, 'F');

  // ── Company name (dark ink → prints black on xerox)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(26, 26, 46);
  doc.text(bill.sellerName, 14, 14);

  // ── Address + phone
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 120);
  doc.text(bill.sellerAddr, 14, 21);
  doc.text('Phone: ' + bill.phone, 14, 27);

  // ── INVOICE label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(232, 93, 4);
  doc.text('INVOICE', W - 14, 20, { align: 'right' });

  // ── Orange divider
  doc.setDrawColor(232, 93, 4);
  doc.setLineWidth(0.8);
  doc.line(14, 32, W - 14, 32);

  // ── Meta row: Bill No | Date | Customer | Address
  doc.setFontSize(8);
  doc.setTextColor(136, 144, 160);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL NO.', 14, 39);
  doc.text('DATE',     70, 39);
  doc.text('BILL TO', 120, 39);
  doc.text('ADDRESS', 168, 39);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(26, 26, 46);
  doc.text(bill.billNo    || '—', 14,  45);
  doc.text(formatDate(bill.date), 70,  45);
  doc.text(bill.custName  || '—', 120, 45);
  doc.text(bill.custAddr  || '—', 168, 45);

  // ── Thin grey divider below meta
  doc.setDrawColor(232, 235, 242);
  doc.setLineWidth(0.4);
  doc.line(14, 49, W - 14, 49);

  // ── Build table body rows
  const tableBody = rows.map((r, i) => [
    i + 1,
    r.description || '',
    r.qty         || '',
    r.rate        ? parseFloat(r.rate).toFixed(2) : '—',
    r.amount > 0  ? r.amount.toFixed(2)           : '—',
  ]);

  // ── Append Subtotal & TOTAL as table rows
  tableBody.push(
    // Subtotal row
    [
      {
        content: '',
        colSpan: 3,
        styles: {
          fillColor: [255, 255, 255],
          lineWidth: 0,
        },
      },
      {
        content: 'Subtotal',
        styles: {
          halign: 'right',
          fontStyle: 'bold',
          fontSize: 9,
          fillColor: [247, 249, 252],
          textColor: [74, 74, 106],
          lineColor: [232, 235, 242],
        },
      },
      {
        content: 'Rs. ' + subtotal.toFixed(2),
        styles: {
          halign: 'right',
          fontSize: 9,
          fillColor: [247, 249, 252],
          textColor: [26, 26, 46],
          lineColor: [232, 235, 242],
        },
      },
    ],

    // TOTAL row
    [
      {
        content: '',
        colSpan: 3,
        styles: {
          fillColor: [255, 255, 255],
          lineWidth: 0,
        },
      },
      {
        content: 'TOTAL',
        styles: {
          halign: 'right',
          fontStyle: 'bold',
          fontSize: 11,
          fillColor: [255, 244, 238],
          textColor: [232, 93, 4],
          lineColor: [232, 93, 4],
          lineWidth: { top: 0.8, bottom: 0.2, left: 0.2, right: 0.2 },
        },
      },
      {
        content: 'Rs. ' + total.toFixed(2),
        styles: {
          halign: 'right',
          fontStyle: 'bold',
          fontSize: 11,
          fillColor: [255, 244, 238],
          textColor: [232, 93, 4],
          lineColor: [232, 93, 4],
          lineWidth: { top: 0.8, bottom: 0.2, left: 0.2, right: 0.2 },
        },
      },
    ],
  );

  // ── Draw the full table
  autoTable(doc, {
    startY: 53,
    head: [['S.No', 'Description', 'Qty', 'Rate (Rs.)', 'Amount (Rs.)']],
    body: tableBody,

    headStyles: {
      fillColor:  [255, 244, 238],
      textColor:  [26, 26, 46],
      fontStyle:  'bold',
      fontSize:   9,
    },

    alternateRowStyles: {
      fillColor: [247, 249, 252],
    },

    styles: {
      fontSize:    9.5,
      cellPadding: 3.5,
      textColor:   [26, 26, 46],
      lineColor:   [232, 235, 242],
      lineWidth:   0.2,
    },

    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { halign: 'left'                  },
      2: { halign: 'center', cellWidth: 22 },
      3: { halign: 'right',  cellWidth: 32 },
      4: { halign: 'right',  cellWidth: 35 },
    },

    margin: { left: 14, right: 14 },
  });

  const afterTable = doc.lastAutoTable.finalY + 6;

  // ── Notes block
  if (bill.notes && bill.notes.trim()) {
    doc.setFillColor(247, 249, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, afterTable, W - 28, 20, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    doc.text('NOTES & TERMS', 18, afterTable + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(102, 102, 102);
    doc.text(bill.notes, 18, afterTable + 14);
  }

  // ── Watermark (very faint, xerox won't pick it up)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(90);
  doc.setTextColor(232, 93, 4);
  try {
    doc.setGState(new doc.GState({ opacity: 0.04 }));
    doc.text('SS', W - 18, 280, { align: 'right' });
    doc.setGState(new doc.GState({ opacity: 1 }));
  } catch (_) {}

  // ── Footer
  const footY = 285;
  doc.setDrawColor(232, 235, 242);
  doc.setLineWidth(0.4);
  doc.line(14, footY - 4, W - 14, footY - 4);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(136, 144, 160);
  doc.text('Thank you for your business!', 14, footY + 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(26, 26, 46);
  doc.text('For ' + bill.sellerName, W - 14, footY - 1, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(170, 170, 170);
  doc.text('Authorised Signatory', W - 14, footY + 4, { align: 'right' });

  // ── Save file
  const dateStr = formatDate(bill.date).replace(/\//g, '-');
  const noStr   = (bill.billNo || 'BILL').replace(/-/g, '');
  doc.save(`Sivam_Stationery_Bill_${noStr}_${dateStr}.pdf`);
}
