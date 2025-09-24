# Next.js Weather App

A simple **weather forecast app** built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.  
It fetches weather data from the [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api) and caches results in **Redis** to reduce API calls and speed up responses.  

## Features

- Search for any location  
- Shows current and multi-day forecast  
- First day's weather expanded by default, others are collapsible  
- Dynamic backgrounds & text colors based on weather conditions (sunny, cloudy, rainy, etc.)  
- Responsive layout with Tailwind CSS  
- Redis caching (30 min TTL by default) to avoid repeated API calls  
- Automatic retry logic with exponential backoff for unstable API responses  

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```env
VISUAL_CROSSING_KEY=your_visual_crossing_api_key
REDIS_URL=redis://127.0.0.1:6379
```

### 4. Run Redis locally
If you don't have Redis yet, install and start it in Ubuntu:
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```
Check if Redis is running:
```bash
redis-cli ping
# should return: PONG
```

### 5. Start the development server
```bash
npm run dev
```

Open http://localhost:3000 in your browser

---
## Tech stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Redis for caching
- Visual Crossing Weather API

---
