import React from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight, Percent, Calendar, Tag } from 'lucide-react';
import '../style/OfferCard.css';

const OfferCard = ({ offer, onEdit, onDelete, onToggleActive }) => {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete offer "${offer.code}"?`)) {
      await onDelete(offer.id || offer.offerId);
    }
  };

  const handleToggleActive = async () => {
    await onToggleActive(offer.id || offer.offerId, !offer.active);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const getStatusClass = () => {
    if (isExpired(offer.expiryDate)) return 'expired';
    return offer.active ? 'active' : 'inactive';
  };

  return (
    <div className={`offer-card ${getStatusClass()}`}>
      <div className="offer-card-header">
        <div className="offer-code">
          <Tag size={18} />
          <span>{offer.code}</span>
        </div>
        <div className="offer-actions">
          <button
            onClick={handleToggleActive}
            className={`toggle-btn ${offer.active ? 'active' : 'inactive'}`}
            title={offer.active ? 'Deactivate Offer' : 'Activate Offer'}
            disabled={isExpired(offer.expiryDate)}
          >
            {offer.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
          <button
            onClick={() => onEdit(offer)}
            className="action-btn edit-btn"
            title="Edit Offer"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="action-btn delete-btn"
            title="Delete Offer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="offer-card-body">
        <div className="discount-section">
          <div className="discount-value">
            {/* <Percent size={20} /> */}
            <span className="discount-text">{offer.discountPercentage}% OFF</span>
          </div>
        </div>

        <div className="offer-details">
          <div className="detail-item">
            <Calendar size={16} />
            <span>Expires: {formatDate(offer.expiryDate)}</span>
          </div>
          
          <div className={`status-indicator ${getStatusClass()}`}>
            {isExpired(offer.expiryDate) 
              ? 'Expired' 
              : offer.active 
                ? 'Active' 
                : 'Inactive'
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;