import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import './index.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <main className="homepage-container" role="main">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="container text-center">
          <h1 id="hero-title" className="hero-title">Find the Perfect Gift</h1>
          <p className="hero-subtitle">
            Our AI-powered platform helps you discover thoughtful, personalized gift ideas for any occasion.
          </p>
          <button 
            onClick={() => navigate('/survey')} 
            className="cta-button cta-button--large"
            aria-label="Start gift finder survey"
          >
            Start Gift Finder
          </button>
        </div>
      </section>

      <section 
        className="how-it-works-section" 
        aria-labelledby="how-it-works-title"
      >
        <div className="container">
          <h2 id="how-it-works-title" className="section-title">How It Works</h2>
          <div className="grid-3-col">
            {[{
              step: '1',
              title: 'Tell Us About Them',
              desc: "Answer a few questions about the recipient's personality, interests, and the occasion."
            }, {
              step: '2',
              title: 'Get AI Recommendations',
              desc: 'Our AI analyzes your responses to generate personalized gift suggestions.'
            }, {
              step: '3',
              title: 'Find the Perfect Gift',
              desc: 'Browse, filter, and refine recommendations until you find the perfect gift.'
            }].map(({step, title, desc}) => (
              <article key={step} className="card" aria-label={`Step ${step}: ${title}`}>
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="step-number">{step}</span>
                    <span className="step-title">{title}</span>
                  </h3>
                </div>
                <div className="card-content">
                  <p>{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section 
        className="featured-categories-section" 
        aria-labelledby="featured-categories-title"
      >
        <div className="container">
          <h2 id="featured-categories-title" className="section-title">Featured Categories</h2>
          <div className="grid-4-col">
            {["Tech Lovers", "Foodies", "Outdoor Enthusiasts", "Book Worms"].map((category) => (
              <div key={category} className="category-card" role="region" aria-label={`Category: ${category}`}>
                <div className="category-card-content">
                  <h3 className="category-title">{category}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        className="cta-banner-section" 
        aria-labelledby="cta-banner-title"
      >
        <div className="container">
          <div className="cta-banner">
            <h2 id="cta-banner-title" className="cta-banner-title">Ready to find the perfect gift?</h2>
            <p className="cta-banner-text">
              Take our quick survey and get personalized recommendations in minutes.
            </p>
            <button 
              onClick={() => navigate('/survey')} 
              className="cta-button"
              aria-label="Start the gift finder survey"
            >
              Start Now
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default HomePage;
