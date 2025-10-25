/**
 * Triggers haptic feedback on supported devices for a more tactile user experience.
 * This function checks for browser support before attempting to vibrate.
 * @param pattern A vibration pattern. Can be a single value for milliseconds
 * for a simple tap, or an array of values to alternate between vibrating and
 * not vibrating for more complex effects.
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
 */
export const triggerHapticFeedback = (pattern: number | number[] = 30) => {
  // Check if the Vibration API is supported
  if (window.navigator && 'vibrate' in window.navigator) {
    try {
      // A catch block is used because some browsers may throw an error
      // if the user has disabled vibration in their settings.
      window.navigator.vibrate(pattern);
    } catch (e) {
      // Silently fail if vibration is not possible.
      console.log("Haptic feedback failed. It might be disabled in browser settings.");
    }
  }
};
