import React from 'react';
import { X, Save } from 'lucide-react';
import '../style/Modal.css';

const Modal = ({ show, modalType, currentData, onClose, onSubmit }) => {
  if (!show) return null;

  const handleSubmit = () => {
    const inputs = document.querySelectorAll('.modal-content input, .modal-content textarea, .modal-content select');
    const data = {};
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        data[input.name] = input.checked;
      } else {
        data[input.name] = input.value;
      }
    });
    onSubmit(data);
  };

  const renderFormFields = () => {
    switch (modalType) {
      case 'course':
        return (
          <div className="form-fields">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                name="title"
                type="text"
                defaultValue={currentData.title || ''}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                rows="3"
                defaultValue={currentData.description || ''}
                className="form-textarea"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                name="category"
                type="text"
                defaultValue={currentData.category || ''}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price</label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={currentData.price || ''}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <div className="checkbox-group">
                <input
                  name="published"
                  type="checkbox"
                  defaultChecked={currentData.published || false}
                  className="form-checkbox"
                />
                <label className="form-label">Publish this course</label>
              </div>
            </div>
          </div>
        );

      case 'module':
        return (
          <div className="form-fields">
            <div className="form-group">
              <label className="form-label">Module Title</label>
              <input
                name="title"
                type="text"
                defaultValue={currentData.title || ''}
                className="form-input"
                required
              />
            </div>
          </div>
        );

      case 'lesson':
        return (
          <div className="form-fields">
            <div className="form-group">
              <label className="form-label">Lesson Title</label>
              <input
                name="title"
                type="text"
                defaultValue={currentData.title || ''}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (seconds)</label>
              <input
                name="durationInSeconds"
                type="number"
                defaultValue={currentData.durationInSeconds || ''}
                className="form-input"
                required
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="form-fields">
            <div className="form-group">
              <label className="form-label">Video URL</label>
              <input
                name="videoUrl"
                type="url"
                placeholder="https://videos.example.com/..."
                className="form-input"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    const action = currentData.courseId || currentData.moduleId || currentData.lessonId || currentData.videoId ? 'Edit' : 'Add';
    const entityType = modalType.charAt(0).toUpperCase() + modalType.slice(1);
    return `${action} ${entityType}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{getModalTitle()}</h3>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {renderFormFields()}

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary"
            >
              <Save size={20} />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;