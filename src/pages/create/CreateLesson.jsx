import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";

const CreateLesson = () => {
  const [loading, setLoading] = useState(false);
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/lesson/${courseId}/add-lesson/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          credentials: "include",
          body: JSON.stringify({ ...formData, course: courseId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create lesson");
      }

      setFormData({ title: "", content: "" });
      setTimeout(() => window.location.reload()); 

    } catch (error) {
      console.error(error);
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
        }}
      >
        <Typography sx={{
                    fontFamily: "Poppins, sans-serif",
                    "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
                    "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
                    }}variant="h6" 
                    mb={2}>
          Create Lesson
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
            label="Content"
            name="content"
            value={formData.content}
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled = {!formData.title || !formData.content}
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
      </Box>
    </Box>
  );
};

export default CreateLesson;
