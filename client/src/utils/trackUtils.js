/**
 * Track utility functions for queue management and operations
 */

/**
 * Calculate total duration of all tracks
 * @param {Array} tracks - Array of track objects
 * @returns {Number} Total duration in seconds
 */
export function calculateTotalDuration(tracks) {
  return tracks.reduce((total, track) => total + (track.duration || 0), 0);
}

/**
 * Format duration from seconds to MM:SS format
 * @param {Number} seconds - Duration in seconds
 * @returns {String} Formatted duration
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const formattedSecs = secs.toString().padStart(2, '0');
  const formattedMins = minutes.toString().padStart(2, '0');
  
  if (hours > 0) {
    return `${hours}:${formattedMins}:${formattedSecs}`;
  }
  return `${formattedMins}:${formattedSecs}`;
}

/**
 * Find track by ID
 * @param {Array} tracks - Array of track objects
 * @param {String} trackId - Track ID to find
 * @returns {Object|null} Track object or null
 */
export function findTrackById(tracks, trackId) {
  return tracks.find(track => track.id === trackId) || null;
}

/**
 * Get tracks by source
 * @param {Array} tracks - Array of track objects
 * @param {String} source - Source to filter by (e.g., 'suno', 'youtube')
 * @returns {Array} Filtered tracks
 */
export function getTracksBySource(tracks, source) {
  return tracks.filter(track => track.source === source);
}

/**
 * Search tracks by query
 * @param {Array} tracks - Array of track objects
 * @param {String} query - Search query
 * @param {Array} searchFields - Fields to search in (default: ['title', 'artist'])
 * @returns {Array} Matching tracks
 */
export function searchTracks(tracks, query, searchFields = ['title', 'artist']) {
  const lowerQuery = query.toLowerCase();
  
  return tracks.filter(track => 
    searchFields.some(field => 
      (track[field] || '').toLowerCase().includes(lowerQuery)
    )
  );
}

/**
 * Get unique artists from tracks
 * @param {Array} tracks - Array of track objects
 * @returns {Array} Array of unique artist names
 */
export function getUniqueArtists(tracks) {
  const artists = new Set();
  tracks.forEach(track => {
    if (track.artist) {
      artists.add(track.artist);
    }
  });
  return Array.from(artists).sort();
}

/**
 * Get track statistics
 * @param {Array} tracks - Array of track objects
 * @returns {Object} Statistics object
 */
export function getTrackStats(tracks) {
  const stats = {
    totalTracks: tracks.length,
    totalDuration: calculateTotalDuration(tracks),
    averageDuration: 0,
    uniqueArtists: getUniqueArtists(tracks).length,
    uniqueSources: new Set(tracks.map(t => t.source)).size,
    minDuration: Math.min(...tracks.map(t => t.duration || 0)),
    maxDuration: Math.max(...tracks.map(t => t.duration || 0))
  };
  
  stats.averageDuration = stats.totalTracks > 0 ? stats.totalDuration / stats.totalTracks : 0;
  
  return stats;
}

/**
 * Remove duplicate tracks by ID
 * @param {Array} tracks - Array of track objects
 * @returns {Array} Tracks without duplicates
 */
export function removeDuplicates(tracks) {
  const seen = new Set();
  return tracks.filter(track => {
    if (seen.has(track.id)) {
      return false;
    }
    seen.add(track.id);
    return true;
  });
}

/**
 * Validate track object
 * @param {Object} track - Track object to validate
 * @returns {Boolean} True if valid
 */
export function isValidTrack(track) {
  return (
    track &&
    typeof track === 'object' &&
    track.id &&
    track.title &&
    (typeof track.duration === 'number' || track.duration > 0)
  );
}

/**
 * Transform Suno track response to standard format
 * @param {Object} sunoTrack - Suno API track response
 * @returns {Object} Standardized track object
 */
export function transformSunoTrack(sunoTrack) {
  return {
    id: sunoTrack.id || sunoTrack.gpt_description_prompt,
    title: sunoTrack.title || 'Untitled',
    artist: sunoTrack.display_name || 'Unknown Artist',
    duration: sunoTrack.duration || 180,
    url: sunoTrack.audio_url || '',
    imageUrl: sunoTrack.image_url || '',
    sunoUrl: `https://suno.com/song/${sunoTrack.id || sunoTrack.gpt_description_prompt}`,
    source: 'suno',
    dateAdded: new Date().toISOString()
  };
}

/**
 * Batch transform tracks from Suno format
 * @param {Array} sunoTracks - Array of Suno API track responses
 * @returns {Array} Array of standardized tracks
 */
export function transformSunoTracks(sunoTracks) {
  return sunoTracks.map(transformSunoTrack);
}
