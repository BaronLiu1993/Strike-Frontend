import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import { Typography, CssBaseline, CircularProgress, Box } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import GradeIcon from '@mui/icons-material/Grade';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import '@fontsource/poppins'; 

const StudentHome = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]); 

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const getCourses = async () => {
      try {
        const response = await fetch('https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
           },

          credentials: 'include',
        });
    
        if (!response.ok) throw new Error('Failed to fetch courses');
    
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
    console.log(`Course clicked: ${courseId}`);
    window.location.href = `/course-student/${courseId}`;
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
        <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>
      </Box>
    );
  }
  
  return (
    <>
      <CssBaseline />
      <div
        className="font-poppins flex flex-col items-center"
        style={{ minHeight: "100vh", paddingBottom: "64px" }}
      >
        <div
          className="p-6 flex-grow flex flex-col bg-white shadow-md rounded-md items-center w-full"
          style={{
            flex: 1, 
            overflowY: "auto", 
            paddingBottom: "64px", 
          }}
        >
          <div className="h-[4rem] w-full flex items-center px-4 rounded-t-md">
            <div
              className = "text-4xl text-[#3f51b5] ml-[1rem] font-extrabold"
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Welcome
            </div>
            <div
              className = "ml-[0.5rem] text-4xl font-extrabold"
              style={{
                marginLeft: "0.5rem",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Back to Strike
            </div>
          </div>
  
          <div className="w-full mt-4">
            {courses.length === 0 ? (
              <Typography variant="body1" color="textSecondary">
                No courses found
              </Typography>
            ) : (
              <ul className="space-y-4">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className="cursor-pointer border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl h-[15rem]"
                    style={{
                      color: "#3f51b5",
                    }}
                  >
                    <MusicNoteIcon style={{ fontSize: "6rem" }} />

                    <div className="flex flex-col">
                      <div
                        className="font-semibold rounded"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {course.title}
                      </div>
                      <div
                        className="p-2 rounded"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {course.description}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        <div className = "flex flex-row w-full justify-center items-center space-x-[3rem] mt-[4rem]">
          <div
              className="cursor-pointer border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl h-[15rem]"
                style={{
                color: "#3f51b5",
                    }}
                  >
                    <GradeIcon style={{ fontSize: "6rem" }} />
                    <div className="flex flex-col ml-[2rem]">
                      <div
                        className="font-semibold rounded w-[8rem]"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                          Grades
                      </div>
                      <div
                        className = "font-bold text-6xl"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                          98
                      </div>
                    </div>
                  </div>
                  <div
              className="cursor-pointer border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl h-[15rem]"
                style={{
                color: "#3f51b5",
                    }}
                  >
                    <ScoreboardIcon style={{ fontSize: "6rem" }} />

                    <div className="flex flex-col ml-[2rem]">
                      <div
                        variant="h6"
                        className="font-semibold w-[8rem] rounded"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        Strike Points
                      </div>
                      <div
                        className = "font-bold text-6xl"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                          1000
                      </div>
                    </div>
                  </div>
          </div>
          
        </div>
        <Navbar />
      </div>
    </>
  );
};

export default StudentHome;
