import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { AssignmentTurnedIn } from "@mui/icons-material";

const ViewSubmissions = () => {
  const { courseId, homeworkId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const VIDEO_BASE_URL = "https://d1zh5iubdcvnfh.cloudfront.net/submissions/";
  const navigate = useNavigate()
  
  useEffect(() => {
    const handleHomeNavigation = async (path) => {
      try {
        const accessToken = localStorage.getItem("access_token"); 
        if (!accessToken) {
          throw new Error("No access token found. Please log in again.");
        }
    
        const roleResponse = await fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/api/auth/user-role/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
    
        if (!roleResponse.ok) {
          throw new Error("Failed to fetch user role. Please try again.");
        }
    
        const roleData = await roleResponse.json();
    
        if (!roleData.role) {
          navigate("/")
        }
  
        if (roleData.role === "student") {
          navigate("/student-home");
        } 

        if (roleData.role === "student") {
          navigate("/student-home");
        } 
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/submission/${courseId}/${homeworkId}/submissions/`,
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
          throw new Error("Failed to fetch submissions.");
        }

        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
    handleHomeNavigation();
  }, [courseId, homeworkId]);

  const handleGradeSubmit = async (submissionId, grade) => {
    try {
      const response = await fetch(
        `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/submission/${courseId}/${homeworkId}/submission/${submissionId}/add-grade/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          credentials: "include",
          body: JSON.stringify({ grade }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit grade.");
      }

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId ? { ...s, graded: true, grade } : s
        )
      );

      setSuccessMessage("Grade submitted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen bg-gray-100">
        <CircularProgress size={50} sx={{ color: "#3f51b5" }} />
      </Box>
    );
  }

  return (
    <motion.div
      className="m-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="border flex items-center rounded-2xl p-4 mt-[3rem] w-full bg-white shadow-lg">
        <AssignmentTurnedIn sx={{ fontSize: "4rem", color: "#5b3819" }} />
        <div className="ml-4">
          <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819" }}>
            Submissions
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "Poppins, sans-serif" }}>
            Review and grade student submissions
          </Typography>
        </div>
      </motion.div>

      {successMessage && (
        <Alert severity="success" sx={{ marginY: 2, textAlign: "center" }}>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ marginY: 2, textAlign: "center" }}>
          {error}
        </Alert>
      )}

      <motion.div className="flex flex-col mt-8 space-y-5">
        {submissions.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: "center", color: "#666" }}>
            No submissions available
          </Typography>
        ) : (
          submissions.map((submission) => {
            const fileName = submission.submission_video
              ? submission.submission_video.split("/").pop()
              : "";
            const videoUrl = `${VIDEO_BASE_URL}${fileName}`;

            return (
              <motion.div
                key={submission.id}
                className="border flex flex-col p-4 rounded-2xl bg-white shadow-md"
              >
                <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", color: "#3f51b5" }}>
                  Student ID: {submission.id}
                </Typography>
                {fileName ? (
                  <video
                    style={{
                      width: "100%",
                      marginBottom: "1rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                    controls
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Typography variant="body2" sx={{ color: "#888", marginBottom: 2 }}>
                    No video submission available.
                  </Typography>
                )}

                <Typography variant="body2" sx={{ color: "#888", marginBottom: 1 }}>
                  Submitted on: {new Date(submission.submitted_at).toLocaleString()}
                </Typography>

                <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", marginBottom: 1 }}>
                  Annotation: {submission.submission_text || "No annotations"}
                </Typography>

                {submission.graded ? (
                  <Typography
                    variant="body1"
                    color="success.main"
                    sx={{ fontFamily: "Poppins, sans-serif", marginBottom: 2 }}
                  >
                    Grade: {submission.grade}
                  </Typography>
                ) : (
                  <Box>
                    <TextField
                      label="Grade"
                      variant="outlined"
                      type="number"
                      fullWidth
                      sx={{ marginBottom: 1 }}
                      onChange={(e) =>
                        setSubmissions((prev) =>
                          prev.map((s) =>
                            s.id === submission.id
                              ? { ...s, grade: parseInt(e.target.value, 10) }
                              : s
                          )
                        )
                      }
                    />
                    <motion.div>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleGradeSubmit(submission.id, submission.grade)}
                        sx={{
                          backgroundColor: "#5b3819",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#5b3819" },
                        }}
                      >
                        Submit Grade
                      </Button>
                    </motion.div>
                  </Box>
                )}
              </motion.div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
};

export default ViewSubmissions;
