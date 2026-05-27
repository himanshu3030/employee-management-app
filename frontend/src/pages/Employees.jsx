import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import EmployeeForm from '../components/EmployeeForm';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // employee object or null
  const limit = 10;

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/employees', { params: { page, limit, search } });
      setEmployees(data.employees);
      setTotal(data.total);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleAdd = async (form) => {
    await api.post('/employees', { ...form, salary: Number(form.salary) });
    setShowForm(false);
    fetchEmployees();
  };

  const handleUpdate = async (form) => {
    await api.put(`/employees/${editing._id}`, { ...form, salary: Number(form.salary) });
    setEditing(null);
    fetchEmployees();
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Employees</h2>
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            + Add Employee
          </button>
        )}
      </div>

      {/* Form */}
      {(showForm || editing) && (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
          <h3 className="font-semibold text-slate-700 mb-3">{editing ? 'Edit Employee' : 'New Employee'}</h3>
          <EmployeeForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleAdd}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text" placeholder="Search by name, email, mobile..."
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No employees found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Name', 'Email', 'Mobile', 'Aadhaar', 'Salary', 'Action'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{emp.name}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.email}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.mobileNumber}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.aadhaarNumber}</td>
                  <td className="px-4 py-3 text-slate-600">₹{emp.salary.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setEditing(emp); setShowForm(false); }}
                      className="text-blue-600 hover:underline text-xs font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex gap-2 mt-4 justify-end">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 text-sm rounded-lg bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm text-slate-600">{page} / {pages}</span>
          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 text-sm rounded-lg bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
