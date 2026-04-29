import React, { useState } from 'react';
import api from '../utils/api';
import './PhotoUpload.css';

const PhotoUpload = ({ hostelId, onPhotoUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    try {
      const response = await api.post(`/hostels/${hostelId}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPreview(null);
      e.target.value = '';
      setError('');
      
      if (onPhotoUploadSuccess) {
        onPhotoUploadSuccess(response.data.hostel);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="photo-upload">
      <h4>Upload Hostel Photo</h4>
      {preview && (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      <div className="upload-input-wrapper">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            handleFileChange(e);
            handleUpload(e);
          }}
          disabled={uploading}
          id={`photo-input-${hostelId}`}
          style={{ display: 'none' }}
        />
        <label htmlFor={`photo-input-${hostelId}`} className="upload-label">
          {uploading ? 'Uploading...' : '📷 Click to upload photo'}
        </label>
      </div>
    </div>
  );
};

export default PhotoUpload;
