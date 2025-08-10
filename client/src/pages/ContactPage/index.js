import React, { useState } from "react";
import './index.css';

// Inline SVG Icons
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" /><path d="M12 21.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" /><path d="M12 21.75c-1.5 0-3.15-.375-4.5-1.125-1.5-.75-2.7-1.875-3.75-3.375-1.05-1.5-1.5-3.3-1.5-5.25 0-4.5 3-8.25 7.5-8.25S19.5 7.5 19.5 12c0 1.95-.45 3.75-1.5 5.25-1.05 1.5-2.25 2.625-3.75 3.375-1.35.75-3 1.125-4.5 1.125Z" />
  </svg>
);

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage(null);

    if (!name || !email || !subject || !message) {
      setSubmitMessage({ type: "error", text: "All fields are required" });
      setLoading(false);
      return;
    }

    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitMessage({ type: "success", text: "Your message has been sent! We'll get back to you soon." });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setSubmitMessage({ type: "error", text: "Failed to send message. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page-container">
      <main className="container contact-main-content">
        <div className="contact-header-section">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        <div className="contact-info-grid">
          <div className="info-card">
            <div className="info-card-content">
              <MailIcon className="info-icon" />
              <h3 className="info-title">Email</h3>
              <p className="info-text">support@aigiftmate.com</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-content">
              <PhoneIcon className="info-icon" />
              <h3 className="info-title">Phone</h3>
              <p className="info-text">(+1) 123-4567</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-content">
              <MapPinIcon className="info-icon" />
              <h3 className="info-title">Address</h3>
              <p className="info-text">Online Support Team</p>
            </div>
          </div>
        </div>

        <div className="message-form-card-wrapper">
          <div className="message-form-card">
            <div className="card-header">
              <h2 className="card-title">Send Us a Message</h2>
              <p className="card-description">Fill out the form below and we'll get back to you as soon as possible</p>
            </div>
            <div className="card-content">
              {submitMessage && (
                <div
                  className={`alert ${submitMessage.type === "error" ? "alert-error" : "alert-success"}`}
                  aria-live="polite"
                >
                  <p className="alert-description">{submitMessage.text}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What is this regarding?"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message here..."
                    className="form-textarea"
                    required
                  />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
