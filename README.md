# 🎧 FlexBeats

A modern, fully responsive Spotify 2.0 clone built using **React 18**, **Tailwind CSS**, **Redux Toolkit**, **IP Geolocation** and powered by **ShazamCore** and **Spotify APIs**.

Stream music, browse trending songs, search your favorite artists, and enjoy a seamless music experience — all from the browser.

---

## 🌍 Live Demo

Check out the live app here: [https://flexbeatsx.netlify.app](https://flexbeatsx.netlify.app)

---

## 🚀 Features

- 🔎 **Smart Search** — Find songs and artists instantly  
- 🎵 **Play/Pause Controls** — Global audio player synced across all pages  
- 📍 **Around You** — Discover popular tracks near your location (IP-based)  
- 🎤 **Lyrics View** — Enjoy lyrics along with the music  
- 📊 **Top Charts & Top Artists** — Stay updated with what's trending  
- 🎧 **Artist Details Page** — Explore discographies and top hits  
- 🔗 **Spotify & Apple Music Preview Support** — Using real `.m4a`/`.mp3` links  
- 🌐 **Responsive UI** — Fully mobile-friendly using TailwindCSS  

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Redux Toolkit, Tailwind CSS, Vite  
- **APIs**:  
  - [Shazam Core API](https://rapidapi.com/tipsters/api/shazam-core)  
  - [Spotify API](https://developer.spotify.com/documentation/web-api/)
  - [IP Geolocation API](https://ipgeolocation.io/ip-location-api.html)  
- **Deployment**: Netlify  
- **State Management**: Redux  
- **Routing**: React Router DOM  

---

## 📂 Project Structure

```
FlexBeats/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── services/
│   ├── utils/
│   └── App.jsx
├── dist/
├── .env
├── package.json
└── vite.config.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MaafiaTroodon/FlexBeats.git
cd FlexBeats
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App Locally

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## 🔐 Environment Variables

Create a `.env` file at the root and add your API keys:

```env
VITE_RAPIDAPI_KEY=your_rapidapi_key
VITE_SHAZAM_CORE_HOST=shazam-core7.p.rapidapi.com
VITE_SPOTIFY_HOST=spotify23.p.rapidapi.com
VITE_GEO_API_KEY=your_ipgeolocation_key
```

---

## 🌐 Deployment

To build the app for production:

```bash
npm run build
```

Then deploy the contents of the `dist/` folder to [Netlify](https://netlify.com) or any static host.

Live demo: [https://flexbeats.netlify.app](https://flexbeats.netlify.app)

---

## 🙌 Credits

- **JavaScript Mastery** — Base template and API integration guidance  
- **ShazamCore & Spotify APIs** — For music and artist data  
- **Team MaafiaTroodon** — Built with 💙 and a lot of grind

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
