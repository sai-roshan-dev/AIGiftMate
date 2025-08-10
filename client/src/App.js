import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SurveyPage from './pages/SurveyPage';
import RecommendationsPage from './pages/RecommendationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SavedGiftsPage from './pages/SavedGiftsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NavBar from './components/NavBar';
import NotificationContainer from './components/NotificationContainer';
import './App.css'; // Import global styles
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';  
import { SurveyProvider } from './context/SurveyContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import TrendingGifts from './pages/TrendingGifts.js';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <SurveyProvider>
          <div className="app-container">
            <NavBar /> {/* NavBar is now rendered globally without props */}
            <main className="main-content-wrapper">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/survey" element={<SurveyPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/saved-gifts" element={<SavedGiftsPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path='trending-gifts' element={<TrendingGifts />} />
                <Route path="/contact" element={<ContactPage />} /> 
                <Route path='*' element={<NotFoundPage />} />
              </Routes>
            </main>
            <NotificationContainer />
          </div>
        </SurveyProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
