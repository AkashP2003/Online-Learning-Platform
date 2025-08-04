import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import LessonCard from './LessonCard';
import '../style/ModuleCard.css';

const ModuleCard = ({ 
  module, 
  onAddLesson, 
  onEditModule, 
  onDeleteModule, 
  onEditLesson, 
  onDeleteLesson, 
  onAddVideo, 
  onDeleteVideo 
}) => {
  const handleDeleteModule = async () => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      await onDeleteModule(module.moduleId);
    }
  };

  return (
    <div className="module-card">
      <div className="module-header">
        <h3 className="module-title">{module.title}</h3>
        <div className="module-actions">
          <button
            onClick={() => onAddLesson(module.moduleId)}
            className="btn-small btn-primary"
          >
            <Plus size={14} />
            Add Lesson
          </button>
          <button
            onClick={() => onEditModule(module)}
            className="btn-icon text-blue"
            title="Edit Module"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDeleteModule}
            className="btn-icon text-red"
            title="Delete Module"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="module-content">
        {!module.lessons || module.lessons.length === 0 ? (
          <p className="no-lessons">No lessons added yet</p>
        ) : (
          <div className="lessons-container">
            {module.lessons.map((lesson) => (
              <LessonCard
                key={lesson.lessonId}
                lesson={lesson}
                onEdit={onEditLesson}
                onDelete={onDeleteLesson}
                onAddVideo={onAddVideo}
                onDeleteVideo={onDeleteVideo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;