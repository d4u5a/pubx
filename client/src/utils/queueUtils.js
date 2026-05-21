/**
 * Queue management utility functions
 */

/**
 * Move track to new position in queue
 * @param {Array} queue - Current queue
 * @param {Number} fromIndex - Current position
 * @param {Number} toIndex - New position
 * @returns {Array} Updated queue
 */
export function moveTrack(queue, fromIndex, toIndex) {
  const newQueue = [...queue];
  const [removed] = newQueue.splice(fromIndex, 1);
  newQueue.splice(toIndex, 0, removed);
  return newQueue;
}

/**
 * Remove track from queue by index
 * @param {Array} queue - Current queue
 * @param {Number} index - Index to remove
 * @returns {Array} Updated queue
 */
export function removeFromQueue(queue, index) {
  return queue.filter((_, i) => i !== index);
}

/**
 * Remove multiple tracks from queue
 * @param {Array} queue - Current queue
 * @param {Array} indices - Indices to remove
 * @returns {Array} Updated queue
 */
export function removeMultipleFromQueue(queue, indices) {
  const indicesToRemove = new Set(indices);
  return queue.filter((_, i) => !indicesToRemove.has(i));
}

/**
 * Clear entire queue
 * @returns {Array} Empty array
 */
export function clearQueue() {
  return [];
}

/**
 * Add tracks to queue
 * @param {Array} queue - Current queue
 * @param {Array} tracks - Tracks to add
 * @param {Number} insertIndex - Position to insert at (default: end)
 * @returns {Array} Updated queue
 */
export function addToQueue(queue, tracks, insertIndex = queue.length) {
  const newQueue = [...queue];
  newQueue.splice(insertIndex, 0, ...tracks);
  return newQueue;
}

/**
 * Replace entire queue
 * @param {Array} newQueue - New queue
 * @returns {Array} New queue
 */
export function replaceQueue(newQueue) {
  return [...newQueue];
}

/**
 * Get current track from queue
 * @param {Array} queue - Current queue
 * @param {Number} currentIndex - Current track index
 * @returns {Object|null} Current track or null
 */
export function getCurrentTrack(queue, currentIndex) {
  if (currentIndex >= 0 && currentIndex < queue.length) {
    return queue[currentIndex];
  }
  return null;
}

/**
 * Get next track in queue
 * @param {Array} queue - Current queue
 * @param {Number} currentIndex - Current track index
 * @param {Boolean} loop - Loop to start if at end
 * @returns {Object|null} Next track or null
 */
export function getNextTrack(queue, currentIndex, loop = false) {
  const nextIndex = currentIndex + 1;
  
  if (nextIndex < queue.length) {
    return queue[nextIndex];
  }
  
  if (loop && queue.length > 0) {
    return queue[0];
  }
  
  return null;
}

/**
 * Get previous track in queue
 * @param {Array} queue - Current queue
 * @param {Number} currentIndex - Current track index
 * @param {Boolean} loop - Loop to end if at start
 * @returns {Object|null} Previous track or null
 */
export function getPreviousTrack(queue, currentIndex, loop = false) {
  const prevIndex = currentIndex - 1;
  
  if (prevIndex >= 0) {
    return queue[prevIndex];
  }
  
  if (loop && queue.length > 0) {
    return queue[queue.length - 1];
  }
  
  return null;
}

/**
 * Get next track index
 * @param {Number} currentIndex - Current index
 * @param {Number} queueLength - Length of queue
 * @param {Boolean} loop - Loop to start if at end
 * @returns {Number} Next index or -1
 */
export function getNextIndex(currentIndex, queueLength, loop = false) {
  const nextIndex = currentIndex + 1;
  
  if (nextIndex < queueLength) {
    return nextIndex;
  }
  
  if (loop && queueLength > 0) {
    return 0;
  }
  
  return -1;
}

/**
 * Duplicate track in queue
 * @param {Array} queue - Current queue
 * @param {Number} index - Index of track to duplicate
 * @returns {Array} Updated queue with duplicated track
 */
export function duplicateTrack(queue, index) {
  const newQueue = [...queue];
  const track = newQueue[index];
  if (track) {
    newQueue.splice(index + 1, 0, { ...track });
  }
  return newQueue;
}

/**
 * Find track position in queue by ID
 * @param {Array} queue - Current queue
 * @param {String} trackId - Track ID to find
 * @returns {Number} Index or -1 if not found
 */
export function findTrackIndex(queue, trackId) {
  return queue.findIndex(track => track.id === trackId);
}

/**
 * Check if track is in queue
 * @param {Array} queue - Current queue
 * @param {String} trackId - Track ID to check
 * @returns {Boolean} True if track is in queue
 */
export function isTrackInQueue(queue, trackId) {
  return findTrackIndex(queue, trackId) !== -1;
}

/**
 * Get queue slice (for pagination)
 * @param {Array} queue - Current queue
 * @param {Number} start - Start index
 * @param {Number} limit - Number of items to return
 * @returns {Array} Slice of queue
 */
export function getQueueSlice(queue, start = 0, limit = 50) {
  return queue.slice(start, start + limit);
}
