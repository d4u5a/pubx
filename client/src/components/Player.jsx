import React, { useState, useEffect } from 'react';
import { formatDuration } from '../utils/trackUtils';
import '../styles/Player.css';

const Player = ({ currentTrack, isPlaying, volume, onPlay, onPause, onVolumeChange, totalTracks, currentIndex }) => {
  const [time, setTime] = useState(0);
  const [bars, setBars] = useState(Array(40).fill(0));
  const [progress, setProgress] = useState(0);

  // Update visualizer when playing
  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(40).fill(0).map(() => Math.random() * 15));
      return;
    }

    const interval = setInterval(() => {
      setBars(Array(40).fill(0).map(() => Math.random() * 100));
    }, 80);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update time when playing
  useEffect(() => {
    if (!isPlaying || !currentTrack) return;

    const interval = setInterval(() => {
      setTime(prev => {
        const newTime = prev + 0.1;
        if (newTime >= currentTrack.duration) {
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  // Reset time when track changes
  useEffect(() => {
    setTime(0);
  }, [currentTrack]);

  // Calculate progress bar
  useEffect(() => {
    if (currentTrack && currentTrack.duration > 0) {
      setProgress((time / currentTrack.duration) * 100);
    }
  }, [time, currentTrack]);

  return (
    <div className="player">
      <div className="player-display">
        {currentTrack ? (
          <>
            {currentTrack.imageUrl && (
              <div className="album-art-container">
                <img src={currentTrack.imageUrl} alt="Album Art" className="album-art" />
                {isPlaying && <div className="playing-indicator">▶</div>}
              </div>
            )}
            <div className="player-info">
              <h2 className="track-title">{currentTrack.title}</h2>
              <p className="track-artist">{currentTrack.artist}</p>
              <p className="track-source">From <span className="source-badge">{currentTrack.source || 'unknown'}</span></p>
              <p className="track-position">
                {currentIndex >= 0 && totalTracks > 0 ? `Track ${currentIndex + 1} of ${totalTracks}` : 'No queue'}
              </p>
            </div>
          </>
        ) : (
          <div className="player-info empty-state">
            <h2>🎵 No Track Selected</h2>
            <p>Add tracks from Suno to get started</p>
          </div>
        )}
      </div>

      {currentTrack && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className="visualizer">
        {bars.map((bar, i) => (
          <div
            key={i}
            className="bar"
            style={{
              height: `${isPlaying && currentTrack ? bar : 5}%`,
              opacity: isPlaying ? 0.8 : 0.3,
              backgroundColor: `hsl(${(i / 40) * 360}, 100%, 50%)`
            }}
          />
        ))}
      </div>

      <div className="player-controls">
        <button
          className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="time-display">
          <span className="current-time">{formatDuration(time)}</span>
          <span className="separator">/</span>
          <span className="total-time">{currentTrack ? formatDuration(currentTrack.duration) : '0:00'}</span>
        </div>

        <div className="volume-control">
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
            className="volume-slider"
            title={`Volume: ${volume}%`}
          />
          <span className="volume-value">{volume}%</span>
        </div>
      </div>
    </div>
  );
};

export default Player;
