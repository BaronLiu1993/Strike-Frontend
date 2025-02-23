import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";

const CreateHomework = () => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/homework/${courseId}/add-homework/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            due_date: formData.dueDate,
            course: courseId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create homework");
      }

      setMessage("Homework created successfully!");
      setFormData({ title: "", description: "", dueDate: "" });
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
        <Typography 
        sx={{
          fontFamily: "Poppins, sans-serif",
          "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
          "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
          marginTop:"16px"
        }} variant="h6" mb={2}>
          Create Homework
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            sx={{
              fontFamily: "Poppins, sans-serif",
              "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
              "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={3}
            sx={{
              fontFamily: "Poppins, sans-serif",
              "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
              "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
            sx={{
              fontFamily: "Poppins, sans-serif",
              "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
              "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!formData.title || !formData.description || !formData.dueDate}
            sx={{
              fontFamily: "Poppins, sans-serif",
              "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
              "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
              marginTop:"16px"
            }}
          >
            {loading ? "Submitting..." : "Submit"}
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

export default CreateHomework;
