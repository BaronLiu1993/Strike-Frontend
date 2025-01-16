import React, { useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography, Alert } from '@mui/material';

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

      const response = await fetch('https://strikeapp-fb52132f9a0c.herokuapp.com/register/student/', {
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: '1rem',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          padding: '2rem',
        }}
      >
        <Typography variant="h5" textAlign="center" mb={2} fontWeight="bold">
          Fill in Your Information!
        </Typography>

        {message && (
          <Alert
            severity={message.includes('successful') ? 'success' : 'error'}
            sx={{ marginBottom: '1rem' }}
          >
            {message}
          </Alert>
        )}

        <TextField
          label="Username"
          fullWidth
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          helperText="Your username will be visible to others."
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          label="Email"
          fullWidth
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <TextField
          label="Password"
          fullWidth
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          fullWidth
          variant="outlined"
          margin="normal"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Typography variant="body2" color="textSecondary" mb={2}>
          <strong>Username Requirements:</strong>
          <ul style={{ marginLeft: '1rem', listStyle: 'disc' }}>
            <li>Contains only English letters and numbers.</li>
            <li>Must be between 2-20 characters in length.</li>
          </ul>
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={handleRegister}
          sx={{
            padding: '0.8rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: '#000',
            color: '#fff',
            '&:hover': { backgroundColor: '#333' },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>
      </Box>
    </Box>
  );
};

export default Register2;
