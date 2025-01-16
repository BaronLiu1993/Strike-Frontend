import React, { useState, useEffect } from "react";
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
  const { homeworkId, courseId } = useParams();
  const [studentId, setStudentId] = useState(null);
  const [video, setVideo] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const response = await fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/register/student/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user information. Please log in.");
        }

        const data = await response.json();
        setStudentId(data.student_id);
      } catch (err) {
        console.error("Error fetching student ID:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentId();
  }, []);

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("submission_video", video || "");
    formData.append("submission_text", text || "");

    if (!studentId) {
      setError("Unable to submit homework. User information not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/submission/${courseId}/${homeworkId}/${studentId}/add-submission/`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to submit homework. Please try again."
        );
      }

      setSuccess(true);
      navigate(`/student-home`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          width: "100%",
          maxWidth: "25rem", 
          backgroundColor: "white",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          height: "100vh", 
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
            textAlign: "center",
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

        <TextField
          fullWidth
          label="Text Annotation"
          variant="outlined"
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ marginBottom: "1rem" }}
        />

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
            "&:hover": { backgroundColor: "#333" },
          }}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default SubmissionPage;
