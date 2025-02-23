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
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [grades, setGrades] = useState({});
  const [gradedStatus, setGradedStatus] = useState({});
  const [gradesLoading, setGradesLoading] = useState(false);

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const studentRes = await fetch(
          "https://strikeapp-fb52132f9a0c.herokuapp.com/register/student/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            credentials: "include",
          }
        );
        if (studentRes.status === 401 || studentRes.status === 403) {
          localStorage.removeItem("access_token");
          navigate("/");
          return;
        }
        if (!studentRes.ok) {
          throw new Error("Failed to fetch student ID");
        }
        const studentData = await studentRes.json();
        setStudentId(studentData.student_id);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching homework data...");
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
        console.log("Homework response status:", homeworkRes.status);
        if (homeworkRes.status === 401 || homeworkRes.status === 403) {
          console.log("Unauthorized access, redirecting to home...");
          localStorage.removeItem("access_token");
          navigate("/");
          return;
        }
        if (!homeworkRes.ok) {
          throw new Error("Failed to fetch homework");
        }
        const homeworkData = await homeworkRes.json();
        setHomeworks(homeworkData || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentId();
    fetchData();
  }, [courseId, navigate]);

  useEffect(() => {
    if (!studentId || homeworks.length === 0) return;

    const fetchGrades = async () => {
      setGradesLoading(true);
      try {
        const gradePromises = homeworks.map((homework) =>
          fetch(
            `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/submission/${courseId}/${homework.id}/student/${studentId}/grade/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              credentials: "include",
            }
          )
            .then((res) => {
              if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("access_token");
                navigate("/");
                return null;
              }
              if (!res.ok) {
                throw new Error("Failed to fetch grade");
              }
              return res.json();
            })
            .then((data) => {
              if (!data)
                return { homeworkId: homework.id, grade: "Pending", graded: false };
              return { homeworkId: homework.id, grade: data.grade || 0, graded: data.graded };
            })
            .catch((error) => {
              console.error(`Error fetching grade for homework ${homework.id}:`, error);
              return { homeworkId: homework.id, grade: "Pending", graded: false };
            })
        );

        const gradeResults = await Promise.all(gradePromises);
        const gradesData = {};
        const gradedStatusData = {};
        gradeResults.forEach(({ homeworkId, grade, graded }) => {
          gradesData[homeworkId] = grade;
          gradedStatusData[homeworkId] = graded;
        });
        setGrades(gradesData);
        setGradedStatus(gradedStatusData);
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setGradesLoading(false);
      }
    };

    fetchGrades();
  }, [studentId, homeworks, courseId, navigate]);

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

  if (error) {
    localStorage.removeItem("access_token"); 
    navigate("/"); 
  }
  return (
    <motion.div
      className="m-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="border flex items-center rounded-2xl p-4 mt-[3rem] w-full">
        <WorkIcon sx={{ fontSize: "4rem", color: "#5b3819" }} />
        <div className="ml-4">
          <Typography
            variant="h4"
            sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819" }}
          >
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
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "Poppins, sans-serif", color: "#5b3819" }}
                >
                  {homework.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "Poppins, sans-serif", mt: 1 }}
                >
                  {homework.description}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "Poppins, sans-serif", color: "#888" }}
                >
                  Due Date: {homework.due_date}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "Poppins, sans-serif", color: "#4CAF50" }}
                >
                  {gradesLoading ? (
                    <CircularProgress size={20} sx={{ color: "#4CAF50" }} />
                  ) : gradedStatus[homework.id] === false ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        className="bg-[#5b3819] text-white px-4 py-2 mt-2 rounded"
                        onClick={() => handleHomeworkSubmission(homework.id)}
                      >
                        Submit
                      </button>
                    </motion.div>
                  ) : grades[homework.id] === 0 || grades[homework.id] === "Pending" ? (
                    "Pending"
                  ) : (
                    `Grade: ${grades[homework.id]}`
                  )}
                </Typography>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default Homework;
