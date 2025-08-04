const courseService = {
  getByInstructor: async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/course/instructor/${userId}/courses`);
      if (!response.ok) throw new Error('Failed to fetch courses for instructor');
      return await response.json();
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      return [];
    }
  },

   create: async (userId, courseData) => {
    try {
      const response = await fetch('http://localhost:8081/api/course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instructorId: userId, // Injecting instructorId here
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          price: parseFloat(courseData.price),
          published: courseData.published === 'on' || courseData.published === true,
        })
      });

      if (!response.ok) throw new Error('Failed to create course');
      return await response.json();
    } catch (error) {
      console.error('Error creating course:', error);
      return null;
    }
  },

  update: async (courseId, courseData) => {
    try {
      const response = await fetch(`http://localhost:8081/api/course/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          price: parseFloat(courseData.price),
          published: courseData.published === 'on' || courseData.published === true
        })
      });

      if (!response.ok) throw new Error('Failed to update course');
      return await response.json();
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  delete: async (courseId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/course/${courseId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete course');
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};

export default courseService;