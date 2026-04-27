import React from 'react';
import { Link } from 'react-router-dom';
import './HostelCard.css';

const HostelCard = ({ hostel }) => {
  return (
    <div className="hostel-card">
      <div className="hostel-image">
        {hostel.images && hostel.images.length > 0 ? (
          <img src={hostel.images[0]} alt={hostel.name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      <div className="hostel-info">
        <h3>{hostel.name}</h3>
        <p className="location">📍 {hostel.location}</p>
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
