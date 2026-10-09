import React, { useState, useEffect } from 'react';

const empty = { name: '', subject: '', address: '', age: '', marks: '', grade: 'A' };

export default function StudentForm({ onSubmit, editingStudent, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(editingStudent || empty);
  }, [editingStudent]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      age: parseInt(form.age, 10),
      marks: parseFloat(form.marks)
    });
    setForm(empty);
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-white fw-bold py-3">
        {editingStudent ? `Edit Student (ID: ${editingStudent.id})` : 'Add New Student'}
      </div>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold">Name</label>
              <input type="text" name="name" className="form-control form-control-sm" value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Subject</label>
              <input type="text" name="subject" className="form-control form-control-sm" value={form.subject} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label small fw-bold">Address</label>
              <textarea name="address" className="form-control form-control-sm" rows="2" value={form.address} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Age</label>
              <input type="number" name="age" className="form-control form-control-sm" value={form.age} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Marks</label>
              <input type="number" step="0.1" name="marks" className="form-control form-control-sm" value={form.marks} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">Grade</label>
              <select name="grade" className="form-select form-select-sm" value={form.grade} onChange={handleChange} required>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-primary btn-sm fw-bold">
              {editingStudent ? 'Update Student' : 'Save Student'}
            </button>
            {editingStudent && (
              <button type="button" className="btn btn-secondary btn-sm ms-1" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
