import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "../navbar/Navbar";
import Class from "../../assets/class.jpg"

const StudentCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courseDetails, setCourseDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [homeworks, setHomeworks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const courseResponse = await fetch(
          `http://localhost:8000/api/v1/course/${courseId}/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course details");
        }

        const courseData = await courseResponse.json();
        setCourseDetails(courseData);

        const postsResponse = await fetch(
          `http://localhost:8000/api/v1/posts/${courseId}/posts/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!postsResponse.ok) {
          throw new Error("Failed to fetch posts");
        }

        const postsData = await postsResponse.json();
        setPosts(postsData);

        const lessonsResponse = await fetch(
          `http://localhost:8000/api/v1/lesson/${courseId}/lessons/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!lessonsResponse.ok) {
          throw new Error("Failed to fetch lessons");
        }

        const lessonsData = await lessonsResponse.json();
        setLessons(lessonsData);

        const homeworkResponse = await fetch(
          `http://localhost:8000/api/v1/homework/${courseId}/homeworks/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!homeworkResponse.ok) {
          throw new Error("Failed to fetch homework");
        }

        const homeworkData = await homeworkResponse.json();
        setHomeworks(homeworkData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleHomeworkSubmission = (homeworkId) => {
    navigate(`/submission/${courseId}/${homeworkId}`);
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
    <div
      className="flex flex-col items-center justify-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >      

      {/* Main Content */}
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
          flexGrow: 1,
        }}
      >
        {courseDetails && (
          <Box
            sx={{
              marginBottom: 3,
              width: "100%",
              padding: 2,
              borderRadius: 2,
              color: "white",
              backgroundImage: `url(${Class})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                marginBottom: "0.5rem",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.7)", // Add text shadow for readability
              }}
            >
              {courseDetails.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)", // Semi-transparent white text
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.7)", // Add text shadow for readability
              }}
            >
              {courseDetails.description}
            </Typography>
          </Box>
        )}


        {/* Posts Section */}
        <Box
          sx={{
            width: "100%",
            marginBottom: "1.5rem",
            overflowY: "auto",
            maxHeight: "300px",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Posts
          </Typography>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Box
                key={post.id}
                sx={{
                  padding: 2,
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  marginBottom: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {post.title}
                </Typography>
                <Typography variant="body2">{post.content}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No posts available
            </Typography>
          )}
        </Box>

        {/* Lessons Section */}
        <Accordion sx={{ width: "100%", marginBottom: "1.5rem" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" fontWeight="bold">
              Lessons
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <Box
                  key={lesson.id}
                  sx={{
                    padding: 2,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {lesson.title}
                  </Typography>
                  <Typography variant="body2">{lesson.description}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No lessons available
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Homework Section */}
        <Accordion sx={{ width: "100%", marginBottom: "1.5rem" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" fontWeight="bold">
              Homework
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {homeworks.length > 0 ? (
              homeworks.map((homework) => (
                <Box
                  key={homework.id}
                  sx={{
                    padding: 2,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {homework.title}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: "0.5rem" }}>
                    {homework.description}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#000",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                    onClick={() => handleHomeworkSubmission(homework.id)}
                  >
                    Submit Homework
                  </Button>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No homework available
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Navbar */}
      <Navbar />
    </div>
  );
};

export default StudentCourse;
