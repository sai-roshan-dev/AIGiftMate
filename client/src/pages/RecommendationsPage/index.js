import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [isLoadingSavedGifts, setIsLoadingSavedGifts] = useState(true);
  const [error, setError] = useState(null);
  const [savedGiftIds, setSavedGiftIds] = useState(new Set());
  const [savingGiftIds, setSavingGiftIds] = useState(new Set());

  const hasFetchedRecommendations = useRef(false);
  const savingInProgress = useRef(new Set());
  const firstRender = useRef(true);

  // Redirect to survey if no survey data
  useEffect(() => {
    if (!surveyData) {
      navigate('/survey');
    }
  }, [surveyData, navigate]);

  // Clear cache only when surveyData changes AFTER first render
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // Skip on initial mount
    }
    localStorage.removeItem('allRecommendations');
    hasFetchedRecommendations.current = false;
  }, [surveyData]);

  // Reset saving state on logout
  useEffect(() => {
    if (!isLoggedIn) {
      savingInProgress.current.clear();
      setSavingGiftIds(new Set());
      setSavedGiftIds(new Set());
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (hasFetchedRecommendations.current) return;

    hasFetchedRecommendations.current = true;

    const fetchRecommendations = async () => {
      setIsLoadingRecommendations(true);
      setError(null);

      // Try to load cached recommendations first
      const cached = localStorage.getItem('allRecommendations');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setAllRecommendations(parsed);
            setIsLoadingRecommendations(false);
            return;
          }
        } catch {
          // Ignore parse error and fetch fresh data
        }
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recommendations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ surveyData }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch recommendations');
        }

        const data = await res.json();
        setAllRecommendations(data.recommendations);
        localStorage.setItem('allRecommendations', JSON.stringify(data.recommendations));
      } catch (fetchErr) {
        console.error('Recommendation fetch error:', fetchErr);
        setError(fetchErr.message || 'Failed to fetch recommendations. Please try again.');
        addNotification(fetchErr.message || 'Error fetching recommendations.', 'error');
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    const fetchUserSavedGifts = async () => {
      if (!isLoggedIn || !token) {
        setIsLoadingSavedGifts(false);
        return;
      }
      setIsLoadingSavedGifts(true);
      try {
        const res = await fetch('http://localhost:5000/api/gifts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const ids = new Set(data.map(gift => gift._id || gift.id));
          setSavedGiftIds(ids);
        }
      } catch (err) {
        console.error('Error fetching user saved gifts:', err);
      } finally {
        setIsLoadingSavedGifts(false);
      }
    };

    // Fetch both in parallel
    fetchRecommendations();
    fetchUserSavedGifts();
  }, [surveyData, isLoggedIn, token, addNotification]);

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
        const res = await fetch('http://localhost:5000/api/gifts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(gift),
        });

        if (res.status === 401) {
          addNotification('Session expired. Please log in again.', 'error');
          navigate('/login');
          return;
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to save gift');
        }

        addNotification('Gift saved successfully!', 'success');
      } catch (err) {
        console.error('Gift save error:', err);
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

  const isLoading = isLoadingRecommendations || isLoadingSavedGifts;

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
                  isSaved={savedGiftIds.has(gift.id || gift._id)}
                  isSaving={savingGiftIds.has(gift.id || gift._id)}
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
