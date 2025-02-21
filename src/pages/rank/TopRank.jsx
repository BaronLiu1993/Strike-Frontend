import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import Navbar from '../navbar/Navbar';
import '@fontsource/poppins'; 


function TopRank() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [view, setView] = useState('all-time');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        const response = await fetch('https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/topaveragesviewset/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch leaderboard data');
        }

        const data = await response.json();
        const sortedStudents = data.sort((a, b) => b.average_grade - a.average_grade);
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
      }}>
        <div 
        className = "font-poppins text-4xl font-bold text-[#3f51b5]"
        style={{
                fontFamily: "Poppins, sans-serif",
              }} >
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
            <Box key={student.id} sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.8rem',
              borderRadius: '12px',
              marginBottom: '0.5rem',
            }}
            className="cursor-pointer border flex items-center rounded-2xl p-4 hover:bg-gray-50 shadow-md hover:shadow-2xl"
              style={{
                  color: "#3f51b5",
                  fontFamily: "Poppins, sans-serif",}}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', width: '10%' }}>{index + 1}</Typography>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }} style={{
                  color: "#3f51b5",
                  fontFamily: "Poppins, sans-serif",}}>{student.username}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray' }} style={{
                  color: "#3f51b5",
                  fontFamily: "Poppins, sans-serif",}}>
                    {student.average_grade.toFixed(2)} points</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'gray' }}></Typography>
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
