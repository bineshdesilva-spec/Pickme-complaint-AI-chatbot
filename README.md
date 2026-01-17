# PickMe AI Support Chatbot

AI-powered multilingual customer support chatbot for PickMe Facebook page.

## Features
- 🤖 AI-powered responses using Google Gemini
- 🌍 Multilingual support (English, Sinhala, Tamil)
- 📱 Mobile-responsive design
- ⚡ Real-time chat interface
- 🔒 Secure API key handling

## Deployment to Cloudflare Pages

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Cloudflare
1. Go to https://dash.cloudflare.com
2. Click **Pages** → **Create a project**
3. Connect your GitHub repository
4. Configure:
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: `/`
5. Click **Save and Deploy**

### Step 3: Add API Key
1. Go to your project settings
2. **Environment variables** → **Add variable**
3. Name: `GEMINI_API_KEY`
4. Value: Your API key from https://makersuite.google.com/app/apikey
5. Click **Save**
6. Redeploy your project

### Step 4: Test
Your app will be live at: `your-project.pages.dev`

## Get Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy and add to Cloudflare environment variables

## Support
- Emergency hotline: 1331
- Email: support@pickme.lk

## License
MIT