# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# AIGiftMate: Your AI-Powered Gift Recommendation Platform

AIGiftMate is a full-stack web application designed to take the stress out of gift-giving. Using the power of Google's Gemini AI, the platform provides personalized, thoughtful gift recommendations based on a user-friendly survey about the recipient.

Find the perfect gift effortlessly with AIGiftMate. Our platform ensures every visitor leaves with personalized gift solutions tailored to their recipient’s preferences. Explore trending gifts curated for inspiration, and benefit from our rich product database that powers AI-driven, survey-based recommendations — making gift-giving simple, thoughtful, and stress-free.

The project is built on the **MERN (MongoDB, Express, React, Node.js)** stack, demonstrating a robust, modular, and scalable architecture.

---

## Live Demo

Check out the live application here:  
[https://aigiftmate.vercel.app](https://aigiftmate.vercel.app)

## Repository Link

Source code is available on GitHub:  
[https://github.com/sai-roshan-dev/AIGiftMate.git](https://github.com/sai-roshan-dev/AIGiftMate.git)

---

## Key Features 🎁

- **Personalized AI Recommendations:** Utilizes the **Gemini AI** to generate unique gift ideas based on a recipient's interests, personality, and budget.
- **Full-Stack Architecture:** A clear separation of concerns between a React frontend and a Node.js/Express backend.
- **User Authentication:** Secure user registration and login system with **JSON Web Tokens (JWT)** and **MongoDB** for data persistence.
- **Product Catalog Integration:** Recommendations are enriched with real product details (images, prices) from a **MongoDB database** that is seeded with local mock data.
- **User Wishlist:** Logged-in users can save their favorite gift ideas to a personal wishlist, with the data stored securely in the database.
- **Admin Dashboard:** A protected admin route allows for viewing user and platform statistics.
- **Responsive & Intuitive UI:** The application is designed to be user-friendly and visually appealing on all devices.
- **Unsplash Image Integration:** Gift recommendations include beautiful product images fetched from the **Unsplash API** for enhanced user experience.
- **Trending Gifts Page:** Features a curated and dynamic carousel of popular gift ideas powered **react-splide** for a smooth browsing experience.
---

## Technologies Used 💻

**Frontend:**

- React — For building a dynamic and responsive user interface.
- React Router DOM — For client-side routing.
- HTML5 & CSS3 — For structuring and styling.
- React Splide  — For creating responsive, touch-friendly carousels/sliders on the Trending Gifts page.
- React Icons  — For using a wide range of customizable icons to enhance the user interface.

**Backend:**

- Node.js & Express — RESTful API backend.
- MongoDB & Mongoose — NoSQL database and ORM.
- Google Gemini API — AI engine for generating recommendations.
- Unsplash API — To fetch product images dynamically.

**Deployment:**

- Render — For backend and database hosting.
- Vercel — For frontend hosting.

---

## Server Startup

The server listens on the configured port (default 5000) and connects to MongoDB at startup. Middleware includes CORS setup to allow requests from your frontend domain.

Run the backend server with:

```bash
npm start
```

You should see a console message like:

```bash
Server is running on http://localhost:5000
```

---

## How to Run the Project Locally ⚙️

### 1. Clone the Repository

```bash
git clone https://github.com/sai-roshan-dev/AIGiftMate.git
cd AIGiftMate
```

### 2. Backend Setup

```bash
cd server
npm install
```

* Create a `.env` file in the `server` directory and add your environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=a_strong_secret_key
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
```

* Seed the database with product mock data (optional):

```bash
node scripts/seedProducts.js
```

* Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

Open a **new terminal** window:

```bash
cd ../client
npm install
npm start
```

Your React app will be running on [http://localhost:3000](http://localhost:3000).

---

## Deployment 🚀

* **Backend & Database:** Deploy on **Render**. Set environment variables in the Render dashboard.
* **Frontend:** Deploy on **Vercel**. Configure the backend API URL in your React environment variables.

---

Thank you for checking out **AIGiftMate**!  

Happy gifting! 🎁✨
