import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

const CreateLesson = ({ isTeacher }) => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isTeacher) {
      alert("Only teachers can create lessons.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/lesson/${courseId}/add-lesson/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        credentials: 'include', 
        body: JSON.stringify({ ...formData, course: courseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create lesson');
      }

      alert('Lesson created successfully!');
      setFormData({ title: '', content: '' });
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the lesson.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          marginBottom: '20px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h5" mb={2}>
          Create Lesson for Course ID: {courseId}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            multiline
            rows={4}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button type="submit" variant="contained" color="primary" disabled={!isTeacher}>
              Submit
            </Button>
          </Box>
        </form>
      </Box>
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography variant="body1">
          Note: Only teachers can create lessons. If you are not authorized, you cannot submit this form.
        </Typography>
      </Box>
    </Box>
  );
};

export default CreateLesson;
