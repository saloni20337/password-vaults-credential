import { useEffect, useState } from "react";
import api from "../services/api";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const loadNotifications = async () => {
    try {
      const [notificationsRes, countRes] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread-count"),
      ]);

      setNotifications(notificationsRes.data);
      setUnreadCount(countRes.data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Check for new notifications every 10 seconds
    const interval = setInterval(loadNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      loadNotifications();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <div className="relative">
      {/* Bell */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h3 className="font-bold">Notifications</h3>
              <p className="text-xs text-slate-500">
                {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="text-3xl">🔔</div>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  No notifications
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  You're all caught up.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    !notification.read &&
                    markAsRead(notification.id)
                  }
                  className={`block w-full border-b border-slate-100 px-4 py-4 text-left transition hover:bg-slate-50 ${
                    !notification.read ? "bg-blue-50/70" : "bg-white"
                  }`}
                >
                  <div className="flex gap-3">

                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                      {notification.type === "LOGIN" && "🔐"}
                      {notification.type === "FAILED_LOGIN" && "⚠️"}
                      {notification.type === "CREDENTIAL_SHARED" && "🔗"}
                      {notification.type === "PASSWORD_EXPIRATION" && "⏰"}
                      {![
                        "LOGIN",
                        "FAILED_LOGIN",
                        "CREDENTIAL_SHARED",
                        "PASSWORD_EXPIRATION",
                      ].includes(notification.type) && "🔔"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-800">
                          {notification.title}
                        </h4>

                        {!notification.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        )}
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-[10px] text-slate-400">
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;