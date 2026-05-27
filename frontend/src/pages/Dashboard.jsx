import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [totalEmployees, setTotalEmployees] = useState('—');
  const [presentToday, setPresentToday] = useState('—');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    api.get('/employees', { params: { limit: 1 } })
      .then(({ data }) => setTotalEmployees(data.total))
      .catch(() => {});

    api.get('/attendance', { params: { date: today, limit: 1 } })
      .then(({ data }) => setPresentToday(data.total))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Dashboard</h2>
      <p className="text-slate-500 text-sm">Welcome back, Admin!</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <p className="text-slate-500 text-sm">Total Employees</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{totalEmployees}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
          <p className="text-slate-500 text-sm">Present Today</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{presentToday}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-500">
          <p className="text-slate-500 text-sm">System</p>
          <p className="text-sm font-medium text-green-600 mt-2">✅ Online</p>
        </div>
      </div>
    </div>
  );
}