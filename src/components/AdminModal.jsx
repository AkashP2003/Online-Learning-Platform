import React from 'react';
import { X, Save } from 'lucide-react';
import '../style/AdminModal.css';

const AdminModal = ({ show, modalType, currentData, onClose, onSubmit }) => {
  if (!show) return null;

  const handleSubmit = () => {
    const inputs = document.querySelectorAll('.admin-modal-content input, .admin-modal-content textarea, .admin-modal-content select');
    const data = {};
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        data[input.name] = input.checked;
      } else if (input.type === 'number') {
        data[input.name] = parseFloat(input.value) || 0;
      } else {
        data[input.name] = input.value;
      }
    });
    onSubmit(data);
  };

  const renderFormFields = () => {
    switch (modalType) {
      case 'user':
        return (
          <div className="admin-form-fields">
            <div className="admin-form-group">
              <label className="admin-form-label">Name</label>
              <input
                name="name"
                type="text"
                defaultValue={currentData.name || ''}
                className="admin-form-input"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={currentData.email || ''}
                className="admin-form-input"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Role</label>
              <select
                name="role"
                defaultValue={currentData.role || 'USER'}
                className="admin-form-select"
                required
              >
                <option value="USER">User</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="admin-form-group">
              <div className="admin-checkbox-group">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked={currentData.active !== false}
                  className="admin-form-checkbox"
                />
                <label className="admin-form-label">Active</label>
              </div>
            </div>
          </div>
        );

      case 'instructor':
        return (
          <div className="admin-form-fields">
            <div className="admin-form-group">
              <label className="admin-form-label">Name</label>
              <input
                name="name"
                type="text"
                defaultValue={currentData.name || ''}
                className="admin-form-input"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={currentData.email || ''}
                className="admin-form-input"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Expertise</label>
              <input
                name="expertise"
                type="text"
                defaultValue={currentData.expertise || ''}
                className="admin-form-input"
                placeholder="e.g., Web Development, Data Science"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Bio</label>
              <textarea
                name="bio"
                rows="3"
                defaultValue={currentData.bio || ''}
                className="admin-form-textarea"
                placeholder="Instructor biography"
              />
            </div>
            <div className="admin-form-group">
              <div className="admin-checkbox-group">
                <input
                  name="verified"
                  type="checkbox"
                  defaultChecked={currentData.verified || false}
                  className="admin-form-checkbox"
                />
                <label className="admin-form-label">Verified</label>
              </div>
            </div>
          </div>
        );

      case 'offer':
        return (
          <div className="admin-form-fields">
            <div className="admin-form-group">
              <label className="admin-form-label">Offer Code</label>
              <input
                name="code"
                type="text"
                defaultValue={currentData.code || ''}
                className="admin-form-input"
                placeholder="e.g., LEARN70"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Discount Percentage</label>
              <input
                name="discountPercentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                defaultValue={currentData.discountPercentage || ''}
                className="admin-form-input"
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Expiry Date</label>
              <input
                name="expiryDate"
                type="date"
                defaultValue={currentData.expiryDate ? currentData.expiryDate.split('T')[0] : ''}
                className="admin-form-input"
                required
              />
            </div>
            <div className="admin-form-group">
              <div className="admin-checkbox-group">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked={currentData.active !== false}
                  className="admin-form-checkbox"
                />
                <label className="admin-form-label">Active</label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    const action = currentData.id || currentData.userId || currentData.instructorId || currentData.offerId ? 'Edit' : 'Add';
    const entityType = modalType.charAt(0).toUpperCase() + modalType.slice(1);
    return `${action} ${entityType}`;
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">{getModalTitle()}</h3>
          <button onClick={onClose} className="admin-modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="admin-modal-body">
          {renderFormFields()}

          <div className="admin-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="admin-btn-primary"
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

export default AdminModal;