import React from 'react';

export function TotalsBox({ subtotal, total }) {
  return (
    <div className="flex justify-end mt-4">
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-mid font-medium">Subtotal</span>
          <span className="text-dark font-semibold">₹ {subtotal.toFixed(2)}</span>
        </div>
        <hr className="border-border my-3" />
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-dark font-cormorant">TOTAL</span>
          <span className="text-2xl font-bold text-orange">₹ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
