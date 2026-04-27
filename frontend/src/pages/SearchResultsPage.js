import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import HostelCard from '../components/HostelCard';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter state
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [roomType, setRoomType] = useState('');
  const [amenity, setAmenity] = useState('');
  const [sort, setSort] = useState('');

  const location = searchParams.get('location') || '';

  useEffect(() => {
    fetchHostels();
  }, [location, minPrice, maxPrice, roomType, amenity, sort]);

  const fetchHostels = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        city: location,
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(roomType && { roomType }),
        ...(amenity && { amenity }),
        ...(sort && { sort }),
      };

      const response = await api.get('/hostels', { params });
      setHostels(response.data.hostels);
    } catch (err) {
      setError('Failed to fetch hostels. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-results-page">
      <div className="search-container">
        <div className="filters-sidebar">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Room Type</label>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
              <option value="">All Types</option>
              <option value="Single Bed">Single Bed</option>
              <option value="Double Bed">Double Bed</option>
              <option value="Triple Sharing">Triple Sharing</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Amenities</label>
            <select value={amenity} onChange={(e) => setAmenity(e.target.value)}>
              <option value="">All Amenities</option>
              <option value="WiFi">WiFi</option>
              <option value="Food">Food</option>
              <option value="AC">AC</option>
              <option value="Parking">Parking</option>
              <option value="Laundry">Laundry</option>
              <option value="Hot Water">Hot Water</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Newest</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="results-section">
          <h2>Results for "{location}"</h2>
          {loading && <div className="loading">Loading hostels...</div>}
          {error && <div className="error">{error}</div>}
          {!loading && hostels.length === 0 && <div className="no-results">No hostels found</div>}
          <div className="hostels-grid">
            {hostels.map((hostel) => (
              <HostelCard key={hostel._id} hostel={hostel} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
