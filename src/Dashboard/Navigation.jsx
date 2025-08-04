import React from 'react';
import { BookOpen, Play, User, CreditCard } from 'lucide-react';
import './Navigation.css';

const Navigation = ({ activeNav, setActiveNav }) => {
  const navItems = [
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'mycourses', label: 'My Courses', icon: Play },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <nav className="navigation">
      <div className="navigation-container">
        <div className="navigation-items">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`nav-button ${activeNav === id ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;