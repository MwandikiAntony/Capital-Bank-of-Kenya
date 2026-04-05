// client/src/services/notifications.js
import api from "../utils/api";

/**
 * Fetches the current user's notifications from the API.
 * Silently ignores 401 errors (handled globally by the axios interceptor).
 * @returns {Promise<Array>} Array of notification objects
 */
export const fetchNotifications = async () => {
  try {
    const res = await api.get("/account/notifications");
    return res.data;
  } catch (err) {
    if (err.response?.status !== 401) {
      console.error("Error fetching notifications:", err);
    }
    throw err;
  }
};