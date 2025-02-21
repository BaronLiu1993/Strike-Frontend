import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, CircularProgress, Alert, Box } from "@mui/material";
import { motion } from "framer-motion";
import WorkIcon from "@mui/icons-material/Work";

const Homework = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const homeworkRes = await fetch(
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
  
        if (!homeworkRes.ok) {
          throw new Error("Failed to fetch homework");
        }
  
        const homeworkData = await homeworkRes.json();
        setHomeworks(homeworkData || []);
  
        const homeworkId = homeworkData.length > 0 ? homeworkData[0].id : null;
        if (!homeworkId) {
          throw new Error("No homework available");
        }
  
        const submissionRes = await fetch(
          `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/submission/${courseId}/${homeworkId}/submission/1/grade/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            credentials: "include",
          }
        );
  
        if (!submissionRes.ok) {
          throw new Error("Failed to fetch submissions");
        }
  
        const submissionData = await submissionRes.json();
        setSubmissions(submissionData || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [courseId, navigate]);

  const handleHomeworkSubmission = (homeworkId) => {
    navigate(`/submission/${courseId}/${homeworkId}`);
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
        <WorkIcon sx={{ fontSize: "4rem", color: "#3f51b5" }} />
        <div className="ml-4">
          <Typography variant="h4" sx={{ fontFamily: "Poppins, sans-serif", color: "#3f51b5" }}>
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
                <Typography variant="h6" sx={{ fontFamily: "Poppins, sans-serif", color: "#3f51b5" }}>
                  {homework.title}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", mt: 1 }}>
                  {homework.description}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "Poppins, sans-serif", color: "#888" }}>
                  Due Date: {homework.due_date}
                </Typography>
              </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {submissions.grade === null || submissions.grade === undefined ? (
                    <Typography variant="body1" color="warning.main" sx={{ fontFamily: "Poppins, sans-serif" }}>
                    Pending Grade
                    </Typography>
                ) : submissions.grade > 0 ? (
                    <Typography variant="body1" color="success.main" sx={{ fontFamily: "Poppins, sans-serif" }}>
                    Grade: {submissions.grade}
                    </Typography>
                ) : (
                    <button
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    className="bg-[#3f51b5] text-white px-4 py-2 rounded"
                    onClick={() => handleHomeworkSubmission(homework.id)}
                    >
                    Submit
                    </button>
                )}
                </motion.div>

            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default Homework;
