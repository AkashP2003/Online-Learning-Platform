const adminService = {
  // User Management
  users: {
    getAll: async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users/');
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
    },

    update: async (userId, userData) => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Failed to update user');
        return await response.json();
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },

    delete: async (userId) => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete user');
        return true;
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    }
  },


  instructors: {
    getAll: async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users/role/INSTRUCTOR');
        if (!response.ok) throw new Error('Failed to fetch instructors');
        return await response.json();
      } catch (error) {
        console.error('Error fetching instructors:', error);
        return [];
      }
    },

    update: async (instructorId, instructorData) => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${instructorData}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(instructorData)
        });
        if (!response.ok) throw new Error('Failed to update instructor');
        return await response.json();
      } catch (error) {
        console.error('Error updating instructor:', error);
        throw error;
      }
    },

    delete: async (instructorId) => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${instructorId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete instructor');
        return true;
      } catch (error) {
        console.error('Error deleting instructor:', error);
        throw error;
      }
    }
  },

  // Offer Management
  offers: {
    getAll: async () => {
      try {
        const response = await fetch('http://localhost:8086/api/offers');
        if (!response.ok) throw new Error('Failed to fetch offers');
        return await response.json();
      } catch (error) {
        console.error('Error fetching offers:', error);
        return [];
      }
    },

    create: async (offerData) => {
      try {
        const response = await fetch('http://localhost:8086/api/offers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(offerData)
        });
        if (!response.ok) throw new Error('Failed to create offer');
        return await response.json();
      } catch (error) {
        console.error('Error creating offer:', error);
        throw error;
      }
    },

    update: async (offerId, offerData) => {
      try {
        const response = await fetch(`http://localhost:8086/api/offers/${offerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(offerData)
        });
        if (!response.ok) throw new Error('Failed to update offer');
        return await response.json();
      } catch (error) {
        console.error('Error updating offer:', error);
        throw error;
      }
    },

    delete: async (offerId) => {
      try {
        const response = await fetch(`http://localhost:8086/api/offers/${offerId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete offer');
        return true;
      } catch (error) {
        console.error('Error deleting offer:', error);
        throw error;
      }
    },

    toggleActive: async (offerId, isActive) => {
      try {
        const response = await fetch(`http://localhost:8086/api/offers/${offerId}/toggle`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ active: isActive })
        });
        if (!response.ok) throw new Error('Failed to toggle offer status');
        return await response.json();
      } catch (error) {
        console.error('Error toggling offer status:', error);
        throw error;
      }
    }
  },
            
  notifications: {
    sendOfferEmails: async () => {
      try {
        const response = await fetch('http://localhost:8087/api/notifications/send-offer-emails', {
          method: 'GET',
        });
        if (!response.ok) throw new Error('Failed to send notification emails');
        return await response.json();
      } catch (error) {
        console.error('Error sending notification emails:', error);
        throw error;
      }
    }
  }
};

export default adminService;   