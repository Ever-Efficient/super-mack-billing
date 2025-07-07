import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersData } from '../assets/data/userdata';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const matchedUser = usersData.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('role', matchedUser.role);
      localStorage.setItem('user', JSON.stringify(matchedUser));

      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen">
      <form onSubmit={handleLogin} className="surface-card p-4 shadow-2 border-round w-full sm:w-20rem">
        <h2 className="text-center">Login</h2>

        {error && (
          <div className="p-error mb-3 text-sm text-red-600">{error}</div>
        )}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="p-inputtext p-component w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="p-inputtext p-component w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="p-button p-component w-full mt-2">
          Login
        </button>
      </form>
    </div>
  );
}