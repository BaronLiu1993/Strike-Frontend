import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";

const Submissions = ({ homeworkId, onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:8000/api/v1/homework/${homeworkId}/submissions/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
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
  }, [homeworkId]);

  const handleGradeSubmit = async (submissionId, grade, comment) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/submissions/${submissionId}/grade/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
          },
          body: JSON.stringify({ grade, comment }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit grade");
      }

      alert("Grade submitted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Submissions for Homework {homeworkId}
      </Typography>
      {submissions.length > 0 ? (
        submissions.map((submission) => (
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
            <Typography variant="h6">{submission.student_name}</Typography>
            <video
              src={submission.video_url}
              controls
              style={{ width: "100%", marginBottom: "1rem" }}
            />
            <Typography variant="body2" gutterBottom>
              Submitted on: {new Date(submission.submitted_at).toLocaleString()}
            </Typography>
            <TextField
              label="Grade"
              variant="outlined"
              fullWidth
              sx={{ marginBottom: 1 }}
              onChange={(e) => (submission.grade = e.target.value)}
            />
            <TextField
              label="Comment"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              sx={{ marginBottom: 1 }}
              onChange={(e) => (submission.comment = e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() =>
                handleGradeSubmit(submission.id, submission.grade, submission.comment)
              }
            >
              Submit Grade
            </Button>
          </Box>
        ))
      ) : (
        <Typography>No submissions available.</Typography>
      )}
      <Button variant="contained" onClick={onClose}>
        Close
      </Button>
    </Box>
  );
};

export default Submissions;
