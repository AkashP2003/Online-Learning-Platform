import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../Context/UserContext'; // Import UserContext directly
import { useNavigate } from 'react-router-dom'; 
import { Clock, CheckCircle, Play, Award, Calendar, User, RefreshCw } from 'lucide-react';
import axios from 'axios'; // Import axios
import './MyCoursesTab.css';

const MyCoursesTab = () => {
  const { userData: contextUserData } = useContext(UserContext); // Get userData from context
  const [userData, setUserData] = useState(null); // Local state for user data
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  const fetchUserData = async () => {
    if (!contextUserData?.userId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/users/${contextUserData.userId}`);
      if (response.data) {
        setUserData(response.data);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [contextUserData]);

  useEffect(() => {
    console.log('MyCoursesTab: userData updated:', userData);
  }, [userData]);

  // Handle refresh function
  const handleRefresh = async () => {
    await fetchUserData();
  };

  if (loading) {
    return (
      <div className="my-courses-container">
        <div className="my-courses-wrapper">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="my-courses-container">
        <div className="my-courses-wrapper">
          <div className="header-section">
            <h1 className="main-title">My Learning Journey</h1>
            <p className="main-subtitle">Start your learning adventure today</p>
          </div>
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h2 className="empty-state-title">No user data available</h2>
            <p className="empty-state-text">Please log in to view your courses.</p>
            <button className="btn-primary" onClick={handleBrowseCourses}>Browse Courses</button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData.enrollments || userData.enrollments.length === 0) {
    return (
      <div className="my-courses-container">
        <div className="my-courses-wrapper">
          <div className="header-section">
            <h1 className="main-title">My Learning Journey</h1>
            <p className="main-subtitle">Start your learning adventure today</p>
          </div>
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h2 className="empty-state-title">No courses enrolled yet</h2>
            <p className="empty-state-text">Browse our catalog and enroll in your first course to get started!</p>
            <button className="btn-primary" onClick={handleBrowseCourses}>Browse Courses</button>
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds = 0) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
  };

  const calculateProgress = (progress) => {
    if (!progress || progress.length === 0) return 0;
    const completed = progress.filter(p => p.watched).length;
    return Math.round((completed / progress.length) * 100);
  };

  const getTotalLessons = (modules = []) => {
    return modules.reduce((total, module) => total + (module.lessons?.length || 0), 0);
  };

  const getTotalDuration = (modules = []) => {
    return modules.reduce((total, module) => {
      return total + (module.lessons?.reduce((moduleTotal, lesson) =>
        moduleTotal + (lesson.durationInSeconds || 0), 0) || 0);
    }, 0);
  };

  const getCompletedLessons = (progress) => {
    if (!progress) return 0;
    return progress.filter(p => p.watched).length;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLessonProgressIndex = (moduleIndex, lessonIndex, modules) => {
    let totalIndex = 0;
    for (let i = 0; i < moduleIndex; i++) {
      totalIndex += modules[i].lessons?.length || 0;
    }
    return totalIndex + lessonIndex;
  };

  const handleBrowseCourses = () => {
    navigate('/dashboard');
  };

  return (
    <div className="my-courses-container">
      <div className="my-courses-wrapper">

        {/* Header */}
        <div className="header-section">
          <div className="header-content">
            <div>
              <h1 className="main-title">My Learning Journey</h1>
              <p className="main-subtitle">Continue your progress and master new skills</p>
            </div>
            <button 
              className="refresh-btn" 
              onClick={handleRefresh} 
              title="Refresh data"
              style={{
                background: 'none',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="user-info-card">
          <div className="user-info-content">
            <div className="user-details">
              <div className="user-avatar">
                <User className="user-icon" />
              </div>
              <div className="user-text">
                <h2 className="user-name">{userData.username}</h2>
                <p className="user-email">{userData.email}</p>
                <span className="user-role">{userData.role}</span>
              </div>
            </div>
            <div className="wallet-info">
              <div className="wallet-balance">₹{userData.walletBalanace?.balance || 0}</div>
              <p className="wallet-label">Wallet Balance</p>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="courses-section">
          {userData.enrollments?.map((enrollment, index) => {
            const course = enrollment.courseDetails?.[0];
            if (!course || !course.modules) return null;

            const progressPercent = calculateProgress(enrollment.progress);
            const totalLessons = getTotalLessons(course.modules);
            const completedLessons = getCompletedLessons(enrollment.progress);
            const totalDuration = getTotalDuration(course.modules);

            return (
              <div key={index} className="course-card">
                <div className="course-header">
                  <div className="course-main-info">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-meta">
                      <span className="course-category">{course.category}</span>
                      <div className="enrollment-date">
                        <Calendar className="calendar-icon" />
                        <span>Enrolled {formatDate(enrollment.enrolledAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="progress-summary">
                    <div className="progress-percent">{progressPercent}%</div>
                    <div className="progress-label">Complete</div>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="progress-stats">
                    <span>{completedLessons} of {totalLessons} lessons completed</span>
                    <span>{formatDuration(totalDuration)} total duration</span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="course-content">
                  <div className="course-stats">
                    <div className="stat-item">
                      <Play className="stat-icon" />
                      <span>{totalLessons} Lessons</span>
                    </div>
                    <div className="stat-item">
                      <Clock className="stat-icon" />
                      <span>{formatDuration(totalDuration)}</span>
                    </div>
                    <div className="stat-item">
                      <Award className="stat-icon" />
                      <span>{enrollment.completed ? 'Completed' : 'In Progress'}</span>
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="modules-container">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="module-card">
                        <h4 className="module-title">{module.title}</h4>
                        <div className="lessons-grid">
                          {module.lessons?.map((lesson, lessonIndex) => {
                            const progressIndex = getLessonProgressIndex(moduleIndex, lessonIndex, course.modules);
                            const isWatched = enrollment.progress?.[progressIndex]?.watched;

                            return (
                              <div key={lessonIndex} className={`lesson-item ${isWatched ? 'completed' : 'pending'}`}>
                                <div className="lesson-main">
                                  <CheckCircle className={`lesson-status-icon ${isWatched ? 'completed' : 'pending'}`} />
                                  <span className="lesson-title">{lesson.title}</span>
                                </div>
                                <div className="lesson-duration">
                                  <Clock className="duration-icon" />
                                  <span>{formatDuration(lesson.durationInSeconds)}</span>
                                </div>
                                {lesson.video?.[0]?.videoUrl && (
                                  <div className="lesson-video">
                                    <a href={lesson.video[0].videoUrl} target="_blank" rel="noreferrer">
                                      Watch Video
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="course-actions">
                    <button className="btn-primary">
                      <Play className="btn-icon" />
                      Continue Learning
                    </button>
                    <button className="btn-secondary">
                      <Award className="btn-icon" />
                      View Certificate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyCoursesTab;