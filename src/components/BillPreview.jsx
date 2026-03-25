import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Logo } from './Logo';
import { formatDate } from '../utils/formatDate';
import { generatePDF } from '../utils/generatePDF';

export function BillPreview({ store, onClose, commitCounter }) {
  const [paperSize, setPaperSize] = React.useState('A4'); // 'A4' or 'A5'
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    onAfterPrint: () => commitCounter(store.billNo),
    documentTitle: `Bill-${store.billNo}`
  });

  const handleDownloadPDF = () => {
    generatePDF(store, paperSize);
    commitCounter(store.billNo);
  };

  const dDate = formatDate(store.date);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center overflow-y-auto print:bg-white print:block">
      {/* Toolbar - hidden on print */}
      <div className="sticky top-0 w-full bg-dark text-white p-4 shadow-md flex items-center justify-between z-10 no-print">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-cormorant text-xl font-semibold">Sivam Stationery – Bill Preview</span>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex bg-mid/30 p-1 rounded-lg gap-1 border border-mid/50 mr-2">
            <button 
              onClick={() => setPaperSize('A4')} 
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${paperSize === 'A4' ? 'bg-orange text-white' : 'text-gray-400 hover:text-white'}`}
            >
              A4
            </button>
            <button 
              onClick={() => setPaperSize('A5')} 
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${paperSize === 'A5' ? 'bg-orange text-white' : 'text-gray-400 hover:text-white'}`}
            >
              A5
            </button>
          </div>
          <button onClick={() => handlePrint()} className="flex flex-row items-center gap-2 bg-mid hover:bg-mid/80 px-4 py-2 rounded transition-colors text-sm font-medium">
            🖨 Print
          </button>
          <button onClick={handleDownloadPDF} className="bg-orange hover:bg-orange2 px-4 py-2 rounded transition-colors text-sm font-medium">
            ⬇ Download PDF
          </button>
          <button onClick={onClose} className="ml-2 text-gray-300 hover:text-white transition-colors text-xl font-bold p-1 px-3">
            ✕
          </button>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div className={`w-full ${paperSize === 'A4' ? 'max-w-[210mm]' : 'max-w-[148mm]'} print:max-w-none m-4 print:m-0 flex-shrink-0 flex flex-col no-print-margin`} style={{ minHeight: 'calc(100vh - 100px)' }}>
        <div 
          ref={printRef}
          className="bg-white mx-auto shadow-xl print:shadow-none relative flex flex-col" 
          style={{ 
            width: paperSize === 'A4' ? '210mm' : '148mm', 
            minHeight: paperSize === 'A4' ? '297mm' : '210mm', 
            padding: paperSize === 'A4' ? '15mm 15mm 20mm 15mm' : '10mm 10mm 15mm 10mm', 
            boxSizing: 'border-box' 
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              <Logo size={68} />
              <div>
                <h1 className="font-cormorant text-[22pt] font-bold text-dark m-0 leading-tight">
                  {store.sellerName}
                </h1>
                <p className="text-gray-500 text-sm mt-1 whitespace-pre-line leading-relaxed">
                  {store.sellerAddr}
                  {"\n"}Ph: {store.phone}
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="font-cormorant text-orange text-3xl font-bold tracking-widest mt-2 border-b-2 border-orange pb-2 uppercase">
                Invoice
              </h2>
            </div>
          </div>

          {/* Meta Strip */}
          <div className="flex border border-border mb-6 divide-x divide-border rounded bg-gray-50">
            <div className="flex-1 p-3">
              <p className="text-xs font-bold text-dark uppercase tracking-wider mb-1">Bill No</p>
              <p className="text-sm font-semibold">{store.billNo}</p>
            </div>
            <div className="flex-1 p-3">
              <p className="text-xs font-bold text-dark uppercase tracking-wider mb-1">Date</p>
              <p className="text-sm font-semibold">{dDate}</p>
            </div>
            <div className="flex-[2] p-3">
              <p className="text-xs font-bold text-dark uppercase tracking-wider mb-1">Bill To</p>
              <p className="text-sm font-semibold">{store.custName || "Cash"}</p>
            </div>
            <div className="flex-[2] p-3">
              <p className="text-xs font-bold text-dark uppercase tracking-wider mb-1">Address</p>
              <p className="text-sm whitespace-pre-wrap leading-tight">{store.custAddr || ""}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left mb-6 text-sm border-collapse">
            <thead>
              <tr className="bg-dark text-white">
                <th className="p-2 border border-dark text-center w-12 font-medium">S.No</th>
                <th className="p-2 border border-dark font-medium">Description</th>
                <th className="p-2 border border-dark text-center w-20 font-medium">Qty</th>
                <th className="p-2 border border-dark text-right w-28 font-medium">Rate ₹</th>
                <th className="p-2 border border-dark text-right w-32 font-medium">Amount ₹</th>
              </tr>
            </thead>
            <tbody>
              {store.items.map((item, i) => {
                const qty = parseFloat(item.qty) || 0;
                const rate = parseFloat(item.rate) || 0;
                return (
                  <tr key={item.id} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-2 border border-gray-200 text-center text-gray-500">{i + 1}</td>
                    <td className="p-2 border border-gray-200 font-medium">{item.description}</td>
                    <td className="p-2 border border-gray-200 text-center">{qty}</td>
                    <td className="p-2 border border-gray-200 text-right">{rate.toFixed(2)}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold">{Math.abs(qty * rate).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="border-t border-gray-300"></td>
                <td className="p-2 text-right font-semibold text-mid border border-gray-300 bg-gray-50">Subtotal</td>
                <td className="p-2 text-right font-bold text-dark border border-gray-300 bg-gray-50">₹ {store.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="border-none"></td>
                <td className="p-3 text-right font-bold text-orange text-lg border-b-2 border-orange font-cormorant">TOTAL</td>
                <td className="p-3 text-right font-bold text-orange text-lg border-b-2 border-orange">₹ {store.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Notes Block */}
          {store.notes && (
            <div className="bg-gray-50 border-l-4 border-orange p-3 mb-6 mt-4 inline-block min-w-[50%]">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-1 mb-2">Notes & Terms</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{store.notes}</p>
            </div>
          )}

          {/* Spacer to push footer down */}
          <div className="flex-grow"></div>

          {/* Watermark Logo */}
          <div 
            className="absolute font-cormorant font-bold text-orange tracking-tighter" 
            style={{ 
              fontSize: paperSize === 'A4' ? '76pt' : '52pt', 
              opacity: 0.035, 
              bottom: paperSize === 'A4' ? '40mm' : '30mm', 
              right: paperSize === 'A4' ? '30mm' : '20mm', 
              pointerEvents: 'none' 
            }}
          >
            SS
          </div>

          {/* Footer - Use relative positioning with flex-grow to ensure visibility */}
          <div className="border-t border-gray-200 pt-4 flex justify-between items-end mt-4">
             <div className="italic text-gray-400 text-xs sm:text-sm">
               Thank you for your business! 🙏
             </div>
             <div className="text-right text-xs sm:text-sm text-gray-600">
               Authorised Signatory / For <span className="font-bold text-dark text-sm sm:text-base">{store.sellerName}</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
