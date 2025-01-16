import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import Navbar from '../navbar/Navbar';
import StrikeLogo from '../../assets/strike.png'; // Replace with your logo path

function TopRank() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);

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
  }, []);

  return (
    <div className="font-oswald min-h-screen w-full flex flex-col items-center bg-gray-100">
      
      <div className="flex-grow flex flex-col bg-white shadow-md rounded-md items-center w-full overflow-y-auto">
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#000',
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <img
            src={StrikeLogo}
            alt="Strike Music Institute"
            style={{ width: '100px', height: 'auto' }}
          />
        </Box>
        <Typography variant="h4" gutterBottom style={{ color: '#000', textAlign: 'center' }}>
          Leaderboard
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : students.length > 0 ? (
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', color: '#000' }}>Rank</TableCell>
                  <TableCell style={{ fontWeight: 'bold', color: '#000' }}>Student</TableCell>
                  <TableCell style={{ fontWeight: 'bold', color: '#000' }}>Average Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.username}</TableCell>
                    <TableCell>{student.average_grade.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            No leaderboard data available
          </Alert>
        )}
      </div>

      <Navbar />
    </div>
  );
}

export default TopRank;
