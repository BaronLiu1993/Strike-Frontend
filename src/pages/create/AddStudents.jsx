import React, { useState } from "react";
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
        <Typography variant="h6" mb={2}>
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
          />
          <Button
            onClick={handleAddStudents}
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || !studentIds}
            sx={{ marginTop: "16px" }}
          >
            {loading ? "Adding..." : "Add Students"}
          </Button>
        </form>
        {message && (
          <Typography
            mt={2}
            color={message.includes("successfully") ? "green" : "error"}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AddStudents;
