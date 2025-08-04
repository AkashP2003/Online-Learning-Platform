import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
import axios from 'axios';
import { Edit, Wallet, X, Save, RefreshCw } from 'lucide-react';
import './ProfileTab.css';

const ProfileTab = () => {
  const { userData: contextUserData } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [walletAmount, setWalletAmount] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to fetch user data
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
      alert('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [contextUserData]);

  // Handle edit profile
  const handleEditProfile = () => {
    setEditForm({
      username: userData.username || '',
      email: userData.email || '',
      password: ''
    });
    setShowEditModal(true);
  };

  const handleUpdateProfile = async () => {
    if (!editForm.username || !editForm.email || !editForm.password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsUpdating(true);
      await axios.put(`http://localhost:8080/api/users/${userData.userId}`, {
        username: editForm.username,
        email: editForm.email,
        password: editForm.password
      });
      
      alert('Profile updated successfully!');
      setShowEditModal(false);
      fetchUserData(); // Refresh user data
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle add money to wallet
  const handleAddMoney = () => {
    setWalletAmount('');
    setShowWalletModal(true);
  };

  const handleAddMoneyToWallet = async () => {
    const amount = parseFloat(walletAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setIsUpdating(true);
      await axios.post(`http://localhost:8085/api/wallet/${userData.userId}/add`, {
        amount: amount
      });
      
      alert(`₹${amount} added to wallet successfully!`);
      setShowWalletModal(false);
      fetchUserData(); // Refresh user data
    } catch (error) {
      console.error('Error adding money to wallet:', error);
      alert('Failed to add money to wallet. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <p>No user data available. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="profile-title">Profile Information</h2>
        <div className="profile-actions">
          <button 
            className="btn-refresh" 
            onClick={fetchUserData}
            title="Refresh data"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn-edit" onClick={handleEditProfile}>
            <Edit size={16} />
            Edit Profile
          </button>
          <button className="btn-wallet" onClick={handleAddMoney}>
            <Wallet size={16} />
            Add Money
          </button>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-row">
          <span className="profile-label">Username:</span>
          <span className="profile-value">{userData.username}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{userData.email}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Role:</span>
          <span className="profile-value">{userData.role}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Wallet Balance:</span>
          <div className="profile-value wallet-balance">₹{userData.walletBalanace?.balance || 0}</div>
        </div>

        <div className="profile-row">
          <span className="profile-label">Account Created:</span>
          <span className="profile-value">
            {new Date(userData.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Account Status:</span>
          <span className={`profile-value ${userData.active ? 'active' : 'inactive'}`}>
            {userData.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  placeholder="Enter username"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={() => setShowEditModal(false)}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button 
                className="btn-save" 
                onClick={handleUpdateProfile}
                disabled={isUpdating}
              >
                <Save size={16} />
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showWalletModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Money to Wallet</h3>
              <button className="modal-close" onClick={() => setShowWalletModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Current Balance: ₹{userData.walletBalanace?.balance || 0}</label>
              </div>
              <div className="form-group">
                <label>Amount to Add:</label>
                <input
                  type="number"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={() => setShowWalletModal(false)}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button 
                className="btn-save" 
                onClick={handleAddMoneyToWallet}
                disabled={isUpdating}
              >
                <Wallet size={16} />
                {isUpdating ? 'Adding...' : 'Add Money'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .profile-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-edit, .btn-wallet, .btn-refresh {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .btn-edit {
          background-color: #3b82f6;
          color: white;
        }

        .btn-edit:hover {
          background-color: #2563eb;
        }

        .btn-wallet {
          background-color: #10b981;
          color: white;
        }

        .btn-wallet:hover {
          background-color: #059669;
        }

        .btn-refresh {
          background-color: #6b7280;
          color: white;
        }

        .btn-refresh:hover {
          background-color: #4b5563;
        }

        .wallet-balance {
          font-weight: bold;
          color: #10b981;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 0.5rem;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          color: #6b7280;
        }

        .modal-close:hover {
          background-color: #f3f4f6;
        }

        .modal-body {
          padding: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .form-group input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-cancel, .btn-save {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-cancel {
          background-color: #6b7280;
          color: white;
        }

        .btn-cancel:hover {
          background-color: #4b5563;
        }

        .btn-save {
          background-color: #3b82f6;
          color: white;
        }

        .btn-save:hover {
          background-color: #2563eb;
        }

        .btn-cancel:disabled, .btn-save:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfileTab;