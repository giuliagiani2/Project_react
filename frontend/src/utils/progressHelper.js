export const getCompletedVideos = (courseId) => {
  const progress = JSON.parse(localStorage.getItem('watchedVideosByCourse')) || {};
  return progress[courseId] || {}; // Ritorna i video completati per il corso specifico
};

export const markVideoAsCompleted = (courseId, videoId) => {
  const progress = JSON.parse(localStorage.getItem('watchedVideosByCourse')) || {};
  const updatedCourseProgress = { ...progress[courseId], [videoId]: true };
  const updatedProgress = { ...progress, [courseId]: updatedCourseProgress };
  localStorage.setItem('watchedVideosByCourse', JSON.stringify(updatedProgress));
};
