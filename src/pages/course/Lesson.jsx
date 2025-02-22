import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress, Alert, Box } from "@mui/material";
import { motion } from "framer-motion";
import LightbulbIcon from "@mui/icons-material/Lightbulb";

const Lesson = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
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
        if (!response.ok) throw new Error("Failed to fetch lessons");
        const data = await response.json();
        setLessons(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
    if (error) {
        navigate("/"); 
      }
  }, [courseId, error, navigate]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen bg-gray-100">
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
    <motion.div
      className="m-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="border flex items-center rounded-2xl p-4 w-full mt-10"
      >
        <LightbulbIcon sx={{ fontSize: "4rem", color: "#5b3819" }} />
        <div className="ml-4">
          <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819" }}>
            Lessons
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "Poppins, sans-serif" }}>
            Strike Modules to Reinforce Your Learning
          </Typography>
        </div>
      </motion.div>

      <motion.div className="flex flex-col mt-8 space-y-5">
        {lessons.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: "center", color: "#666" }}>
            No lessons available
          </Typography>
        ) : (
          lessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              className="border flex flex-col p-4 rounded-2xl"
             
            >
              <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819" }}>
                {lesson.title}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", mt: 1 }}>
                Instructions: {lesson.content}
              </Typography>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default Lesson;
