import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Button
} from "@mui/material";
import { motion } from "framer-motion";
import CloudIcon from "@mui/icons-material/Cloud";
import "@fontsource/poppins";

const SubmissionPage = () => {
  const { homeworkId, courseId } = useParams();
  const [studentId, setStudentId] = useState(null);
  const [video, setVideo] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/register/student/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch user info. Please log in.");

        const data = await response.json();
        setStudentId(data.student_id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleDeleteVideo = () => {
    setVideo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(false);

    if (!studentId) {
      setError("Unable to submit homework. User information not found.");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("submission_video", video || "");
    formData.append("submission_text", text || "");

    try {
      const response = await fetch(
        `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/submission/${courseId}/${homeworkId}/${studentId}/add-submission/`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit homework. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => navigate(`/student-home`));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen bg-gray-100">
        <CircularProgress size={50} sx={{ color: "#3f51b5" }} />
      </Box>
    );
  }

  if (error) {
      const navigate = useNavigate();
    
      useEffect(() => {
        navigate("/login"); 
      }, [navigate]);
    
      return null; 
    }

  return (
    <motion.div
      className="flex flex-col justify-between items-center p-6 space-y-6 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-lg space-y-6">
        <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#3f51b5", fontWeight: "bold" }}>
          Your Work
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: "100%" }}>
            Submission successful!
          </Alert>
        )}

        <motion.div className="space-y-6">
          <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
            Attachments
          </Typography>

          <div className="flex flex-col items-center justify-between">
            {video ? (
              <motion.div className="border flex items-center justify-between rounded-2xl p-4 h-[6rem] w-full">
                <div className = "flex flex-col">
                  <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", color: "#3f51b5" }}>
                    {video.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "#666" }}>
                    File Size: {(video.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </div>
                <div>
                  <Button onClick={handleDeleteVideo} sx={{ ml: 2 }}>Delete</Button>
                </div>
              </motion.div>
            ) : (
              <motion.div className="flex flex-col items-center">
                <CloudIcon sx={{ color: "#3f51b5", fontSize: "8rem" }} />
                <Typography variant="body1" sx={{ fontFamily: "Poppins, sans-serif", color: "#666", mt: 2 }}>
                  No attachments uploaded.
                </Typography>
              </motion.div>
            )}
          </div>
          <TextField
        fullWidth
        multiline
        minRows={3}
        variant="outlined"
        label="Add Annotations (Optional)"
        placeholder="Add a Comment here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{
          fontFamily: "Poppins, sans-serif",
          "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
          "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" }, 
        }}
      />
        </motion.div>
      </div>
      




      <motion.div className="w-full max-w-lg">
        {uploading ? (
          <div className="flex justify-center">
            <CircularProgress size={35} sx={{ color: "#4CAF50" }} />
            <Typography variant="body1" sx={{ ml: 2, fontFamily: "Poppins, sans-serif", color: "#4CAF50" }}>
              Uploading...
            </Typography>
          </div>
        ) : video ? (
          <motion.button
            style={{ fontFamily: "Poppins, sans-serif" }}
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-3 rounded-lg text-lg cursor-pointer"
          >
            Upload Video
          </motion.button>
        ) : (
          <motion.label
            style={{ fontFamily: "Poppins, sans-serif" }}
            className="w-full bg-[#3f51b5] text-white py-3 rounded-lg text-lg text-center cursor-pointer block"
          >
            Select Video
            <input type="file" onChange={handleVideoChange} accept="video/*" className="hidden" />
          </motion.label>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SubmissionPage;
