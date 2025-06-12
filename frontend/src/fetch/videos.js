// src/fetch/videos.js
export const fetchVideos = async () => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/videos';
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};
