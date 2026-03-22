import React, { useState } from 'react';
import { BrandBar } from './components/BrandBar';
import { BillForm } from './components/BillForm';
import { BillPreview } from './components/BillPreview';
import { useBillStore } from './hooks/useBillStore';
import { useBillCounter } from './hooks/useBillCounter';

function App() {
  const store = useBillStore();
  const counter = useBillCounter();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 font-outfit text-dark antialiased">
      <div className="max-w-5xl mx-auto">
        <BrandBar />
        <BillForm 
          store={store} 
          onPreview={() => setShowPreview(true)} 
          onClear={store.resetStore} 
        />
      </div>

      {showPreview && (
        <BillPreview 
          store={store} 
          onClose={() => setShowPreview(false)} 
          commitCounter={counter.commit}
        />
      )}
    </div>
  );
}

export default App;
