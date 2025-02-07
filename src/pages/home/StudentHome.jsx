import React, { useState, useEffect } from 'react';
import Violin from '../../assets/violin.jpg';
import Navbar from '../navbar/Navbar';
import Strike from '../../assets/strike.png';
import { Typography, CssBaseline, CircularProgress, Box } from '@mui/material';
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
        className="font-poppins flex flex-col items-center bg-gray-300"
        style={{ minHeight: "100vh", paddingBottom: "64px" }} // Reserve space for Navbar
      >
        <div
          className="p-6 flex-grow flex flex-col bg-white shadow-md rounded-md items-center w-full"
          style={{
            flex: 1, 
            overflowY: "auto", 
            paddingBottom: "64px", 
          }}
        >
          <div className="bg-slate-200 h-[4rem] w-full flex justify-center items-center px-4 rounded-t-md">
            
            <Typography
              variant="h6"
              component="h1"
              style={{
                marginLeft: "1rem",
                color: "brown",
                fontFamily: "Poppins, sans-serif",
                font: "bold"
              }}
            >
              Hello,
            </Typography>
            <Typography
              variant="h6"
              component="h1"
              style={{
                marginLeft: "1rem",
                color: "black",
                fontFamily: "Poppins, sans-serif",
              }}
            >
                Welcome back to Strike!
            </Typography>
          </div>
  
          {/* Courses Section */}
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
                    className="cursor-pointer border p-4 rounded hover:bg-gray-50"
                    style={{
                      backgroundImage: `url(${Violin})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      color: "#fff",
                    }}
                  >
                    <Typography
                      variant="h6"
                      className="font-semibold p-2 rounded"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="p-2 rounded"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {course.description}
                    </Typography>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
  
        {/* Navbar */}
        <Navbar />
      </div>
    </>
  );
};

export default StudentHome;
