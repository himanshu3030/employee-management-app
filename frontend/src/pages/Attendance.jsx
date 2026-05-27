import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const today = new Date().toISOString().split('T')[0];

const STATUS_COLORS = {
  Present: 'bg-green-100 text-green-700',
  Absent: 'bg-red-100 text-red-700',
  Leave: 'bg-yellow-100 text-yellow-700',
};

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [date, setDate] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [msg, setMsg] = useState('');
  const limit = 10;

  useEffect(() => {
    api.get('/employees', { params: { limit: 100 } })
      .then(({ data }) => setEmployees(data.employees))
      .catch(() => {});
  }, []);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/attendance', {
        params: { page, limit, ...(date && { date }), ...(employeeId && { employeeId }) },
      });
      setRecords(data.records);
      setTotal(data.total);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [page, date, employeeId]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const handleMarkToday = async () => {
    setMarking(true);
    try {
      await api.post('/attendance/mark-today');
      setMsg('Today\'s attendance marked!');
      fetchAttendance();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error marking attendance');
    } finally {
      setMarking(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleEdit = async (id) => {
    try {
      await api.put(`/attendance/${id}`, { status: editing.status });
      setMsg('Attendance updated!');
      setEditing(null);
      fetchAttendance();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error updating');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Attendance</h2>
        <button
          onClick={handleMarkToday}
          disabled={marking}
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {marking ? 'Marking...' : '✅ Mark Today\'s Attendance'}
        </button>
      </div>

      {msg && (
        <div className={`text-sm rounded-lg p-3 mb-4 ${msg.includes('Error') || msg.includes('only') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="date" value={date}
          onChange={(e) => { setDate(e.target.value); setPage(1); }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={employeeId}
          onChange={(e) => { setEmployeeId(e.target.value); setPage(1); }}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Employees</option>
          {employees.map((e) => (
            <option key={e._id} value={e._id}>{e.name}</option>
          ))}
        </select>
        {(date || employeeId) && (
          <button
            onClick={() => { setDate(''); setEmployeeId(''); setPage(1); }}
            className="text-sm text-slate-500 hover:text-slate-800 underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No records found. Click <strong>"Mark Today's Attendance"</strong> to create today's records.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Employee', 'Email', 'Date', 'Status', 'Action'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{r.employee?.name || '—'}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{r.employee?.email || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{r.date}</td>
                  <td className="px-4 py-3">
                    {editing?.id === r._id ? (
                      <select
                        value={editing.status}
                        onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                        className="border border-slate-300 rounded px-2 py-1 text-xs"
                      >
                        <option>Present</option>
                        <option>Absent</option>
                        <option>Leave</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[r.status]}`}>
                        {r.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.date === today ? (
                      editing?.id === r._id ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(r._id)} className="text-green-600 text-xs font-medium hover:underline">Save</button>
                          <button onClick={() => setEditing(null)} className="text-slate-400 text-xs hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditing({ id: r._id, status: r.status })}
                          className="text-blue-600 text-xs font-medium hover:underline"
                        >
                          Edit
                        </button>
                      )
                    ) : (
                      <span className="text-slate-300 text-xs">Locked</span>
                    )}
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
          <button disabled={page === 1} onClick={() => setPage(page - 1)}
            className="px-3 py-1 text-sm rounded-lg bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-50">Prev</button>
          <span className="px-3 py-1 text-sm text-slate-600">{page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(page + 1)}
            className="px-3 py-1 text-sm rounded-lg bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-50">Next</button>
        </div>
      )}
    </div>
  );
}