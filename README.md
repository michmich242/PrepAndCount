# Macro & Fitness Tracker with Meal Prepper

Welcome to the Macro & Fitness Tracker with Meal Prepper App! This is a full-stack application built with the MERN stack (MongoDB, Express, React Native, Node.js) and powered by Expo for seamless cross-platform functionality. It aims to simplify tracking your daily macros, fitness progress, and meal preparation, providing an all-in-one tool to help you achieve your health and fitness goals.

## Features

- **Macro Tracking:** Easily log and track your daily intake of macronutrients (proteins, carbs, fats) and calories.
- **Fitness Progress:** Monitor your fitness journey with weight tracking, workout logs, and goal setting.
- **Meal Prep Planning:** Plan and organize meals for the week, with recipe suggestions and calorie calculations.
- **Custom Goals:** Set personalized macro and fitness goals based on your individual needs.
- **Cross-Platform Support:** Built using Expo, the app works on both Android and iOS devices.

## Tech Stack

### Frontend
- **React Native**: Cross-platform mobile app development
- **Expo**: Framework and platform for universal React applications

### Backend
- **Node.js**: Backend runtime environment
- **Express**: Web application framework for APIs

### Database
- **MongoDB**: NoSQL database for storing user data and app content

### Additional Tools
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB
- **JWT**: JSON Web Tokens for user authentication
- **Redux**: State management for efficient app-wide data handling

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.template .env
   ```

4. Update the `.env` file with your MongoDB URI and JWT secret.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.template .env
   ```

4. Create config file:
   ```bash
   cp config/config.template.js config/config.js
   ```

5. Update the config files with your backend API URL.

## Running the Application

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm start
```

## Environment Variables

### Backend
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT token generation

### Frontend
- `API_URL`: Backend API URL (e.g., http://localhost:5000/api)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/macro-fitness-tracker.git

2. Install all dependencies:
   ```bash
   npm install

3. Run the application:
   ```bash
   npm start

**Disclaimer**: Android SDK or Xcode is needed for the phone to pop up
