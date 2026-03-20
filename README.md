# 🚀 CryptoLens — Real-Time Crypto Market Dashboard

A real-time cryptocurrency dashboard built with React and CoinGecko API.
No backend, no install needed — just open and use.

---

## 🌐 Live Demo
[Click here to view live demo](https://crypto-dashboard-eo8x.vercel.app/)

---

## 🛠️ Tech Stack

| Technology | Why chosen |
|---|---|
| React 18 (CDN) | Component-based UI, Context API for state management |
| CoinGecko API | Free public API, no API key needed |
| LocalStorage | Simple persistence for watchlist and theme preference |
| CSS Variables | Clean dark/light mode switching with one toggle |
| Google Fonts | Distinctive typography for professional look |

---

## 📦 Setup Instructions

### Option 1 — Live Server (Recommended)
1. Download and extract the ZIP file
2. Open the folder in VS Code
3. Install Live Server extension (Ctrl + Shift + X → search Live Server)
4. Click "Go Live" at bottom right
5. App opens at http://127.0.0.1:5500

### Option 2 — Direct Open
1. Extract the ZIP file
2. Open the crypto-dashboard folder
3. Double-click index.html
4. Opens directly in your browser ✅

---

## ✨ Features

- Live top 20 cryptocurrencies from CoinGecko API
- Search by coin name or symbol
- Star coins to save to personal watchlist
- Click any coin to see detailed modal (24h high/low, ATH, volume)
- Refresh button updates data without page reload
- Dark / Light mode toggle
- Watchlist persists after browser refresh
- Error banner for API rate limit or offline detection
- Skeleton loading animation while fetching

---

## 🎯 Evaluation Criteria

### 1. Error Handling
- API rate limit (429) → shows friendly error banner with retry button
- Offline detection → navigator.onLine check shows offline message
- Detail fetch fails → falls back to basic data already loaded in list

### 2. Performance
- useMemo for filtered coin list — no recalculation on every render
- useCallback for fetchCoins and toggleWatchlist — no unnecessary recreations
- API called only on mount and manual refresh — no polling or wasteful calls

### 3. Code Cleanliness
- All API calls in js/services/api.js only
- All LocalStorage in js/services/storage.js only
- Each component in its own file under js/components/

---

## ⚖️ Trade-offs & Improvements

### Shortcuts taken
- Used CDN React instead of Vite build tool
- CoinGecko free tier has rate limits (no API key)
- No real-time WebSocket updates

### Given more time, I would
1. Add price sparkline charts for each coin
2. Add WebSocket for real-time price updates
3. Add portfolio tracker with buy price entry
4. Add price alert notifications
5. Add historical price chart with Chart.js
6. Use Vite for proper production build
7. Write unit tests for API service functions

---

## 📁 Project Structure

\`\`\`
crypto-dashboard/
│
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── services/
    │   ├── api.js
    │   └── storage.js
    ├── components/
    │   ├── Header.js
    │   ├── CoinCard.js
    │   ├── Modal.js
    │   └── ErrorBanner.js
    └── app.js
    
