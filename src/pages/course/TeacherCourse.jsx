import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Navbar from "../navbar/Navbar";
import CreatePost from "../create/CreatePost";
import CreateLesson from "../create/CreateLesson";
import CreateHomework from "../create/CreateHomework";
import AddStudents from "../create/AddStudents";
import Class from "../../assets/class.jpg";

const TeacherCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courseDetails, setCourseDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [openDialog, setOpenDialog] = useState({
    post: false,
    lesson: false,
    homework: false,
    students: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const courseResponse = await fetch(
        `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/${courseId}/`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json",
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
          headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
           },
          credentials: "include",
        }
      );

      if (!postsResponse.ok) {
        throw new Error("Failed to fetch posts");
      }

      const postsData = await postsResponse.json();
      setPosts(postsData);

      const lessonsResponse = await fetch(
        `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/lesson/${courseId}/lessons/`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
           },
          credentials: "include",
        }
      );

      if (!lessonsResponse.ok) {
        throw new Error("Failed to fetch lessons");
      }

      const lessonsData = await lessonsResponse.json();
      setLessons(lessonsData);

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
      setHomeworks(homeworkData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const openCreateDialog = (type) => {
    setOpenDialog({ ...openDialog, [type]: true });
  };

  const closeCreateDialog = (type) => {
    setOpenDialog({ ...openDialog, [type]: false });
  };

  const handleExtraButtonClick = () => {
    navigate(`/course-teacher-view/${courseId}`);
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
            minHeight: "100%",
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
          width: "100%", // Full width
          flex: 1, // Dynamically adjusts height to fill the parent
          backgroundColor: "white",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          padding: "2rem",
          overflow: "auto", // Allows scrolling for overflowing content
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
    
        {/* Create Buttons */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            justifyContent: "center",
            marginBottom: 3,
          }}
        >
          <Button variant="contained" onClick={() => openCreateDialog("post")}>
            Create Post
          </Button>
          <Button variant="contained" onClick={() => openCreateDialog("lesson")}>
            Create Lesson
          </Button>
          <Button variant="contained" onClick={() => openCreateDialog("homework")}>
            Create Homework
          </Button>
          <Button variant="contained" onClick={() => openCreateDialog("students")}>
            Add Students
          </Button>
          <Button variant="contained" onClick={handleExtraButtonClick}>
            View Class
          </Button>
        </Box>
    
        {/* Dialogs */}
        <Dialog open={openDialog.post} onClose={() => closeCreateDialog("post")}>
          <DialogTitle>Create Post</DialogTitle>
          <DialogContent>
            <CreatePost isTeacher={true} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeCreateDialog("post")}>Close</Button>
          </DialogActions>
        </Dialog>
    
        <Dialog open={openDialog.lesson} onClose={() => closeCreateDialog("lesson")}>
          <DialogTitle>Create Lesson</DialogTitle>
          <DialogContent>
            <CreateLesson isTeacher={true} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeCreateDialog("lesson")}>Close</Button>
          </DialogActions>
        </Dialog>
    
        <Dialog
          open={openDialog.homework}
          onClose={() => closeCreateDialog("homework")}
        >
          <DialogTitle>Create Homework</DialogTitle>
          <DialogContent>
            <CreateHomework isTeacher={true} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeCreateDialog("homework")}>Close</Button>
          </DialogActions>
        </Dialog>
    
        <Dialog
          open={openDialog.students}
          onClose={() => closeCreateDialog("students")}
        >
          <DialogTitle>Add Students</DialogTitle>
          <DialogContent>
            <AddStudents courseId={courseId} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeCreateDialog("students")}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    
      <Navbar />
    </div>
    

  );
};

export default TeacherCourse;
