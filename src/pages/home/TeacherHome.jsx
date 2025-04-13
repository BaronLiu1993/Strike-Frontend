import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Typography, CssBaseline, CircularProgress, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import GradeIcon from "@mui/icons-material/Grade";
import "@fontsource/poppins";

const TeacherHome = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("access_token");

    try {
      const coursesRes = await fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!coursesRes.ok) throw new Error("Failed to fetch data");
      const coursesData = await coursesRes.json();
      setCourses(coursesData.results || coursesData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    fetchData();
    handleHomeNavigation()
  }, [fetchData]);

  const handleCourseClick = (courseId) => {
    navigate(`/course-teacher-view/${courseId}`);
  };

  const handleLeaderboardClick = () => {
    navigate("/leaderboard");
  };

  const openCreateDialog = () => {
    setOpenDialog(true);
  };

  const closeCreateDialog = () => {
    setOpenDialog(false);
    setNewCourse({ title: "", description: "" }); 
    setCreateMessage(""); 
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      setCreateMessage("Please fill in all fields");
      return;
    }
    setCreating(true);
    setCreateMessage("");

    try {
      const response = await fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const createdCourse = await response.json();
      setCourses((prevCourses) => [...prevCourses, createdCourse]);
      closeCreateDialog(); 
      setCreateMessage("Course created successfully!");
    } catch (err) {
      console.error("Error creating course:", err.message);
      setCreateMessage("Failed to create course");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <CircularProgress size={50} sx={{ color: "#3f51b5" }} />
      </Box>
    );
  }

  if (error) {
    localStorage.removeItem("access_token"); 
    navigate("/"); 
  }

  return (
    <>
      <CssBaseline />
      <motion.div
        className="font-poppins flex flex-col items-center"
        style={{ minHeight: "100vh", paddingBottom: "64px", overflow: "hidden" }}
      >
        <motion.div
          className="p-6 flex-grow flex flex-col bg-white rounded-md items-center w-full mt-10"
          style={{ flex: 1, overflowY: "auto", paddingBottom: "64px" }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="h-[4rem] w-full flex items-center rounded-t-md">
            <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819", ml: 2 }}>
              Welcome Back to Strike
            </Typography>
          </motion.div>

          <motion.div className="w-full mt-4">
            <Typography variant="h5" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819", ml: 2, my: 2 }}>
              Courses
            </Typography>
            {courses.length === 0 ? (
              <Typography sx={{ ml: 2 }} variant="body1" color="textSecondary">
                No courses found
              </Typography>
            ) : (
              <ul className="space-y-4">
                {courses.map((course) => (
                  <motion.li
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className="cursor-pointer border flex items-center rounded-2xl p-4 shadow-md hover:shadow-xl"
                    style={{ color: "#5b3819" }}
                  >
                    <MusicNoteIcon style={{ fontSize: "3rem" }} />
                    <div className="flex flex-col ml-4">
                      <Typography variant="h6">{course.title}</Typography>
                      <Typography variant="body2">{course.description}</Typography>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          <motion.div className="flex flex-col w-full mt-6">
            <Typography variant="h5" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819", ml: 2 }}>
              Strike Leaderboard
            </Typography>

            <div className="flex space-x-4 mt-4">
              <motion.div
                className="cursor-pointer border flex items-center justify-center rounded-2xl p-4 shadow-md flex-1"
                style={{ color: "#5b3819" }}
                onClick={openCreateDialog}
              >
                <GradeIcon style={{ fontSize: "3rem" }} />
                <div className="flex flex-col ml-4">
                  <Typography variant="body">Create</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>Courses</Typography>
                </div>
              </motion.div>
              <motion.div
                className="cursor-pointer border flex items-center rounded-2xl p-4 shadow-md flex-1"
                style={{ color: "#5b3819" }}
                onClick={handleLeaderboardClick}
              >
                <div className="flex flex-col ml-4">
                  <Typography variant="body2">See the</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Rank
                  </Typography>
                </div>
              </motion.div>

              <Dialog open={openDialog} onClose={closeCreateDialog} maxWidth="xs">
                <DialogTitle sx = {{fontFamily: "Poppins, sans-serif",
          "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
          "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
          marginTop:"16px"}}>Create a New Course</DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    label="Course Title"
                    variant="outlined"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    sx={{ mt: 2, fontFamily: "Poppins, sans-serif",
                      "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
                      "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
                    }}
                    
                  />
                  <TextField
                    fullWidth
                    label="Course Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    sx={{ mt: 2, fontFamily: "Poppins, sans-serif",
                      "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
                      "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
                      marginTop:"16px"
                    }}
                  />
                  {createMessage && (
                    <Typography color={createMessage.includes("successfully") ? "green" : "error"} sx={{ mt: 2 }}>
                      {createMessage}
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button variant = "contaiend" sc ={{fontFamily: "Poppins, sans-serif",
          "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
          "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
          }} onClick={closeCreateDialog} color="secondary">
                    Cancel
                  </Button>
                  <Button sx = {{fontFamily: "Poppins, sans-serif",
          "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
          "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
        }}variant = "contained" onClick={handleCreateCourse} color="primary" disabled={creating}>
                    {creating ? <CircularProgress size={24} /> : "Create"}
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default TeacherHome;