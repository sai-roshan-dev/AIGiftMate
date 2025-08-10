import React from 'react';
import './index.css';

const AboutPage = () => {
  return (
    <div className="about-page-container">
      <main className="about-main-content">
        <div className="about-header-section">
          <h1 className="about-title">About Us</h1>
          <p className="about-subtitle">
            Welcome to the Gift Recommendation Platform! Our mission is to make gift-giving effortless and meaningful by leveraging advanced AI technology to provide personalized gift suggestions for every occasion.
          </p>
        </div>

        <section className="about-sections-wrapper">
          <div className="section-group">
            <h2 className="section-heading">Our Vision</h2>
            <div className="section-card">
              <p className="section-text">
                We believe that every gift should tell a story and create lasting memories. Our platform is designed to help you find the perfect gift that resonates with the recipient's personality, interests, and preferences.
              </p>
            </div>
          </div>

          <div className="section-group">
            <h2 className="section-heading">How It Works</h2>
            <div className="section-card">
              <p className="section-text">
                By combining user-provided survey data with cutting-edge AI models, we generate tailored gift recommendations that are thoughtful and unique. Whether it's a birthday, anniversary, or any special occasion, we've got you covered.
              </p>
            </div>
          </div>

          <div className="section-group">
            <h2 className="section-heading">Why Choose Us?</h2>
            <div className="section-card">
              <ul className="feature-list">
                <li>Personalized recommendations based on detailed survey data.</li>
                <li>Wide range of categories to suit every taste and budget.</li>
                <li>Easy-to-use interface for a seamless experience.</li>
                <li>Secure and reliable platform with user privacy in mind.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
