import React, { useState, useEffect } from 'react';
import Player from './components/Player';
import Mixer from './components/Mixer';
import Queue from './components/Queue';
import SunoPlaylistImporter from './components/SunoPlaylistImporter';
import './styles/App.css';

const App = () => {
  const [state, setState] = useState({
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
  });

  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket connected');
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'stateUpdate') {
          setState(message.data);
        }
      } catch (e) {
        console.error('WebSocket message error:', e);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
    };

    return () => {
      if (websocket) websocket.close();
    };
  }, []);

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  };

  const handlePlay = () => {
    sendMessage({ type: 'play' });
  };

  const handlePause = () => {
    sendMessage({ type: 'pause' });
  };

  const handleAddToQueue = (track) => {
    sendMessage({ type: 'addToQueue', track });
  };

  const handleRemoveFromQueue = (index) => {
    sendMessage({ type: 'removeFromQueue', index });
  };

  const handleSetCurrentTrack = (index) => {
    sendMessage({ type: 'setCurrentTrack', index });
  };

  const handleSetVolume = (volume) => {
    sendMessage({ type: 'setVolume', volume });
  };

  const handleSetMixerSettings = (settings) => {
    sendMessage({ type: 'setMixerSettings', settings });
  };

  const currentTrack = state.queue[state.currentTrackIndex] || null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎵 PubX</h1>
        <p>Flexible Streaming DJ Mixer</p>
      </header>

      <div className="app-container">
        <div className="main-panel">
          <Player
            currentTrack={currentTrack}
            isPlaying={state.isPlaying}
            volume={state.volume}
            onPlay={handlePlay}
            onPause={handlePause}
            onVolumeChange={handleSetVolume}
          />

          <Mixer
            settings={state.mixerSettings}
            onSettingsChange={handleSetMixerSettings}
          />
        </div>

        <div className="side-panel">
          <SunoPlaylistImporter onAddToQueue={handleAddToQueue} />
          <Queue
            queue={state.queue}
            currentTrackIndex={state.currentTrackIndex}
            onSelectTrack={handleSetCurrentTrack}
            onRemoveTrack={handleRemoveFromQueue}
          />
        </div>
      </div>

      <footer className="app-footer">
        <p>Tracks in queue: {state.queue.length} | Connected clients: ∞</p>
      </footer>
    </div>
  );
};

export default App;
