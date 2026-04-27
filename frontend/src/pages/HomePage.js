import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (location) => {
    if (location.trim()) {
      navigate(`/search?location=${encodeURIComponent(location)}`);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Student Hostel</h1>
          <p>Browse, compare, and book the best hostels for your needs</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <section className="features-section">
        <div className="feature">
          <div className="feature-icon">🔍</div>
          <h3>Easy Search</h3>
          <p>Search hostels by location, price, and amenities</p>
        </div>
        <div className="feature">
          <div className="feature-icon">⭐</div>
          <h3>Verified Hostels</h3>
          <p>Only verified hostel owners on our platform</p>
        </div>
        <div className="feature">
          <div className="feature-icon">💰</div>
          <h3>Best Prices</h3>
          <p>Compare prices and get the best deals</p>
        </div>
        <div className="feature">
          <div className="feature-icon">📱</div>
          <h3>Easy Booking</h3>
          <p>Book your hostel in just a few clicks</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
