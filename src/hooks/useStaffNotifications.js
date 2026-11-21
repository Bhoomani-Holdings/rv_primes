import { useCallback, useEffect, useState } from "react";
import { getStaffNotifications, markStaffNotificationsRead } from "../services/staffNotificationService";

export default function useStaffNotifications(session) {
  const accessToken = session?.accessToken;
  const [data, setData] = useState({ unreadCount: 0, notifications: [] });
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!accessToken) {
      setData({ unreadCount: 0, notifications: [] });
      return;
    }
    try {
      const result = await getStaffNotifications(accessToken);
      setData({
        unreadCount: Number(result.unreadCount) || 0,
        notifications: Array.isArray(result.notifications) ? result.notifications : []
      });
      setError("");
    } catch (loadError) {
      setError(loadError.message || "Unable to load notifications.");
    }
  }, [accessToken]);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, 20000);
    window.addEventListener("staff-notifications-updated", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("staff-notifications-updated", refresh);
    };
  }, [refresh]);

  const markAllRead = async () => {
    if (!accessToken) return;
    await markStaffNotificationsRead(accessToken);
    await refresh();
    window.dispatchEvent(new Event("staff-notifications-updated"));
  };

  return { ...data, error, refresh, markAllRead };
}
