const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

// Global app state
let appState = {
  queue: [],
  currentTrackIndex: -1,
  isPlaying: false,
  volume: 70,
  mixerSettings: {
    bass: 0,
    treble: 0,
    reverb: 0,
    echo: 0,
    distortion: 0
  }
};

const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected. Total clients:', clients.size);
  
  // Send current state to new client
  ws.send(JSON.stringify({ type: 'stateUpdate', data: appState }));
  
  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      handleWebSocketMessage(parsed, ws);
    } catch (e) {
      console.error('WebSocket message error:', e);
    }
  });
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total clients:', clients.size);
  });
});

function broadcastState() {
  const message = JSON.stringify({ type: 'stateUpdate', data: appState });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function handleWebSocketMessage(message, ws) {
  switch (message.type) {
    case 'play':
      appState.isPlaying = true;
      broadcastState();
      break;
    case 'pause':
      appState.isPlaying = false;
      broadcastState();
      break;
    case 'addToQueue':
      appState.queue.push(message.track);
      broadcastState();
      break;
    case 'removeFromQueue':
      appState.queue.splice(message.index, 1);
      broadcastState();
      break;
    case 'setCurrentTrack':
      appState.currentTrackIndex = message.index;
      appState.isPlaying = true;
      broadcastState();
      break;
    case 'setVolume':
      appState.volume = message.volume;
      broadcastState();
      break;
    case 'setMixerSettings':
      appState.mixerSettings = message.settings;
      broadcastState();
      break;
  }
}

// REST API Endpoints

// Get current state
app.get('/api/state', (req, res) => {
  res.json(appState);
});

// Import Suno playlist
app.post('/api/suno/import-playlist', async (req, res) => {
  try {
    const { playlistId } = req.body;
    
    if (!playlistId) {
      return res.status(400).json({ error: 'playlistId is required' });
    }
    
    const playlist = await fetchSunoPlaylist(playlistId);
    
    if (playlist.tracks && Array.isArray(playlist.tracks)) {
      const transformedTracks = playlist.tracks.map(track => ({
        id: track.id || track.gpt_description_prompt,
        title: track.title || 'Untitled',
        artist: track.display_name || 'Unknown Artist',
        duration: track.duration || 180,
        url: track.audio_url || '',
        imageUrl: track.image_url || '',
        sunoUrl: `https://suno.com/song/${track.id || track.gpt_description_prompt}`,
        source: 'suno'
      }));
      
      appState.queue.push(...transformedTracks);
      broadcastState();
      
      res.json({
        success: true,
        tracksAdded: transformedTracks.length,
        queue: appState.queue
      });
    } else {
      res.status(400).json({ error: 'Invalid playlist format' });
    }
  } catch (error) {
    console.error('Suno import error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search Suno
app.get('/api/suno/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const results = await searchSuno(q);
    res.json(results);
  } catch (error) {
    console.error('Suno search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch single Suno playlist
app.get('/api/suno/playlist/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await fetchSunoPlaylist(playlistId);
    res.json(playlist);
  } catch (error) {
    console.error('Suno playlist fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add track to queue
app.post('/api/queue/add', (req, res) => {
  try {
    const { track } = req.body;
    
    if (!track) {
      return res.status(400).json({ error: 'track is required' });
    }
    
    appState.queue.push(track);
    broadcastState();
    
    res.json({
      success: true,
      queue: appState.queue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suno API Helpers

async function fetchSunoPlaylist(playlistId) {
  // Extract ID from URL if full URL is provided
  const id = playlistId.includes('/') ? playlistId.split('/').pop() : playlistId;
  
  try {
    // Try direct API endpoint
    const response = await fetch(`https://api.suno.ai/api/playlist/${id}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    // Fallback: return mock data structure for demo
    return {
      id,
      name: 'Suno Playlist',
      tracks: []
    };
  } catch (error) {
    console.error('Error fetching Suno playlist:', error);
    
    // Return empty playlist structure on error
    return {
      id,
      name: 'Suno Playlist',
      tracks: [],
      error: 'Unable to fetch playlist. Please ensure the playlist URL is correct and public.'
    };
  }
}

async function searchSuno(query) {
  try {
    // Suno search via their API or web scraping
    const response = await fetch(
      `https://api.suno.ai/api/search/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      
      // Transform results
      const tracks = (data.songs || data.results || []).map(track => ({
        id: track.id || track.song_id,
        title: track.title || track.name || 'Untitled',
        artist: track.artist || track.display_name || 'Unknown Artist',
        duration: track.duration || track.length || 180,
        url: track.audio_url || track.url || '',
        imageUrl: track.image_url || track.thumbnail || '',
        sunoUrl: `https://suno.com/song/${track.id || track.song_id}`,
        source: 'suno'
      }));
      
      return { results: tracks };
    }
    
    // Return mock search results for demo
    return {
      results: [
        {
          id: 'demo1',
          title: 'Sample Song',
          artist: 'Demo Artist',
          duration: 180,
          imageUrl: 'https://via.placeholder.com/100',
          sunoUrl: 'https://suno.com/song/demo1',
          source: 'suno'
        }
      ]
    };
  } catch (error) {
    console.error('Error searching Suno:', error);
    return { results: [], error: 'Search unavailable' };
  }
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🎵 PubX Server running on http://localhost:${PORT}`);
});
