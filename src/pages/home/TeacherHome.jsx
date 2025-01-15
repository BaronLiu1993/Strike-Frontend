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
  const [openCreateDialog, setOpenCreateDialog] = useState(false); // State for dialog
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [createMessage, setCreateMessage] = useState('');
  const [creating, setCreating] = useState(false); // Loading state for course creation

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/course/', {
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

  const handleCourseClick = (courseId) => {
    window.location.href = `/course-teacher/${courseId}`;
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim() || !newCourse.description.trim()) {
      setCreateMessage('Title and description are required.');
      return;
    }
    setCreating(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create course');
      }

      const createdCourse = await response.json();
      setCourses((prevCourses) => [...prevCourses, createdCourse]);
      setCreateMessage('Course created successfully!');
      setNewCourse({ title: '', description: '' });
      setOpenCreateDialog(false);
    } catch (err) {
      setCreateMessage(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
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

          {/* Courses Section */}
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

        {/* Create Course Dialog */}
        <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                multiline
                rows={4}
                fullWidth
                required
              />
              {createMessage && (
                <Typography
                  variant="body2"
                  color={createMessage.includes('successfully') ? 'green' : 'error'}
                >
                  {createMessage}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateCourse}
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Course'}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Navbar */}
        <Navbar />
      </div>
    </>
  );
};

export default TeacherHome;
