import React from 'react';
import '../styles/QueueControls.css';

const QueueControls = ({ queueLength, isShuffle, repeat, onShuffle, onRepeat, onClearQueue }) => {
  return (
    <div className="queue-controls-panel">
      <div className="control-group">
        <button
          className={`control-button ${isShuffle ? 'active' : ''}`}
          onClick={onShuffle}
          title="Toggle shuffle mode"
        >
          🔀 Shuffle
        </button>
        <button
          className={`control-button repeat-btn ${repeat !== 'off' ? 'active' : ''}`}
          onClick={onRepeat}
          title="Toggle repeat mode"
        >
          🔁 {repeat === 'one' ? 'Repeat One' : repeat === 'all' ? 'Repeat All' : 'Repeat'}
        </button>
      </div>
      <div className="control-group">
        <button
          className="control-button clear-btn"
          onClick={onClearQueue}
          disabled={queueLength === 0}
          title="Clear queue"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};

export default QueueControls;
