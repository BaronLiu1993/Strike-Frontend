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
        zIndex: 1000, // Ensure it stays above other components
      }}
    >
      {/* Home Button */}
      <Tooltip title="Home" arrow>
        <IconButton
          onClick={() => handleNavigation("/teacher-home")}
          sx={{
            color: "#555",
            "&:hover": {
              color: "#000",
              transform: "scale(1.1)", // Slight scaling effect on hover
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
              transform: "scale(1.1)", // Slight scaling effect on hover
            },
            transition: "all 0.3s ease",
          }}
        >
          <LeaderboardIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      {/* Add Course Button */}
      <Tooltip title="Add Course" arrow>
        <IconButton
          onClick={() => handleNavigation("/add-course")}
          sx={{
            color: "#555",
            "&:hover": {
              color: "#000",
              transform: "scale(1.1)", // Slight scaling effect on hover
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
