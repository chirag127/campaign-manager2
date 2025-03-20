# Campaign Manager App

A comprehensive application for creating, managing, and tracking advertising campaigns across multiple platforms.

## Features

-   **Multi-Platform Campaign Management**: Create and manage campaigns across Facebook, Google, LinkedIn, Twitter, Snapchat, YouTube, and Instagram
-   **Centralized Dashboard**: View real-time performance metrics across all platforms
-   **Lead Management**: Track and manage leads generated from your campaigns
-   **Platform Integration**: Connect to multiple advertising platforms using their official APIs
-   **Performance Analytics**: Analyze campaign performance with detailed metrics and visualizations

## Tech Stack

### Frontend

-   React Native (Expo)
-   React Navigation
-   React Native Paper
-   Formik & Yup
-   Axios

### Backend

-   Express.js
-   MongoDB
-   Mongoose
-   JWT Authentication
-   Various Ad Platform APIs

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB
-   Expo CLI

### Installation

1. Clone the repository

```
git clone https://github.com/yourusername/campaign-manager.git
cd campaign-manager
```

2. Install backend dependencies

```
cd backend
npm install
```

3. Install frontend dependencies

```
cd ../frontend
npm install
```

4. Set up environment variables

    - Create a `.env` file in the backend directory based on the `.env.example` file
    - Add your MongoDB connection string and JWT secret
    - Add your API keys for the various advertising platforms

5. Start the backend server

```
cd backend
npm run dev
```

6. Start the frontend application

```
cd ../frontend
npm start
```

## API Integration

The app integrates with the following advertising platform APIs:

-   Facebook Marketing API
-   Google Ads API
-   LinkedIn Marketing API
-   Twitter Ads API
-   Snapchat Marketing API
-   YouTube Ads API
-   Instagram Graph API

Each platform requires specific authentication and setup. Refer to the respective platform's developer documentation for details on obtaining API keys and access tokens.

## Project Structure

```
campaign-manager/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── navigation/
│   │   ├── screens/
│   │   └── utils/
│   ├── App.js
│   ├── app.json
│   └── package.json
└── README.md
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
