import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

const CreateHomework = ({ isTeacher }) => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isTeacher) {
      alert("Only teachers can create homework.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/homework/${courseId}/add-homework/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          due_date: formData.dueDate, 
          course: courseId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create homework');
      }

      alert('Homework created successfully!');
      setFormData({ title: '', description: '', dueDate: '' });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating homework. Please try again.');
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
          Create Homework for Course ID: {courseId}
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
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isTeacher || !formData.title || !formData.description || !formData.dueDate}
            >
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
          <strong>Note:</strong> Only teachers are allowed to create homework. If you are not authorized, this form will not be submitted.
        </Typography>
      </Box>
    </Box>
  );
};

export default CreateHomework;
