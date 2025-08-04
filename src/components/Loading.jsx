import React from 'react';
import '../style/Loading.css';

const Loading = ({ show }) => {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <span>Loading...</span>
    </div>
  );
};

export default Loading;