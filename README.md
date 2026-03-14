# KisaanMitra - किसानमित्र

**Voice-first, offline-capable multilingual agricultural assistant for Indian farmers**

## Features
- Voice input/output (works offline on many devices)
- Hindi & English support
- AI-powered responses via Ollama (unlimited, no API costs)
- Real-time weather with 3-day forecast
- Market prices (works completely offline!)
- Crop calendar (works completely offline!)
- Installable PWA - works on all devices

## Deployment Guide (100% Free)

### Option 1: Quick Deploy to Vercel (Frontend)

1. Go to https://vercel.com/drag-and-drop
2. Drag the `frontend` folder
3. Your app is live!

### Option 2: Deploy via CLI

```bash
cd frontend
npm i -g vercel
vercel
```

### Making AI Work (Backend)

For AI responses, you need a backend with Ollama:

#### Quick: Use ngrok (Free, Temporary)
```bash
# Install ngrok
brew install ngrok  # or download from ngrok.com

# Start your backend
cd backend
python app.py

# In another terminal, expose port 5001
ngrok http 5001

# Copy the ngrok URL and paste it in frontend/js/api.js:
# const BACKEND_URL = 'https://your-ngrok-url.ngrok-free.app';
```

#### Permanent: Deploy to Render (Free)
1. Push code to GitHub
2. Go to https://render.com
3. Create Web Service from your GitHub repo
4. Build command: `pip install -r requirements.txt`
5. Start command: `python app.py`

## How to Use Offline

1. **First online visit**: App caches automatically
2. **Turn off internet**: App works offline!
   - Prices: Always works
   - Calendar: Always works
   - FAQ: 20+ farming questions answered
   - Voice: May not work offline (browser limitation)
   - Type in text box as fallback

## Tech Stack
- Frontend: Vanilla JS, PWA, Web Speech API
- Backend: Flask + Ollama (llama3.2)
- APIs: Weather (Open-Meteo), Prices (MSP data)

## License
MIT
