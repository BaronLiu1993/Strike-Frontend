import React, { useState, useEffect } from 'react';
import Violin from '../../assets/violin.jpg';
import Navbar from '../navbar/Navbar';
import Strike from '../../assets/strike.png';
import { Typography, CssBaseline } from '@mui/material'; // Material-UI components for consistent design
import '@fontsource/poppins'; // Import Poppins font

const StudentHome = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]); // State to store fetched courses

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/course/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
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
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <CssBaseline />
      <div className="font-poppins min-h-screen flex flex-col items-center bg-gray-100">
        {/* Container */}
        <div className="p-6 flex-grow flex flex-col bg-white shadow-md rounded-md items-center w-[25rem] max-w-4xl">
          {/* Top Bar */}
          <div className="bg-black h-[4rem] w-full flex items-center px-4 rounded-t-md">
            <img
              src={Strike}
              alt="Strike Music Institute Logo"
              className="h-[3rem] w-[3rem] object-contain"
            />
            <Typography
              variant="h6"
              component="h1"
              style={{
                marginLeft: '1rem',
                color: 'white',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Strike Music Institute
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
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      color: '#fff',
                    }}
                  >
                    <Typography
                      variant="h6"
                      className="font-semibold p-2 rounded"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="p-2 rounded"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
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
