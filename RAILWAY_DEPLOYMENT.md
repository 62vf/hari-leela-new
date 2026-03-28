# Deploying Hari Leela Collections to Railway

This guide will help you deploy your complete website on Railway - **NO CREDIT CARD REQUIRED!**

## Why Railway?

✅ $5 free credit per month (enough for small apps)
✅ No credit card required initially
✅ PostgreSQL database included
✅ Easy GitHub integration
✅ One-click deployment

---

## Step 1: Push to GitHub (if not done)

```bash
git add .
git commit -m "Ready for Railway deployment"
git push
```

---

## Step 2: Deploy Backend + Database on Railway

### A. Sign Up & Create Project

1. Go to **https://railway.app**
2. Click **"Login with GitHub"** (no sign-up form needed!)
3. Authorize Railway to access your repos
4. Click **"New Project"**
5. Select **"Deploy from GitHub repo"**
6. Choose your repository: `62vf/hari-leela`

### B. Configure Backend Service

Railway will auto-detect your Flask app! After deployment starts:

1. Click on your service (should say "backend" or your repo name)
2. Go to **"Variables"** tab
3. Add these environment variables:

```
SECRET_KEY=your-random-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_DEFAULT_SENDER=Hari Leela Collections
PORT=5000
```

**Generate Secret Keys:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```
Run this twice for both SECRET_KEY and JWT_SECRET_KEY

**Gmail App Password:**
- Google Account → Security → 2-Step Verification
- App passwords → Generate for "Mail"
- Copy the 16-character password

### C. Add PostgreSQL Database

1. In your project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Wait 1-2 minutes for database creation
4. Railway will automatically add `DATABASE_URL` to your backend variables!

### D. Initialize Database

1. Go to your backend service → **"Settings"** tab
2. Scroll to **"Deploy Triggers"**
3. Click **"Deploy"** (this will run build.sh and seed the database)
4. Wait 3-5 minutes for deployment

### E. Get Your Backend URL

1. Go to your service → **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `harileela-backend-production.up.railway.app`)

---

## Step 3: Deploy Frontend on Vercel (Free, No Card)

### A. Sign Up Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel

### B. Deploy Frontend

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add **Environment Variable**:
   ```
   VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
   ```
   (Use the Railway backend URL from Step 2E)

5. Click **"Deploy"**
6. Wait 2-3 minutes

### C. Your Website is Live!

Vercel will give you a URL like: `harileela-frontend.vercel.app`

---

## Step 4: Test Your Website

1. Visit your Vercel URL
2. Browse products and categories
3. Test admin login:
   - Go to: `https://your-site.vercel.app/admin/login`
   - Username: `admin`
   - Password: `admin123`

---

## Important: Update CORS Settings (If Needed)

If you get CORS errors, update backend CORS:

1. Go to Railway → Your backend service
2. Add environment variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

3. Update [app.py](backend/app.py) if needed (but current config allows all origins)

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Railway Backend + DB | $0/month (uses $5 credit) |
| Vercel Frontend | $0/month (free forever) |
| **Total** | **$0/month** 🎉 |

---

## Custom Domain (Optional)

### For Frontend (Vercel):
1. Vercel Dashboard → Your project → **"Settings"** → **"Domains"**
2. Add your domain (e.g., `harileelastore.com`)
3. Update DNS records as shown

### For Backend (Railway):
1. Railway → Your service → **"Settings"** → **"Domains"**
2. Add custom domain
3. Update DNS records

---

## Keeping Services Active

### Railway Backend:
- Free $5 credit = ~500 hours/month
- More than enough for one website!
- If you run out, add a card (still stays free under $5)

### Vercel Frontend:
- Unlimited bandwidth
- Never sleeps
- Always fast

---

## Updating Your Website

Just push to GitHub:

```bash
git add .
git commit -m "Update website"
git push
```

- **Vercel** auto-deploys frontend ✅
- **Railway** auto-deploys backend ✅

---

## Alternative: All-in-One Railway Deployment

Want both frontend + backend on Railway?

1. Deploy backend as shown above
2. In Railway, click **"+ New"** → **"Empty Service"**
3. Connect to your GitHub repo
4. Set **Root Directory**: `frontend`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
6. Railway will auto-detect Vite and deploy!

**Cost:** Still free (uses same $5 credit)

---

## Troubleshooting

### Backend Not Starting:
- Check logs: Railway → Service → **"Deployments"** → Click latest → **"View Logs"**
- Verify all environment variables are set
- Check DATABASE_URL is automatically added

### Frontend Can't Connect:
- Verify VITE_API_URL is correct
- Check backend is running (visit `/api/health`)
- Check CORS settings

### Database Connection Error:
- Railway automatically sets DATABASE_URL
- Make sure PostgreSQL service is running
- Restart backend service

### Out of Railway Credit:
- Monitor usage: Railway Dashboard → **"Usage"**
- Optimize: Backend sleeps after inactivity (free tier)
- Or add card to continue free (under $5/month)

---

## 🎉 Congratulations!

Your Hari Leela Collections website is now live!

- **Frontend**: `https://your-site.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **Cost**: $0/month

Need help? Railway has great docs: https://docs.railway.app
