import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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
  DialogActions,
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
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const getCourses = async () => {
      console.log("Starting fetch for courses...");
      try {
        const response = await fetch('https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Add token here
          },
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        console.log("Fetched courses data:", data);
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err.message);
        setError(err.message);
      } finally {
        console.log("Fetch complete, setting loading to false.");
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course-teacher/${courseId}`); // Navigate to the course details page
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description) {
      setCreateMessage('Please fill in all fields');
      return;
    }
    setCreating(true);
    setCreateMessage('');
    try {
      console.log("Creating a new course with data:", newCourse);
      const response = await fetch('https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
        },
        body: JSON.stringify(newCourse),
      });

      console.log("Response status for create course:", response.status);
      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const createdCourse = await response.json();
      console.log("Created course data:", createdCourse);
      setCourses((prevCourses) => [...prevCourses, createdCourse]);
      setOpenCreateDialog(false);
      setNewCourse({ title: '', description: '' });
      setCreateMessage('Course created successfully!');
    } catch (err) {
      console.error("Error creating course:", err.message);
      setCreateMessage('Failed to create course');
    } finally {
      setCreating(false);
    }
  };

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
    <div
      className="font-poppins flex flex-col items-center bg-gray-100"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div
        className="p-6 flex-grow flex flex-col bg-white shadow-md rounded-md items-center w-full"
        style={{
          flex: 1, 
          width: "100%",
          overflowY: "auto", 
          paddingBottom: "64px", 
        }}
      >
        <div className="bg-slate-300 h-[4rem] w-full flex items-center px-4 rounded-t-md">
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
                        Strike, 
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
                        Beta Release
                      </Typography>
        </div>

        <div className="w-full mt-4">
          <Box
            sx={{
              marginBottom: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
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
                  className="cursor-pointer bg-slate-300 border p-4 rounded hover:bg-gray-50"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <Typography
                    variant="h6"
                    className="font-semibold p-2 rounded"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="p-2 rounded"
                    style={{ fontFamily: "Poppins, sans-serif" }}
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

    {/* Dialog for Create Course */}
    <Dialog
      open={openCreateDialog}
      onClose={() => setOpenCreateDialog(false)}
      maxWidth="xs"
    >
      <DialogTitle>Create a New Course</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Course Title"
          variant="outlined"
          value={newCourse.title}
          onChange={(e) =>
            setNewCourse({ ...newCourse, title: e.target.value })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Course Description"
          variant="outlined"
          multiline
          rows={4}
          value={newCourse.description}
          onChange={(e) =>
            setNewCourse({ ...newCourse, description: e.target.value })
          }
        />
        {createMessage && (
          <Typography
            variant="body2"
            color={createMessage.includes("successfully") ? "green" : "error"}
          >
            {createMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenCreateDialog(false)} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleCreateCourse}
          color="primary"
          disabled={creating}
        >
          {creating ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  </>

  );
};

export default TeacherHome;
