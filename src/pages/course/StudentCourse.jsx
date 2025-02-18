import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Alert,
  Box,
  CardContent,
  Avatar,
} from "@mui/material";
import Navbar from "../navbar/Navbar";
import ArticleIcon from '@mui/icons-material/Article';
import SchoolIcon from '@mui/icons-material/School';

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
      className="flex flex-col items-center "
    >

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "2rem",
          flexGrow: 1,
        }}
      >
        {courseDetails && (
          <div
            className="cursor-pointer border flex flex-col justify-center rounded-2xl p-4 hover:bg-gray-50 w-full shadow-md hover:shadow-2xl h-[15rem]"
            
          >
            <h1
              className="font-semibold text-4xl rounded"
              style={{
                fontFamily: "Poppins, sans-serif",
                color: "#3f51b5",
                
              }}
              
            >
              {courseDetails.title}
            </h1>
            <h2
              className="font-semibold rounded"
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {courseDetails.description}
            </h2>
          </div>
        )}

  <div className = "flex mt-[5rem] ">
    <div className = "flex flex-col mb-[2rem] space-y-5">
              <div
                className="cursor-pointer border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl h-[4rem]"
                  style={{
                  color: "#3f51b5",
                      }}
                    >
                      <SchoolIcon style={{ fontSize: "2rem" }} />
                      <div className="flex flex-col m-2">
                        <div
                          className="font-semibold rounded w-[5rem]"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                            Lessons
                        </div>
                      </div>
                    </div>
                    <div
                className="cursor-pointer border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl h-[4rem]"
                  style={{
                  color: "#3f51b5",
                      }}
                    >
                      <ArticleIcon style={{ fontSize: "2rem" }} />
                      <div className="flex flex-col m-2">
                        <div
                          className="font-semibold rounded w-[5rem]"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                            Homework
                        </div>
                      </div>
                    </div>
        </div>
    <div className = "w-[20rem] ml-[2rem]">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className = "w-full border-2 rounded-2xl overflow-hidden flex flex-col"
          >
            <div
            className = "p-[1rem] border-b-[2px] border-[#eee] flex items-center"
              
            >
              <Avatar
                sx={{
                  backgroundColor: "#3f51b5",
                  marginRight: "0.5rem",
                  textTransform: "uppercase",
                }}
              >
                {post.author ? post.author[0] : "DC"}
              </Avatar>
              <Box>
                <h1
                  className = "font-bold text-xl m-2"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#3f51b5",
                  }}
                >
                  {"Davis Chow"}
                </h1>
                <h2
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "#3f51b5",
                }}
                  className = "ml-2"
                >
                  {new Date(post.created_at).toLocaleString()}
                </h2>
              </Box>
            </div>

            <CardContent>
              <h2 
              className = "font-bold text-xl m-2"
              style={{
                fontFamily: "Poppins, sans-serif",                
              }} >
                {post.title}
              </h2>
              <h2 
              className = "ml-2"
              style={{
                fontFamily: "Poppins, sans-serif",
              }}>
                {post.content}
              </h2>
            </CardContent>
          </div>
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
    </div>
  </div>
      
      <Navbar />
      </Box>
    </div>
  );
};

export default StudentCourse;
