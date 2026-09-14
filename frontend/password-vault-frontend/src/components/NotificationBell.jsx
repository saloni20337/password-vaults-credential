
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NotificationBell() {
  const navigate = useNavigate();
  const ref = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  const paths = {
    LOGIN: "/login-activity",
    FAILED_LOGIN: "/security-alerts",
    SECURITY_ALERT: "/security-alerts",
    SUSPICIOUS_ACTIVITY: "/suspicious-activity",
    CREDENTIAL_SHARED: "/manage-shared",
    PASSWORD_EXPIRATION: "/credentials",
    AUDIT: "/audit-logs",
    AUDIT_LOG: "/audit-logs",
  };

  const load = async () => {
    try {
      const [n, c] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread-count"),
      ]);
      setNotifications(n.data);
      setUnread(c.data);
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const clickNotification = async (n) => {
    const path = paths[n.type];

    if (n.read) {
      setOpen(false);
      if (path) navigate(path);
      return;
    }

    try {
      await api.put(`/notifications/${n.id}/read`);
    } catch (err) {
      console.error("Read error:", err);
    } finally {
      setOpen(false);
      if (path) navigate(path);
      load();
    }
  };

  const markAll = async () => {
    try {
      await api.put("/notifications/read-all");
      load();
    } catch (err) {
      console.error("Mark all error:", err);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(true)}
        className="relative rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[350px] overflow-hidden rounded-2xl border bg-white text-slate-900 shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h3 className="font-bold">Notifications</h3>
              <p className="text-xs text-slate-500">
                {unread ? `${unread} unread` : "You're all caught up"}
              </p>
            </div>

            {unread > 0 && (
              <button
                onClick={markAll}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">
                No notifications
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => clickNotification(n)}
                  className={`w-full border-b px-4 py-4 text-left hover:bg-slate-50 ${
                    !n.read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-xl">🔔</span>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <b className="text-sm">{n.title}</b>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-600" />
                        )}
                      </div>

                      <p className="mt-1 text-xs text-slate-600">
                        {n.message}
                      </p>

                      <p className="mt-2 text-[10px] text-slate-400">
                        {new Date(n.createdAt).toLocaleString()}
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