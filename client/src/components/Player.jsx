import React, { useState, useEffect } from 'react';
import '../styles/Player.css';

const Player = ({ currentTrack, isPlaying, volume, onPlay, onPause, onVolumeChange }) => {
  const [time, setTime] = useState(0);
  const [analyser, setAnalyser] = useState(null);
  const [bars, setBars] = useState(Array(40).fill(0));

  useEffect(() => {
    // Simulate visualizer
    const interval = setInterval(() => {
      setBars(Array(40).fill(0).map(() => Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setTime(prev => prev + 0.1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="player">
      <div className="player-display">
        {currentTrack ? (
          <>
            {currentTrack.imageUrl && (
              <img src={currentTrack.imageUrl} alt="Album Art" className="album-art" />
            )}
            <div className="player-info">
              <h2>{currentTrack.title}</h2>
              <p>{currentTrack.artist}</p>
            </div>
          </>
        ) : (
          <div className="player-info">
            <h2>No Track Selected</h2>
            <p>Select a track from the queue</p>
          </div>
        )}
      </div>

      <div className="visualizer">
        {bars.map((bar, i) => (
          <div
            key={i}
            className="bar"
            style={{
              height: `${isPlaying ? bar : 5}%`,
              opacity: isPlaying ? 0.8 : 0.3
            }}
          />
        ))}
      </div>

      <div className="player-controls">
        <button
          className={`control-btn ${isPlaying ? 'active' : ''}`}
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="time-display">
          <span>{formatTime(time)}</span>
          <span>{currentTrack ? `/ ${formatTime(currentTrack.duration)}` : '/ 0:00'}</span>
        </div>

        <div className="volume-control">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
            className="volume-slider"
          />
          <span>{volume}%</span>
        </div>
      </div>
    </div>
  );
};

export default Player;
