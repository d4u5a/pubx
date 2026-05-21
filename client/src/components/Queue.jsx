import React, { useState } from 'react';
import { sortByTitle, sortByArtist, sortByDuration, shuffleTracks } from '../utils/sortingUtils';
import { calculateTotalDuration, formatDuration } from '../utils/trackUtils';
import '../styles/Queue.css';

const Queue = ({ queue, currentTrackIndex, onSelectTrack, onRemoveTrack, onMoveTrack }) => {
  const [sortBy, setSortBy] = useState('none');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(false);

  const filteredQueue = queue.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSortedQueue = () => {
    if (sortBy === 'title') return sortByTitle(filteredQueue);
    if (sortBy === 'artist') return sortByArtist(filteredQueue);
    if (sortBy === 'duration') return sortByDuration(filteredQueue);
    if (sortBy === 'shuffle') return shuffleTracks(filteredQueue);
    return filteredQueue;
  };

  const displayQueue = getSortedQueue();
  const totalDuration = calculateTotalDuration(queue);
  const avgDuration = queue.length > 0 ? totalDuration / queue.length : 0;

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex) => {
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onMoveTrack(draggedIndex, targetIndex);
      setDraggedIndex(null);
    }
  };

  return (
    <div className="queue">
      <div className="queue-header">
        <h3>📋 Queue ({queue.length})</h3>
        <button
          className="stats-toggle"
          onClick={() => setShowStats(!showStats)}
          title="Show statistics"
        >
          📊
        </button>
      </div>

      {showStats && queue.length > 0 && (
        <div className="queue-stats">
          <div className="stat-item">
            <span>Total Duration:</span>
            <strong>{formatDuration(totalDuration)}</strong>
          </div>
          <div className="stat-item">
            <span>Avg Duration:</span>
            <strong>{formatDuration(avgDuration)}</strong>
          </div>
          <div className="stat-item">
            <span>Unique Artists:</span>
            <strong>{new Set(queue.map(t => t.artist)).size}</strong>
          </div>
        </div>
      )}

      <div className="queue-controls">
        <input
          type="text"
          placeholder="🔍 Search tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="none">Sort by...</option>
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="duration">Duration</option>
          <option value="shuffle">Shuffle</option>
        </select>
      </div>

      <div className="queue-list">
        {queue.length === 0 ? (
          <p className="empty-queue">🎹 No tracks in queue. Add some from Suno!</p>
        ) : displayQueue.length === 0 ? (
          <p className="empty-queue">🔍 No tracks match your search</p>
        ) : (
          displayQueue.map((track, displayIndex) => {
            const actualIndex = queue.indexOf(track);
            return (
              <div
                key={actualIndex}
                className={`queue-item ${actualIndex === currentTrackIndex ? 'active' : ''} ${draggedIndex === actualIndex ? 'dragging' : ''}`}
                onClick={() => onSelectTrack(actualIndex)}
                draggable
                onDragStart={() => handleDragStart(actualIndex)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(actualIndex)}
              >
                <div className="queue-item-info">
                  <span className="track-number">{displayIndex + 1}</span>
                  <div className="track-details">
                    <div className="track-title">{track.title}</div>
                    <div className="track-artist">by {track.artist}</div>
                  </div>
                </div>
                <div className="track-duration">{formatDuration(track.duration)}</div>
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTrack(actualIndex);
                  }}
                  title="Remove from queue"
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Queue;
