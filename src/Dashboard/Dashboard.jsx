import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import CoursesTab from '../tabs/CoursesTab';
import MyCoursesTab from '../tabs/MyCoursesTab';
import ProfileTab from '../tabs/ProfileTab';
import PaymentTab from '../tabs/PaymentTab'
import './Dashboard.css';


const Dashboard = ({ user, onLogout }) => {
  const [activeNav, setActiveNav] = useState('courses');

  const renderActiveTab = () => {
    switch (activeNav) {
      case 'courses':
        return <CoursesTab />;
      case 'mycourses':
        return <MyCoursesTab user={user} />;
      case 'profile':
        return <ProfileTab user={user} />;
      case 'payments':
        return <PaymentTab user={user} />;
      default:
        return <CoursesTab />;
    }
  };

  return (
    <div className="dashboard-container">
      <Header user={user} onLogout={onLogout} />
      <Navigation activeNav={activeNav} setActiveNav={setActiveNav} />
      
      <main className="dashboard-main">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default Dashboard;
