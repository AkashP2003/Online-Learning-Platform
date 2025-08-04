import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play,BookOpen, Clock, Award, Users } from 'lucide-react';
import axios from 'axios';
import './CourseDetailPage.css';
import { useNavigate } from 'react-router-dom'; 

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate(); 

  

  useEffect(() => {
    axios.get(`http://localhost:8081/api/course/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const getTotalLessons = (modules) => {
    return modules.reduce((total, module) => total + module.lessons.length, 0);
  };

 const getTotalModule = (course) => {
  return course?.modules?.length || 0
};

 const handleEnrollCourse = (e, courseId) => {
  e.preventDefault();
  e.stopPropagation();

  if (!course || course.courseId !== courseId) {
    console.error("Course not found with ID:", courseId);
    return;
  }
  navigate(`/payment/${courseId}`, { state: { courses: course } });
  };

  const getTotalDuration = (modules) => {
    return modules.reduce((total, module) => 
      total + module.lessons.reduce((moduleTotal, lesson) => 
        moduleTotal + lesson.durationInSeconds, 0), 0);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!course) return <div className="loading">Loading...</div>;

  const totalLessons = getTotalLessons(course.modules);
  const totalDuration = getTotalDuration(course.modules);
  const totalModules = getTotalModule(course);

  return (
    <div className="course-detail-container">
      <div className="course-header">
        <div className="course-main-info">
          <h2 className="course-title">{course.title}</h2>
          <p className="course-description">{course.description}</p>
          <div className="course-meta">
            <span className="course-category">{course.category}</span>
            <span className="course-price">₹{course.price}</span>
            <button
                      onClick={(e) => handleEnrollCourse(e, course.courseId)}
                      className="course-enroll"
                 >
            <span style={{ color: 'white' }}>Enroll Now</span>
            </button>
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="course-stats">
          <div className="stat-item">
            <BookOpen className="" />
            <span>{totalModules} Modules</span>
          </div>
          <div className="stat-item">
            <Play className="" />
            <span>{totalLessons} Lessons</span>
          </div>
          <div className="stat-item">
            <Clock className="" />
            <span>{formatDuration(totalDuration)}</span>
          </div>
          <div className="stat-item">
            <Users className="" />
            <span>{course.enrollmentCount} Students</span>
          </div>
          <div className="stat-item">
            <Award className="" />
            <span>Certificate</span>
          </div>
        </div>

        <div className="modules-container">
          <h3>Course Content</h3>
          {course.modules.map((module, moduleIndex) => (
            <div key={module.moduleId} className="module-card">
              <h4 className="module-title">{module.title}</h4>
              <div className="lessons-grid">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.lessonId} className="lesson-item">
                    <div className="lesson-main">
                      <Play className="lesson-status-icon" />
                      <span className="lesson-title">{lesson.title}</span>
                    </div>
                    <div className="lesson-duration">
                      <Clock className="duration-icon" />
                      <span>{formatDuration(lesson.durationInSeconds)}</span>
                    </div>
                    {/* {lesson.video && lesson.video.length > 0 && (
                      <div className="lesson-video">
                        <a href={lesson.video[0].videoUrl} target="_blank" rel="noreferrer">
                          Watch Video
                        </a>
                      </div>
                    )} */}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}