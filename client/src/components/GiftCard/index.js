import React from 'react';
import './index.css';

const GiftCard = ({ gift, onSave, onDelete, isSaved, isSaving, isUnmatched }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerText = '🎁 Great gift, but no image preview!';
    e.target.parentNode.insertBefore(placeholder, e.target.nextSibling);
  };

  return (
    <div className={`gift-card ${isUnmatched ? 'unmatched-gift-card' : ''}`}>
      <h3 className="gift-card-name">{gift.name}</h3>
      <p className="gift-card-description">{gift.description}</p>
      <div className="gift-card-details">
        <span className="gift-card-price">₹{gift.price}</span>
        <span className="gift-card-category">{gift.category}</span>
      </div>

      {(gift.imageUrl || gift.image) ? (
        <img
          src={gift.imageUrl || gift.image}
          alt={gift.name}
          onError={handleImageError}
          className="gift-card-image"
        />
      ) : (
        <div className="image-placeholder">🎁 Surprise! No image here.</div>
      )}

      <p className="gift-card-reason">{gift.reason}</p>

      {/* Save Button */}
      {onSave && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isSaved && !isSaving) {
              onSave(gift);
            }
          }}
          disabled={isSaved || isSaving}
          className={`save-button ${isSaved ? 'saved' : ''}`}
        >
          {isSaved ? 'Saved' : isSaving ? 'Saving...' : 'Save Gift'}
        </button>
      )}

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(gift._id || gift.id);
          }}
          className="delete-button"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default GiftCard;
