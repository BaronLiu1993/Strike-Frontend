import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import { useParams } from 'react-router-dom';

function Homework() {
  const { homeworkId } = useParams(); // Assuming `homeworkId` is passed in the URL
  const [homeworkDetails, setHomeworkDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [video, setVideo] = useState(null);
  const [annotation, setAnnotation] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Fetch homework details
  useEffect(() => {
    const fetchHomeworkDetails = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:8000/api/v1/homeworks/${homeworkId}/homeworks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch homework details');
        }

        const data = await response.json();
        setHomeworkDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworkDetails();
  }, [homeworkId]);

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video || !annotation.trim()) {
      setSubmissionMessage('Please provide both a video and a text annotation.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('video', video);
      formData.append('annotation', annotation);

      const response = await fetch(`http://localhost:8000/api/v1/homework/${homeworkId}/submit/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit homework');
      }

      setSubmissionMessage('Homework submitted successfully!');
    } catch (error) {
      setSubmissionMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !homeworkDetails) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="font-oswald min-h-screen flex flex-col items-center bg-gray-100">
        <div className="p-6 flex-grow flex flex-col bg-white shadow-md rounded-md items-center w-[25rem] max-w-4xl">
          {/* Homework Details */}
          {homeworkDetails && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-black mb-4">{homeworkDetails.title}</h1>
              <p className="text-gray-700 mb-2">{homeworkDetails.description}</p>
              <p className="text-gray-500">
                <strong>Due Date:</strong> {new Date(homeworkDetails.due_date).toLocaleDateString()}
              </p>
            </div>
          )}

          <form className="w-full max-w-md" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="video" className="block text-sm font-medium text-gray-700">
                Video Submission
              </label>
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="annotation" className="block text-sm font-medium text-gray-700">
                Text Annotation
              </label>
              <textarea
                id="annotation"
                rows="4"
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Write your annotation here..."
              />
            </div>

            {submissionMessage && (
              <p
                className={`mb-4 px-4 py-2 rounded ${
                  submissionMessage.includes('successfully')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {submissionMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Homework'}
            </button>
          </form>
        </div>
        <Navbar />
      </div>
    </>
  );
}

export default Homework;
