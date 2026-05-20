# 🎵 PubX - Flexible Streaming DJ Mixer

A **real-time interactive streaming web app** with **Suno.com playlist integration** for flexible, simple DJ mixing and track management.

## ✨ Features

### 🎛️ Core Features
- **Real-time WebSocket Streaming** - Live synchronized state across all connected clients
- **Interactive Player** - Play/pause, volume control, animated visualizer
- **Advanced Mixer** - Bass, treble, reverb, echo, distortion controls
- **Dynamic Queue Management** - Add/remove tracks on the fly
- **Responsive Design** - Works on desktop and mobile

### 🎵 Suno Integration
- **Import Playlists** - Paste Suno playlist URLs to import entire playlists
- **Search Tracks** - Search Suno's music library directly from the app
- **Add Individual Tracks** - Browse search results and add tracks to queue
- **Direct Links** - Click to view any track on Suno.com

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/d4u5a/pubx.git
cd pubx

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Running the App

**Terminal 1: Start Backend**
```bash
npm run dev
# or
npm start
```

**Terminal 2: Start Frontend**
```bash
npm run client
```

Open `http://localhost:5000` in your browser.

## 📖 How to Use

### Importing Suno Playlists

1. Go to [Suno.com](https://suno.com)
2. Find or create a playlist
3. Copy the playlist URL: `https://suno.com/playlist/YOUR_ID`
4. In PubX, click **📋 Import Playlist**
5. Paste the URL and click **📥 Import Playlist**
6. All tracks are added to your queue automatically!

### Searching for Tracks

1. Click **🔍 Search Suno**
2. Enter a song name, artist, or genre
3. Browse the results
4. Click **➕ Add** to add any track to your queue

### Using the Mixer

Adjust real-time audio effects:
- **Bass** - Low-end frequency boost/cut
- **Treble** - High-end frequency boost/cut
- **Reverb** - Spatial room effect
- **Echo** - Delay effect
- **Distortion** - Harmonic saturation

## 🏗️ Project Structure

```
pubx/
├── server.js                 # Express + WebSocket server with Suno API
├── package.json              # Backend dependencies
├── client/
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── components/
│   │   │   ├── Player.jsx   # Audio player controls
│   │   │   ├── Mixer.jsx    # Mixer controls
│   │   │   ├── Queue.jsx    # Track queue display
│   │   │   └── SunoPlaylistImporter.jsx  # Suno integration
│   │   └── styles/
│   │       └── SunoPlaylistImporter.css  # Importer styles
│   └── package.json          # Frontend dependencies
└── README.md
```

## 🔌 API Endpoints

### Get State
```
GET /api/state
```

### Import Suno Playlist
```
POST /api/suno/import-playlist
Body: { "playlistId": "YOUR_ID" }
```

### Search Suno
```
GET /api/suno/search?q=query
```

### Add Track to Queue
```
POST /api/queue/add
Body: { "track": { ...trackData } }
```

### Fetch Single Suno Playlist
```
GET /api/suno/playlist/:playlistId
```

## 🔄 WebSocket Events

The app uses WebSocket for real-time synchronization:

- `stateUpdate` - Broadcast app state to all clients
- `play` - Start playback
- `pause` - Pause playback
- `addToQueue` - Add track to queue
- `removeFromQueue` - Remove track from queue
- `setCurrentTrack` - Set now playing track
- `setVolume` - Change volume
- `setMixerSettings` - Update mixer parameters

## 🎨 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Fast build tool
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js + Express** - Server framework
- **WebSocket** - Real-time communication
- **Suno API** - Playlist and track data

## 🔐 Notes

- Suno API integration works with public playlists
- No authentication required for Suno integration
- Data syncs real-time across all connected browsers
- Tracks are streamed directly from Suno's CDN

## 📝 Future Enhancements

- [ ] User authentication
- [ ] Persistent queue storage
- [ ] Equalizer presets
- [ ] Recording/export functionality
- [ ] Spotify/Apple Music integration
- [ ] Advanced audio processing
- [ ] Multi-track mixing
- [ ] Effects chain customization

## 🐛 Troubleshooting

### Suno Playlist Import Failed
- Verify the playlist URL is correct
- Ensure the playlist is public
- Check your internet connection
- Try searching for tracks instead

### WebSocket Connection Issues
- Ensure backend is running on port 5000
- Check browser console for errors
- Clear browser cache and reload

### Tracks Not Appearing
- Refresh the page
- Check that tracks have valid audio URLs
- Verify Suno API is accessible

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Made with 🎵 by d4u5a**

[Visit Suno.com](https://suno.com) | [GitHub Repository](https://github.com/d4u5a/pubx)
