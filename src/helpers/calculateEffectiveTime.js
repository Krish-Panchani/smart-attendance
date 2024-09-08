// ../helpers/calculateEffectiveTime

/**
 * Calculates the total effective time from logs.
 * @param {Array} logs - An array of log objects with timestamp and status.
 * @returns {number} The total effective time in minutes.
 */
export const calculateEffectiveTime = (logs) => {
    let totalMinutes = 0;
    let lastCheckin = null;
  
    logs.forEach(log => {
      const timestamp = log.timestamp.toDate();
      if (log.status === 'checkin') {
        lastCheckin = timestamp;
      } else if (log.status === 'checkout' && lastCheckin) {
        const diff = timestamp - lastCheckin;
        totalMinutes += Math.round(diff / 60000);
        lastCheckin = null;
      }
    });
  
    if (lastCheckin) {
      // Add time from last check-in to now if the user is still checked in
      const now = new Date();
      const diff = now - lastCheckin;
      totalMinutes += Math.round(diff / 60000);
    }
  
    return totalMinutes;
  };
  
  /**
   * Finds the last checkout log from the given logs.
   * @param {Array} logs - An array of log objects with timestamp and status.
   * @returns {Object|null} The last checkout log or null if no checkout logs are found.
   */
  export const lastCheckout = (logs) => {
    const checkoutLogs = logs.filter(log => log.status === 'checkout');
    if (checkoutLogs.length === 0) return null;
  
    return checkoutLogs.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate())[0];
  };
  
  /**
   * Gets the list of logs.
   * @param {Array} logs - An array of log objects with timestamp and status.
   * @returns {Array} The list of logs.
   */
  export const logs = (logs) => {
    return logs;
  };
  