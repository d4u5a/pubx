import React, { useState } from 'react';
import '../styles/SunoPlaylistImporter.css';

const SunoPlaylistImporter = ({ onAddToQueue }) => {
  const [activeTab, setActiveTab] = useState('import');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImportPlaylist = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Extract playlist ID from URL
      const playlistId = playlistUrl.includes('playlist/')
        ? playlistUrl.split('playlist/')[1].split('?')[0]
        : playlistUrl;

      const response = await fetch('/api/suno/import-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistId })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Added ${data.tracksAdded} tracks to queue!`);
        setPlaylistUrl('');
        
        // Add tracks to queue if callback provided
        if (data.queue && onAddToQueue) {
          data.queue.forEach(track => onAddToQueue(track));
        }
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/suno/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.results || []);
        setMessage(`Found ${(data.results || []).length} results`);
      } else {
        setMessage(`❌ Search error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrack = (track) => {
    onAddToQueue(track);
    setMessage(`✅ Added "${track.title}" to queue!`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="suno-importer">
      <h3>🎵 Suno Integration</h3>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          📋 Import Playlist
        </button>
        <button
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 Search
        </button>
      </div>

      {activeTab === 'import' && (
        <form onSubmit={handleImportPlaylist} className="import-form">
          <input
            type="text"
            placeholder="Paste Suno playlist URL: https://suno.com/playlist/..."
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? '⏳ Importing...' : '📥 Import Playlist'}
          </button>
        </form>
      )}

      {activeTab === 'search' && (
        <>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search Suno: song, artist, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? '⏳ Searching...' : '🔍 Search'}
            </button>
          </form>

          <div className="search-results">
            {searchResults.map((track, index) => (
              <div key={index} className="search-result-item">
                {track.imageUrl && (
                  <img src={track.imageUrl} alt={track.title} className="result-thumbnail" />
                )}
                <div className="result-info">
                  <div className="result-title">{track.title}</div>
                  <div className="result-artist">{track.artist}</div>
                </div>
                <button
                  className="add-btn"
                  onClick={() => handleAddTrack(track)}
                  title="Add to queue"
                >
                  ➕
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default SunoPlaylistImporter;
