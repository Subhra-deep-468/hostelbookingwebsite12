import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './OwnerDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPending = async () => {
    try {
      const response = await api.get('/hostels/admin/pending');
      setHostels(response.data.hostels || []);
    } catch (err) {
      setError('Failed to load pending hostels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (hostelId) => {
    try {
      await api.put(`/hostels/admin/${hostelId}/approve`);
      fetchPending();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (hostelId) => {
    if (!window.confirm('Reject this hostel? The owner will see it as rejected.')) return;
    try {
      await api.put(`/hostels/admin/${hostelId}/reject`);
      fetchPending();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    }
  };

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <h1>Admin — Hostel approvals</h1>
        <p>Welcome, {user?.name}. New listings appear here until you approve them for students.</p>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="tab-content">
          {hostels.length === 0 ? (
            <div className="no-data">No hostels waiting for approval</div>
          ) : (
            <div className="bookings-list">
              {hostels.map((hostel) => (
                <div key={hostel._id} className="request-card">
                  <div className="request-header">
                    <div>
                      <h3>{hostel.name}</h3>
                      <p className="student-info">
                        Owner: {hostel.owner?.name} ({hostel.owner?.email})
                        {hostel.owner?.phone ? ` · ${hostel.owner.phone}` : ''}
                      </p>
                    </div>
                    <span
                      className="status"
                      style={{
                        backgroundColor: '#f39c12',
                      }}
                    >
                      PENDING
                    </span>
                  </div>
                  <div className="request-details">
                    <p>
                      <strong>City:</strong> {hostel.city} · <strong>Area:</strong> {hostel.area || '—'}
                    </p>
                    <p>
                      <strong>Location:</strong> {hostel.location}
                    </p>
                    <p>
                      <strong>From:</strong> ₹{hostel.pricePerMonth}/month
                    </p>
                    <p>
                      <strong>Description:</strong> {hostel.description?.slice(0, 200)}
                      {hostel.description?.length > 200 ? '…' : ''}
                    </p>
                  </div>
                  <div className="request-actions">
                    <button type="button" className="btn-approve" onClick={() => handleApprove(hostel._id)}>
                      Approve for students
                    </button>
                    <button type="button" className="btn-reject" onClick={() => handleReject(hostel._id)}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
