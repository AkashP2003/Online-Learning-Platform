import React, {useContext} from 'react';
import { BookOpen, Bell, User, LogOut } from 'lucide-react';
import './Header.css';
import { UserContext } from '../Context/UserContext'; 

const Header = ({ user, onLogout }) => {
  const { userData } = useContext(UserContext); 
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
     
          <div className="logo-section">
            <div className="logo-icon">
              <BookOpen className="icon-white" />
            </div>
            <h1 className="logo-text">LearnHub</h1>
          </div>

        
          <div className="user-section">
         
            <button className="notification-button" aria-label="Notifications">
              <Bell className="bell-icon" />
              <span className="notification-badge">3</span>
            </button>

            <div className="user-info">
              <div className="user-avatar">
                <User className="icon-white-sm" color='#fff' />
              </div>
              {userData && (
                <div className="user-details">
                  <div className="username">{userData?.username}</div>
                  {/* <div className="useremail">{userData?.email}</div> */}
                </div>
              )}
            </div>

            <button className="logout-button" onClick={onLogout} aria-label="Logout">
              <LogOut className="logout-icon" />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;