import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { useSurvey } from '../../context/SurveyContext';

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const SurveyPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const { surveyData, updateSurveyData } = useSurvey();

  const steps = [
    { title: "Who is this gift for?", fields: ["relationship"] },
    { title: "What's the occasion?", fields: ["occasion"] },
    { title: "What are their interests?", fields: ["interests"] },
    { title: "What's their personality like?", fields: ["personality"] },
    { title: "What's your budget?", fields: ["budget"] },
    { title: "Any additional details?", fields: [] },
  ];

  const interests = [
    "Reading", "Cooking", "Sports", "Technology", "Art", "Music", "Travel", "Gaming",
    "Fitness", "Fashion", "Home Decor", "Gardening", "Other",
  ];

  const personalities = [
    "Creative", "Practical", "Adventurous", "Intellectual", "Social", "Relaxed",
    "Organized", "Energetic", "Thoughtful", "Humorous", "Other",
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Validation to check if all required fields are filled
  // If field is "Other", check corresponding "Other" text input is filled
  const isStepValid = () => {
    const requiredFields = steps[currentStep].fields;

    return requiredFields.every(field => {
      const value = surveyData[field];

      if (field === "interests" || field === "personality") {
        // For checkbox arrays, must have at least one selected
        if (!Array.isArray(value) || value.length === 0) return false;

        // If "Other" selected, check text input not empty
        if (value.includes("Other")) {
          const otherField = field + "Other";
          const otherValue = surveyData[otherField];
          return otherValue !== undefined && otherValue.trim() !== "";
        }
        return true;
      }

      // For radio fields
      if (value === "Other") {
        const otherField = field + "Other";
        const otherValue = surveyData[otherField];
        return otherValue !== undefined && otherValue.trim() !== "";
      }

      if (Array.isArray(value)) return value.length > 0;

      return value !== undefined && value !== "" && value !== null;
    });
  };

  const handleNext = () => {
    if (!isStepValid()) {
      alert("Please fill all required fields before proceeding.");
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final submit or navigate to recommendations
      console.log('Final Survey Data:', surveyData);
      navigate('/recommendations');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChange = (field, value) => {
    updateSurveyData({ [field]: value });
  };

  const handleCheckboxChange = (field, value, checked) => {
    const currentValues = surveyData[field] || [];
    if (checked) {
      updateSurveyData({ [field]: [...currentValues, value] });
    } else {
      updateSurveyData({ [field]: currentValues.filter(item => item !== value) });
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="survey-container">
      <div className="survey-card-wrapper">
        <div className="survey-card">
          <div className="card-header">
            <h2 className="card-title text-center">{steps[currentStep].title}</h2>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="card-content">
            {currentStep === 0 && (
              <div className="form-step">
                <div className="form-group">
                  <label className="form-label">What is your relationship with them?</label>
                  <div className="radio-group-grid">
                    {["Family", "Friend", "Partner", "Colleague", "Acquaintance", "Other"].map((rel) => (
                      <div key={rel} className="radio-item">
                        <input
                          type="radio"
                          id={`relationship-${rel}`}
                          name="relationship"
                          value={rel}
                          checked={surveyData.relationship === rel}
                          onChange={(e) => handleChange("relationship", e.target.value)}
                        />
                        <label htmlFor={`relationship-${rel}`}>{rel}</label>
                      </div>
                    ))}
                  </div>
                  {surveyData.relationship === "Other" && (
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Please specify"
                      value={surveyData.relationshipOther || ""}
                      onChange={(e) => handleChange("relationshipOther", e.target.value)}
                    />
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="age" className="form-label">How old are they?</label>
                  <input
                    id="age"
                    type="number"
                    className="form-input"
                    placeholder="Age"
                    value={surveyData.age || ""}
                    onChange={(e) => handleChange("age", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">What is their gender?</label>
                  <div className="radio-group-grid-3">
                    {["Male", "Female", "Non-binary", "Prefer not to say"].map((gender) => (
                      <div key={gender} className="radio-item">
                        <input
                          type="radio"
                          id={`gender-${gender}`}
                          name="gender"
                          value={gender}
                          checked={surveyData.gender === gender}
                          onChange={(e) => handleChange("gender", e.target.value)}
                        />
                        <label htmlFor={`gender-${gender}`}>{gender}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="form-step">
                <div className="form-group">
                  <label className="form-label">What's the occasion?</label>
                  <div className="radio-group-grid">
                    {[
                      "Birthday", "Mother's Day","Festival","Anniversary", "Holiday", "Graduation", "Wedding",
                      "Housewarming", "Just Because", "Other",
                    ].map((occasion) => (
                      <div key={occasion} className="radio-item">
                        <input
                          type="radio"
                          id={`occasion-${occasion}`}
                          name="occasion"
                          value={occasion}
                          checked={surveyData.occasion === occasion}
                          onChange={(e) => handleChange("occasion", e.target.value)}
                        />
                        <label htmlFor={`occasion-${occasion}`}>{occasion}</label>
                      </div>
                    ))}
                  </div>
                  {surveyData.occasion === "Other" && (
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Please specify"
                      value={surveyData.occasionOther || ""}
                      onChange={(e) => handleChange("occasionOther", e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <div className="form-group">
                  <label className="form-label">What are their interests? (Select all that apply)</label>
                  <div className="checkbox-group-grid">
                    {interests.map((interest) => (
                      <div key={interest} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`interest-${interest}`}
                          checked={surveyData.interests?.includes(interest) || false}
                          onChange={(e) => handleCheckboxChange("interests", interest, e.target.checked)}
                        />
                        <label htmlFor={`interest-${interest}`}>{interest}</label>
                      </div>
                    ))}
                  </div>
                  {surveyData.interests?.includes("Other") && (
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Please specify"
                      value={surveyData.interestsOther || ""}
                      onChange={(e) => handleChange("interestsOther", e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step">
                <div className="form-group">
                  <label className="form-label">How would you describe their personality? (Select all that apply)</label>
                  <div className="checkbox-group-grid">
                    {personalities.map((trait) => (
                      <div key={trait} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`personality-${trait}`}
                          checked={surveyData.personality?.includes(trait) || false}
                          onChange={(e) => handleCheckboxChange("personality", trait, e.target.checked)}
                        />
                        <label htmlFor={`personality-${trait}`}>{trait}</label>
                      </div>
                    ))}
                  </div>
                  {surveyData.personality?.includes("Other") && (
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Please specify"
                      value={surveyData.personalityOther || ""}
                      onChange={(e) => handleChange("personalityOther", e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="form-step">
                <div className="form-group">
                  <div className="budget-slider-header">
                    <label className="form-label">What's your budget?</label>
                    <span className="budget-display">
                      ₹{Math.round(surveyData.budget?.[0] || 500).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="500"
                    value={surveyData.budget?.[0] || 500}
                    onChange={(e) => handleChange("budget", [Number(e.target.value)])}
                    className="budget-slider"
                  />
                  <div className="budget-range-labels">
                    <span>₹1000</span>
                    <span>₹100000</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="form-step">
                <div className="form-group">
                  <label htmlFor="additionalInfo" className="form-label">Any additional details that might help?</label>
                  <textarea
                    id="additionalInfo"
                    className="form-textarea"
                    placeholder="E.g., favorite brands, colors, things they've mentioned wanting, etc."
                    value={surveyData.additionalInfo || ""}
                    onChange={(e) => handleChange("additionalInfo", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="card-footer">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="nav-button nav-button-ghost"
            >
              <ChevronLeft /> Back
            </button>
            <button
              onClick={handleNext}
              className="nav-button"
              disabled={!isStepValid()}
            >
              {currentStep === steps.length - 1 ? "Get Recommendations" : "Next"}
              {currentStep !== steps.length - 1 && <ChevronRight />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
