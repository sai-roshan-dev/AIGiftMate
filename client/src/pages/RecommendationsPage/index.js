import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { useSurvey } from '../../context/SurveyContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import GiftCard from '../../components/GiftCard';

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const { surveyData } = useSurvey();
  const { token, isLoggedIn } = useAuth();
  const { addNotification } = useNotification();

  const [allRecommendations, setAllRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedGiftIds, setSavedGiftIds] = useState(new Set());
  const [savingGiftIds, setSavingGiftIds] = useState(new Set());

  const hasFetchedRecommendations = useRef(false);
  const savingInProgress = useRef(new Set());

  // Redirect to survey if no survey data
  useEffect(() => {
    if (!surveyData) {
      navigate('/survey');
    }
  }, [surveyData, navigate]);

  useEffect(() => {
    if (hasFetchedRecommendations.current) return;

    // Try to load cached recommendations from localStorage
    const cached = localStorage.getItem('allRecommendations');
    if (cached) {
      setAllRecommendations(JSON.parse(cached));
      setIsLoading(false);
      hasFetchedRecommendations.current = true;
      return;
    }

    hasFetchedRecommendations.current = true;

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ surveyData }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch recommendations');
        }

        const data = await response.json();
        setAllRecommendations(data.recommendations);

        // Save to localStorage cache
        localStorage.setItem('allRecommendations', JSON.stringify(data.recommendations));
      } catch (err) {
        setError('Failed to fetch recommendations. Please try again.');
        addNotification(err.message || 'Error fetching recommendations.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserSavedGifts = async () => {
      if (!isLoggedIn || !token) return;
      try {
        const response = await fetch('http://localhost:5000/api/gifts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const ids = new Set(data.map(gift => gift._id || gift.id));
          setSavedGiftIds(ids);
        }
      } catch (err) {
        console.error('Error fetching user saved gifts:', err);
      }
    };

    fetchRecommendations();
    fetchUserSavedGifts();
  }, [surveyData, isLoggedIn, token, addNotification]);

  // Clear cache if surveyData changes (e.g., user retakes survey)
  useEffect(() => {
    localStorage.removeItem('allRecommendations');
    hasFetchedRecommendations.current = false;
  }, [surveyData]);

  const handleSaveGift = useCallback(
    async (gift) => {
      if (!isLoggedIn || !token) {
        navigate('/login');
        return;
      }

      const giftId = gift.id || gift._id;

      // Prevent duplicate saving
      if (savedGiftIds.has(giftId) || savingInProgress.current.has(giftId)) {
        addNotification('This gift is already saved or saving in progress.', 'info');
        return;
      }

      savingInProgress.current.add(giftId);
      setSavingGiftIds(new Set(savingInProgress.current));

      // Optimistically update savedGiftIds to prevent multiple saves
      let optimisticallySaved = false;
      setSavedGiftIds((prev) => {
        const updated = new Set(prev);
        if (!updated.has(giftId)) {
          updated.add(giftId);
          optimisticallySaved = true;
        }
        return updated;
      });

      try {
        const response = await fetch('http://localhost:5000/api/gifts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(gift),
        });

        if (response.status === 401) {
          addNotification('Session expired. Please log in again.', 'error');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save gift');
        }

        addNotification('Gift saved successfully!', 'success');
      } catch (err) {
        // Rollback optimistic save
        if (optimisticallySaved) {
          setSavedGiftIds((prev) => {
            const updated = new Set(prev);
            updated.delete(giftId);
            return updated;
          });
        }
        addNotification(err.message || 'Failed to save gift.', 'error');
      } finally {
        savingInProgress.current.delete(giftId);
        setSavingGiftIds(new Set(savingInProgress.current));
      }
    },
    [isLoggedIn, token, navigate, addNotification, savedGiftIds]
  );

  const savedGiftIdList = useMemo(() => new Set(savedGiftIds), [savedGiftIds]);
  const savingGiftIdList = useMemo(() => new Set(savingGiftIds), [savingGiftIds]);

  return (
    <div className="recommendations-page">
      <div className="container">
        <h2>Your Personalized Gift Ideas</h2>
        <p>Based on your survey responses, here are some suggestions:</p>

        {isLoading ? (
          <div className="loading">⏳ Loading your gifts...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="recommendations-grid">
            {allRecommendations.length > 0 ? (
              allRecommendations.map((gift) => (
                <GiftCard
                  key={gift.id || gift._id}
                  gift={gift}
                  onSave={handleSaveGift}
                  isSaved={savedGiftIdList.has(gift.id || gift._id)}
                  isSaving={savingGiftIdList.has(gift.id || gift._id)}
                  isUnmatched={!gift.isCatalogMatch}
                />
              ))
            ) : (
              <div className="no-results">
                <p>🎁 Hmm... we couldn’t find any gift matches.</p>
                <button onClick={() => navigate('/survey')}>Take Survey Again</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
