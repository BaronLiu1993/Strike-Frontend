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
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { Permissions } from "@capacitor/permissions";
import Navbar from "../navbar/Navbar";

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
        const response = await fetch(
          "https://strikeapp-fb52132f9a0c.herokuapp.com/register/student/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            credentials: "include",
          }
        );

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

  const requestPermissions = async () => {
    await Permissions.requestPermissions();
  };

  const pickFile = async () => {
    try {
      await requestPermissions();
      const result = await FilePicker.pickFiles({
        multiple: false,
        types: ["video/*"],
      });

      if (result.files.length > 0) {
        setVideo(result.files[0]);
      }
    } catch (error) {
      console.error("File selection failed:", error);
      setError("Failed to select file. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!studentId) {
      setError("Unable to submit homework. User information not found.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    if (video) {
      const fileBlob = new Blob([video.blob], { type: video.mimeType });
      formData.append("submission_video", fileBlob, video.name);
    }
    formData.append("submission_text", text || "");

    try {
      const response = await fetch(
        `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/submission/${courseId}/${homeworkId}/${studentId}/add-submission/`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingBottom: "64px" }}>
      <CssBaseline />
      <Box sx={{ width: "90%", maxWidth: "400px", backgroundColor: "#fff", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" color="black">
          Submit Homework
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: "1.5rem" }}>
          Upload your video or provide a text annotation for your homework.
        </Typography>

        <Button variant="contained" fullWidth onClick={pickFile} sx={{ backgroundColor: "black", color: "#fff", textTransform: "none", fontWeight: "bold", borderRadius: "8px", marginBottom: "1rem", '&:hover': { backgroundColor: "brown" } }}>
          {video ? video.name : "Pick Video File"}
        </Button>

        <TextField fullWidth label="Text Annotation" variant="outlined" multiline rows={4} value={text} onChange={(e) => setText(e.target.value)} sx={{ marginBottom: "1rem", backgroundColor: "#f5f5f5", borderRadius: "8px" }} />

        {error && <Alert severity="error" sx={{ marginBottom: "1rem" }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ marginBottom: "1rem" }}>Submission successful!</Alert>}

        <Button type="submit" variant="contained" fullWidth onClick={handleSubmit} sx={{ padding: "1rem", fontSize: "1rem", fontWeight: "bold", backgroundColor: "black", color: "#fff", borderRadius: "8px", '&:hover': { backgroundColor: "brown" } }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </Box>
      <Navbar sx={{ marginTop: "auto" }} />
    </Box>
  );
};

export default SubmissionPage;
