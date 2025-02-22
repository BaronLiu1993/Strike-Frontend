import React, { useState, useEffect, useCallback } from "react";
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
  const [points, setPoints] = useState(0);
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
        fetch("https://strikeapp-fb52132f9a0c.herokuapp.com/register/student/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }),
      ]);

      if (!coursesRes.ok || !studentRes.ok) throw new Error("Failed to fetch data");
      const coursesData = await coursesRes.json();
      const studentData = await studentRes.json();
      setCourses(coursesData.results || coursesData || []);
      setPoints(studentData.details?.points || 0); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    if (error) {
      navigate("/");
    }
  }, [error, navigate]);

  const handleCourseClick = (courseId) => {
    navigate(`/course-student/${courseId}`);
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
            className="h-[4rem] w-full flex items-center rounded-t-md mt-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819", ml: 2}}>
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
                    className="cursor-pointer border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl"
                    style={{ color: "#5b3819" }}
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
          <motion.div className="flex flex-col w-full mt-6">
            <Typography variant="h5" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819", ml: 2 }}>
              Strike Leaderboard
            </Typography>

            <div className="flex space-x-4 mt-5">
              <motion.div
                className="border flex items-center rounded-2xl p-4 flex-1"
                style={{ color: "#5b3819" }}
                whileTap={{ scale: 0.95 }}
              >
                <GradeIcon style={{ fontSize: "3rem" }} />
                <div className="flex flex-col ml-4">
                  <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif" }}>
                    Points
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {points}
                  </Typography>
                </div>
              </motion.div>
              

              <motion.div
                className="cursor-pointer border flex items-center rounded-2xl p-4 flex-1"
                style={{ color: "#5b3819" }}
                onClick={() => handleLeaderboardClick()}
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
