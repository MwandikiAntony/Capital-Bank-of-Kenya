// services/notifications.js
import api from "../utils/api";

export const fetchNotifications = async () => {
  console.log("🔁 Fetching notifications...");
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
