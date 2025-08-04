import React from 'react';
import { Upload, Edit, Trash2, Video, X } from 'lucide-react';
import '../style/LessonCard.css';

const LessonCard = ({ lesson, onEdit, onDelete, onAddVideo, onDeleteVideo }) => {
  const handleDeleteLesson = async () => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      await onDelete(lesson.lessonId);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      await onDeleteVideo(videoId);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="lesson-card">
      <div className="lesson-header">
        <div className="lesson-info">
          <h4 className="lesson-title">{lesson.title}</h4>
          <div className="lesson-meta">
            <span>Duration: {formatDuration(lesson.durationInSeconds)}</span>
            <span>Video: 
              {lesson.video && (
      <div className="video-item">
         <Video size={14} />
           <span className="video-id">Video Url: {lesson.video.videoUrl}</span>
          <button
      onClick={() => handleDeleteVideo(lesson.video.videoId)}
      className="btn-icon text-red"
      title="Delete Video"
           >
      <X size={14} />
    </button>
  </div> 
)}

            </span>

          </div>
          {lesson.video && lesson.video.length > 0 && (
            <div className="video-list">
              {lesson.video.map((video) => (
                <div key={video.videoId} className="video-item">
                  <Video size={14} />
                  <span className="video-id">Video ID: {video.videoId}</span>
                  <button
                    onClick={() => handleDeleteVideo(video.videoId)}
                    className="btn-icon text-red"
                    title="Delete Video"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lesson-actions">
          <button
            onClick={() => onAddVideo(lesson.lessonId)}
            className="btn-small btn-purple"
          >
            <Upload size={12} />
            Upload Video
          </button>
          <button
            onClick={() => onEdit(lesson)}
            className="btn-icon text-blue"
            title="Edit Lesson"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={handleDeleteLesson}
            className="btn-icon text-red"
            title="Delete Lesson"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;