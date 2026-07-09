# Deployment Guide

## Overview

EscapeHer uses a split deployment:
- **Frontend (Next.js)** → Vercel
- **Backend (Express.js)** → Render
- **Database** → MongoDB Atlas
- **File Storage / Push Notifications** → Firebase

---

## Prerequisites

1. **Accounts Required:**
   - [Vercel](https://vercel.com) account
   - [Render](https://render.com) account
   - [MongoDB Atlas](https://www.mongodb.com/atlas) account
   - [Firebase](https://console.firebase.google.com) project
   - [Google AI Studio](https://aistudio.google.com) for Gemini API key

2. **Tools Required:**
   - Node.js >= 18
   - npm >= 9
   - Git
   - Vercel CLI (`npm i -g vercel`)

---

## Step 1: MongoDB Atlas Setup

1. Create a new cluster (M0 free tier is sufficient for development).
2. Create a database user with read/write access.
3. Whitelist `0.0.0.0/0` for Render (or use Render's static IPs).
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/escapeher?retryWrites=true&w=majority
   ```

---

## Step 2: Firebase Setup

1. Create a new Firebase project.
2. Enable **Authentication** (Email/Password provider).
3. Enable **Cloud Storage** for evidence uploads.
4. Enable **Cloud Messaging** for push notifications.
5. Generate a service account key (Project Settings → Service accounts → Generate new private key).
6. Copy the web app config for the client.

---

## Step 3: Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey).
2. Create a new API key.
3. Note the key for the server environment variables.

---

## Step 4: Backend Deployment (Render)

### Environment Variables

Set these in Render's dashboard:

| Variable | Description |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random 64-char secret |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | Vercel frontend URL |
| `CORS_ORIGINS` | Additional allowed origins |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | `gemini-2.0-flash` |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON (base64 encoded) |

### Render Configuration

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Runtime:** Node 18+

---

## Step 5: Frontend Deployment (Vercel)

### Environment Variables

Set these in Vercel's dashboard:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Render backend URL + `/api` |
| `NEXT_PUBLIC_SOCKET_URL` | Render backend URL |
| `NEXT_PUBLIC_APP_URL` | Vercel frontend URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | FCM VAPID key |

### Vercel Configuration

1. Import the project from GitHub.
2. Set:
   - **Root Directory:** `client`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

---

## Step 6: Post-Deployment Verification

1. ✅ Frontend loads at the Vercel URL.
2. ✅ API health check at `<render-url>/api/health` returns `200`.
3. ✅ Login/signup flow works end-to-end.
4. ✅ Socket.IO connection establishes (check browser DevTools).
5. ✅ Emergency trigger flow works.
6. ✅ AI analysis returns results.
7. ✅ Push notifications are received (if FCM is configured).

---

## Troubleshooting

| Issue | Solution |
|---|---|
| CORS errors | Verify `CLIENT_URL` and `CORS_ORIGINS` on Render |
| Socket.IO fails | Ensure Render allows WebSocket connections |
| MongoDB timeout | Check IP whitelist in Atlas |
| Gemini errors | Verify API key and quota on Google AI Studio |
| Build failures | Check Node.js version matches deployment target |

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains.
2. Add your custom domain.
3. Update DNS records as instructed.

### Render
1. Go to Service Settings → Custom Domain.
2. Add your API domain.
3. Update DNS records as instructed.

Update `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`, and `CLIENT_URL` accordingly.
