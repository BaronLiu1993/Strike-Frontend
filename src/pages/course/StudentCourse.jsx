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
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "../navbar/Navbar";
import Class from "../../assets/class.jpg";

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
          `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/${courseId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            credentials: "include",
          }
        );

        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course details");
        }

        const courseData = await courseResponse.json();
        setCourseDetails(courseData);

        const postsResponse = await fetch(
          `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/posts/${courseId}/posts/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            credentials: "include",
          }
        );

        if (!postsResponse.ok) {
          throw new Error("Failed to fetch posts");
        }

        const postsData = await postsResponse.json();
        setPosts(postsData || []);

        const lessonsResponse = await fetch(
          `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/lesson/${courseId}/lessons/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            credentials: "include",
          }
        );

        if (!lessonsResponse.ok) {
          throw new Error("Failed to fetch lessons");
        }

        const lessonsData = await lessonsResponse.json();
        setLessons(lessonsData || []);

        const homeworkResponse = await fetch(
          `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/homework/${courseId}/homeworks/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            credentials: "include",
          }
        );

        if (!homeworkResponse.ok) {
          throw new Error("Failed to fetch homework");
        }

        const homeworkData = await homeworkResponse.json();

        const updatedHomeworks = await Promise.all(
          (homeworkData || []).map(async (homework) => {
            if (homework.graded && homework.submission_id) {
              try {
                const gradeResponse = await fetch(
                  `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/submission/${courseId}/${homework.id}/students/${homework.student_id}/submission/${homework.submission_id}/grade/`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    credentials: "include",
                  }
                );

                if (gradeResponse.ok) {
                  const gradeData = await gradeResponse.json();
                  return { ...homework, grade: gradeData.grade };
                }
              } catch (error) {
                console.error("Failed to fetch grade", error);
              }
            }
            return homework;
          })
        );

        setHomeworks(updatedHomeworks || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleHomeworkSubmission = (homeworkId) => {
    navigate(`/submissionview/${courseId}/${homeworkId}`);
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
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
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
              }}
            >
              {courseDetails.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.7)",
              }}
            >
              {courseDetails.description}
            </Typography>
          </Box>
        )}

        <Accordion sx={{ width: "100%", marginBottom: "1.5rem" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" fontWeight="bold">
              Lessons
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {lessons && lessons.length > 0 ? (
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
                  <Typography variant="body2">{lesson.content}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No lessons available
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>  
  <Accordion sx={{ width: "100%", marginBottom: "1.5rem" }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="h5" fontWeight="bold">
        Homework
      </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {homeworks && homeworks.length > 0 ? (
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
                  onClick={() => handleHomeworkSubmission(homework.id)} // Redirect to grade submissions
                >
                  Grade Homework
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
    <Box
      sx={{
        width: "100%",
        marginTop: "2rem",
        padding: "1rem",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        maxHeight: "500px", 
        overflowY: "auto", 
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ marginBottom: "1rem", textAlign: "center" }}
      >
        Posts Feed
      </Typography>

      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <Card
            key={post.id}
            sx={{
              marginBottom: 2,
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                borderBottom: "1px solid #eee",
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: "#3f51b5",
                  marginRight: "0.5rem",
                  textTransform: "uppercase",
                }}
              >
                {post.author ? post.author[0] : "?"}
              </Avatar>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", lineHeight: 1.2 }}
                >
                  {"Davis Chow"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "gray", lineHeight: 1.2 }}
                >
                  {new Date(post.created_at).toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <CardContent>
              <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}>
                {post.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {post.content}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ textAlign: "center", marginTop: "1rem" }}
        >
          No posts available
        </Typography>
      )}
    </Box>
      <Navbar />
      </Box>
    </div>
  );
};

export default StudentCourse;
