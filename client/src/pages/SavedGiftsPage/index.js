import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import GiftCard from '../../components/GiftCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SavedGiftsPage = () => {
  const navigate = useNavigate();
  const { token, isLoggedIn, logout } = useAuth();
  const { addNotification } = useNotification();
  const [savedGifts, setSavedGifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedGifts = async () => {
      if (!isLoggedIn || !token) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/gifts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch saved gifts');
        }

        const data = await response.json();

        const updatedGifts = data.map((gift) => ({
          ...gift,
          imageUrl: gift.imageUrl || '/placeholder-image.jpg',
        }));

        setSavedGifts(updatedGifts);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching saved gifts.');
        console.error('Error fetching saved gifts:', err);
        addNotification(err.message || 'Failed to load saved gifts.', 'error');
        if (err.message.toLowerCase().includes('authorized')) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedGifts();
  }, [isLoggedIn, token, addNotification, navigate, logout]);

  const handleDeleteGift = useCallback(
    async (giftId) => {
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/gifts/${giftId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete gift');
        }

        setSavedGifts((prevGifts) => prevGifts.filter((gift) => gift._id !== giftId));
        addNotification('Gift deleted successfully!', 'success');
      } catch (err) {
        addNotification(err.message || 'An error occurred while deleting the gift.', 'error');
        console.error('Error deleting gift:', err);
      }
    },
    [token, addNotification]
  );

  if (!isLoggedIn && !isLoading) {
    return <div className="saved-gifts-message">Please log in to view your saved gifts.</div>;
  }

  return (
    <div className="saved-gifts-page">
      <div className="container">
        <h2 className="saved-gifts-title">Your Saved Gift Ideas</h2>
        <p className="saved-gifts-subtitle">Here are the gift recommendations you've saved.</p>

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your saved gifts...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <div className="saved-gifts-grid">
            {savedGifts.length > 0 ? (
              savedGifts.map((gift) => (
                <GiftCard key={gift._id} gift={gift} onDelete={handleDeleteGift} />
              ))
            ) : (
              <div className="no-results">
                <p>You haven't saved any gifts yet.</p>
                <button onClick={() => navigate('/survey')} className="cta-button">
                  Find new gifts
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedGiftsPage;
