import React, { useEffect } from 'react';
import { useBillCounter } from '../hooks/useBillCounter';
import { ItemsTable } from './ItemsTable';
import { TotalsBox } from './TotalsBox';

export function BillForm({ store, onPreview, onClear }) {
  const counter = useBillCounter();
  const {
    billNo, setBillNo,
    date, setDate,
    phone, setPhone,
    sellerName, setSellerName,
    sellerAddr, setSellerAddr,
    custName, setCustName,
    custAddr, setCustAddr,
    items, updateItem, addItem, removeItem,
    notes, setNotes,
    subtotal, total
  } = store;

  useEffect(() => {
    if (!billNo) {
      setBillNo(counter.getNext());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAutoNo = () => {
    setBillNo(counter.getNext());
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      onClear();
      setBillNo(counter.getNext());
    }
  };

  return (
    <div className="pb-24">
      {/* 2. Bill Info */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 md:p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-dark font-cormorant">Bill Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-mid mb-1">Bill No.</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                className="w-full bg-bg border border-gray-200 rounded p-2 focus:border-orange focus:ring-1 focus:ring-orange outline-none"
              />
              <button
                onClick={handleAutoNo}
                className="bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 rounded text-sm font-medium transition-colors"
                title="Regenerate Auto Number"
              >
                ⟳ Auto
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-mid mb-1">Date</label>
            <input
               type="date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
               className="w-full bg-bg border border-gray-200 rounded p-2 focus:border-orange focus:ring-1 focus:ring-orange outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mid mb-1">Phone</label>
            <input
               type="text"
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
               className="w-full bg-bg border border-gray-200 rounded p-2 focus:border-orange focus:ring-1 focus:ring-orange outline-none"
               placeholder="1234567890"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 3. Seller Details */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4 text-dark font-cormorant">Seller Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mid mb-1">Business Name</label>
              <input
                 type="text"
                 value={sellerName}
                 onChange={(e) => setSellerName(e.target.value)}
                 className="w-full bg-bg border border-gray-200 rounded p-2 focus:border-orange focus:ring-1 focus:ring-orange outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-mid mb-1">Address</label>
              <textarea
                 value={sellerAddr}
                 onChange={(e) => setSellerAddr(e.target.value)}
                 className="w-full bg-bg border border-gray-200 rounded p-2 focus:border-orange focus:ring-1 focus:ring-orange outline-none resize-none"
                 rows="2"
              />
            </div>
          </div>
        </div>

        {/* 4. Bill To Details */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4 text-dark font-cormorant">Bill To (Customer)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mid mb-1">Customer / Company Name</label>
              <input
                 type="text"
                 value={custName}
                 onChange={(e) => setCustName(e.target.value)}
                 className="w-full bg-bg border border-gray-200 rounded p-2 focus:border-orange focus:ring-1 focus:ring-orange outline-none"
                 placeholder="Walk-in Customer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-mid mb-1">Address</label>
              <textarea
                 value={custAddr}
                 onChange={(e) => setCustAddr(e.target.value)}
                 className="w-full bg-bg border border-gray-200 rounded p-2 focus:border-orange focus:ring-1 focus:ring-orange outline-none resize-none"
                 rows="2"
                 placeholder="Customer Address"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Items */}
      <ItemsTable items={items} updateItem={updateItem} addItem={addItem} removeItem={removeItem} />
      <TotalsBox subtotal={subtotal} total={total} />

      {/* 6. Notes / Terms */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-4 md:p-6 mt-6">
         <h2 className="text-xl font-semibold mb-4 text-dark font-cormorant">Notes / Terms (Optional)</h2>
         <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-bg border border-gray-200 rounded p-2 focus:border-orange focus:ring-1 focus:ring-orange outline-none resize-y"
            rows="3"
            placeholder="Thank you for your business!"
         />
      </div>

      {/* Action Bar - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-5xl mx-auto flex justify-end gap-4 items-center px-4">
           <button
             onClick={handleClear}
             className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
           >
             🗑 Clear All
           </button>
           <button
             onClick={onPreview}
             className="px-6 py-2 rounded-lg bg-orange text-white font-semibold shadow-md hover:bg-orange2 transition-colors flex items-center gap-2"
           >
             👁 Preview & Print
           </button>
        </div>
      </div>
    </div>
  );
}
