const videoService = {
  getForLesson: async (lessonId) => {
    try {
      console.log('Fetching videos for lesson:', lessonId);
      const response = await fetch(`http://localhost:8084/api/video/lessons/${lessonId}/video`);
      console.log('Videos response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch videos:', errorText);
        throw new Error(`Failed to fetch videos: ${response.status} ${errorText}`);
      }
      
      const videos = await response.json();
      console.log('Fetched videos:', videos);
      return videos;
    } catch (error) {
       if (error.response && error.response.status === 404) {
      return null; // No video uploaded
    } else{
      console.error('Error fetching videos:', error);
      return [];
    }
    }
  },



  upload: async (videoData) => {
    try {
      console.log('Uploading video with data:', videoData);
      
      // Validate required fields
      if (!videoData.videoUrl) {
        throw new Error('Video URL is required');
      }
      if (!videoData.lessonId) {
        throw new Error('Lesson ID is required');
      }

      const payload = {
        lessonId: parseInt(videoData.lessonId),
        videoUrl: videoData.videoUrl
      };

      console.log('Video upload payload:', payload);

      const response = await fetch('http://localhost:8084/api/video/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Video upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to upload video:', errorText);
        throw new Error(`Failed to upload video: ${response.status} ${errorText}`);
      }
      
      const newVideo = await response.json();
      console.log('Uploaded video:', newVideo);
      return newVideo;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  delete: async (videoId) => {
    try {
      console.log('Deleting video:', videoId);
      
      const response = await fetch(`http://localhost:8084/api/video/${videoId}`, {
        method: 'DELETE'
      });

      console.log('Video deletion response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to delete video:', errorText);
        throw new Error(`Failed to delete video: ${response.status} ${errorText}`);
      }
      
      console.log('Video deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }
};

export default videoService;