import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  LogIn,
  ArrowLeft,
  RefreshCw,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function SecurityAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/security/analytics");
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load security analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const cards = [
    ["Total Logins", analytics?.totalLogins, LogIn, "text-cyan-300"],
    ["Successful", analytics?.successfulLogins, CheckCircle2, "text-emerald-300"],
    ["Failed", analytics?.failedLogins, AlertTriangle, "text-amber-300"],
    ["Suspicious", analytics?.suspiciousActivities, ShieldAlert, "text-violet-300"],
    ["Alerts", analytics?.securityAlerts, ShieldCheck, "text-red-300"],
  ];

  return (
    <div className="min-h-screen bg-[#090a0c] text-zinc-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <Link
              to="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-cyan-300"
            >
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center bg-violet-300/10 text-violet-300">
                <BarChart3 className="size-6" />
              </div>

              <div>
                <h1 className="text-3xl font-semibold">
                  Security Analytics
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                  Monitor your application's security activity.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchAnalytics}
            className="flex items-center justify-center gap-2 border border-white/[0.08] px-4 py-2 text-sm hover:border-cyan-300/30"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 flex justify-between border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}

            <button onClick={fetchAnalytics}>
              Retry
            </button>
          </div>
        )}

        {/* SECURITY STATISTICS */}
        <section className="mt-7">

          <h2 className="text-sm font-semibold">
            Security Statistics
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {cards.map(([label, value, Icon, color]) => (
              <div
                key={label}
                className="border border-white/[0.08] bg-white/[0.025] p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    {label}
                  </span>

                  <Icon className={`size-5 ${color}`} />
                </div>

                {loading ? (
                  <div className="mt-5 h-8 w-12 animate-pulse bg-white/[0.08]" />
                ) : (
                  <p className={`mt-5 text-3xl font-semibold ${color}`}>
                    {value ?? 0}
                  </p>
                )}
              </div>
            ))}

          </div>
        </section>

        {/* LOGIN ACTIVITY */}
        <ActivitySection
          title="Login Activity"
          description="Latest successful and failed login attempts."
          icon={Activity}
          data={analytics?.recentLoginActivities}
          loading={loading}
          to="/login-activity"
          render={(item) => (
            <>
              <div>
                <p className="text-sm text-zinc-200">
                  {item.username || "Unknown User"}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  {item.status || "Login Activity"}
                </p>
              </div>

              <span className="text-xs text-zinc-600">
                {item.loginTime
                  ? new Date(item.loginTime).toLocaleString()
                  : ""}
              </span>
            </>
          )}
        />

        {/* SUSPICIOUS ACTIVITIES */}
        <ActivitySection
          title="Suspicious Activities"
          description="Recently detected suspicious activities."
          icon={ShieldAlert}
          data={analytics?.recentSuspiciousActivities}
          loading={loading}
          to="/suspicious-activity"
          render={(item) => (
            <>
              <div>
                <p className="text-sm text-zinc-200">
                  {item.activityType || "Suspicious Activity"}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  {item.description || "Activity detected"}
                </p>
              </div>

              <span className="text-xs text-zinc-600">
                {item.detectedAt
                  ? new Date(item.detectedAt).toLocaleString()
                  : ""}
              </span>
            </>
          )}
        />

        {/* SECURITY ALERTS */}
        <ActivitySection
          title="Security Alerts"
          description="Latest security alerts generated by the system."
          icon={AlertTriangle}
          data={analytics?.recentSecurityAlerts}
          loading={loading}
          to="/security-alerts"
          render={(item) => (
            <>
              <div>
                <p className="text-sm text-zinc-200">
                  {item.title || item.alertType || "Security Alert"}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  {item.message || item.description || "Alert generated"}
                </p>
              </div>

              <span className="text-xs text-zinc-600">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : ""}
              </span>
            </>
          )}
        />

        {/* AUDIT / RECENT ACTIVITY */}
        <ActivitySection
          title="Audit & Recent Activity"
          description="Important recent security activities recorded in audit logs."
          icon={ShieldCheck}
          data={analytics?.recentAuditActivities}
          loading={loading}
          to="/audit-logs"
          render={(item) => (
            <>
              <div>
                <p className="text-sm text-zinc-200">
                  {item.action || "System Activity"}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  {item.description || "Activity recorded"}
                </p>
              </div>

              <span className="text-xs text-zinc-600">
                {item.timestamp
                  ? new Date(item.timestamp).toLocaleString()
                  : ""}
              </span>
            </>
          )}
        />

      </main>
    </div>
  );
}


function ActivitySection({
  title,
  description,
  icon: Icon,
  data,
  loading,
  to,
  render,
}) {

  return (
    <section className="mt-7 border border-white/[0.08] bg-white/[0.025]">

      <div className="flex items-center justify-between border-b border-white/[0.07] p-5">

        <div className="flex items-center gap-3">
          <Icon className="size-5 text-cyan-300" />

          <div>
            <h2 className="text-sm font-semibold">
              {title}
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              {description}
            </p>
          </div>
        </div>

        <Link
          to={to}
          className="flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200"
        >
          View All
          <ArrowUpRight className="size-4" />
        </Link>

      </div>

      <div className="divide-y divide-white/[0.07]">

        {loading ? (

          <div className="space-y-3 p-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 animate-pulse bg-white/[0.05]"
              />
            ))}
          </div>

        ) : data?.length ? (

          data.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-5 hover:bg-white/[0.02]"
            >
              {render(item)}
            </div>
          ))

        ) : (

          <div className="p-8 text-center text-sm text-zinc-600">
            No recent activity found.
          </div>

        )}

      </div>

    </section>
  );
}



export default SecurityAnalytics;