import React from 'react';
import { Edit, Trash2, Users } from 'lucide-react';
import '../style/CourseCard.css';

const CourseCard = ({ course, onEdit, onDelete, onManageContent }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await onDelete(course.courseId);
    }
  };

  return (
    <div className="course-card">
      <div className="course-card-content">
        <div className="course-card-header">
          <div className="course-info">
            <h3 className="course-title">{course.title}</h3>
            <p className="course-description">{course.description}</p>
            <div className="course-meta">
              <span className="category-badge">{course.category}</span>
              <span className="enrollment-count">
                <Users size={14} />
                {course.enrollmentCount || 0}
              </span>
            </div>
          </div>
          <div className="course-actions">
            <button
              onClick={() => onEdit(course)}
              className="btn-icon text-blue"
              title="Edit Course"
            >
              <Edit size={28} />
            </button>
            <button
              onClick={handleDelete}
              className="btn-icon text-red"
              title="Delete Course"
            >
              <Trash2 size={28} />
            </button>
          </div>
        </div>
        <div className="course-footer">
          <span className="course-price">₹{course.price}</span>
          <div className="course-status">
            <span className={`status-badge ${course.published ? 'status-published' : 'status-draft'}`}>
              {course.published ? 'Published' : 'Draft'}
            </span>
            <button
              onClick={() => onManageContent(course)}
              className="manage-content-btn"
            >
              Manage Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;