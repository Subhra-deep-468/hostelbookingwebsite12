import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './HostelDetailsPage.css';

const HostelDetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [message, setMessage] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchHostel();
  }, [id]);

  const fetchHostel = async () => {
    try {
      const response = await api.get(`/hostels/${id}`);
      setHostel(response.data.hostel);
      if (response.data.hostel.roomTypes.length > 0) {
        setSelectedRoomType(response.data.hostel.roomTypes[0].type);
      }
    } catch (err) {
      setError('Failed to load hostel details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to book a hostel');
      return;
    }

    if (user.role !== 'student') {
      alert('Only students can book hostels');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        hostelId: id,
        roomType: selectedRoomType,
        message,
      });

      setBookingSuccess(true);
      setSelectedRoomType('');
      setMessage('');

      setTimeout(() => {
        setBookingSuccess(false);
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading hostel details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!hostel) return <div className="error">Hostel not found</div>;

  const selectedRoom = hostel.roomTypes.find((r) => r.type === selectedRoomType);

  return (
    <div className="hostel-details-page">
      <div className="details-container">
        <div className="images-section">
          {hostel.images && hostel.images.length > 0 ? (
            <div className="main-image">
              <img src={hostel.images[0]} alt={hostel.name} />
            </div>
          ) : (
            <div className="no-image">No Images Available</div>
          )}
        </div>

        <div className="info-section">
          <h1>{hostel.name}</h1>
          <p className="location">📍 {hostel.location}</p>
          <div className="rating">
            <span>⭐ {hostel.rating || 'No ratings'}</span>
          </div>

          <div className="amenities">
            <h3>Amenities</h3>
            <div className="amenity-list">
              {hostel.amenities.map((amenity, idx) => (
                <span key={idx} className="amenity">
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="description">
            <h3>About</h3>
            <p>{hostel.description}</p>
          </div>

          <div className="owner-info">
            <h3>Owner Details</h3>
            <p>Name: {hostel.owner.name}</p>
            <p>Email: {hostel.owner.email}</p>
            <p>Phone: {hostel.owner.phone || 'N/A'}</p>
          </div>
        </div>

        <div className="booking-section">
          <div className="booking-card">
            <h3>Book Now</h3>

            {bookingSuccess && <div className="success-message">✓ Booking request sent successfully!</div>}

            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Room Type</label>
                <select value={selectedRoomType} onChange={(e) => setSelectedRoomType(e.target.value)}>
                  {hostel.roomTypes.map((room) => (
                    <option key={room.type} value={room.type}>
                      {room.type} - ₹{room.pricePerMonth}/month
                    </option>
                  ))}
                </select>
              </div>

              {selectedRoom && (
                <div className="room-info">
                  <p>Available: {selectedRoom.availableRooms} rooms</p>
                  <p className="price">₹{selectedRoom.pricePerMonth}/month</p>
                </div>
              )}

              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the owner something about yourself..."
                  rows="4"
                />
              </div>

              <button type="submit" className="btn-book" disabled={bookingLoading || !user}>
                {bookingLoading ? 'Processing...' : user ? 'Send Booking Request' : 'Login to Book'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetailsPage;
