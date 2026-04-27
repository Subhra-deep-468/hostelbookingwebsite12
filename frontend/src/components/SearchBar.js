import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(location);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by city or area..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
