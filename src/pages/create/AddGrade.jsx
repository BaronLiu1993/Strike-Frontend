import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

const AddGrade = () => {
  const { courseId, homeworkId } = useParams(); // Extract courseId and homeworkId from the URL
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/submission/${courseId}/${homeworkId}/submissions/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
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
        `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/submission/${submissionId}/add-grade/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ grade }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit grade.");
      }

      setSuccessMessage("Grade submitted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-oswald">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Grade Submissions
        </Typography>
        {successMessage && (
          <Alert severity="success" sx={{ marginBottom: "1rem" }}>
            {successMessage}
          </Alert>
        )}
        {submissions.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No submissions found.
          </Typography>
        ) : (
          submissions.map((submission) => (
            <Box
              key={submission.id}
              sx={{
                marginBottom: "1.5rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                Student ID: {submission.student.id}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
                Submission ID: {submission.id}
              </Typography>
              <TextField
                label="Grade"
                variant="outlined"
                type="number"
                size="small"
                sx={{ marginBottom: "1rem", width: "100%" }}
                onChange={(e) =>
                  setSubmissions((prev) =>
                    prev.map((s) =>
                      s.id === submission.id
                        ? { ...s, grade: e.target.value }
                        : s
                    )
                  )
                }
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  padding: "0.5rem",
                  backgroundColor: "#000",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
                onClick={() =>
                  handleGradeSubmit(submission.id, submission.grade)
                }
              >
                Submit Grade
              </Button>
            </Box>
          ))
        )}
      </div>
    </div>
  );
};

export default AddGrade;
