# KisaanMitra - किसान मित्र 🌾

**Voice-First AI Assistant for Indian Farmers**

[![Deploy](https://img.shields.io/badge/Live-Demo-blue)](https://ps-chakradhar.github.io/kisaanmitra/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Cross--Platform-orange)](README.md)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Features](#features)
5. [Technology Stack](#technology-stack)
6. [Architecture](#architecture)
7. [Deployment](#deployment)
8. [How It Works](#how-it-works)
9. [Offline Capability](#offline-capability)
10. [API Services](#api-services)
11. [User Interface](#user-interface)
12. [Impact & Benefits](#impact--benefits)
13. [Future Enhancements](#future-enhancements)
14. [License](#license)

---

## 📖 Project Overview

**KisaanMitra** (किसान मित्र) is a voice-first, offline-capable multilingual agricultural assistant designed specifically for Indian farmers. It provides AI-powered agricultural advice, weather forecasts, and market prices through a simple voice interface in Hindi.

The application works completely offline for basic features (prices, crop calendar, FAQ) and uses free Cloudflare AI for unlimited AI responses, making it accessible even in remote rural areas with limited internet connectivity.

**Live Demo:** https://ps-chakradhar.github.io/kisaanmitra/

**Backend API:** https://PSC03.pythonanywhere.com

---

## 🎯 Problem Statement

Indian agriculture faces several critical challenges:

1. **Limited Expert Access**: Farmers lack easy access to agricultural experts for crop disease diagnosis and treatment
2. **Language Barriers**: Most agricultural information is in English, inaccessible to majority of Indian farmers
3. **Internet Dependency**: Most apps require constant internet, but rural areas have poor connectivity
4. **Cost Barriers**: Paid APIs and services make technology inaccessible to resource-poor farmers
5. **Literacy Issues**: Text-based interfaces exclude farmers with limited literacy
6. **Timely Information**: Delayed advice leads to crop losses and reduced yields

---

## 💡 Solution

KisaanMitra addresses these challenges through:

- **Voice-First Interface**: Farmers can speak in Hindi to get answers - no typing or literacy required
- **Offline Capability**: Core features work without internet using cached data and local storage
- **Free AI**: Uses Cloudflare Workers AI for unlimited responses at no cost
- **Multilingual**: Supports Hindi (primary) and English
- **Works on Any Device**: Runs in any browser - no app installation needed

---

## ✨ Features

### Core Features

| Feature | Description | Mode |
|---------|-------------|------|
| 🎤 **Voice Input** | Speak your query in Hindi | Online |
| 🔊 **Voice Output** | Hear responses spoken aloud | Online |
| 🤖 **AI Assistant** | Get answers to farming questions | Online |
| 🌦️ **Weather** | 3-day forecast with farming advice | Online |
| 💰 **Market Prices** | MSP prices for major crops | Offline |
| 📅 **Crop Calendar** | Sowing/harvesting guidance | Offline |
| ❓ **Offline FAQ** | 20+ common farming questions | Offline |

### Smart Query Routing

The system automatically detects query type:
- **Disease/Symptoms** → AI for diagnosis
- **Weather** → Weather service
- **Prices** → Price database
- **General** → AI assistant

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Vanilla JavaScript | Lightweight, no dependencies |
| Web Speech API | Voice input and TTS output |
| Service Worker | PWA offline caching |
| CSS3 | Responsive design |

### Backend
| Technology | Purpose |
|------------|---------|
| Python Flask | Web framework |
| Cloudflare Workers AI | Free unlimited AI (Llama 3.1) |
| Open-Meteo API | Weather data (free) |
| Local JSON | Offline price database |

### Deployment (100% Free)
| Service | Purpose |
|---------|---------|
| GitHub Pages | Frontend hosting |
| PythonAnywhere | Backend API |
| Cloudflare Workers AI | AI responses |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER DEVICE                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   Browser   │    │  PWA Cache  │    │ Local Data  │   │
│  └──────┬──────┘    └─────────────┘    └─────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Frontend (index.html + js)             │   │
│  │    - Voice Recognition & Synthesis                  │   │
│  │    - UI Components                                  │   │
│  │    - Offline Service Worker                         │   │
│  └──────────────────────┬──────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │
            (Online Mode)  │ (Offline Mode)
                          ▼
┌─────────────────────────┼───────────────────────────────────┐
│                    BACKEND API                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PythonAnywhere (Flask)                  │  │
│  │                                                      │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────┐  │  │
│  │  │Query Route │ │ Weather    │ │ Price Service  │  │  │
│  │  │  (AI)      │ │ Service    │ │   (JSON)       │  │  │
│  │  └─────┬──────┘ └─────┬──────┘ └───────┬────────┘  │  │
│  └────────┼─────────────┼─────────────────┼───────────┘  │
│           │             │                 │               │
│           ▼             ▼                 ▼               │
│  ┌────────────────┐ ┌──────────┐    ┌─────────────┐      │
│  │ Cloudflare AI  │ │Weather   │    │ Local JSON  │      │
│  │ (Llama 3.1)   │ │API       │    │ Prices DB  │      │
│  └────────────────┘ └──────────┘    └─────────────┘      │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment

### Live URLs

- **Frontend (GitHub Pages):** https://ps-chakradhar.github.io/kisaanmitra/
- **Backend API:** https://PSC03.pythonanywhere.com

### Deployment Steps

#### Frontend (GitHub Pages)
```bash
# Push to GitHub
git add .
git commit -m "Update"
git push

# Enable GitHub Pages in repo settings
# Source: /docs folder
```

#### Backend (PythonAnywhere)
```bash
# Upload files via PythonAnywhere Files tab
# or use git pull in Bash console

# Configure .env with API keys
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_token
WEATHER_API_KEY=your_weather_key
```

---

## 🔧 How It Works

### Voice Interaction Flow
```
1. User taps microphone button
2. Browser records voice input
3. Speech converted to text (Hindi/English)
4. Text sent to backend API
5. Backend determines query type (AI/Weather/Price)
6. Appropriate service processes query
7. Response returned in JSON format
8. Frontend displays answer
9. Text converted to speech for audio output
```

### Query Routing Logic
```python
if "weather" in query or "मौसम" in query:
    → Weather Service
elif "price" in query or "भाव" in query:
    → Price Service  
elif has_symptom_keywords(query):
    → AI Service (Disease diagnosis)
else:
    → AI Service (General advice)
```

---

## 📴 Offline Capability

### Offline Features (Always Works)
| Feature | Data Source |
|---------|-------------|
| Market Prices | Local JSON in app |
| Crop Calendar | Local JSON in app |
| FAQ Responses | 20+ cached Q&A pairs |
| PWA Installation | Service Worker |

### Online Features
| Feature | Data Source |
|---------|-------------|
| Voice Input | Web Speech API |
| AI Responses | Cloudflare Workers AI |
| Weather Data | Open-Meteo API |

### First-Time Setup
1. Visit app while online
2. App automatically caches for offline use
3. Works offline afterward!

---

## 🔌 API Services

### Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/query` | POST | Main query handler (AI/Weather/Price) |
| `/api/health` | GET | Health check |
| `/api/weather` | GET | Weather data |
| `/api/prices` | GET | Market prices |

### Request Format
```json
POST /api/query
{
  "query": "मेरे आलू के पत्ते पीले हो रहे हैं",
  "language": "hi",
  "history": [{"role": "user", "content": "..."}]
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "text": "Answer in Hindi...",
    "type": "general",
    "steps": ["Step 1", "Step 2", "Step 3"],
    "emoji": "🌾"
  },
  "provider": "cloudflare"
}
```

---

## 📱 User Interface

### Main Screen
- Language toggle (Hindi/English)
- Microphone button for voice input
- Quick action buttons:
  - Prices (भाव)
  - Crops (फसल)
  - Weather (मौसम)
- Query input text box

### Response Display
- Emoji indicator
- Main answer text
- Action steps (if applicable)
- "Listen Again" button for TTS

### Offline Indicators
- Visual status dot (green/red)
- Toast messages for offline mode

---

## 📈 Impact & Benefits

### For Farmers
- ✅ **Timely Advice**: Get expert-level guidance instantly
- ✅ **Cost-Free**: No paid subscriptions or API costs
- ✅ **Language**: Native Hindi support
- ✅ **Literacy-Free**: Voice interface works for all
- ✅ **Offline Access**: Works in remote areas
- ✅ **Weather Planning**: Plan farming activities
- ✅ **Market Info**: Fair pricing knowledge

### Social Impact
- 🏆 **Empowers Small Farmers**: Level playing field with agribusiness
- 🌾 **Food Security**: Better crop management
- 💰 **Income Improvement**: Fair pricing knowledge
- 📱 **Digital Inclusion**: Technology accessible to all

---

## 🔮 Future Enhancements

### Phase 2 (Planned)
- [ ] Regional language support (Marathi, Bengali, Tamil, Telugu)
- [ ] Image-based disease detection (upload leaf photos)
- [ ] SMS alerts for weather warnings
- [ ] Integration with government schemes (PM-KISAN)
- [ ] Crop-specific advisory system
- [ ] Soil health database

### Technical Improvements
- [ ] Mobile app (Android/iOS)
- [ ] Regional dialect support
- [ ] Video tutorials
- [ ] Farmer community forum

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Languages Supported | 2 (Hindi, English) |
| Offline FAQ Questions | 20+ |
| Crops in Price Database | 10+ |
| Crops in Calendar | 15+ |
| API Dependencies | 0 (Free services) |
| Platform Support | All browsers |

---

## 👨‍💻 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Cloudflare Workers AI for free unlimited AI
- Open-Meteo for weather data
- GitHub Pages for hosting
- PythonAnywhere for backend deployment
- All open-source contributors

---

## 📞 Contact

- **Developer:** P.S. Chakradhar
- **GitHub:** https://github.com/PS-Chakradhar/kisaanmitra
- **Live Demo:** https://ps-chakradhar.github.io/kisaanmitra/

---

**Made with ❤️ for Indian Farmers 🇮🇳**

*किसानों की सेवा में समर्पित*
