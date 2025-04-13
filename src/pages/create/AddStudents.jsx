import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const AddStudents = ({ courseIdentification }) => {
  const [studentIds, setStudentIds] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddStudents = async () => {
    if (!studentIds.trim()) {
      setMessage("Please enter at least one student ID.");
      return;
    }

    const idsArray = studentIds.split(",").map(id => parseInt(id.trim(), 10));

    if (idsArray.some(isNaN)) {
      setMessage("All student IDs must be valid numbers.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/${courseIdentification}/add-students/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          credentials: "include",
          body: JSON.stringify({ student_ids: idsArray }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add students.");
      }

      setMessage("Students added successfully.");
      setStudentIds("");
      setTimeout(() => window.location.reload()); 

    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px", 
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "22rem",
          padding: "16px",
          backgroundColor: "#fff",
        }}
      >
        <Typography sx = {{fontFamily: "Poppins, sans-serif",
                    "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
                    "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },}} variant="h6" mb={2}>
          Add Students to Course
        </Typography>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            fullWidth
            margin="normal"
            label="Student IDs (comma-separated)"
            value={studentIds}
            onChange={(e) => setStudentIds(e.target.value)}
            required
            sx = {{fontFamily: "Poppins, sans-serif",
              "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
              "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },}}
          />
          <Button
            onClick={handleAddStudents}
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || !studentIds}
            sx={{ marginTop: "16px", fontFamily: "Poppins, sans-serif",
              "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
              "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" }, }}
          >
            {loading ? "Adding..." : "Add Students"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddStudents;
