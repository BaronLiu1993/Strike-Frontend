import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, CircularProgress, Alert, Box } from "@mui/material";
import { motion } from "framer-motion";
import WorkIcon from "@mui/icons-material/Work";

const TeacherHomework = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    
        if (roleData.role === "student") {
          navigate("/student-home");
        } 
      } catch (err) {
        setError(err.message);
      }
    };
    const fetchHomework = async () => {
      try {
        const response = await fetch(
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

        if (!response.ok) throw new Error("Failed to fetch homework");

        const data = await response.json();
        setHomeworks(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    handleHomeNavigation()
    fetchHomework();
    if (error) {
        navigate("/"); 
    }
  }, [courseId, error, navigate]);

  const handleHomeworkSubmission = (homeworkId) => {
    navigate(`/submissionview/${courseId}/${homeworkId}`);
  };



  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen bg-gray-100">
        <CircularProgress size={50} sx={{ color: "#3f51b5" }} />
      </Box>
    );
  }

  

  return (
    <motion.div
      className="m-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="border flex items-center rounded-2xl p-4 mt-[3rem] w-full "
      >
        <WorkIcon sx={{ fontSize: "4rem", color: "#5b3819" }} />
        <div className="ml-4">
          <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819" }}>
            Homework
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "Poppins, sans-serif" }}>
            Strike Learning Assessments
          </Typography>
        </div>
      </motion.div>

      <motion.div className="flex flex-col mt-8 space-y-5">
        {homeworks.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: "center", color: "#666" }}>
            No Homework available
          </Typography>
        ) : (
          homeworks.map((homework) => (
            <motion.div
              key={homework.id}
              className="border flex justify-between items-center p-4 rounded-2xl"
            >
              <div className="flex flex-col">
                <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819" }}>
                  {homework.title}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif"}}>
                  {homework.description}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "#888" }}>
                  Due Date: {homework.due_date}
                </Typography>
              </div>
            
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button style = {{fontFamily: "Poppins, sans-serif"}} className="bg-[#5b3819] text-white px-4 py-2 rounded" onClick={() => handleHomeworkSubmission(homework.id)}>
                    Grade
                </button>
                </motion.div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default TeacherHomework;
