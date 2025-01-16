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
      // Login request
      const response = await fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/api/auth/login/", {
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

      // Fetch user role
      const roleResponse = await fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/api/auth/user-role/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!roleResponse.ok) {
        throw new Error("Failed to fetch user role. Please try again.");
      }

      const roleData = await roleResponse.json();

      // Redirect based on role
      if (roleData.role === "teacher") {
        navigate("/teacher-home");
      } else if (roleData.role === "student") {
        navigate("/student-home");
      } else {
        throw new Error("Unknown user role. Contact support.");
      }
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
            filter: "brightness(50%)",
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
          className="flex flex-col rounded-md items-center justify-center w-[90%] max-w-[400px] p-6"
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
                  style: { color: "#fff" },
                }}
                InputProps={{
                  style: { color: "#fff", borderColor: "#fff" },
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
                  style: { color: "#fff" },
                }}
                InputProps={{
                  style: { color: "#fff", borderColor: "#fff" },
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
