// services/UserService.js
import axios from 'axios';

class UserService {
  constructor() {
    this.cache = new Map();
    this.listeners = new Set();
    this.isRefreshing = false;
  }

  // Add listener for data updates
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback); // Return cleanup function
  }

  // Notify all listeners of data changes
  notifyListeners(data) {
    this.listeners.forEach(callback => callback(data));
  }

  // Get user data with caching
  async getUserData(userId, forceRefresh = false) {
    const cacheKey = `user_${userId}`;
    
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      // Check if cache is still valid (5 minutes)
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        return cached.data;
      }
    }

    try {
      const response = await axios.get(`http://localhost:8083/api/payment/users/${userId}`);
      const userData = {
        ...response.data,
        lastUpdated: Date.now()
      };

      // Update cache
      this.cache.set(cacheKey, {
        data: userData,
        timestamp: Date.now()
      });

      // Notify all listeners
      this.notifyListeners(userData);

      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  // Get enrolled courses for a user
  async getEnrolledCourses(userId) {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
      if (response.data?.enrollments) {
        const enrolled = response.data.enrollments.flatMap(enrollment =>
          enrollment.courseDetails.map(course => String(course.courseId))
        );
        return enrolled;
      }
      return [];
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      return [];
    }
  }

  // Get all courses
  async getAllCourses() {
    const cacheKey = 'all_courses';
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      // Cache courses for 10 minutes
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) {
        return cached.data;
      }
    }

    try {
      const response = await axios.get('http://localhost:8081/api/course/');
      const courses = response.data || [];

      this.cache.set(cacheKey, {
        data: courses,
        timestamp: Date.now()
      });

      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Get course details by ID
  async getCourseById(courseId) {
    const cacheKey = `course_${courseId}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) {
        return cached.data;
      }
    }

    try {
      const response = await axios.get(`http://localhost:8081/api/course/${courseId}`);
      const course = response.data;

      this.cache.set(cacheKey, {
        data: course,
        timestamp: Date.now()
      });

      return course;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  // Get multiple courses by IDs (batch request)
  async getCoursesByIds(courseIds) {
    const uniqueIds = [...new Set(courseIds)];
    const coursePromises = uniqueIds.map(id => 
      this.getCourseById(id).catch(() => ({ id, title: 'Unknown Course' }))
    );

    try {
      const courses = await Promise.all(coursePromises);
      const courseMap = {};
      courses.forEach(course => {
        if (course.courseId || course.id) {
          courseMap[course.courseId || course.id] = course.title || course;
        }
      });
      return courseMap;
    } catch (error) {
      console.error('Error fetching multiple courses:', error);
      return {};
    }
  }

  // Get active offers
  async getActiveOffers() {
    const cacheKey = 'active_offers';
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      // Cache offers for 5 minutes
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        return cached.data;
      }
    }

    try {
      const response = await axios.get('http://localhost:8086/api/offers/active');
      let offers = [];

      if (Array.isArray(response.data)) {
        offers = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        offers = response.data.data;
      } else if (response.data.offers && Array.isArray(response.data.offers)) {
        offers = response.data.offers;
      }

      this.cache.set(cacheKey, {
        data: offers,
        timestamp: Date.now()
      });

      return offers;
    } catch (error) {
      console.error('Error fetching offers:', error);
      return [];
    }
  }

  // Process payment
  async processPayment(paymentData) {
    try {
      let response;
      
      if (paymentData.paymentGateway === 'CREDIT') {
        response = await axios.post('http://localhost:8083/api/payment/', paymentData);
      } else if (paymentData.paymentGateway === 'WALLET') {
        response = await axios.post(`http://localhost:8085/api/wallet/${paymentData.userId}/pay`, {
          courseId: paymentData.courseId,
          amount: paymentData.amount
        });
      }

      // Invalidate user cache to force refresh
      this.invalidateUserCache(paymentData.userId);
      
      // Refresh user data after payment
      setTimeout(() => {
        this.getUserData(paymentData.userId, true);
      }, 1000);

      return response;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  // Invalidate cache for specific user
  invalidateUserCache(userId) {
    const cacheKey = `user_${userId}`;
    this.cache.delete(cacheKey);
  }

  // Invalidate all cache
  invalidateAllCache() {
    this.cache.clear();
  }

  // Force refresh user data and notify all listeners
  async refreshUserData(userId) {
    if (this.isRefreshing) {
      return; // Prevent multiple simultaneous refreshes
    }

    this.isRefreshing = true;
    try {
      const userData = await this.getUserData(userId, true);
      this.isRefreshing = false;
      return userData;
    } catch (error) {
      this.isRefreshing = false;
      throw error;
    }
  }

  // Get comprehensive dashboard data
  async getDashboardData(userId) {
    try {
      const [userData, courses, offers] = await Promise.all([
        this.getUserData(userId),
        this.getAllCourses(),
        this.getActiveOffers()
      ]);

      // Get course details for payments if needed
      let courseTitles = {};
      if (userData.payments && userData.payments.length > 0) {
        const courseIds = [...new Set(userData.payments.map(p => p.courseId))];
        courseTitles = await this.getCoursesByIds(courseIds);
      }

      return {
        userData,
        courses,
        offers,
        courseTitles,
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}

// Create singleton instance
const userService = new UserService();

export default userService;