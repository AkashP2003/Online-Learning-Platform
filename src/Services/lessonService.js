const lessonService = {
  getForModule: async (moduleId) => {
    try {
      console.log('Fetching lessons for module:', moduleId);
      const response = await fetch(`http://localhost:8081/api/lesson/modules/${moduleId}/lessons`);
      console.log('Lessons response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch lessons:', errorText);
        throw new Error(`Failed to fetch lessons: ${response.status} ${errorText}`);
      }
      
      const lessons = await response.json();
      console.log('Fetched lessons:', lessons);
      return lessons;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }
  },

  create: async (lessonData) => {
    try {
      console.log('Creating lesson with data:', lessonData);
      
      // Validate required fields
      if (!lessonData.title) {
        throw new Error('Lesson title is required');
      }
      if (!lessonData.moduleId) {
        throw new Error('Module ID is required');
      }
      if (!lessonData.durationInSeconds) {
        throw new Error('Duration is required');
      }

      const payload = {
        title: lessonData.title,
        moduleId: parseInt(lessonData.moduleId),
        durationInSeconds: parseInt(lessonData.durationInSeconds),
        video: []
      };

      console.log('Lesson creation payload:', payload);

      const response = await fetch(`http://localhost:8081/api/lesson/modules/${lessonData.moduleId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Lesson creation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create lesson:', errorText);
        throw new Error(`Failed to create lesson: ${response.status} ${errorText}`);
      }
      
      const newLesson = await response.json();
      console.log('Created lesson:', newLesson);
      return newLesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  },

  update: async (lessonId, lessonData) => {
    try {
      console.log('Updating lesson:', lessonId, 'with data:', lessonData);
      
      const payload = {
        title: lessonData.title,
        durationInSeconds: parseInt(lessonData.durationInSeconds)
      };

      const response = await fetch(`http://localhost:8081/api/lesson/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Lesson update response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to update lesson:', errorText);
        throw new Error(`Failed to update lesson: ${response.status} ${errorText}`);
      }
      
      const updatedLesson = await response.json();
      console.log('Updated lesson:', updatedLesson);
      return updatedLesson;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  },

  delete: async (lessonId) => {
    try {
      console.log('Deleting lesson:', lessonId);
      
      const response = await fetch(`http://localhost:8081/api/lesson/${lessonId}`, {
        method: 'DELETE'
      });

      console.log('Lesson deletion response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to delete lesson:', errorText);
        throw new Error(`Failed to delete lesson: ${response.status} ${errorText}`);
      }
      
      console.log('Lesson deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  }
};

export default lessonService;