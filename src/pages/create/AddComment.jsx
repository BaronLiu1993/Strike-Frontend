import React, { useState } from 'react';

const AddComment = ({ submissionId }) => {
  const [commentText, setCommentText] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComment = async () => {
    if (!commentText.trim()) {
      setMessage('Comment cannot be empty.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('https://strikeapp-fb52132f9a0c.herokuapp.com/api/v1/comments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          submission: submissionId,
          comment_text: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment. Please try again.');
      }

      setMessage('Comment added successfully.');
      setCommentText('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Add Feedback</h2>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Feedback:
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            rows="4"
            placeholder="Write your feedback here..."
          />
        </label>
      </div>
      <button
        onClick={handleComment}
        className={`${
          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        } text-white px-4 py-2 rounded`}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  );
};

export default AddComment;
