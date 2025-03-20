// API configuration
export const API_URL = "http://localhost:5000";

// Platform API endpoints
export const PLATFORM_ENDPOINTS = {
    facebook: {
        authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
        redirectUri: "https://localhost:5000/api/platforms/facebook/callback",
        scope: "ads_management,ads_read,business_management",
    },
    google: {
        authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        redirectUri: "https://localhost:5000/api/platforms/google/callback",
        scope: "https://www.googleapis.com/auth/adwords",
    },
    linkedin: {
        authUrl: "https://www.linkedin.com/oauth/v2/authorization",
        redirectUri: "https://localhost:5000/api/platforms/linkedin/callback",
        scope: "r_ads,r_ads_reporting,r_organization_social",
    },
    twitter: {
        authUrl: "https://twitter.com/i/oauth2/authorize",
        redirectUri: "https://localhost:5000/api/platforms/twitter/callback",
        scope: "tweet.read,users.read,ads:read,offline.access",
    },
    snapchat: {
        authUrl: "https://accounts.snapchat.com/login/oauth2/authorize",
        redirectUri: "https://localhost:5000/api/platforms/snapchat/callback",
        scope: "snapchat-marketing-api",
    },
    youtube: {
        authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        redirectUri: "https://localhost:5000/api/platforms/youtube/callback",
        scope: "https://www.googleapis.com/auth/youtube",
    },
    instagram: {
        authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
        redirectUri: "https://localhost:5000/api/platforms/instagram/callback",
        scope: "instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights",
    },
};
