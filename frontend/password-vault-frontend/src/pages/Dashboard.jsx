import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Folder,
  KeyRound,
  Plus,
  ShieldCheck,
  Star,
  Activity,
  RefreshCw,
  BarChart3,
LogIn,
ShieldAlert,
} from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState(null);
const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const navigate = useNavigate();
  const username = "User";

 const fetchCredentials = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const response = await api.get("/credentials");

    if (!Array.isArray(response.data)) {
      throw new Error("Invalid response");
    }

    const safeCredentials = response.data.map((credential) => {
      const {
        password,
        passwordStrength,
        isWeak,
        weakPassword,
        ...safeCredential
      } = credential;

      const weak =
        typeof weakPassword === "boolean"
          ? weakPassword
          : typeof isWeak === "boolean"
          ? isWeak
          : passwordStrength === "weak" ||
            (typeof password === "string" && password.length < 8);

      return {
        ...safeCredential,
        isWeak: weak,
        passwordStrength,
      };
    });

    setCredentials(safeCredentials);

  } catch (requestError) {
    console.error("Failed to fetch credentials:", requestError);

    if (requestError.response?.status === 401) {
      navigate("/login", { replace: true });
      return;
    }

    setError("Unable to load your vault. Please try again.");

  } finally {
    setLoading(false);
  }
}, [navigate]);


const fetchAnalytics = useCallback(async () => {
  try {
    setAnalyticsLoading(true);

    const response =
      await api.get("/security/analytics");

    setAnalytics(response.data);

  } catch (error) {
    console.error(
      "Failed to fetch security analytics:",
      error
    );

  } finally {
    setAnalyticsLoading(false);
  }
}, []);


useEffect(() => {
  fetchCredentials();
  fetchAnalytics();
}, [fetchCredentials, fetchAnalytics]);


const stats = useMemo(
  () => ({
    total: credentials.length,
    favorites: credentials.filter((item) => item.favourite).length,
    categories: new Set(
      credentials.map((item) => item.category).filter(Boolean)
    ).size,
    weak: credentials.filter((item) => item.isWeak).length,
  }),
  [credentials]
);


const recent = useMemo(
  () =>
    [...credentials]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
      .slice(0, 5),
  [credentials]
);


const securityScore = loading
  ? 0
  : stats.total === 0
  ? 100
  : Math.max(
      0,
      Math.round(
        ((stats.total - stats.weak) / stats.total) * 100
      )
    );


const statItems = [
  {
    label: "Credentials",
    value: stats.total,
    detail: "Saved in your vault",
    icon: KeyRound,
    accent: "text-cyan-300",
  },
  {
    label: "Favorites",
    value: stats.favorites,
    detail: "Quickly accessible",
    icon: Star,
    accent: "text-amber-300",
  },
  {
    label: "Categories",
    value: stats.categories,
    detail: "Organized groups",
    icon: Folder,
    accent: "text-violet-300",
  },
  {
    label: "Weak passwords",
    value: stats.weak,
    detail: stats.weak > 0
      ? "Review recommended"
      : "All protected",
    icon: AlertTriangle,
    accent: stats.weak > 0
      ? "text-amber-300"
      : "text-emerald-300",
    warning: stats.weak > 0,
  },
];

  return (
    <div className="min-h-screen bg-[#090a0c] text-zinc-100">
      <Navbar />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.06),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
          <header className="flex flex-col gap-6 border-b border-white/[0.07] pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                Private vault
              </div>

              <p className="text-sm text-zinc-500">Welcome back,</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-zinc-100 sm:text-4xl">
                {username}
              </h1>
              <p className="mt-2 text-sm text-zinc-500 sm:text-base">
                Your credentials are organized, protected, and ready when you need them.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 text-xs text-zinc-500 sm:flex">
                <span className="size-2 rounded-full bg-emerald-400" />
                Vault active
              </div>

              <Link
                to="/add-credential"
                className="inline-flex items-center gap-2 border border-cyan-300/20 bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <Plus className="size-4" />
                Add credential
              </Link>
            </div>
          </header>

          {error && (
            <div className="mt-6 flex flex-col gap-3 border border-red-400/20 bg-red-500/[0.07] p-4 text-sm text-red-200 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={fetchCredentials}
                className="inline-flex items-center gap-2 self-start text-sm font-semibold text-red-100 hover:text-white sm:self-auto"
              >
                <RefreshCw className="size-4" />
                Retry
              </button>
            </div>
          )}

          <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statItems.map((item) => (
              <StatCard
                key={item.label}
                {...item}
                loading={loading}
              />
            ))}
          </section>

          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(290px,0.85fr)]">
            <section className="space-y-6">
              <div className="border border-white/[0.08] bg-white/[0.025]">
                <div className="flex flex-col gap-5 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`grid size-11 shrink-0 place-items-center ${
                      stats.weak > 0
                        ? "bg-amber-300/10 text-amber-300"
                        : "bg-emerald-300/10 text-emerald-300"
                    }`}>
                      {stats.weak > 0 ? (
                        <AlertTriangle className="size-5" />
                      ) : (
                        <ShieldCheck className="size-5" />
                      )}
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-zinc-100">
                        Security status
                      </h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        A live overview of your saved credential health.
                      </p>
                    </div>
                  </div>

                  <span className={`w-fit px-3 py-1.5 text-xs font-semibold ${
                    stats.weak > 0
                      ? "bg-amber-300/10 text-amber-300"
                      : "bg-emerald-300/10 text-emerald-300"
                  }`}>
                    {loading
                      ? "Checking..."
                      : stats.weak > 0
                      ? "Review needed"
                      : "Protected"}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <SecurityScore score={securityScore} loading={loading} />

                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-zinc-200">
                        Password health
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {loading
                          ? "Checking your vault..."
                          : stats.weak > 0
                          ? `${stats.weak} weak password${stats.weak > 1 ? "s" : ""} detected.`
                          : "No weak passwords detected."}
                      </p>

                      {!loading && (
                        <div className="mt-4 space-y-2 text-xs">
                          <StatusLine
                            ok={stats.weak === 0}
                            text={stats.weak === 0 ? "No weak passwords detected" : "Weak passwords need attention"}
                          />
                          <StatusLine
                            ok
                            text={`${stats.total} credential${stats.total === 1 ? "" : "s"} monitored`}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {!loading && stats.weak > 0 && (
                    <Link
                      to="/credentials"
                      className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4 text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                      Review weak passwords
                      <ArrowUpRight className="size-4" />
                    </Link>
                  )}
                </div>
              </div>

              <section className="overflow-hidden border border-white/[0.08] bg-white/[0.025]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5 sm:px-6">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-100">
                      Recently added
                    </h2>
                    <p className="mt-1 text-xs text-zinc-600">
                      Your latest saved credentials.
                    </p>
                  </div>

                  <Link
                    to="/credentials"
                    className="flex items-center gap-1 text-xs font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    View all
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {loading ? (
                    <LoadingRows />
                  ) : recent.length ? (
                    recent.map((item) => (
                      <VaultRow key={item.id} item={item} />
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </div>
              </section>
            </section>

            <aside className="space-y-6">
              <section className="border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-100">
                      Quick access
                    </h2>
                    <p className="mt-1 text-xs text-zinc-600">
                      Common vault actions
                    </p>
                  </div>
                  <Activity className="size-4 text-violet-300" />
                </div>

                <div className="mt-5 space-y-2">
                  <QuickLink
                    to="/credentials"
                    label="View credentials"
                    icon={KeyRound}
                  />
                  <QuickLink
                    to="/add-credential"
                    label="Add credential"
                    icon={Plus}
                  />
                  <QuickLink
                    to="/login-activity"
                    label="Login activity"
                    icon={Activity}
                  />
                </div>
              </section>

              <section className="border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-100">
                      Vault summary
                    </h2>
                    <p className="mt-1 text-xs text-zinc-600">
                      Your current overview
                    </p>
                  </div>
                  <KeyRound className="size-4 text-cyan-300" />
                </div>

                <div className="mt-5 divide-y divide-white/[0.07]">
                  <SummaryRow label="Credentials" value={loading ? "—" : stats.total} />
                  <SummaryRow label="Favorites" value={loading ? "—" : stats.favorites} />
                  <SummaryRow label="Categories" value={loading ? "—" : stats.categories} />
                  <SummaryRow
                    label="Weak passwords"
                    value={loading ? "—" : stats.weak}
                    warning={!loading && stats.weak > 0}
                  />
                </div>
              </section>

              <section className="border border-cyan-300/[0.08] bg-cyan-300/[0.025] p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-emerald-300" />
                  <div>
                    <p className="text-xs font-medium text-zinc-200">
                      Your vault is encrypted
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-600">
                      Your credentials remain securely protected.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
          <section className="mt-7 border border-white/[0.08] bg-white/[0.025]">

  <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

    <div className="flex items-center gap-3">

      <div className="grid size-10 place-items-center bg-violet-300/10 text-violet-300">
        <BarChart3 className="size-5" />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-zinc-100">
          Security Analytics
        </h2>

        <p className="mt-1 text-xs text-zinc-600">
          Real-time overview of your security activity.
        </p>
      </div>

    </div>

  <Link

  to="/security-analytics"
  className="flex items-center gap-1 text-xs font-medium text-cyan-300 hover:text-cyan-200"
>
  View Security Analytics
  <ArrowUpRight className="size-3.5" />
</Link>

  </div>


  <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-5 sm:p-6">

    <AnalyticsCard
      label="Total Logins"
      value={analytics?.totalLogins}
      icon={LogIn}
      loading={analyticsLoading}
       to="/login-activity"
    />

    <AnalyticsCard
      label="Successful"
      value={analytics?.successfulLogins}
      icon={CheckCircle2}
      accent="text-emerald-300"
      loading={analyticsLoading}
       to="/login-activity"
    />

    <AnalyticsCard
      label="Failed"
      value={analytics?.failedLogins}
      icon={AlertTriangle}
      accent="text-amber-300"
      loading={analyticsLoading}
        to="/login-activity"
    />

    <AnalyticsCard
      label="Suspicious"
      value={analytics?.suspiciousActivities}
      icon={ShieldAlert}
      accent="text-violet-300"
      loading={analyticsLoading}
       to="/suspicious-activity"
    />

    <AnalyticsCard
      label="Alerts"
      value={analytics?.securityAlerts}
      icon={ShieldCheck}
      accent="text-red-300"
      loading={analyticsLoading}
      to="/security-alerts"
    />

  </div>
  {analytics?.recentActivities?.length > 0 && (
  <section className="border-t border-white/[0.07] p-5 sm:p-6">

    <div className="mb-4 flex items-center justify-between">

      <div>
        <h3 className="text-sm font-semibold text-zinc-100">
          Recent Security Activity
        </h3>

        <p className="mt-1 text-xs text-zinc-600">
          Latest activities recorded in your security audit logs.
        </p>
      </div>

      <Link
        to="/audit-logs"
        className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
      >
        View all
      </Link>

    </div>

    <div className="space-y-2">

      {analytics.recentActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center justify-between border border-white/[0.07] p-3"
        >

          <div>
            <p className="text-sm text-zinc-200">
              {activity.action}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              {activity.description}
            </p>
          </div>

          <span className="text-[10px] text-zinc-600">
            {activity.timestamp
              ? new Date(activity.timestamp).toLocaleString()
              : ""}
          </span>

        </div>
      ))}

    </div>

  </section>
)}

</section>

          <footer className="mt-10 flex flex-col gap-3 border-t border-white/[0.07] pt-5 text-[11px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <span>Password Vault · Secure credential management</span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Vault system active
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
function AnalyticsCard({
  label,
  value,
  icon: Icon,
  accent = "text-cyan-300",
  loading,
   to
}) {
 const navigate = useNavigate();
  return (
    <button
  onClick={() => navigate(to)}
  className="w-full border border-white/[0.07] bg-white/[0.025] p-4 text-left cursor-pointer transition hover:border-cyan-300/[0.25] hover:bg-white/[0.05]"
>
      <div className="flex items-center justify-between">

        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
          {label}
        </span>

        <Icon
          className={`size-4 ${accent}`}
          strokeWidth={1.8}
        />

      </div>

      {loading ? (

        <div className="mt-4 h-7 w-10 animate-pulse bg-white/[0.08]" />

      ) : (

        <p className={`mt-3 text-2xl font-semibold ${accent}`}>
          {value ?? 0}
        </p>

      )}

   </button>
  );
}

function StatCard({ icon: Icon, label, value, detail, accent, warning, loading }) {
  return (
    <div className="border border-white/[0.08] bg-white/[0.035] p-5 transition duration-200 hover:border-white/[0.16] hover:bg-white/[0.05]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          {label}
        </span>
        <Icon className={`size-4 ${accent}`} strokeWidth={1.8} />
      </div>

      {loading ? (
        <div className="mt-5 h-9 w-16 animate-pulse bg-white/[0.08]" />
      ) : (
        <div className="mt-4 flex items-end justify-between gap-3">
          <span className={`text-3xl font-semibold tracking-tight ${
            warning ? "text-amber-300" : "text-zinc-100"
          }`}>
            {value}
          </span>
          <span className="pb-1 text-right text-[11px] text-zinc-600">
            {detail}
          </span>
        </div>
      )}
    </div>
  );
}

function SecurityScore({ score, loading }) {
  const angle = loading ? 0 : Math.round((score / 100) * 360);

  return (
    <div
      className="relative grid size-28 shrink-0 place-items-center rounded-full"
      style={{
        background: `conic-gradient(rgb(103 232 249) 0deg ${angle}deg, rgba(255,255,255,0.08) ${angle}deg 360deg)`,
      }}
    >
      <div className="grid size-[92px] place-items-center rounded-full bg-[#101114]">
        {loading ? (
          <div className="h-8 w-10 animate-pulse bg-white/[0.08]" />
        ) : (
          <div className="text-center">
            <span className="block text-2xl font-semibold">{score}</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-600">
              score
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusLine({ ok, text }) {
  return (
    <div className="flex items-center gap-2 text-zinc-500">
      <span className={`size-1.5 rounded-full ${ok ? "bg-emerald-300" : "bg-amber-300"}`} />
      {text}
    </div>
  );
}

function VaultRow({ item }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-white/[0.035] sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-cyan-300/10 text-sm font-bold text-cyan-200">
          {item.websiteName?.[0]?.toUpperCase() || "?"}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-200">
            {item.websiteName || "Unnamed credential"}
          </p>
          <p className="mt-1 truncate text-xs text-zinc-600">
            {item.category || "General"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {item.isWeak && (
          <span className="hidden bg-amber-300/10 px-2 py-1 text-[10px] font-semibold text-amber-300 sm:inline-flex">
            Weak
          </span>
        )}
        {item.favourite && (
          <Star className="size-4 fill-amber-300 text-amber-300" />
        )}
        <ArrowUpRight className="size-4 text-zinc-700" />
      </div>
    </div>
  );
}

function QuickLink({ to, label, icon: Icon }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 border border-white/[0.08] px-3 py-3 text-sm text-zinc-400 transition hover:border-cyan-300/30 hover:bg-white/[0.025] hover:text-cyan-200"
    >
      <span className="grid size-8 place-items-center bg-white/[0.05] text-cyan-300">
        <Icon className="size-4" />
      </span>
      {label}
      <ArrowUpRight className="ml-auto size-4 text-zinc-700 transition group-hover:text-cyan-300" />
    </Link>
  );
}

function SummaryRow({ label, value, warning }) {
  return (
    <div className="flex items-center justify-between py-3.5 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className={`font-semibold ${warning ? "text-amber-300" : "text-zinc-200"}`}>
        {value}
      </span>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-4 p-6">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center gap-3">
          <div className="size-10 animate-pulse rounded-lg bg-white/[0.08]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 animate-pulse bg-white/[0.08]" />
            <div className="h-2.5 w-20 animate-pulse bg-white/[0.05]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-white/[0.05]">
        <KeyRound className="size-5 text-zinc-500" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-200">
        No credentials saved yet.
      </p>
      <p className="mt-1 text-xs text-zinc-600">
        Add your first credential to get started.
      </p>
      <Link
        to="/add-credential"
        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
      >
        Add credential
        <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}

export default Dashboard;