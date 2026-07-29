# AdVantage — Multi-Platform Campaign Management

[![Stars](https://img.shields.io/github/stars/chirag127/AdVantage-Campaign-Management-Multi-Platform-App?style=flat-square&logo=github)](https://github.com/chirag127/AdVantage-Campaign-Management-Multi-Platform-App/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](backend)
[![Expo](https://img.shields.io/badge/Expo-React%20Native-000020?style=flat-square&logo=expo)](frontend)

Unified SaaS platform for managing multi-channel ad campaigns (Google Ads, Meta, LinkedIn) with real-time analytics, lead tracking, and a cross-platform dashboard.

**Live:** https://AdVantage-Campaign-Management-Multi-Platform-App.oriz.in

## What it is

- **Backend** — Node.js + Express REST API with MongoDB (Mongoose), JWT auth via Passport (Google / Facebook / LinkedIn OAuth), scheduled jobs via `node-cron`.
- **Frontend** — Expo / React Native app that runs on iOS, Android, and web (React Native Web) with React Navigation, React Native Paper UI, and charts via `react-native-chart-kit`.

## Features

- Multi-platform campaign management (Google Ads, Meta, LinkedIn)
- Real-time analytics dashboard
- Lead tracking and capture
- OAuth login (Google, Facebook, LinkedIn) + JWT sessions
- Cross-platform: one codebase for web and native mobile

## Repository layout

```
backend/    Express API + MongoDB models, routes, controllers
frontend/   Expo React Native app (web + iOS + Android)
docs/       GitHub Pages landing site
```

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env   # set MONGODB_URI, JWT_SECRET, OAuth keys
npm run dev            # nodemon, or `npm start` for production
```

API serves at `http://localhost:5000` (see `server.js`). Routes: `/api/auth`, `/api/users`, `/api/campaigns`, `/api/platforms`, `/api/leads`, `/api/analytics`.

### Frontend

```bash
cd frontend
npm install
npm start              # Expo dev server
npm run web            # web
npm run android        # Android
npm run ios            # iOS
```

## Tech stack

| Layer    | Tech |
| :------- | :--- |
| API      | Express 4, Mongoose 7, Passport (JWT + OAuth), Helmet, node-cron |
| Mobile   | Expo 52, React Native 0.83, React Navigation 6, React Native Paper |
| Web      | React Native Web |
| Data     | MongoDB |

## License

MIT — see [LICENSE](LICENSE).
