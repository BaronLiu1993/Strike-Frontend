import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Alert,
  Box,
  CardContent,
  Avatar,
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import CreatePost from "../create/CreatePost";
import CreateHomework from "../create/CreateHomework";
import AddStudents from "../create/AddStudents";


import { motion } from "framer-motion";
import ArticleIcon from "@mui/icons-material/Article";
import SchoolIcon from "@mui/icons-material/School";

const TeacherCourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courseDetails, setCourseDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState({
    post: false,
    homework: false,
    student: false
  });


  const componentMapping = {
    post: <CreatePost />,
    homework: <CreateHomework />, 
    students: <AddStudents courseIdentification={courseId}/>
  };

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
        
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("access_token");

        const urls = [
          `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/${courseId}/`,
          `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/posts/${courseId}/posts/`
        ];

        const responses = await Promise.all(
          urls.map((url) =>
            fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              credentials: "include",
            })
          )
        );

        if (responses.some((res) => !res.ok)) {
          throw new Error("Failed to fetch course data");
        }

        const [courseData, postsData] = await Promise.all(
          responses.map((res) => res.json())
        );

        setCourseDetails(courseData);
        setPosts(postsData || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    handleHomeNavigation()
    fetchData();
    if (error) {
      navigate("/"); 
    }
  }, [courseId, error, navigate]);

  const openCreateDialog = (type) => {
    setOpenDialog((prev) => ({ ...prev, [type]: true }));
  };

  const closeCreateDialog = (type) => {
    setOpenDialog((prev) => ({ ...prev, [type]: false }));
  };

  const handleSwipe = (event, info) => {
    if (info.offset.x > 100) navigate(-1);
    if (info.offset.x < -100) navigate(1);
  };

  const handleNavigation = (path) => navigate(path);

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5f5f5" }}
      >
        <CircularProgress size={50} sx={{ color: "#3f51b5" }} />
      </Box>
    );
  }

  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    localStorage.removeItem("access_token"); 
    navigate("/"); 
  }

  return (
    <motion.div
      className="flex flex-col items-center"
      style={{ minHeight: "100vh", paddingBottom: "64px", overflow: "hidden" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleSwipe}
    >
      <motion.div
        className="p-4 flex-grow flex flex-col bg-white rounded-md items-center w-full mt-10"
        style={{ flex: 1, overflowY: "auto", paddingBottom: "64px" }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        
        {courseDetails && (
          <motion.div
            className="py-[1rem] border flex flex-col justify-center rounded-2xl w-full"
          >
            <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819", textAlign: "center" }}>
              {courseDetails.title}
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "Poppins, sans-serif", textAlign: "center" }}>
              {courseDetails.description}
            </Typography>
          </motion.div>
        )}
        <motion.div>
          <div className = "mt-[2rem] flex flex-row space-x-5">
          <Button sx={{
                    fontFamily: "Poppins, sans-serif",
                    "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
                    "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
                    }} 
                    variant="contained" 
                    onClick={() => openCreateDialog("post")}>
            Create Post</Button>
          <Button sx={{
                fontFamily: "Poppins, sans-serif",
                "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
                "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
                }} 
              variant="contained" 
                    onClick={() => openCreateDialog("homework")}>
                  Create Homework</Button>
                  <Button sx={{
                    fontFamily: "Poppins, sans-serif",
                    "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
                    "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
                    }} 
                    variant="contained" 
                    onClick={() => openCreateDialog("students")}>
            Add Student</Button>
          {Object.keys(componentMapping).map((type) => (
            <Dialog key={type} open={openDialog[type]} onClose={() => closeCreateDialog(type)}>
              <DialogContent>
                {componentMapping[type]} 
              </DialogContent>
              <DialogActions>
                <Button onClick={() => closeCreateDialog(type)}>Close</Button>
              </DialogActions>
            </Dialog>
          ))}
        </div>
        </motion.div>

        <motion.div className="flex mt-6 w-full space-x-4">
          <motion.div
            onClick={() => handleNavigation(`/lesson/${courseId}/`)}
            className="cursor-pointer border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl flex-1"
            style={{ color: "#5b3819" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SchoolIcon style={{ fontSize: "2rem" }} />
            <Typography variant="h6" sx={{ ml: 1, fontFamily: "Poppins, sans-serif" }}>
            Match
            </Typography>
          </motion.div>
          <motion.div
            onClick={() => handleNavigation(`/homework-teacher/${courseId}/`)}
            className="cursor-pointer border flex items-center rounded-2xl p-4 shadow-md hover:shadow-lg flex-1"
            style={{ color: "#5b3819" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArticleIcon style={{ fontSize: "2rem" }} />
            <Typography variant="h6" sx={{ ml: 1, fontFamily: "Poppins, sans-serif" }}>
              Homework
            </Typography>
          </motion.div>
        </motion.div>

        <motion.div className="w-full mt-6 overflow-hidden">
          <Typography variant="h5" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819", mb: 2 }}>
            Posts
          </Typography>
          <motion.div drag="x" dragConstraints={{ left: -300, right: 300 }} className="flex flex-col space-y-5">
            {posts.length > 0 ? (
              posts.map((post) => (
                <motion.div
                  key={post.id}
                  className="border-2 rounded-2xl overflow-hidden flex flex-col p-4"
                >
                  <div className="flex items-center">
                    <Avatar sx={{ backgroundColor: "#3f51b5", marginRight: "0.5rem" }}>
                      {post.author ? post.author[0] : "U"}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
                      {post.author || "Davis Chow"}
                    </Typography>
                  </div>
                  <Typography variant="h6" sx={{ mt: 2, fontFamily: "Poppins, sans-serif" }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", mt: 1 }}>
                    {post.content}
                  </Typography>
                </motion.div>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", marginTop: "1rem" }}>
                No posts available
              </Typography>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TeacherCourseView;
