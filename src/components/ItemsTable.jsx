import React from 'react';

export function ItemsTable({ items, updateItem, addItem, removeItem }) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border mt-6 p-4 md:p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-dark font-cormorant">Invoice Items</h2>
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-bg text-mid text-sm border-b border-border">
            <th className="p-3 w-12 text-center">#</th>
            <th className="p-3">Description</th>
            <th className="p-3 w-28 text-center">Qty</th>
            <th className="p-3 w-36 text-right">Rate (₹)</th>
            <th className="p-3 w-36 text-right">Amount (₹)</th>
            <th className="p-3 w-12 text-center">✕</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const qty = parseFloat(item.qty) || 0;
            const rate = parseFloat(item.rate) || 0;
            const amount = qty * rate;

            return (
              <tr key={item.id} className="border-b border-border hover:bg-[#fafbfc] transition-colors">
                <td className="p-3 text-center text-gray-500">{index + 1}</td>
                <td className="p-3">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full bg-transparent border border-gray-200 rounded p-2 focus:border-orange focus:ring-1 focus:ring-orange outline-none"
                    placeholder="Item description"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                    className="w-full bg-transparent border border-gray-200 rounded p-2 text-center focus:border-orange focus:ring-1 focus:ring-orange outline-none"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                    className="w-full bg-transparent border border-gray-200 rounded p-2 text-right focus:border-orange focus:ring-1 focus:ring-orange outline-none"
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td className="p-3 text-right font-medium text-dark bg-gray-50/50">
                  {amount.toFixed(2)}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove Item"
                    disabled={items.length <= 1}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="mt-4">
        <button
          onClick={addItem}
          className="text-orange font-medium hover:text-orange2 transition-colors flex items-center gap-1 px-2 py-1"
        >
          <span className="text-xl leading-none">＋</span> Add Item
        </button>
      </div>
    </div>
  );
}
