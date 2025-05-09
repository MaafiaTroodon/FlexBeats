# 🎧 FlexBeats

A modern, fully responsive Spotify 2.0 clone built using **React 18**, **Tailwind CSS**, **Redux Toolkit**, and powered by **ShazamCore** and **Spotify APIs**.

Stream music, browse trending songs, search your favorite artists, and enjoy a seamless music experience — all from the browser.

!

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
- **Deployment**: Netlify
- **State Management**: Redux
- **Routing**: React Router DOM

---

## 📂 Project Structure

FlexBeats/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ ├── pages/
│ ├── redux/
│ ├── services/
│ ├── utils/
│ └── App.jsx
├── dist/
├── .env
├── package.json
└── vite.config.js


---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MaafiaTroodon/FlexBeats.git
cd FlexBeats

### 2. Install Dependencies
npm install

### 3. Run the App Locally
npm run dev
App will start at http://localhost:3000