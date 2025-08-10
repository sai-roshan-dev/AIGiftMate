import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, token, isLoggedIn, logout } = useAuth();
  const { addNotification } = useNotification();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoggedIn || !token) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching profile data.');
        console.error('Error fetching profile:', err);
        addNotification(err.message || 'Failed to load profile.', 'error');

        if (
          err.message.toLowerCase().includes('unauthorized') ||
          err.message.toLowerCase().includes('token')
        ) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isLoggedIn, token, addNotification, logout, navigate]);

  if (!isLoggedIn && !isLoading) {
    return <div className="profile-message">Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h2 className="profile-title">User Profile</h2>
        <p className="profile-subtitle">View and manage your account details.</p>

        {isLoading ? (
          <div className="loading-state" aria-live="polite">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        ) : error ? (
          <div className="error-message" aria-live="polite">
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="back-button">Go to Home</button>
          </div>
        ) : profileData ? (
          <div className="profile-details-card">
            <div className="profile-detail-item">
              <span className="profile-label">Username:</span>
              <span className="profile-value">{profileData.username}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-label">Email:</span>
              <span className="profile-value">{profileData.email}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-label">Role:</span>
              <span className="profile-value">{profileData.role}</span>
            </div>
            <div className="profile-detail-item">
              <span className="profile-label">Member Since:</span>
              <span className="profile-value">
                {new Date(profileData.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        ) : (
          <div className="no-profile-data">
            <p>No profile data available.</p>
            <button onClick={() => navigate('/')} className="back-button">Go to Home</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
