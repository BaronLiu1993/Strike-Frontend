import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AddBoxIcon from "@mui/icons-material/AddBox";

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleHomeNavigation = async (path) => {
    try {
      const accessToken = localStorage.getItem("access_token"); 
      if (!accessToken) {
        throw new Error("No access token found. Please log in again.");
      }
  
      const roleResponse = await fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/api/auth/user-role/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (!roleResponse.ok) {
        throw new Error("Failed to fetch user role. Please try again.");
      }
  
      const roleData = await roleResponse.json();
  
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
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#f5f5f5",
        boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "0.5rem 0",
        zIndex: 1000, 
      }}
    >
      <Tooltip title="Home" arrow>
        <IconButton
          onClick={() => handleHomeNavigation()}
          sx={{
            color: "#555",
            "&:hover": {
              color: "#000",
              transform: "scale(1.1)", 
            },
            transition: "all 0.3s ease",
          }}
        >
          <HomeIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Leaderboard" arrow>
        <IconButton
          onClick={() => handleNavigation("/leaderboard")}
          sx={{
            color: "#555",
            "&:hover": {
              color: "#000",
              transform: "scale(1.1)", 
            },
            transition: "all 0.3s ease",
          }}
        >
          <LeaderboardIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Add Course" arrow>
        <IconButton
          onClick={() => handleNavigation("/add-course")}
          sx={{
            color: "#555",
            "&:hover": {
              color: "#000",
              transform: "scale(1.1)", 
            },
            transition: "all 0.3s ease",
          }}
        >
          <AddBoxIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Navbar;
