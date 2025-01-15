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

      navigate("/student-home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Video Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          loop
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(50%)", // Darkens the video for better readability
          }}
        >
          <source src={BackgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Login Container */}
      <div
        className="flex flex-col items-center justify-center"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="flex flex-col shadow-md rounded-md items-center justify-center w-[90%] max-w-[400px] p-6"
          style={{
            backgroundColor: "transparent", // Transparent container
          }}
        >
          <img
            src={StrikeLogo}
            alt="Strike Music Logo"
            style={{
              width: "80px",
              height: "auto",
              marginBottom: "1rem",
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            style={{
              marginBottom: "1rem",
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
            }}
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="subtitle1"
            style={{
              color: "#fff",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            Enter your login details below
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: "rgba(255, 0, 0, 0.8)",
                color: "#fff",
              }}
            >
              {error}
            </Alert>
          )}

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
                InputLabelProps={{
                  style: { color: "#fff" }, // White label text
                }}
                InputProps={{
                  style: { color: "#fff", borderColor: "#fff" }, // White input text
                  classes: {
                    notchedOutline: {
                      borderColor: "#fff", // White outline
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#fff",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                    },
                  },
                }}
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
                InputLabelProps={{
                  style: { color: "#fff" }, // White label text
                }}
                InputProps={{
                  style: { color: "#fff", borderColor: "#fff" }, // White input text
                  classes: {
                    notchedOutline: {
                      borderColor: "#fff", // White outline
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#fff",
                    },
                    "&:hover fieldset": {
                      borderColor: "#fff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fff",
                    },
                  },
                }}
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

          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography
              variant="body2"
              sx={{ mr: 1, color: "#fff" }}
            >
              Don't have an account?
            </Typography>
            <Button
              variant="text"
              sx={{
                color: "#fff",
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
