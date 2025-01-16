import React, { useState, useEffect } from 'react';
import Violin from '../../assets/violin.jpg';
import Navbar from '../navbar/Navbar';
import Strike from '../../assets/strike.png';
import {
  Typography,
  CssBaseline,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import '@fontsource/poppins';

const TeacherHome = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false); 
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [createMessage, setCreateMessage] = useState('');
  const [creating, setCreating] = useState(false); 

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch('https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
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

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress size={50} sx={{ color: '#3f51b5' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <CssBaseline />
      <div className="font-poppins min-h-screen flex flex-col items-center bg-gray-100">
        <div className="p-6 flex-grow flex flex-col bg-white shadow-md rounded-md items-center w-[25rem] max-w-4xl">
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

          <div className="w-full mt-4">
            <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5">Your Courses</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenCreateDialog(true)}
              >
                Create Course
              </Button>
            </Box>
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
                      className="font-semibold p-2 rounded bg-black bg-opacity-60"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="p-2 rounded bg-black bg-opacity-50"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      {course.description}
                    </Typography>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <Navbar />
      </div>
    </>
  );
};

export default TeacherHome;
