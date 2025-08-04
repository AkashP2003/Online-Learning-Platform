import React, { useEffect, useState, useContext } from 'react';
import './PaymentTab.css';
import axios from 'axios';
import { UserContext } from '../Context/UserContext'; // Import UserContext directly
import { RefreshCw } from 'lucide-react';

const PaymentTab = () => {
  const { userData: contextUserData } = useContext(UserContext); // Get userData from context
  const [userData, setUserData] = useState(null); // Local state for user data
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [course, setCourse] = useState({});

  // Function to fetch user data (same as in CoursesTab.jsx)
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [contextUserData]);

  useEffect(() => {
    console.log('PaymentTab: userData updated:', userData);
    if (userData?.payments) {
      setPayments(userData.payments);
    } else {
      setPayments([]);
    }
  }, [userData]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (payments.length === 0) {
        setCourse({});
        return;
      }

      const uniqueCourseIds = [...new Set(payments.map(p => p.courseId))];

      const courseRequests = uniqueCourseIds.map(id =>
        axios.get(`http://localhost:8081/api/course/${id}`)
          .then(res => ({ id, title: res.data.title }))
          .catch(() => ({ id, title: 'Unknown Course' }))
      );

      try {
        const courseResults = await Promise.all(courseRequests);

        const map = {};
        courseResults.forEach(({ id, title }) => {
          map[id] = title;
        });

        setCourse(map);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [payments]);

  const handleRefresh = async () => {
    await fetchUserData();
  };

  return (
    <div className="payment-tab-container">
      <div className="payment-header">
        <h2 className="payment-tab-title">Payment History</h2>
        <button 
          className="refresh-btn" 
          onClick={handleRefresh} 
          title="Refresh data"
          style={{
            background: 'none',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px'
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading || !userData ? (
        <div className="loading-container">
          <p>Loading payment data...</p>
        </div>
      ) : payments.length === 0 ? (
        <p className="no-payments">No payments found.</p>
      ) : (
        <div className="payment-table-container">
          <table className="payment-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Payment Gateway</th>
                <th>Date</th>
                <th>Course Name</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={`${payment.id || index}-${payment.createdAt}`}>
                  <td>{index + 1}</td>
                  <td>₹{payment.amount}</td>
                  <td className={payment.status === 'SUCCESS' ? 'success' : 'failed'}>
                    {payment.status}
                  </td>
                  <td>{payment.paymentGateway}</td>
                  <td>{new Date(payment.createdAt).toLocaleString()}</td>
                  <td>{course?.[payment.courseId] || 'Loading...'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentTab;