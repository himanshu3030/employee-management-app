import { useState, useEffect } from 'react';

const empty = { name: '', aadhaarNumber: '', address: '', salary: '', email: '', mobileNumber: '' };

const Field = ({ label, name, type = 'text', placeholder, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
    <input
      type={type} required placeholder={placeholder}
      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
    />
  </div>
);

export default function EmployeeForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm(empty);
  }, [initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(form);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Error saving';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Full Name" name="name" placeholder="Rahul Sharma" value={form.name} onChange={set} />
        <Field label="Email" name="email" type="email" placeholder="rahul@example.com" value={form.email} onChange={set} />
        <Field label="Mobile Number" name="mobileNumber" placeholder="9876543210" value={form.mobileNumber} onChange={set} />
        <Field label="Aadhaar Number" name="aadhaarNumber" placeholder="12-digit number" value={form.aadhaarNumber} onChange={set} />
        <Field label="Salary (₹)" name="salary" type="number" placeholder="50000" value={form.salary} onChange={set} />
        <Field label="Address" name="address" placeholder="123, MG Road, Delhi" value={form.address} onChange={set} />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
          {initial ? 'Update' : 'Add Employee'}
        </button>
        <button type="button" onClick={onCancel} className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm px-4 py-2 rounded-lg transition">
          Cancel
        </button>
      </div>
    </form>
  );
}