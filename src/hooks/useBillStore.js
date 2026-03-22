import { useState } from 'react';
import { calcTotals } from '../utils/calcTotals';

export function useBillStore() {
  const [billNo, setBillNo] = useState("");
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [phone, setPhone] = useState("");
  const [sellerName, setSellerName] = useState("SIVAM STATIONERY");
  const [sellerAddr, setSellerAddr] = useState("Muthur road, Vellakovil – 638111");
  const [custName, setCustName] = useState("ITC-LIMITED");
  const [custAddr, setCustAddr] = useState("");
  
  const [items, setItems] = useState([
    { id: Date.now().toString(), description: "80GSM-A4", qty: "1", rate: "2500" }
  ]);
  const [notes, setNotes] = useState("");

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now().toString() + Math.random(), description: "", qty: "", rate: "" }]);
  };

  const removeItem = (id) => {
    if (items.length <= 1) return; // prevent deleting last row
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const resetStore = () => {
    setCustName("");
    setCustAddr("");
    setPhone("");
    setItems([{ id: Date.now().toString(), description: "", qty: "", rate: "" }]);
    setNotes("");
    setDate(new Date().toISOString().split('T')[0]);
  };

  const { subtotal, total } = calcTotals(items);

  return {
    billNo, setBillNo,
    date, setDate,
    phone, setPhone,
    sellerName, setSellerName,
    sellerAddr, setSellerAddr,
    custName, setCustName,
    custAddr, setCustAddr,
    items, setItems,
    notes, setNotes,
    updateItem,
    addItem,
    removeItem,
    resetStore,
    subtotal,
    total
  };
}
