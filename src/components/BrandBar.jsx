import React from 'react';
import { Logo } from './Logo';

export function BrandBar() {
  return (
    <div className="bg-dark text-white rounded-xl shadow-lg p-4 flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Logo size={50} />
        <div>
          <h1 className="font-cormorant text-2xl md:text-3xl font-semibold tracking-wide m-0 leading-tight">
            SIVAM STATIONERY
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            Muthur road, Vellakovil – 638111 | Professional Bill Generator
          </p>
        </div>
      </div>
      <div>
        <span className="bg-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          v2.0
        </span>
      </div>
    </div>
  );
}
