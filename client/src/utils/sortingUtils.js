/**
 * Sorting utility functions for tracks and playlists
 */

/**
 * Sort tracks by title (alphabetically)
 * @param {Array} tracks - Array of track objects
 * @param {String} order - 'asc' or 'desc'
 * @returns {Array} Sorted tracks
 */
export function sortByTitle(tracks, order = 'asc') {
  return [...tracks].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort tracks by artist name
 * @param {Array} tracks - Array of track objects
 * @param {String} order - 'asc' or 'desc'
 * @returns {Array} Sorted tracks
 */
export function sortByArtist(tracks, order = 'asc') {
  return [...tracks].sort((a, b) => {
    const comparison = a.artist.localeCompare(b.artist);
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort tracks by duration
 * @param {Array} tracks - Array of track objects
 * @param {String} order - 'asc' or 'desc'
 * @returns {Array} Sorted tracks
 */
export function sortByDuration(tracks, order = 'asc') {
  return [...tracks].sort((a, b) => {
    const comparison = a.duration - b.duration;
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort tracks by date added (most recent first by default)
 * @param {Array} tracks - Array of track objects with dateAdded property
 * @param {String} order - 'asc' or 'desc'
 * @returns {Array} Sorted tracks
 */
export function sortByDateAdded(tracks, order = 'desc') {
  return [...tracks].sort((a, b) => {
    const dateA = new Date(a.dateAdded || 0);
    const dateB = new Date(b.dateAdded || 0);
    const comparison = dateA - dateB;
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort tracks by source (suno, youtube, spotify, etc.)
 * @param {Array} tracks - Array of track objects
 * @param {String} order - 'asc' or 'desc'
 * @returns {Array} Sorted tracks
 */
export function sortBySource(tracks, order = 'asc') {
  return [...tracks].sort((a, b) => {
    const comparison = (a.source || 'unknown').localeCompare(b.source || 'unknown');
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Shuffle tracks (Fisher-Yates algorithm)
 * @param {Array} tracks - Array of track objects
 * @returns {Array} Shuffled tracks
 */
export function shuffleTracks(tracks) {
  const shuffled = [...tracks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Sort tracks by custom comparator function
 * @param {Array} tracks - Array of track objects
 * @param {Function} comparator - Custom comparison function
 * @returns {Array} Sorted tracks
 */
export function sortByCustom(tracks, comparator) {
  return [...tracks].sort(comparator);
}

/**
 * Group tracks by a property
 * @param {Array} tracks - Array of track objects
 * @param {String} property - Property to group by (e.g., 'artist', 'source')
 * @returns {Object} Grouped tracks
 */
export function groupTracks(tracks, property) {
  return tracks.reduce((groups, track) => {
    const key = track[property] || 'Unknown';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(track);
    return groups;
  }, {});
}

/**
 * Filter and sort tracks
 * @param {Array} tracks - Array of track objects
 * @param {Function} filterFn - Filter function
 * @param {String} sortBy - Sort criteria ('title', 'artist', 'duration', 'dateAdded', 'source')
 * @param {String} order - 'asc' or 'desc'
 * @returns {Array} Filtered and sorted tracks
 */
export function filterAndSort(tracks, filterFn, sortBy = 'title', order = 'asc') {
  const filtered = tracks.filter(filterFn);
  
  switch (sortBy) {
    case 'title':
      return sortByTitle(filtered, order);
    case 'artist':
      return sortByArtist(filtered, order);
    case 'duration':
      return sortByDuration(filtered, order);
    case 'dateAdded':
      return sortByDateAdded(filtered, order);
    case 'source':
      return sortBySource(filtered, order);
    default:
      return filtered;
  }
}
