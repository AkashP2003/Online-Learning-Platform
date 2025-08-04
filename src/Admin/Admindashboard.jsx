import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  GraduationCap, 
  Tag, 
  Bell, 
  Plus, 
  LogOut,
  BarChart3,
  Settings
} from 'lucide-react';

// Import services
import adminService from '../Services/adminService';

// Import components
import AdminModal from '../components/AdminModal';
import UserTable from '../components/UserTable';
import OfferCard from '../components/OfferCard';
import NotificationPanel from '../components/NotificationPanel';
import Loading from '../components/Loading';

// Import styles
import './AdminDashboard.css';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentData, setCurrentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstructors: 0,
    activeOffers: 0,
    totalOffers: 0
  });

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Update stats when data changes
  useEffect(() => {
    setStats({
      totalUsers: users.length,
      totalInstructors: instructors.length,
      activeOffers: offers.filter(offer => offer.active && !isExpired(offer.expiryDate)).length,
      totalOffers: offers.length
    });
  }, [users, instructors, offers]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [usersData, instructorsData, offersData] = await Promise.all([
        adminService.users.getAll(),
        adminService.instructors.getAll(),
        adminService.offers.getAll()
      ]);
      
      setUsers(usersData);
      setInstructors(instructorsData);
      setOffers(offersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  // Modal handlers
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
      setLoading(true);
      console.log('Submitting data:', { modalType, data, currentData });

      switch (modalType) {
        case 'user':
          if (currentData.id || currentData.userId) {
            await adminService.users.update(currentData.id || currentData.userId, data);
          }
          const updatedUsers = await adminService.users.getAll();
          setUsers(updatedUsers);
          break;

        case 'instructor':
          if (currentData.id || currentData.userId) {
            await adminService.instructors.update(currentData.id || currentData.userId, data);
          }
          const updatedInstructors = await adminService.instructors.getAll();
          setInstructors(updatedInstructors);
          break;

        case 'offer':
          if (currentData.id || currentData.offerId) {
            await adminService.offers.update(currentData.id || currentData.offerId, data);
          } else {
            await adminService.offers.create(data);
          }
          const updatedOffers = await adminService.offers.getAll();
          setOffers(updatedOffers);
          break;

        default:
          console.error('Unknown modal type:', modalType);
          throw new Error(`Unknown modal type: ${modalType}`);
      }
      closeModal();
    } catch (error) {
      console.error('Error in handleSubmitData:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // User handlers
  const handleEditUser = (user) => {
    openModal('user', user);
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await adminService.users.delete(userId);
      const updatedUsers = await adminService.users.getAll();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Error deleting user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Instructor handlers
  const handleEditInstructor = (instructor) => {
    openModal('instructor', instructor);
  };

  const handleDeleteInstructor = async (instructorId) => {
    setLoading(true);
    try {
      await adminService.instructors.delete(instructorId);
      const updatedInstructors = await adminService.instructors.getAll();
      setInstructors(updatedInstructors);
    } catch (error) {
      console.error('Error deleting instructor:', error);
      alert(`Error deleting instructor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Offer handlers
  const handleEditOffer = (offer) => {
    openModal('offer', offer);
  };

  const handleDeleteOffer = async (offerId) => {
    setLoading(true);
    try {
      await adminService.offers.delete(offerId);
      const updatedOffers = await adminService.offers.getAll();
      setOffers(updatedOffers);
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert(`Error deleting offer: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOfferActive = async (offerId, isActive) => {
    setLoading(true);
    try {
      await adminService.offers.toggleActive(offerId, isActive);
      const updatedOffers = await adminService.offers.getAll();
      setOffers(updatedOffers);
    } catch (error) {
      console.error('Error toggling offer status:', error);
      alert(`Error updating offer status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Notification handler
  const handleSendNotification = async () => {
    try {
      const result = await adminService.notifications.sendOfferEmails();
      alert('Notification emails sent successfully!');
      return result;
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <UserTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        );

      case 'instructors':
        return (
          <UserTable
            users={instructors}
            onEdit={handleEditInstructor}
            onDelete={handleDeleteInstructor}
          />
        );

      case 'offers':
        return (
          <div className="offers-section">
            <div className="section-header">
              <h3>Offers Management</h3>
              <button
                onClick={() => openModal('offer')}
                className="admin-btn-primary"
              >
                <Plus size={20} />
                Add New Offer
              </button>
            </div>
            
            <div className="offers-grid">
              {offers.length === 0 ? (
                <div className="no-offers">
                  <Tag size={48} />
                  <p>No offers found</p>
                  <button
                    onClick={() => openModal('offer')}
                    className="admin-btn-primary"
                  >
                    Create First Offer
                  </button>
                </div>
              ) : (
                offers.map((offer) => (
                  <OfferCard
                    key={offer.id || offer.offerId}
                    offer={offer}
                    onEdit={handleEditOffer}
                    onDelete={handleDeleteOffer}
                    onToggleActive={handleToggleOfferActive}
                  />
                ))
              )}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <NotificationPanel onSendNotification={handleSendNotification} />
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <header className="admin-dashboard-header">
        <div className="admin-header-content">
          <div className="admin-header-flex">
            <div className="admin-header-info">
              <h1 className="admin-header-title">Admin Dashboard</h1>
              <p className="admin-header-subtitle">Manage users, instructors, offers, and notifications</p>
            </div>
            <div className="admin-header-actions">
              <div className="admin-user-info">
                <span>Welcome, {user?.username|| 'Admin'}</span>
              </div>
              <button className="admin-logout-button" onClick={onLogout} aria-label="Logout">
                <LogOut className="admin-logout-icon" />
                <span className="admin-logout-text">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="admin-stats-section">
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon users">
              <Users size={30} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="stat-icon instructors">
              <GraduationCap size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalInstructors}</h3>
              <p>Instructors</p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="stat-icon offers">
              <Tag size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.activeOffers}</h3>
              <p>Active Offers</p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="stat-icon total-offers">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalOffers}</h3>
              <p>Total Offers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-main-content">
        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <nav className="admin-nav-flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`admin-nav-tab ${activeTab === 'users' ? 'active' : ''}`}
            >
              <Users size={25} />
              Users
            </button>
            <button
              onClick={() => setActiveTab('instructors')}
              className={`admin-nav-tab ${activeTab === 'instructors' ? 'active' : ''}`}
            >
              <GraduationCap size={25} />
              Instructors
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`admin-nav-tab ${activeTab === 'offers' ? 'active' : ''}`}
            >
              <Tag size={25} />
              Offers
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`admin-nav-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            >
              <Bell size={25} />
              Notifications
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="admin-tab-content">
          {renderTabContent()}
        </div>
      </div>

      {/* Modal */}
      <AdminModal
        show={showModal}
        modalType={modalType}
        currentData={currentData}
        onClose={closeModal}
        onSubmit={handleSubmitData}
      />

      {/* Loading Overlay */}
      <Loading show={loading} />
    </div>
  );
};

export default AdminDashboard;