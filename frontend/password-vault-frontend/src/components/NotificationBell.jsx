
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NotificationBell() {
  const navigate = useNavigate();
  const notificationRef = useRef(null);

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

  // Close notification popup when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Decide where each notification should open
  const getNotificationPath = (type) => {
    switch (type) {
      case "LOGIN":
        return "/login-activity";

      case "FAILED_LOGIN":
        return "/security-alerts";

      case "CREDENTIAL_SHARED":
        return "/manage-shared";

      case "PASSWORD_EXPIRATION":
        return "/credentials";

      case "SUSPICIOUS_ACTIVITY":
        return "/suspicious-activity";

      case "SECURITY_ALERT":
        return "/security-alerts";

      case "AUDIT":
      case "AUDIT_LOG":
        return "/audit-logs";

      default:
        return null;
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      await loadNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      await loadNotifications();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark unread notification as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to relevant page
    const path = getNotificationPath(notification.type);

    if (path) {
      setOpen(false);
      navigate(path);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "LOGIN":
        return "🔐";

      case "FAILED_LOGIN":
        return "⚠️";

      case "CREDENTIAL_SHARED":
        return "🔗";

      case "PASSWORD_EXPIRATION":
        return "⏰";

      case "SUSPICIOUS_ACTIVITY":
        return "🚨";

      case "SECURITY_ALERT":
        return "🛡️";

      case "AUDIT":
      case "AUDIT_LOG":
        return "📋";

      default:
        return "🔔";
    }
  };

  const getNotificationIconStyle = (type) => {
    switch (type) {
      case "LOGIN":
        return "bg-blue-50";

      case "FAILED_LOGIN":
        return "bg-amber-50";

      case "CREDENTIAL_SHARED":
        return "bg-indigo-50";

      case "PASSWORD_EXPIRATION":
        return "bg-orange-50";

      case "SUSPICIOUS_ACTIVITY":
        return "bg-red-50";

      case "SECURITY_ALERT":
        return "bg-purple-50";

      case "AUDIT":
      case "AUDIT_LOG":
        return "bg-slate-100";

      default:
        return "bg-slate-100";
    }
  };

  return (
    <div
      ref={notificationRef}
      className="relative"
      onMouseLeave={() => setOpen(false)}
    >
      {/* Bell */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Popup */}
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-3 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl"
          onMouseEnter={() => setOpen(true)}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Notifications
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                {unreadCount === 0
                  ? "You're all caught up"
                  : `${unreadCount} unread notification${
                      unreadCount !== 1 ? "s" : ""
                    }`}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="rounded-md px-2 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  🔔
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  You're all caught up.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const path = getNotificationPath(notification.type);

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`group block w-full border-b border-slate-100 px-4 py-4 text-left transition ${
                      !notification.read
                        ? "bg-blue-50/60 hover:bg-blue-100/70"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${getNotificationIconStyle(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`text-sm ${
                              !notification.read
                                ? "font-bold text-slate-900"
                                : "font-semibold text-slate-800"
                            }`}
                          >
                            {notification.title}
                          </h4>

                          {!notification.read && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {notification.message}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-[10px] text-slate-400">
                            {new Date(
                              notification.createdAt
                            ).toLocaleString()}
                          </p>

                          {path && (
                            <span className="text-[10px] font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
                              View →
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
