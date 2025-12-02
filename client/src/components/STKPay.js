// client/src/components/STKPay.js
import React, { useState } from 'react';
import axios from 'axios';
import api from '../utils/api';

export default function STKPay({ onDone }) {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  async function handlePay(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/mpesa/stk/push',
        { phone, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('STK request sent. Please enter PIN on your phone.');
      onDone && onDone(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePay} className="space-y-3">
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+2547xxxxxxxx" required className="w-full p-2 border rounded" />
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (KES)" required type="number" className="w-full p-2 border rounded" />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? 'Requesting...' : 'Pay with M-Pesa'}
      </button>
    </form>
  );
}
