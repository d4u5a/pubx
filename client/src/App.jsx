import React, { useState, useEffect, useCallback } from 'react';
import Player from './components/Player';
import Mixer from './components/Mixer';
import Queue from './components/Queue';
import SunoPlaylistImporter from './components/SunoPlaylistImporter';
import QueueControls from './components/QueueControls';
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
    },
    shuffle: false,
    repeat: 'off' // off, one, all
  });

  const [ws, setWs] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to WebSocket with automatic reconnection
    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;
        const websocket = new WebSocket(wsUrl);

        websocket.onopen = () => {
          console.log('🔗 WebSocket connected');
          setConnectionStatus('connected');
          setWs(websocket);
          setError(null);
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
          setConnectionStatus('error');
          setError('Connection error');
        };

        websocket.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          setConnectionStatus('disconnected');
          setWs(null);
          // Attempt reconnection after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        return websocket;
      } catch (err) {
        console.error('WebSocket connection failed:', err);
        setError('Failed to connect');
      }
    };

    const websocket = connectWebSocket();

    return () => {
      if (websocket) websocket.close();
    };
  }, []);

  const sendMessage = useCallback((message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected');
    }
  }, [ws]);

  const handlePlay = useCallback(() => {
    sendMessage({ type: 'play' });
  }, [sendMessage]);

  const handlePause = useCallback(() => {
    sendMessage({ type: 'pause' });
  }, [sendMessage]);

  const handleAddToQueue = useCallback((track) => {
    sendMessage({ type: 'addToQueue', track });
  }, [sendMessage]);

  const handleRemoveFromQueue = useCallback((index) => {
    sendMessage({ type: 'removeFromQueue', index });
  }, [sendMessage]);

  const handleSetCurrentTrack = useCallback((index) => {
    sendMessage({ type: 'setCurrentTrack', index });
  }, [sendMessage]);

  const handleSetVolume = useCallback((volume) => {
    sendMessage({ type: 'setVolume', volume });
  }, [sendMessage]);

  const handleSetMixerSettings = useCallback((settings) => {
    sendMessage({ type: 'setMixerSettings', settings });
  }, [sendMessage]);

  const handleShuffle = useCallback(() => {
    sendMessage({ type: 'toggleShuffle' });
  }, [sendMessage]);

  const handleRepeat = useCallback(() => {
    sendMessage({ type: 'toggleRepeat' });
  }, [sendMessage]);

  const handleMoveTrack = useCallback((fromIndex, toIndex) => {
    sendMessage({ type: 'moveTrack', fromIndex, toIndex });
  }, [sendMessage]);

  const handleClearQueue = useCallback(() => {
    if (window.confirm('Clear entire queue?')) {
      sendMessage({ type: 'clearQueue' });
    }
  }, [sendMessage]);

  const currentTrack = state.queue[state.currentTrackIndex] || null;
  const statusIndicator = {
    connected: '🟢',
    disconnected: '🔴',
    error: '🟠'
  }[connectionStatus] || '⚫';

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>🎵 PubX</h1>
            <p>Flexible Streaming DJ Mixer</p>
          </div>
          <div className="header-status">
            <span className="status-indicator" title={connectionStatus}>
              {statusIndicator} {connectionStatus}
            </span>
          </div>
        </div>
      </header>

      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="app-container">
        <div className="main-panel">
          <Player
            currentTrack={currentTrack}
            isPlaying={state.isPlaying}
            volume={state.volume}
            onPlay={handlePlay}
            onPause={handlePause}
            onVolumeChange={handleSetVolume}
            totalTracks={state.queue.length}
            currentIndex={state.currentTrackIndex}
          />

          <Mixer
            settings={state.mixerSettings}
            onSettingsChange={handleSetMixerSettings}
          />
        </div>

        <div className="side-panel">
          <SunoPlaylistImporter onAddToQueue={handleAddToQueue} />
          
          <QueueControls
            queueLength={state.queue.length}
            isShuffle={state.shuffle}
            repeat={state.repeat}
            onShuffle={handleShuffle}
            onRepeat={handleRepeat}
            onClearQueue={handleClearQueue}
          />
          
          <Queue
            queue={state.queue}
            currentTrackIndex={state.currentTrackIndex}
            onSelectTrack={handleSetCurrentTrack}
            onRemoveTrack={handleRemoveFromQueue}
            onMoveTrack={handleMoveTrack}
          />
        </div>
      </div>

      <footer className="app-footer">
        <p>
          <span>📊 Queue: {state.queue.length} tracks</span>
          <span>•</span>
          <span>🔗 {statusIndicator} {connectionStatus}</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
