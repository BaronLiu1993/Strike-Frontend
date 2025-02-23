import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import '@fontsource/poppins';

function TopRank() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/toppointsviewset/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch leaderboard data');
        }

        const data = await response.json();
        const sortedStudents = data.sort((a, b) => b.points - a.points);
        setStudents(sortedStudents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    if (error) {
      navigate("/");
    }
  }, [error, navigate]);

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: '64px',
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '1rem',
        position: 'relative',
        marginTop: 10
      }}>
        <div 
          className="font-poppins text-4xl font-bold text-[#5b3819]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Leaderboard
        </div>
      </Box>
      <Box sx={{
        backgroundColor: 'white',
        width: '90%',
        maxWidth: '400px',
        borderRadius: '16px',
        padding: '1rem',
      }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : students.length > 0 ? (
          students.map((student, index) => (
            <Box key={student.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.8rem',
                borderRadius: '12px',
                marginBottom: '0.5rem',
              }}
              className="border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl"
              style={{
                color: "#5b3819",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: '0.5rem' }}>
                  {index + 1}.
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {student.username}
                </Typography>
              </Box>
              <Typography>
                {student.points} Tokens
              </Typography>
            </Box>
          ))
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>No leaderboard data available</Alert>
        )}
      </Box>
    </Box>
  );
}

export default TopRank;
