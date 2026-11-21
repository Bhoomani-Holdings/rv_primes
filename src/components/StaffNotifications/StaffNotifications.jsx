import { useState } from "react";
import { FiBell, FiCheck } from "react-icons/fi";
import "./StaffNotifications.css";

const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date)
    : "";
};

export default function StaffNotifications({ notifications = [], unreadCount = 0, error = "", onMarkAllRead }) {
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const markAllRead = async () => {
    setBusy(true);
    setActionError("");
    try {
      await onMarkAllRead?.();
    } catch (markError) {
      setActionError(markError.message || "Unable to update notifications.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="staff-notifications">
      <header className="staff-notifications__header">
        <div>
          <h1>Notifications</h1>
          <p>{unreadCount ? `${unreadCount} unread` : "You’re all caught up"}</p>
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={markAllRead} disabled={busy}>
            <FiCheck aria-hidden="true" /> {busy ? "Updating..." : "Mark all as read"}
          </button>
        )}
      </header>
      {error && <p className="staff-notifications__error" role="alert">{error}</p>}
      {actionError && <p className="staff-notifications__error" role="alert">{actionError}</p>}
      {notifications.length === 0 ? (
        <div className="staff-notifications__empty">No notifications yet.</div>
      ) : (
        <div className="staff-notifications__list">
          {notifications.map((notification) => (
            <article className={`staff-notifications__item${notification.readAt ? "" : " is-unread"}`} key={notification._id}>
              <span className="staff-notifications__icon"><FiBell aria-hidden="true" /></span>
              <div>
                <h2>{notification.title}</h2>
                <p>{notification.message}</p>
                <time dateTime={notification.createdAt}>{formatDate(notification.createdAt)}</time>
              </div>
              {!notification.readAt && <b>New</b>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
