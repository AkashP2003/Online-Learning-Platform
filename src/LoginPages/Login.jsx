import React, { useState, useContext } from 'react';
import { UserContext, useUser } from '../Context/UserContext';
import './Login.css'; // import custom CSS
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useUser();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
     
      const res = await fetch('http://192.168.1.29:8080/api/users/');
      const users = await res.json();

      const matchedUser = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (!matchedUser) {
        setError('Invalid email or password');
        return;
      }

      const fullUserRes = await fetch(`http://localhost:8080/api/users/${matchedUser.userId}`);
      const fullUserData = await fullUserRes.json();

      login(fullUserData);

    } catch (err) {
      setError('Server error. Try again.');
    }
  };


  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="logo-box">
            <span className="logo-text">📘</span>
          </div>
          <h1 className="title">LearnHub</h1>
          <p className="subtitle">Sign in to continue learning</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
         {error && <p className="error">{error}</p>}
          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>

        <div className="register-link">
          <p>
            Don't have an account?{' '}
            <button type="button" onClick={() => navigate('/register')}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
