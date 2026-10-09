import React from 'react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-3">
          <div className="card shadow-sm border-0 h-100 text-center p-3">
            <div className="text-muted small text-uppercase fw-bold">Average Marks</div>
            <div className="display-6 fw-bold text-primary my-1">{stats.mean ?? '-'}</div>
            <div className="small text-muted">NumPy mean()</div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card shadow-sm border-0 h-100 text-center p-3">
            <div className="text-muted small text-uppercase fw-bold">Highest Marks</div>
            <div className="display-6 fw-bold text-success my-1">{stats.max ?? '-'}</div>
            <div className="small text-muted">NumPy max()</div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card shadow-sm border-0 h-100 text-center p-3">
            <div className="text-muted small text-uppercase fw-bold">Lowest Marks</div>
            <div className="display-6 fw-bold text-danger my-1">{stats.min ?? '-'}</div>
            <div className="small text-muted">NumPy min()</div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card shadow-sm border-0 h-100 text-center p-3">
            <div className="text-muted small text-uppercase fw-bold">Pass Rate</div>
            <div className="display-6 fw-bold text-dark my-1">{stats.pass_pct ?? 0}%</div>
            <div className="small text-muted">Passing score: 40</div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4 py-2 px-3 d-flex flex-row justify-content-between align-items-center">
        <div className="small text-muted">
          <strong className="text-dark">Grade Counts: </strong>
          {stats.grades && Object.entries(stats.grades).map(([g, c]) => (
            <span key={g} className="badge bg-light text-dark border ms-1">{g}: {c}</span>
          ))}
        </div>
        <span className="badge bg-secondary">Total: {stats.total || 0}</span>
      </div>
    </div>
  );
}
