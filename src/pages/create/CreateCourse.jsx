import React, { useState } from 'react';

const CreateCourse = () => {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setMessage('Title and description are required.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({
          title,
          description,
          students: [], 
        }),
      });

      if (!response.ok) {
        // Attempt to extract error message from API response
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create course work');
      }

      const data = await response.json();
      setMessage(`Course work created successfully: ${data.title}`);
      setTitle(''); // Reset the title
      setDescription(''); // Reset the description
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false); // Set loading back to false
    }
  };

  return (
    <div className="mt-10 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Create Course Work</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter course title"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            rows="4"
            placeholder="Enter course description"
          />
        </label>
      </div>
      <button
        onClick={handleSubmit}
        className={`${
          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        } text-white px-4 py-2 rounded`}
        disabled={loading} // Disable button while loading
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {message && <p className={`mt-4 ${loading ? 'text-gray-500' : 'text-green-500'}`}>{message}</p>}
    </div>
  );
};

export default CreateCourse;
