# 🚀 Deployment Guide - Expense Tracker

This guide will help you deploy your expense tracker application to the web so you can access it from your smartphone anywhere.

## 📋 Prerequisites

- Git installed on your computer
- A GitHub account (free)
- Node.js installed locally (for testing)

---

## 🌐 Deployment Options

### Option 1: Render (Recommended) ⭐

Render is the easiest option with a generous free tier.

#### Step 1: Prepare Your Code

1. **Initialize Git repository** (if not already done):
   ```bash
   cd "c:\Users\gilbe\OneDrive\Documentos 1\FINAN"
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to [github.com](https://github.com) and sign in
   - Click "New repository"
   - Name it `expense-tracker`
   - Don't initialize with README (you already have code)
   - Click "Create repository"

3. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
   git branch -M main
   git push -u origin main
   ```

#### Step 2: Deploy to Render

1. **Sign up for Render**:
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (`expense-tracker`)
   - Configure the service:
     - **Name**: `expense-tracker` (or any name you prefer)
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: `Free`

3. **Deploy**:
   - Click "Create Web Service"
   - Wait 2-5 minutes for deployment
   - Your app will be available at: `https://expense-tracker-XXXX.onrender.com`

4. **Access from smartphone**:
   - Open the URL on your phone's browser
   - Add to home screen for quick access

#### Important Notes for Render:

> [!WARNING]
> **Free tier limitations**:
> - App will sleep after 15 minutes of inactivity
> - First load after sleep takes 30-60 seconds
> - Database resets if app is inactive for extended periods

> [!TIP]
> To keep your app awake, use a service like [UptimeRobot](https://uptimerobot.com) to ping your app every 10 minutes.

---

### Option 2: Railway

Railway offers $5 free credit monthly.

#### Steps:

1. **Sign up**: Go to [railway.app](https://railway.app)
2. **New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select repository**: Choose your `expense-tracker` repo
4. **Configure**:
   - Railway auto-detects Node.js
   - No additional configuration needed
5. **Deploy**: Click deploy and wait
6. **Get URL**: Go to Settings → Generate Domain

---

### Option 3: Fly.io

Fly.io offers a free tier with persistent storage.

#### Steps:

1. **Install Fly CLI**:
   ```bash
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Sign up and login**:
   ```bash
   fly auth signup
   fly auth login
   ```

3. **Launch app**:
   ```bash
   cd "c:\Users\gilbe\OneDrive\Documentos 1\FINAN"
   fly launch
   ```

4. **Follow prompts**:
   - Choose app name
   - Select region (closest to you)
   - Don't add PostgreSQL
   - Deploy now: Yes

5. **Access**: Your app will be at `https://YOUR-APP-NAME.fly.dev`

---

## 📱 Adding to Smartphone Home Screen

### iPhone (Safari):

1. Open the app URL in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "Meus Gastos"
5. Tap "Add"

### Android (Chrome):

1. Open the app URL in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen"
4. Name it "Meus Gastos"
5. Tap "Add"

---

## 🔧 Troubleshooting

### App is slow to load
- This is normal on free tiers after inactivity
- Consider upgrading to paid tier for instant loads

### Database data disappeared
- Free tiers may reset SQLite databases
- For production, consider upgrading or using PostgreSQL

### Can't access from smartphone
- Check if URL is correct
- Ensure you're using HTTPS (not HTTP)
- Try clearing browser cache

### Changes not showing after deployment
- Make sure you committed and pushed changes to GitHub
- Trigger a manual redeploy on your hosting platform

---

## 🔐 Security Considerations

> [!CAUTION]
> **No Authentication**: This app has no login system. Anyone with the URL can add/view expenses.

**For production use, consider**:
- Adding user authentication
- Using environment variables for sensitive data
- Implementing rate limiting
- Using a proper database (PostgreSQL)

---

## 💡 Next Steps

After deployment:

1. **Test thoroughly**: Add expenses, export CSV, refresh page
2. **Bookmark the URL**: Save it on your phone
3. **Share with family**: If you want others to use it
4. **Monitor usage**: Check hosting platform dashboard

---

## 📊 Monitoring Your App

### Render Dashboard:
- View logs: Click on your service → Logs
- Check metrics: CPU, Memory usage
- Restart: Manual → Restart

### Railway Dashboard:
- Deployments: View deployment history
- Metrics: Resource usage
- Logs: Real-time logs

---

## 🆙 Upgrading to Paid Tier

If you need better performance:

**Render**: $7/month
- No sleep
- Faster performance
- Persistent database

**Railway**: Pay-as-you-go
- $5 free credit/month
- ~$5-10/month typical usage

**Fly.io**: $1.94/month
- 256MB RAM
- Persistent storage

---

## 🔄 Updating Your App

When you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Your hosting platform will automatically redeploy!

---

## 📞 Support

If you encounter issues:

1. **Check logs** on your hosting platform
2. **Test locally** first: `npm start`
3. **Verify environment variables** are set correctly
4. **Check GitHub repository** is up to date

---

**Your app is ready to deploy! Choose your preferred platform and follow the steps above.** 🚀
