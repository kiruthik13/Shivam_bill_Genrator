import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './formatDate';

export function generatePDF(billData) {
  const {
    billNo, date, phone, sellerName, sellerAddr, custName, custAddr, items, notes, subtotal, total
  } = billData;

  const doc = new jsPDF('p', 'mm', 'a4');
  const dDate = formatDate(date);
  
  // 1. Header section
  doc.setFillColor(26, 26, 46); // #1A1A2E
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text(sellerName, 15, 20);
  
  doc.setTextColor(180, 180, 180);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${sellerAddr} | Ph: ${phone}`, 15, 28);
  
  doc.setTextColor(232, 93, 4); // #E85D04
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.text("INVOICE", 195, 24, { align: "right" });
  
  // 2. Orange horizontal rule
  doc.setDrawColor(232, 93, 4);
  doc.setLineWidth(1);
  doc.line(15, 42, 195, 42);
  
  // 3. Meta info row
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Bill No: ", 15, 50);
  doc.setFont("helvetica", "normal");
  doc.text(billNo, 35, 50);
  
  doc.setFont("helvetica", "bold");
  doc.text("Date: ", 15, 56);
  doc.setFont("helvetica", "normal");
  doc.text(dDate, 35, 56);
  
  doc.setFont("helvetica", "bold");
  doc.text("Bill To: ", 105, 50);
  doc.setFont("helvetica", "normal");
  doc.text(custName || "Cash", 125, 50);
  
  doc.setFont("helvetica", "bold");
  doc.text("Address: ", 105, 56);
  doc.setFont("helvetica", "normal");
  const splitAddr = doc.splitTextToSize(custAddr, 70);
  doc.text(splitAddr, 125, 56);
  
  // 4. Items table
  let currentY = 56 + (splitAddr.length * 5) + 5;
  if (currentY < 70) currentY = 70;
  
  const tableData = items.map((item, index) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    return [
      (index + 1).toString(),
      item.description,
      qty.toString(),
      rate.toFixed(2),
      (qty * rate).toFixed(2)
    ];
  });
  
  autoTable(doc, {
    startY: currentY,
    head: [['S.No', 'Description', 'Qty', 'Rate (Rs)', 'Amount (Rs)']],
    body: tableData,
    headStyles: { fillColor: [26, 26, 46], textColor: 255, fontSize: 10 },
    alternateRowStyles: { fillColor: [247, 249, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { halign: 'left' },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'right', cellWidth: 30 },
      4: { halign: 'right', cellWidth: 35 }
    },
    margin: { left: 15, right: 15 }
  });
  
  currentY = doc.lastAutoTable.finalY + 10;
  
  // 5. Totals
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Subtotal:", 145, currentY);
  doc.text(`Rs ${subtotal.toFixed(2)}`, 195, currentY, { align: "right" });
  
  currentY += 4;
  doc.setLineWidth(0.5);
  doc.setDrawColor(232, 93, 4);
  doc.line(145, currentY, 195, currentY);
  
  currentY += 6;
  doc.setTextColor(232, 93, 4);
  doc.setFontSize(14);
  doc.text("TOTAL:", 145, currentY);
  doc.text(`Rs ${total.toFixed(2)}`, 195, currentY, { align: "right" });
  
  // 6. Notes
  if (notes) {
    currentY += 15;
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Notes & Terms:", 15, currentY);
    currentY += 5;
    const splitNotes = doc.splitTextToSize(notes, 100);
    doc.text(splitNotes, 15, currentY);
  }
  
  // 8. Watermark
  doc.setTextColor(253, 237, 230); // Very light orange
  doc.setFontSize(120);
  doc.setFont("times", "bold");
  doc.text("SS", 150, 260, { align: "center", angle: 45 });
  
  // 7. Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - 20;
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(15, footerY - 5, 195, footerY - 5);
  
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("Thank you for your business!", 15, footerY + 2);
  
  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "normal");
  doc.text("Authorised Signatory / For Sivam Stationery", 195, footerY + 2, { align: "right" });
  
  const dFormat = date.split('-').reverse().join('-');
  const billNoForFile = billNo.replace('-', '');
  const fileName = `Sivam_Stationery_Bill_${billNoForFile}_${dFormat}.pdf`;
  doc.save(fileName);
}
