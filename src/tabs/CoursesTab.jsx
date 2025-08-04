import React, { useEffect, useState, useContext  } from 'react';
import { Play , BookOpen, Clock, Filter, Search, Percent, ChevronLeft, ChevronRight } from 'lucide-react';
import './CoursesTab.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { UserContext } from '../Context/UserContext'; 

const CoursesTab = () => {
  const [courses, setCourses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offers, setOffers] = useState([]);
  const { userData } = useContext(UserContext);  
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!userData?.userId) return;
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userData.userId}`);
        if (response.data?.enrollments) {
          const enrolled = response.data.enrollments.flatMap(enrollment =>
            enrollment.courseDetails.map(course => String(course.courseId))
          );
          setEnrolledCourses(enrolled);
        }
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      }
    };

    fetchEnrolledCourses();
  }, [userData]);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
      const response = await axios.get('http://localhost:8081/api/course/');
      if (response.data) {
        setCourses(response.data);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }

    try {
      const offersResponse = await axios.get('http://localhost:8086/api/offers/active');
      if (offersResponse.data) {
        setOffers(offersResponse.data);
      }
    } catch (err) {
      console.warn("Failed to load offers:", err);
    }
  };

    fetchCourses();
  }, []);


const navigate = useNavigate(); 

const handleEnrollCourse = (e, courseId) => {
  e.preventDefault();
  e.stopPropagation();
  const course = courses.find(c => c.courseId === courseId);
  navigate(`/payment/${courseId}`, { state: { course } });
};
 useEffect(() => {
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prevIndex) => 
          prevIndex === offers.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [offers.length]);

   const handlePrevOffer = () => {
    setCurrentOfferIndex(currentOfferIndex === 0 ? offers.length - 1 : currentOfferIndex - 1);
  };

  const handleNextOffer = () => {
    setCurrentOfferIndex(currentOfferIndex === offers.length - 1 ? 0 : currentOfferIndex + 1);
  };

  const formatExpiryDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = categoryFilter === 'All Categories' || course.category === categoryFilter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const uniqueCategories = [
    'All Categories',
    ...new Set(courses.map(course => course.category))
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTotalLessons = (modules) => {
    if (!modules || !Array.isArray(modules)) return 0;
    return modules.reduce((total, module) => {
      return total + (module.lessons?.length || 0);
    }, 0);
  };

  const getTotalDuration = (modules) => {
    if (!modules || !Array.isArray(modules)) return 0;
    return modules.reduce((total, module) => {
      if (!module.lessons) return total;
      return total + module.lessons.reduce((moduleTotal, lesson) => {
        return moduleTotal + (lesson.durationInSeconds || 0);
      }, 0);
    }, 0);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="courses-tab-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-tab-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Something went wrong</h2>
          <p className="error-text">{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-tab-container">
      <div className="courses-header">
        <div className="header-content">
          <h1 className="courses-main-title">Discover Courses</h1>
          <p className="courses-subtitle">Enhance your skills with our comprehensive course catalog</p>
        </div>
      </div>
      <div>
      {offers.length > 0 ? (
      // {offers.length > 0 && (
        <div className="offers-section">
          <div className="offers-slider">
            <div className="offers-container">
              <div className="offer-card">
                <div className="offer-icon">
                  <Percent className="percent-icon" />
                </div>
                <div className="offer-content">
                  <div className="offer-header">
                    <h3 className="offer-title">Special Offer!</h3>
                    <div className="offer-discount">
                      {offers[currentOfferIndex].discountPercentage}% OFF
                    </div>
                  </div>
                  <div className="offer-details">
                    <p className="offer-code">Use code: <strong>{offers[currentOfferIndex].code}</strong></p>
                    <p className="offer-expiry">Valid until {formatExpiryDate(offers[currentOfferIndex].expiryDate)}</p>
                  </div>
                </div>
              </div>
              
              {offers.length > 1 && (
                <>
                  <button className="slider-btn prev-btn" onClick={handlePrevOffer}>
                    <ChevronLeft className="slider-icon" />
                  </button>
                  <button className="slider-btn next-btn" onClick={handleNextOffer}>
                    <ChevronRight className="slider-icon" />
                  </button>
                </>
              )}
            </div>
            
            {offers.length > 1 && (
              <div className="slider-dots">
                {offers.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentOfferIndex ? 'active' : ''}`}
                    onClick={() => setCurrentOfferIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      // 
      
      ) : (
    <div className="offers-placeholder">No active offers at the moment</div>
          )}
              </div>

      <div className="courses-filters">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search courses..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-container">
          <Filter className="filter-icon" />
          <select
            className="category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

 
      <div className="results-info">
        <span className="results-count">
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="no-courses">
          <div className="no-courses-icon">📚</div>
          <h3 className="no-courses-title">No courses found</h3>
          <p className="no-courses-text">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <Link 
              key={course.courseId} 
              to={`/course/${course.courseId}`} 
              className="course-link"
            >
              <div className="course-card">
                <div className="course-card-header">
                  <div className="course-image-placeholder">
                    <Play className="play-icon" />
                  </div>
                  <div className="course-category-badge">
                    {course.category}
                  </div>
                </div>
                
                <div className="course-card-body">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-stats">
                    <div className="stat-item">
                      <BookOpen className="" />
                      <span>Check modules</span>
                    </div>
                    <div className="stat-item">
                      <Clock className="" size={25}/>
                      <span>Check lessons</span>
                    </div>
                    {getTotalDuration(course.modules) > 0 && (
                      <div className="stat-item">
                        <Clock className="stat-icon" />
                        <span>{formatDuration(getTotalDuration(course.modules))}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="course-footer">
                    <div className="course-price">
                      <span className="price-amount">{formatPrice(course.price)}</span>
                    </div>
                   
      {enrolledCourses.includes(String(course.courseId)) ? (
        <button className="enroll-button-enrolled" disabled>
          Enrolled
        </button>
      ) : (
        <button
          onClick={(e) => handleEnrollCourse(e, course.courseId)}
          className="enroll-button"
        >
          <Play className="button-icon" />
          Enroll Now
        </button>
      )}
      

                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesTab;