import React from 'react';
import './index.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <img
        src="https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif"
        alt="Page Not Found"
        className="notfound-image"
      />
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
    </div>
  );
};

export default NotFoundPage;
