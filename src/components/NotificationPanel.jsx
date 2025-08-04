import React, { useState } from 'react';
import { Send, Mail, Users, CheckCircle, AlertCircle } from 'lucide-react';
import '../style/NotificationPanel.css';

const NotificationPanel = ({ onSendNotification }) => {
  const [loading, setLoading] = useState(false);
  const [lastSent, setLastSent] = useState(null);
  const [error, setError] = useState(null);

  const handleSendNotification = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await onSendNotification();
      setLastSent(new Date());
      
      // Show success message (you can customize this)
      console.log('Notification sent successfully:', result);
    } catch (error) {
      console.error('Error sending notification:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return date.toLocaleString();
  };

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <div className="header-content">
          <div className="header-icon">
            <Mail size={24} />
          </div>
          <div>
            <h3>Push Notifications</h3>
            <p>Send offer notifications to all users</p>
          </div>
        </div>
      </div>

      <div className="notification-body">
        <div className="notification-info">
          <div className="info-item">
            <Users size={18} />
            <span>Send to all registered users</span>
          </div>
          <div className="info-item">
            <Mail size={18} />
            <span>Email notifications about current offers</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {lastSent && !error && (
          <div className="success-message">
            <CheckCircle size={16} />
            <span>Last sent: {formatDate(lastSent)}</span>
          </div>
        )}

        <button
          onClick={handleSendNotification}
          disabled={loading}
          className={`send-notification-btn ${loading ? 'loading' : ''}`}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Sending...
            </>
          ) : (
            <>
              <Send size={20} />
              Send Offer Notifications
            </>
          )}
        </button>

        <div className="notification-footer">
          <p className="disclaimer">
            This will send email notifications to all active users about current offers and promotions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;