const BASE = 'http://127.0.0.1:8000/api';

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': 'Bearer ' + token } : {})
});

export const apiLogin = async (username, password) => {
  const r = await fetch(`${BASE}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!r.ok) throw new Error('Invalid credentials');
  return r.json();
};

export const getStudents = async (token) => {
  const r = await fetch(`${BASE}/students/`, { headers: authHeaders(token) });
  if (!r.ok) throw new Error('Failed to load students');
  return r.json();
};

export const addStudent = async (data, token) => {
  const r = await fetch(`${BASE}/students/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data)
  });
  if (!r.ok) throw new Error('Failed to add student');
  return r.json();
};

export const updateStudent = async (id, data, token) => {
  const r = await fetch(`${BASE}/students/${id}/`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data)
  });
  if (!r.ok) throw new Error('Failed to update student');
  return r.json();
};

export const deleteStudent = async (id, token) => {
  const r = await fetch(`${BASE}/students/${id}/`, {
    method: 'DELETE',
    headers: authHeaders(token)
  });
  if (!r.ok) throw new Error('Failed to delete student');
  return true;
};

export const getStats = async (token) => {
  const r = await fetch(`${BASE}/stats/`, { headers: authHeaders(token) });
  if (!r.ok) throw new Error('Failed to load stats');
  return r.json();
};
