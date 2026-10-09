import React, { useState } from 'react';
import { apiLogin } from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submitLogin = async (u, p) => {
    setError('');
    try {
      const data = await apiLogin(u, p);
      onLogin(data);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin(username, password);
  };

  return (
    <div className="row justify-content-center pt-5">
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white text-center py-3">
            <h5 className="mb-0 fw-bold">Sign In</h5>
          </div>
          <div className="card-body p-4">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
