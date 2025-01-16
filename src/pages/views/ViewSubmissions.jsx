import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import Navbar from '../navbar/Navbar'

const ViewSubmissions = ({ onClose }) => {
  const { courseId, homeworkId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const VIDEO_BASE_URL = "https://d1zh5iubdcvnfh.cloudfront.net/submissions/";

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/submission/${courseId}/${homeworkId}/submissions/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json",
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
          body: JSON.stringify({
            grade,
          }),
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: "1rem", width: "100%" }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full height of the screen
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          padding: "2rem",
          width: "100%", // Fixed width
          height: "100%", // Full height
          overflowY: "auto", // Allow scrolling for content
        }}
      >
        <Typography variant="h5" gutterBottom>
          Submissions for Homework {homeworkId}
        </Typography>
        {successMessage && (
          <Alert severity="success" sx={{ marginBottom: "1rem" }}>
            {successMessage}
          </Alert>
        )}
        <Box>
          {submissions.length > 0 ? (
            submissions.map((submission) => {
              const fileName = submission.submission_video
                ? submission.submission_video.split("/").pop()
                : "";

              const videoUrl = `${VIDEO_BASE_URL}${fileName}`;

              return (
                <Box
                  key={submission.id}
                  sx={{
                    padding: 2,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    marginBottom: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Student: {submission.student}
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
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      No video submission available.
                    </Typography>
                  )}
                  <Typography variant="body2" gutterBottom>
                    Submitted on:{" "}
                    {new Date(submission.submitted_at).toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ marginBottom: 1 }}
                    color="textSecondary"
                  >
                    Annotation: {submission.submission_text || "No annotations"}
                  </Typography>

                  {submission.graded ? (
                    <Typography
                      variant="body1"
                      color="success.main"
                      sx={{ marginBottom: 2 }}
                    >
                      Grade: {submission.grade}
                    </Typography>
                  ) : (
                    <>
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
                                ? {
                                    ...s,
                                    grade: parseInt(e.target.value, 10),
                                  }
                                : s
                            )
                          )
                        }
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() =>
                          handleGradeSubmit(submission.id, submission.grade)
                        }
                        sx={{
                          backgroundColor: "#000",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#333" },
                        }}
                      >
                        Submit Grade
                      </Button>
                    </>
                  )}
                </Box>
              );
            })
          ) : (
            <Typography>No submissions available.</Typography>
          )}
        </Box>
      </Box>
      <Navbar />
    </Box>
  );
};

export default ViewSubmissions;
