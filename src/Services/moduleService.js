const moduleService = {
  getForCourse: async (courseId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/modules/courses/${courseId}/modules`);
      if (!response.ok) throw new Error('Failed to fetch modules');
      return await response.json();
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  },

  create: async (moduleData) => {
    try {
      const response = await fetch(`http://localhost:8081/api/modules/courses/${moduleData.courseId}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: moduleData.title
        })
      });

      if (!response.ok) throw new Error('Failed to create module');
      return await response.json();
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  },

  update: async (moduleId, moduleData) => {
    try {
      const response = await fetch(`http://localhost:8081/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: moduleData.title
        })
      });

      if (!response.ok) throw new Error('Failed to update module');
      return await response.json();
    } catch (error) {
      console.error('Error updating module:', error);
      throw error;
    }
  },

  delete: async (moduleId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/modules/${moduleId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete module');
      return true;
    } catch (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
  }
};

export default moduleService;