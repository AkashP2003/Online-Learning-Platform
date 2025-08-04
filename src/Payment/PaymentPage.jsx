import React, { useEffect, useState, useContext } from 'react';
import './PaymentPage.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Context/UserContext';

export default function PaymentPage() {
  const { courseId } = useParams();
  const location = useLocation();
  const { userData, refreshUserData } = useContext(UserContext);
  const [course, setCourse] = useState(location.state?.course || null);
  const [selectedMethod, setSelectedMethod] = useState('CREDIT');
  const [offers, setOffers] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [status] = useState('SUCCESS');
  const [loading, setLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setOffersLoading(true);
       if (!courseId) {
      console.error('Course ID is undefined');
      return;
    }

    const courseResponse = await axios.get(`http://localhost:8081/api/course/${courseId}`);
        setCourse(courseResponse.data);
        console.log("Course data:", courseResponse.data);
        const offersResponse = await axios.get('http://localhost:8086/api/offers/active');
        console.log("Offers from API:", offersResponse.data);
        if (Array.isArray(offersResponse.data)) {
          setOffers(offersResponse.data);
        } else if (offersResponse.data.data && Array.isArray(offersResponse.data.data)) {
          setOffers(offersResponse.data.data);
        } else if (offersResponse.data.offers && Array.isArray(offersResponse.data.offers)) {
          setOffers(offersResponse.data.offers);
        } else {
          console.warn("Unexpected offers response structure:", offersResponse.data);
          setOffers([]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      } finally {
        setLoading(false);
        setOffersLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleOfferSelect = (code) => {
    setSelectedCoupon(selectedCoupon === code ? '' : code);
  };

  const calculateDiscountedPrice = () => {
    if (!selectedCoupon || !course) return course.price;
    
    const selectedOffer = offers.find(offer => offer.code === selectedCoupon);
    if (selectedOffer) {
      const discount = (course.price * selectedOffer.discountPercentage) / 100;
      return course.price - discount;
    }
    return course.price;
  };

  const handlePayment = async () => {
    if (!userData || !course) return;

    const finalAmount = calculateDiscountedPrice();
    
    const payload = {
      userId: userData.userId,
      courseId: course.courseId,
      amount: finalAmount,
      status,
      paymentGateway: selectedMethod,
      couponCode: selectedCoupon
    };

    try {
      if (selectedMethod === 'CREDIT') {
        await axios.post('http://localhost:8083/api/payment/', payload);
      } else if (selectedMethod === 'WALLET') {
        await axios.post(`http://localhost:8085/api/wallet/${userData.userId}/pay`, {
          courseId: course.courseId,
          amount: finalAmount
        });
      }
      await refreshUserData();
      alert("Payment successful!");
      navigate('/dashboard');
    } catch (err) {
      console.error('Payment error:', err);
      alert("Payment failed. Please try again.");
    }
  };

  if (!course || loading) {
    return <div className="payment-loading">Loading course info...</div>;
  }

  const originalPrice = course.price;
  const discountedPrice = calculateDiscountedPrice();
  const savings = originalPrice - discountedPrice;

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2>Payment for {course.title}</h2>
        <div className="price-section">
          <div className="price-info">
            <span className={`original-price ${savings > 0 ? 'strikethrough' : ''}`}>
              ₹{originalPrice}
            </span>
            {savings > 0 && (
              <>
                <span className="discounted-price">₹{discountedPrice.toFixed(2)}</span>
                <span className="savings">You save ₹{savings.toFixed(2)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="offers-section">
        <h3>Available Offers</h3>
        <div className="offers-container">
          {offersLoading ? (
            <div className="offers-loading">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="no-offers">
              <p>No active offers available at the moment.</p>
            </div>
          ) : (
            <div className="offers-list">
              {offers.map((offer) => (
                <div
                  key={offer.id || offer.code}
                  className={`offer-card ${selectedCoupon === offer.code ? 'selected' : ''}`}
                  onClick={() => handleOfferSelect(offer.code)}
                >
                  <div className="offer-header">
                    <h4 className="offer-code">{offer.code}</h4>
                    <div className="discount-badge">
                      {offer.discountPercentage}% OFF
                    </div>
                  </div>
                  <p className="offer-description">
                    {offer.description || `Get ${offer.discountPercentage}% off on your purchase`}
                  </p>
                  <small className="offer-expiry">
                    Valid until: {new Date(offer.expiryDate).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="payment-methods-section">
        <h3>Choose Payment Method</h3>
        <div className="payment-methods">
          <label className={`payment-method ${selectedMethod === 'CREDIT' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="method"
              value="CREDIT"
              checked={selectedMethod === 'CREDIT'}
              onChange={() => setSelectedMethod('CREDIT')}
            />
            <span className="payment-method-text">Credit Card</span>
          </label>
          <label className={`payment-method ${selectedMethod === 'WALLET' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="method"
              value="WALLET"
              checked={selectedMethod === 'WALLET'}
              onChange={() => setSelectedMethod('WALLET')}
            />
            <span className="payment-method-text">Wallet</span>
          </label>
        </div>
      </div>

      <div className="payment-summary">
        <div className="summary-row">
          <span>Course Price:</span>
          <span>₹{originalPrice}</span>
        </div>
        {selectedCoupon && (
          <>
            <div className="summary-row discount">
              <span>Discount ({selectedCoupon}):</span>
              <span>-₹{savings.toFixed(2)}</span>
            </div>
            <hr className="summary-divider" />
          </>
        )}
        <div className="summary-row total">
          <span>Total Amount:</span>
          <span>₹{discountedPrice.toFixed(2)}</span>
        </div>
      </div>

      <button className="pay-button" onClick={handlePayment}>
        Pay ₹{discountedPrice.toFixed(2)} Now
      </button>
    </div>
  );
}