import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { Typography, CssBaseline, CircularProgress, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import GradeIcon from "@mui/icons-material/Grade";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import "@fontsource/poppins";

const TeacherHome = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const controls = useAnimation();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("access_token");

    try {
      const [coursesRes, studentRes] = await Promise.all([
        fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }),
      ]);

      if (!coursesRes.ok) throw new Error("Failed to fetch data");
      const coursesData = await coursesRes.json();
      setCourses(coursesData.results || coursesData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  

  const handleCourseClick = (courseId) => {
    navigate(`/course-teacher-view/${courseId}`);
  };

  const handleLeaderboardClick = () => {
    navigate("/leaderboard");
  };

  const swipeHandler = (event, info) => {
    if (info.offset.x > 100) {
      navigate(-1); 
    } else if (info.offset.x < -100) {
      navigate(1); 
    }
  };

  const openCreateDialog = () => {
    setOpenDialog(true);
  };

  const closeCreateDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateCourse = async () => {
      if (!newCourse.title || !newCourse.description) {
          setCreateMessage('Please fill in all fields');
          return;
      }
      setCreating(true);
      setCreateMessage('');

      try {
          console.log("Creating a new course with data:", newCourse);
          const response = await fetch('https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
              },
              body: JSON.stringify(newCourse),
          });

          console.log("Response status for create course:", response.status);
          if (!response.ok) {
              throw new Error('Failed to create course');
          }

          const createdCourse = await response.json();
          console.log("Created course data:", createdCourse);
          setCourses((prevCourses) => [...prevCourses, createdCourse]);
          setOpenCreateDialog(false);
          setNewCourse({ title: '', description: '' });
          setCreateMessage('Course created successfully!');
      } catch (err) {
          console.error("Error creating course:", err.message);
          setCreateMessage('Failed to create course');
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

  return (
    <>
      <CssBaseline />
      <motion.div
        className="font-poppins flex flex-col items-center"
        style={{ minHeight: "100vh", paddingBottom: "64px", overflow: "hidden" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={swipeHandler}
      >
        <motion.div
          className="p-6 flex-grow flex flex-col bg-white rounded-md items-center w-full mt-10"
          style={{ flex: 1, overflowY: "auto", paddingBottom: "64px" }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="h-[4rem] w-full flex items-center rounded-t-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819", ml: 2 }}>
              Welcome Back to Strike
            </Typography>
          </motion.div>

          <motion.div className="w-full mt-4">
            <Typography
              variant="h5"
              sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819", ml: 2, my: 2 }}
            >
              Courses
            </Typography>
            {courses.length === 0 ? (
              <Typography sx = {{ml: 2}} variant="body1" color="textSecondary">
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
                    whileTap={{ scale: 0.95 }}
                  >
                    <MusicNoteIcon style={{ fontSize: "3rem" }} />
                    <div className="flex flex-col ml-4">
                      <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold" }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif" }}>
                        {course.description}
                      </Typography>
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
                className="cursor-pointer border flex items-center justify-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl flex-1"
                style={{ color: "#5b3819" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openCreateDialog(true)}
              >
                <GradeIcon style={{ fontSize: "3rem" }} />
                <div className="flex flex-col ml-4">
                  <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif" }}>
                    Create
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Courses
                  </Typography>
                </div>
                <Dialog
                    open={openDialog} 
                    onClose={() => closeCreateDialog}
                    maxWidth="xs"
                  >
                    <DialogTitle sx={{ fontFamily: "Poppins, sans-serif", font: "bold", color: "#5b3819", ml: 2 }}>Create a New Course</DialogTitle>
                    <DialogContent>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Course Title"
                        variant="outlined"
                        value={newCourse.title}
                        onChange={(e) =>
                          setNewCourse({ ...newCourse, title: e.target.value })
                        }
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
                          "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
                        }}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Course Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={newCourse.description}
                        onChange={(e) =>
                          setNewCourse({ ...newCourse, description: e.target.value })
                        }
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          "& .MuiInputBase-root": { fontFamily: "Poppins, sans-serif" }, 
                          "& .MuiInputLabel-root": { fontFamily: "Poppins, sans-serif" },
                        }}
                      />
                      {createMessage && (
                        <Typography
                          variant="body2"
                          color={createMessage.includes("successfully") ? "green" : "error"}
                        >
                          {createMessage}
                        </Typography>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          color: "#5b3819",
                          backgroundColor: "#f5f5f5",
                          width: "90%",
                          fontSize: "1rem", 
                        }}
                        onClick={() => closeCreateDialog()}
                        color="secondary"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateCourse}
                        color="primary"
                        disabled={creating}
                        sx={{
                          fontFamily: "Poppins, sans-serif",
                          color: "white",
                          backgroundColor: "#5b3819",
                          width: "90%",
                          fontSize: "1rem", 
                          "&:hover": { backgroundColor: "#5b3819" }, 
                        }}
                      >
                        {creating ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Create"}
                      </Button>
                    </DialogActions>

                  </Dialog>
              </motion.div>
              <motion.div
                className="cursor-pointer border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl flex-1"
                style={{ color: "#5b3819" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLeaderboardClick()}
              >
                <ScoreboardIcon style={{ fontSize: "3rem" }} />
                <div className="flex flex-col ml-4">
                  <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif" }}>
                    See the
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Rank
                  </Typography>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default TeacherHome;
