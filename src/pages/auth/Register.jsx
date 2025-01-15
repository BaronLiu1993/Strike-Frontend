import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Box, Alert } from "@mui/material";
import "@fontsource/poppins"; // Poppins font
import StrikeLogo from "../../assets/strike.png"; // Replace with the correct path to your logo
import BackgroundVideo from "../../assets/performance.mp4"; // Replace with the correct path to your video

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const user = {
      username: username,
      password: password,
    };
    try {
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed. Please try again.");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // Redirect to the home page or dashboard after successful login
      navigate("/student-home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Login Container */}
      <div
        className="bg-white shadow-lg rounded-lg min-h-screen p-8 max-w-md w-[25rem]"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1, // Ensures the video is behind other elements
            opacity: 0.2, // Makes the video slightly transparent
          }}
        >
          <source src={BackgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Content */}
        <div
          className="flex flex-col items-center justify-center relative"
          style={{
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <img
            src={StrikeLogo}
            alt="Strike Music Logo"
            style={{
              width: "80px",
              height: "auto",
              marginBottom: "1rem",
            }}
          />

          {/* Welcome Text */}
          <Typography
            variant="h4"
            component="h1"
            style={{
              marginBottom: "1rem",
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
            }}
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="subtitle1"
            style={{
              color: "#555",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            Enter your login details below
          </Typography>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form
            onSubmit={submit}
            style={{
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            <Box mb={2}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                padding: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Login
            </Button>
          </form>

          {/* Register Option */}
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="body2" sx={{ mr: 1, color: "#000" }}>
              Don't have an account?
            </Typography>
            <Button
              variant="text"
              sx={{
                color: "#000",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Login;
