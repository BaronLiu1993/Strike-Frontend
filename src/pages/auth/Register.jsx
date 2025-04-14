import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Box, Button, CircularProgress, TextField, Typography, Alert } from '@mui/material';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const navigate = useNavigate(); 

  useEffect(() => {
    const handleHomeNavigation = async (path) => {
      try {
        const accessToken = localStorage.getItem("access_token"); 
        
    
        const roleResponse = await fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/api/auth/user-role/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
    
        
    
        const roleData = await roleResponse.json();
    
        if (roleData.role === "teacher") {
          navigate("/teacher-home");
        } else if (roleData.role === "student") {
          navigate("/student-home");
        } 
        
      } catch (err) {
        setError(err.message);
      }
    };

    handleHomeNavigation()
  }, [])

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

      setMessage('Registration successful! Redirecting to login...');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: inputFocused ? "150px" : "0", 
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          height: "auto",
          boxSizing: "border-box",
        }}
      >
        <Typography
          style={{
            fontFamily: "Poppins, sans-serif",
            color: "#5b3819",
          }} 
          variant="h5" 
          textAlign="center" 
          mb={2}
          fontWeight="bold"
        >
          Fill in Your Information!
        </Typography>

        {message && (
          <Alert severity={message.includes('successful') ? 'success' : 'error'} sx={{ marginBottom: '1rem' }}>
            {message}
          </Alert>
        )}

        <TextField
          style={{
            fontFamily: "Poppins, sans-serif",
            color: "#5b3819",
          }}
          label="Username"
          fullWidth
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          helperText="Your username will be visible to others."
          sx={{
            fontFamily: "Poppins, sans-serif",
            "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
            "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" }, 
          }}
        />
        <TextField
          label="Email"
          fullWidth
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          sx={{
            fontFamily: "Poppins, sans-serif",
            "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" },
            "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" }, 
          }}
        />
        <TextField
          label="Password"
          fullWidth
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          sx={{
            fontFamily: "Poppins, sans-serif",
            "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" },
            "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
          }}
        />
        <TextField
          label="Confirm Password"
          fullWidth
          variant="outlined"
          margin="normal"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          sx={{
            fontFamily: "Poppins, sans-serif",
            "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
            "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" }, 
          }}
        />

        <Typography
          style={{
            fontFamily: "Poppins, sans-serif",
            color: "#5b3819",
          }}
          variant="body2"
          color="textSecondary"
          mb={2}
        >
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
          style={{
            fontFamily: "Poppins, sans-serif",
            background: "#5b3819",
          }}
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
    </div>
  );
};

export default Register;
