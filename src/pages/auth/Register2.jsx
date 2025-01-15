import React, { useState } from 'react';

const Register2 = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (username.length < 2 || username.length > 20 || /[^a-zA-Z0-9]/.test(username)) {
      setMessage('Username must contain only English letters and numbers, and be 2-20 characters long.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: username.trim(),
        password: password.trim(),
        email: email.trim(),
      };

      const response = await fetch('http://localhost:8000/register/student/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to register.');
      }

      setMessage('Registration successful! You can now log in.');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-oswald">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Fill in Your Information!</h2>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              message.includes('successful')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm password"
          />
        </div>

        <div className="mb-6">
          <h1 className="text-lg font-semibold mb-2">About Username</h1>
          <ul className="list-disc list-inside text-gray-600">
            <li>Your username will be visible to others.</li>
            <li>It must contain only English characters or numbers.</li>
            <li>Must be between 2-20 characters in length.</li>
          </ul>
        </div>

        <button
          onClick={handleRegister}
          className={`w-full py-3 text-white rounded-md text-lg ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </div>
  );
};

export default Register2;
