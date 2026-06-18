# Vercel-only Deployment Guide

This version runs the React frontend and Express API on the same Vercel project.

## 1) Important security step
If you ever shared your MongoDB password, reset it in MongoDB Atlas first.

MongoDB Atlas:
- Database Access -> edit your database user -> reset password
- Network Access -> add `0.0.0.0/0` so Vercel can connect

## 2) Push this version to GitHub

```bash
git add .
git commit -m "Prepare Vercel-only deployment"
git push
```

## 3) Import the repo in Vercel

Vercel settings:

```txt
Framework Preset: Other
Root Directory: ./
Install Command: npm run vercel:install
Build Command: npm run vercel:build
Output Directory: client/dist
```

## 4) Environment Variables in Vercel

Add these in Project Settings -> Environment Variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/open-claw?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=write_a_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=https://YOUR_PROJECT.vercel.app
DEMO_SEED_EMAIL=demo@agentlab.dev
DEMO_SEED_PASSWORD=DemoPass123!
```

Do not commit these values to GitHub.

## 5) Deploy

Click Deploy in Vercel. After deployment, test:

```txt
https://YOUR_PROJECT.vercel.app/api/health
```

Expected result:

```json
{
  "success": true,
  "status": "ok",
  "service": "openclaw-agent-suite-api",
  "deployment": "vercel-serverless"
}
```

## 6) Seed MongoDB Atlas

Because Vercel does not give you a normal backend shell like Render, seed the database locally against Atlas.

Create `server/.env` locally only:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/open-claw?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=write_the_same_secret_you_used_in_vercel
JWT_EXPIRES_IN=7d
DEMO_SEED_EMAIL=demo@agentlab.dev
DEMO_SEED_PASSWORD=DemoPass123!
CLIENT_URL=https://YOUR_PROJECT.vercel.app
```

Then run:

```bash
npm run seed
```

After that, login on the live site using:

```txt
demo@agentlab.dev
DemoPass123!
```

## 7) Local development

For local development with Docker MongoDB:

```bash
docker compose up -d
npm run seed
npm run dev
```

Local URLs:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:4100/api/health
```
