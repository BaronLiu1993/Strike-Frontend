import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  CssBaseline,
  Alert,
} from "@mui/material";
import StrikeLogo from "../../assets/strike.png"; // Replace with the correct path to your logo

const SubmissionPage = () => {
  const { homeworkId, courseId } = useParams(); // Extract homework and course IDs from the URL
  const [video, setVideo] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("submission_video", video || ""); // Add video file
    formData.append("submission_text", text || ""); // Add text annotation

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/submissions/${courseId}/${homeworkId}/${studentId}/add-submission/`, // Adjusted endpoint to include courseId and homeworkId
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit homework. Please try again.");
      }

      setSuccess(true);
      navigate(`/course-student/${courseId}`); // Redirect back to the course page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "25rem",
          backgroundColor: "white",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          padding: "2rem",
          flexGrow: 1, // Ensure the form stretches to fill the available space
        }}
      >
        <Box
          sx={{
            width: "100%",
            backgroundColor: "black",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <img
            src={StrikeLogo}
            alt="Strike Music Institute"
            style={{ width: "60px", height: "auto" }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            marginTop: "1rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Submit Homework
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginBottom: "1.5rem",
            color: "#666",
            textAlign: "center",
          }}
        >
          Please upload your video or provide a text annotation for your homework.
        </Typography>

        {/* Video Upload */}
        <Box sx={{ marginBottom: "1rem", width: "100%" }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderColor: "#333",
              "&:hover": { borderColor: "#000" },
            }}
          >
            {video ? video.name : "Upload Video"}
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoChange}
            />
          </Button>
        </Box>

        {/* Text Annotation */}
        <TextField
          fullWidth
          label="Text Annotation"
          variant="outlined"
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{
            marginBottom: "1rem",
          }}
        />

        {/* Error or Success Messages */}
        {error && (
          <Alert severity="error" sx={{ marginBottom: "1rem", width: "100%" }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ marginBottom: "1rem", width: "100%" }}>
            Submission successful!
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            padding: "1rem",
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </Box>
    </div>
  );
};

export default SubmissionPage;
