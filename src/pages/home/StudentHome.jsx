import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { Typography, CssBaseline, CircularProgress, Box } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import GradeIcon from "@mui/icons-material/Grade";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import "@fontsource/poppins";

const StudentHome = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const controls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const getCourses = async () => {
      try {
        const response = await fetch(
          "https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        setCourses(data.results || data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course-student/${courseId}`);
  };

  const swipeHandler = (event, info) => {
    if (info.offset.x > 100) {
      navigate(-1); 
    } else if (info.offset.x < -100) {
      navigate(1); 
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
        <CircularProgress size={50} sx={{ color: "#3f51b5" }} />
      </Box>
    );
  }

  if (error) {
    const navigate = useNavigate();
  
    useEffect(() => {
      navigate("/login"); 
    }, [navigate]);
  
    return null; 
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
          className="p-6 flex-grow flex flex-col bg-white rounded-md items-center w-full"
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
            <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#3f51b5", ml: 2 }}>
              Welcome Back to Strike
            </Typography>
          </motion.div>

          <motion.div className="w-full mt-4">
            <Typography
              variant="h5"
              sx={{ fontFamily: "Poppins, sans-serif", color: "#3f51b5", ml: 2, my: 2 }}
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
                    className="cursor-pointer border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl"
                    style={{ color: "#3f51b5" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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

          {/* Leaderboard Section */}
          <motion.div className="flex flex-col w-full mt-6">
            <Typography variant="h5" sx={{ fontFamily: "Poppins, sans-serif", color: "#3f51b5", ml: 2 }}>
              Strike Leaderboard
            </Typography>

            <div className="flex space-x-4 mt-4">
              <motion.div
                className="cursor-pointer border flex items-center justify-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl flex-1"
                style={{ color: "#3f51b5" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GradeIcon style={{ fontSize: "3rem" }} />
                <div className="flex flex-col ml-4">
                  <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif" }}>
                    Grades
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    98
                  </Typography>
                </div>
              </motion.div>

              <motion.div
                className="cursor-pointer border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl flex-1"
                style={{ color: "#3f51b5" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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

export default StudentHome;
