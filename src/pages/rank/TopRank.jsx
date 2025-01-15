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

        const response = await fetch('http://localhost:8000/api/v1/topaveragesviewset/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch leaderboard data');
        }

        const data = await response.json();
        // Sort students by average grade in descending order
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
    <div className="font-oswald min-h-screen flex flex-col items-center bg-gray-100">
      
      {/* Main Content */}
      <div className="flex-grow flex flex-col bg-white shadow-md rounded-md items-center w-[25rem] overflow-y-auto">
        <Box
          sx={{
            width: '25rem',
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
