import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import StudentForm from './StudentForm';
import { getStudents, getStats, addStudent, updateStudent, deleteStudent } from '../api';

export default function Dashboard({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');
  const [q, setQ] = useState('');
  const [grade, setGrade] = useState('');
  const isAdmin = user.role === 'admin';

  const notify = (t) => { setMsg(t); setTimeout(() => setMsg(''), 3000); };
  const loadData = async () => {
    try {
      const [s, st] = await Promise.all([getStudents(user.token), getStats(user.token)]);
      setStudents(s); setStats(st);
    } catch { notify('Error loading data'); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (data) => {
    try {
      editing ? await updateStudent(editing.id, data, user.token) : await addStudent(data, user.token);
      setEditing(null); notify('Saved!'); loadData();
    } catch (e) { notify(e.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Delete #${id}?`)) {
      try { await deleteStudent(id, user.token); notify('Deleted!'); loadData(); } catch { notify('Failed'); }
    }
  };

  const filtered = students.filter(s => (s.name.toLowerCase().includes(q.toLowerCase()) || s.subject.toLowerCase().includes(q.toLowerCase())) && (!grade || s.grade === grade));
  return (
    <div>
      <nav className="navbar navbar-dark bg-dark rounded mb-3 px-3">
        <span className="navbar-brand fw-bold mb-0">Student Performance Tracker</span>
        <div className="ms-auto d-flex align-items-center">
          <span className="text-white fw-bold me-2">{user.username}</span>
          <span className={`badge ${isAdmin ? 'bg-success' : 'bg-secondary'} me-3`}>{user.role.toUpperCase()}</span>
          <button className="btn btn-outline-light btn-sm py-0" onClick={onLogout}>Logout</button>
        </div>
      </nav>
      {msg && <div className="alert alert-info py-1 small">{msg}</div>}
      <StatsCards stats={stats} />
      {isAdmin && <StudentForm onSubmit={handleSave} editingStudent={editing} onCancel={() => setEditing(null)} />}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-2 d-flex justify-content-between align-items-center">
          <span className="fw-bold small">Records</span>
          <div className="d-flex gap-2">
            <input type="text" className="form-control form-control-sm" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} style={{ width: '130px' }} />
            <select className="form-select form-select-sm" value={grade} onChange={e => setGrade(e.target.value)} style={{ width: '110px' }}>
              <option value="">All Grades</option><option value="A">Grade A</option><option value="B">Grade B</option><option value="C">Grade C</option><option value="D">Grade D</option><option value="F">Grade F</option>
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle mb-0 small">
            <thead className="table-light"><tr><th>ID</th><th>Name</th><th>Subject</th><th>Age</th><th>Marks</th><th>Grade</th><th>Address</th>{isAdmin && <th className="text-end">Actions</th>}</tr></thead>
            <tbody>
              {!filtered.length ? <tr><td colSpan={isAdmin ? 8 : 7} className="text-center text-muted py-3">No records found.</td></tr> :
                filtered.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td><td className="fw-bold">{s.name}</td><td>{s.subject}</td><td>{s.age}</td><td>{s.marks}</td>
                    <td className="fw-bold text-dark">{s.grade}</td>
                    <td className="small text-muted">{s.address}</td>
                    {isAdmin && <td className="text-end"><button className="btn btn-outline-primary btn-sm py-0 me-1" onClick={() => setEditing(s)}>Edit</button><button className="btn btn-outline-danger btn-sm py-0" onClick={() => handleDelete(s.id)}>Delete</button></td>}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
