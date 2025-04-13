import React, { useState, useEffect } from "react";
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
        } else {
          navigate("/");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    handleHomeNavigation()
  }, [])

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
      });
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
          paddingBottom: inputFocused ? "200px" : "0", 
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
          <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819", textAlign: "center" }}>
            Welcome Back!
          </Typography>
          <Typography variant="subtitle1" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819", textAlign: "center", marginBottom: "1rem" }}>
            Enter your login details
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <AudiotrackIcon sx={{ color: "#5b3819", fontSize: "10rem", display: "block", margin: "0 auto 1rem" }} />

          <form onSubmit={submit} style={{ width: "100%" }}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                required
                sx={{
                  color: "#5b3819",
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
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                required
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" },
                  "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
                }}
              />
            </Box>
            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >



                <Button
                          variant="contained"
                          fullWidth
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
                          type="submit"
                          disabled={isLoggingIn}
                        >
                            {isLoggingIn ? "Logging in..." : "Login"}
                        </Button>
            </motion.div>
          </form>

          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Typography variant="body2" sx={{ color: "#5b3819", mr: 1 }}>
              Don't have an account?
            </Typography>
            <Button
              variant="text"
              sx={{
                color: "#5b3819",
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
