import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import { Button, TextField, Typography, Box, Alert } from "@mui/material";
import "@fontsource/poppins";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    const user = { username, password };

    try {
      const response = await fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setTimeout(() => {
        if (roleData.role === "teacher") {
          navigate("/teacher-home");
        } else if (roleData.role === "student") {
          navigate("/student-home");
        } else {
          throw new Error("Unknown user role. Contact support.");
        }
      }, 500);
    } catch (err) {
      setIsLoggingIn(false);
      setError(err.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100vw", opacity: 0 }}
        transition={{ type: "tween", duration: 0.5 }}
        style={{
          fontFamily: "Poppins, sans-serif",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          className="flex flex-col rounded-md"
          style={{
            width: "90%",
            maxWidth: "400px",
            background: "white",
            padding: "1.5rem",
            borderRadius: "10px"
          }}
        >
          <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#3f51b5", textAlign: "center" }}>
            Welcome Back!
          </Typography>
          <Typography variant="subtitle1" sx={{ fontFamily: "Poppins, sans-serif", color: "#3f51b5", textAlign: "center", marginBottom: "1rem" }}>
            Enter your login details
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <AudiotrackIcon sx={{ color: "#3f51b5", fontSize: "5rem", display: "block", margin: "0 auto 1rem" }} />

          <form onSubmit={submit} style={{ width: "100%" }}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
                  "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
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
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, // Ensures input field text uses Poppins
                  "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" }, // Ensures label uses Poppins
                }}
              />
            </Box>
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoggingIn}
                sx={{
                  padding: "12px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  backgroundColor: "#3f51b5",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#3f51b5" },
                }}
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            </motion.div>
          </form>

          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Typography variant="body2" sx={{ color: "#3f51b5", mr: 1 }}>
              Don't have an account?
            </Typography>
            <Button
              variant="text"
              sx={{
                color: "#3f51b5",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Box>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
