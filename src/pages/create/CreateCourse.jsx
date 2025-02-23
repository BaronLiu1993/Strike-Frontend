import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setMessage("Title and description are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          students: [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create course");
      }

      const data = await response.json();
      setMessage(`Course created successfully: ${data.title}`);
      setTitle("");
      setDescription("");
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
          border: "1px solid #ccc",
        }}
      >
        <Typography variant="h6" mb={2}>
          Create Course
        </Typography>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            rows={3}
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || !title || !description}
            sx={{ marginTop: "16px" }}
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

export default CreateCourse;
