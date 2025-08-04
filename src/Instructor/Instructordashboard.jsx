import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Book, FileText, LogOut } from 'lucide-react';

import courseService from '../Services/courseService';
import moduleService from '../Services/moduleService';
import lessonService from '../Services/lessonService';
import videoService from '../Services/videoService';
import { useUser } from '../Context/UserContext';
import Modal from '../components/Modal';
import CourseCard from '../components/CourseCard';
import ModuleCard from '../components/ModuleCard';

import './Instructordashboard.css';

const InstructorDashboard = ({ user, onLogout }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentData, setCurrentData] = useState({});
 const { userData } = useUser();
  // Remove selectedCourse from dependencies to prevent infinite loop
  const loadCourseWithModules = useCallback(async (courseId) => {
    try {
      const modules = await moduleService.getForCourse(courseId);

      const modulesWithLessons = await Promise.all(
        modules.map(async (module) => {
          const lessons = await lessonService.getForModule(module.moduleId);

          const lessonsWithVideos = await Promise.all(
            lessons.map(async (lesson) => {
              const videos = await videoService.getForLesson(lesson.lessonId);
              return {
                ...lesson,
                video: videos || []
              };
            })
          );

          return {
            ...module,
            lessons: lessonsWithVideos
          };
        })
      );

      // Update both selectedCourse and courses state
      setCourses(prev => prev.map(course => {
        if (course.courseId === courseId) {
          const updatedCourse = {
            ...course,
            modules: modulesWithLessons
          };
          // Update selectedCourse if this is the selected course
          setSelectedCourse(prevSelected => 
            prevSelected && prevSelected.courseId === courseId ? updatedCourse : prevSelected
          );
          return updatedCourse;
        }
        return course;
      }));

    } catch (error) {
      console.error('Error loading course data:', error);
    } 
  }, []); // Empty dependency array

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await courseService.getByInstructor(userData.userId);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error loading courses:', error);
      } 
    };

    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse && activeTab === 'content') {
      loadCourseWithModules(selectedCourse.courseId);
    }
  }, [selectedCourse?.courseId, activeTab, loadCourseWithModules]); // Use selectedCourse.courseId instead of selectedCourse

  const openModal = (type, data = {}) => {
    setModalType(type);
    setCurrentData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentData({});
  };

  const handleSubmitData = async (data) => {
    try {
      console.log('Submitting data:', { modalType, data, currentData });
      
      switch (modalType) {
        case 'course':
          if (currentData.courseId) {
            await courseService.update(currentData.courseId, data);
          } else {
            await courseService.create(userData.userId, data);
          }
          const updatedCourses = await courseService.getByInstructor(userData.userId);
          setCourses(updatedCourses);
          break;

        case 'module':
          if (currentData.moduleId) {
            await moduleService.update(currentData.moduleId, data);
          } else {
            // Ensure courseId is available
            if (!selectedCourse?.courseId) {
              throw new Error('No course selected for module creation');
            }
            await moduleService.create({ ...data, courseId: selectedCourse.courseId });
          }
          await loadCourseWithModules(selectedCourse.courseId);
          break;

        case 'lesson':
          if (currentData.lessonId) {
            await lessonService.update(currentData.lessonId, data);
          } else {
            // Ensure moduleId is available
            if (!currentData.moduleId) {
              throw new Error('No module ID provided for lesson creation');
            }
            console.log('Creating lesson with data:', { ...data, moduleId: currentData.moduleId });
            await lessonService.create({ ...data, moduleId: currentData.moduleId });
          }
          await loadCourseWithModules(selectedCourse.courseId);
          break;

        case 'video':
          // Ensure lessonId is available
          if (!currentData.lessonId) {
            throw new Error('No lesson ID provided for video upload');
          }
          console.log('Uploading video with data:', { ...data, lessonId: currentData.lessonId });
          await videoService.upload({ ...data, lessonId: currentData.lessonId });
          await loadCourseWithModules(selectedCourse.courseId);
          break;

        default:
          console.error('Unknown modal type:', modalType);
          throw new Error(`Unknown modal type: ${modalType}`);
      }
      closeModal();
    } catch (error) {
      console.error('Error in handleSubmitData:', error);
      alert(`Error: ${error.message}`);
    } 
  };

  const handleEditCourse = (course) => {
    openModal('course', course);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await courseService.delete(courseId);
      const updatedCourses = await courseService.getByInstructor(user?.userId);
      setCourses(updatedCourses);
      
      if (selectedCourse && selectedCourse.courseId === courseId) {
        setSelectedCourse(null);
        setActiveTab('courses');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleManageContent = (course) => {
    setSelectedCourse(course);
    setActiveTab('content');
  };

  const handleAddLesson = (moduleId) => {
    console.log('Adding lesson for module:', moduleId);
    openModal('lesson', { moduleId });
  };

  const handleEditModule = (module) => {
    openModal('module', module);
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await moduleService.delete(moduleId);
      await loadCourseWithModules(selectedCourse.courseId);
    } catch (error) {
      console.error('Error deleting module:', error);
    } 
  };

  const handleEditLesson = (lesson) => {
    openModal('lesson', lesson);
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await lessonService.delete(lessonId);
      await loadCourseWithModules(selectedCourse.courseId);
    } catch (error) {
      console.error('Error deleting lesson:', error);
    } 
  };

  const handleAddVideo = (lessonId) => {
    console.log('Adding video for lesson:', lessonId);
    openModal('video', { lessonId });
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await videoService.delete(videoId);
      await loadCourseWithModules(selectedCourse.courseId);
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-flex">
            <div className="header-info">
              <h1 className="header-title">Instructor Dashboard</h1>
              <p className="header-subtitle">Manage your courses, modules, and content</p>
            </div>
            <div className="header-actions">
              <div className="stats-badge">
                <span>Total Courses: {courses.length}</span>
              </div>
               <div className="admin-user-info" style={{fontSize:'18px', fontWeight:"bold"}}>
                <span>Welcome, {userData?.username}</span>
              </div>
              <button
                onClick={() => openModal('course')}
                className="btn-primary"
              >
                <Plus size={20} />
                New Course
              </button>

              <button className="logout-button" onClick={onLogout} aria-label="Logout">
                <LogOut className="logout-icon" />
                <span className="logout-text">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="nav-tabs">
          <nav className="nav-flex">
            <button
              onClick={() => setActiveTab('courses')}
              className={`nav-tab ${activeTab === 'courses' ? 'active' : ''}`}
            >
              <Book size={18} />
              Courses
            </button>
            {selectedCourse && (
              <button
                onClick={() => setActiveTab('content')}
                className={`nav-tab ${activeTab === 'content' ? 'active' : ''}`}
              >
                <FileText size={18} />
                Course Content
              </button>
            )}
          </nav>
        </div>

        {activeTab === 'courses' && (
          <div className="courses-section">
            <div className="course-grid">
              {courses.map((course) => (
                <CourseCard
                  key={course.courseId}
                  course={course}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                  onManageContent={handleManageContent}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && selectedCourse && (
          <div className="content-section">
            <div className="content-container">
              <div className="content-header">
                <div>
                  <h2 className="content-title">{selectedCourse.title}</h2>
                  <p className="content-subtitle">Manage modules, lessons, and videos</p>
                </div>
                <button
                  onClick={() => openModal('module')}
                  className="btn-success"
                >
                  <Plus size={20} />
                  Add Module
                </button>
              </div>

              <div className="modules-container">
                {selectedCourse.modules && selectedCourse.modules.map((module) => (
                  <ModuleCard
                    key={module.moduleId}
                    module={module}
                    onAddLesson={handleAddLesson}
                    onEditModule={handleEditModule}
                    onDeleteModule={handleDeleteModule}
                    onEditLesson={handleEditLesson}
                    onDeleteLesson={handleDeleteLesson}
                    onAddVideo={handleAddVideo}
                    onDeleteVideo={handleDeleteVideo}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        show={showModal}
        modalType={modalType}
        currentData={currentData}
        onClose={closeModal}
        onSubmit={handleSubmitData}
      />
    </div>
  );
};

export default InstructorDashboard;