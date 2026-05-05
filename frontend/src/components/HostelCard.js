import React from 'react';
import { Link } from 'react-router-dom';
import './HostelCard.css';

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;

  const backendHost = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : 'http://localhost:5000';

  if (imagePath.startsWith('/')) {
    return `${backendHost}${imagePath}`;
  }

  return `${backendHost}/${imagePath}`;
};

const HostelCard = ({ hostel }) => {
  const imageUrl = hostel.images && hostel.images.length > 0 ? getImageUrl(hostel.images[0]) : null;

  return (
    <div className="hostel-card">
      <div className="hostel-image">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={hostel.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
            }}
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      <div className="hostel-info">
        <div className="hostel-title-row">
          <h3>{hostel.name}</h3>
          <div className="rating">
            <span className="icon">⭐</span>
            <span>{hostel.rating ? hostel.rating.toFixed(1) : '4.5'}</span>
          </div>
        </div>
        <p className="location">
          <span className="icon">📍</span>
          {hostel.location}
        </p>
        <p className="description">{hostel.description.substring(0, 100)}...</p>
        <div className="amenities">
          {hostel.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="amenity-tag">
              {amenity}
            </span>
          ))}
        </div>
        <div className="hostel-footer">
          <div className="price">₹{hostel.pricePerMonth}/month</div>
          <Link to={`/hostel/${hostel._id}`} className="btn-view">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
