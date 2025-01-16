import React, { useState } from 'react';

const AddStudents = ({ courseId }) => {
  const [studentIds, setStudentIds] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddStudents = async () => {
    if (!studentIds.trim()) {
      setMessage('Please enter at least one student ID.');
      return;
    }
    const idsArray = studentIds.split(',').map(id => parseInt(id.trim(), 10));
    if (idsArray.some(isNaN)) {
      setMessage('All student IDs must be valid numbers.');
      return;
    }

    setLoading(true);
    setMessage(''); 

    try {
      const response = await fetch(
        `https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/course/${courseId}/add-students/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
          },
          credentials: 'include', 
          body: JSON.stringify({
            student_ids: idsArray,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add students. Please try again.');
      }

      setMessage('Students added successfully.');
      setStudentIds(''); // Clear input field after success
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Add Students to Course</h2>
      {message && (
        <p
          className={`mb-4 ${
            message.includes('successfully') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Student IDs (comma-separated):
          <input
            type="text"
            value={studentIds}
            onChange={(e) => setStudentIds(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter student IDs (e.g., 1, 2, 3)"
          />
        </label>
      </div>
      <button
        onClick={handleAddStudents}
        className={`${
          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        } text-white px-4 py-2 rounded`}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Students'}
      </button>
    </div>
  );
};

export default AddStudents;
