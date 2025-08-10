import { createContext, useContext, useState } from "react";

const defaultSurveyData = {
  relationship: "",
  age: "",
  gender: "",
  occasion: "",
  interests: [],
  personality: [],
  budget: [50],
  additionalInfo: "",
};

const SurveyContext = createContext(undefined);

export function SurveyProvider({ children }) {
  const [surveyData, setSurveyData] = useState(defaultSurveyData);

  const updateSurveyData = (data) => {
    setSurveyData((prev) => ({ ...prev, ...data }));
  };

  const resetSurveyData = () => {
    setSurveyData(defaultSurveyData);
  };

  const value = {
    surveyData,
    updateSurveyData,
    resetSurveyData,
  };

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error("useSurvey must be used within a SurveyProvider");
  }
  return context;
}
