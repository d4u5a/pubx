import React from 'react';
import '../styles/Queue.css';

const Queue = ({ queue, currentTrackIndex, onSelectTrack, onRemoveTrack }) => {
  return (
    <div className="queue">
      <h3>📋 Queue ({queue.length})</h3>
      <div className="queue-list">
        {queue.length === 0 ? (
          <p className="empty-queue">No tracks in queue. Add some from Suno!</p>
        ) : (
          queue.map((track, index) => (
            <div
              key={index}
              className={`queue-item ${index === currentTrackIndex ? 'active' : ''}`}
              onClick={() => onSelectTrack(index)}
            >
              <div className="queue-item-info">
                <span className="track-number">{index + 1}</span>
                <div className="track-details">
                  <div className="track-title">{track.title}</div>
                  <div className="track-artist">{track.artist}</div>
                </div>
              </div>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTrack(index);
                }}
                title="Remove from queue"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Queue;
