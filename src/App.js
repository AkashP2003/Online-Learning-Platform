// App.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPages/Login';
import RegisterPage from './LoginPages/Register';
import Dashboard from './Dashboard/Dashboard';
import { UserContext } from './Context/UserContext';
import CourseDetailPage from './Pages/CourseDetailPage';
import PaymentPage from './Payment/PaymentPage'; 
import InstructorDashboard from './Instructor/Instructordashboard';
import AdminDashboard from './Admin/Admindashboard';
import './App.css';

function App() {
  const { userData, logout } = useContext(UserContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData ? (
            userData.role?.toLowerCase() === 'instructor' ? (
              <Navigate to="/instructordashboard" />
            ) : userData.role?.toLowerCase() === 'admin' ? (
              <Navigate to="/admindashboard" />
            ) : (
              <Navigate to="/dashboard" />
            )
          ) : (
            <LoginPage />
          )
        }
      />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          userData ? <Dashboard onLogout={logout} /> : <Navigate to="/" />
        }
      />

      <Route
        path="/admindashboard"
        element={
          userData?.role?.toLowerCase() === 'admin' ? (
            <AdminDashboard onLogout={logout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/instructordashboard"
        element={
          userData?.role?.toLowerCase() === 'instructor' ? (
            <InstructorDashboard onLogout={logout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/course/:id"
        element={
          userData ? <CourseDetailPage /> : <Navigate to="/" />
        }
      />

      <Route
        path="/payment/:courseId"
        element={
          userData ? <PaymentPage /> : <Navigate to="/" />
        }
      />
    </Routes>
  );
}

export default App;
