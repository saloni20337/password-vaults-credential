import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

/**
 * Modern SVG Icons (Lucide-style)
 */
const Icons = {
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Key: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3L15.5 7.5z"/></svg>
  ),
  Star: ({ fill = "none" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Layers: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  )
};

function Dashboard() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem("name") || "User";

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await api.get("/credentials");
        setCredentials(response.data);
      } catch (error) {
        console.error("Failed to fetch credentials:", error);
      } finally {
        // Simulate a slight delay for smoother skeleton transitions
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchCredentials();
  }, []);

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const stats = useMemo(() => {
    const total = credentials.length;
    const favorites = credentials.filter(c => c.favourite).length;
    const categories = new Set(credentials.map(c => c.category).filter(Boolean)).size;
    const weak = credentials.filter(c => c.password && c.password.length < 8).length;
    
    const passwordUsage = {};
    credentials.forEach(c => { if (c.password) passwordUsage[c.password] = (passwordUsage[c.password] || 0) + 1; });
    const reused = credentials.filter(c => c.password && passwordUsage[c.password] > 1).length;
    
    const score = total === 0 ? 100 : Math.round(((total - weak - reused) / total) * 100);
    return { total, favorites, categories, weak, reused, score: Math.max(0, Math.min(100, score)), passwordUsage };
  }, [credentials]);

  const categoryData = useMemo(() => {
    return Array.from(new Set(credentials.map(c => c.category).filter(Boolean)))
      .map(cat => ({ name: cat, count: credentials.filter(c => c.category === cat).length }))
      .sort((a, b) => b.count - a.count);
  }, [credentials]);

  const riskyOnes = useMemo(() => {
    return credentials
      .map(c => {
        const issues = [];
        if (c.password && c.password.length < 8) issues.push("Weak");
        if (c.password && stats.passwordUsage[c.password] > 1) issues.push("Reused");
        return { ...c, issues };
      })
      .filter(c => c.issues.length > 0)
      .slice(0, 5);
  }, [credentials, stats.passwordUsage]);

  const recent = useMemo(() => [...credentials].slice(-5).reverse(), [credentials]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {getGreeting()}, <span className="text-indigo-600">{username}</span>
            </h1>
            <p className="text-slate-500 mt-1 text-lg">Your digital vault is secure and up to date.</p>
          </div>
          <Link to="/add-credential" 
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]">
            <Icons.Plus />
            Add New Credential
          </Link>
        </header>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Icons.Key />} label="Total Items" value={stats.total} loading={loading} />
          <StatCard icon={<Icons.Star fill="currentColor" />} label="Favorites" value={stats.favorites} loading={loading} color="text-amber-500" />
          <StatCard icon={<Icons.Layers />} label="Categories" value={stats.categories} loading={loading} />
          <StatCard icon={<Icons.Alert />} label="Weak Passwords" value={stats.weak} loading={loading} color={stats.weak > 0 ? "text-rose-500" : "text-emerald-500"} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Security & Insights */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Security Score Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Icons.Shield /> Security Health
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">Overall protection score based on password strength</p>
                </div>
                <div className={`text-4xl font-black ${stats.score >= 80 ? 'text-emerald-500' : stats.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {loading ? "..." : `${stats.score}%`}
                </div>
              </div>
              <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${stats.score >= 80 ? 'bg-emerald-500' : stats.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: loading ? '0%' : `${stats.score}%` }}
                />
              </div>
              <div className="mt-4 flex justify-between text-sm font-medium text-slate-400">
                <span>Critical</span>
                <span>Fair</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Security Insights */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-lg font-bold">Security Insights</h2>
                {riskyOnes.length > 0 && (
                  <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {riskyOnes.length} Action{riskyOnes.length > 1 ? 's' : ''} Required
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-50">
                {loading ? (
                  [1, 2, 3].map(i => <SkeletonRow key={i} />)
                ) : riskyOnes.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 italic">No security risks detected. Great job!</div>
                ) : (
                  riskyOnes.map(item => (
                    <div key={item.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                          {item.websiteName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{item.websiteName}</h4>
                          <div className="flex gap-2 mt-1">
                            {item.issues.map(issue => (
                              <span key={issue} className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${issue === 'Weak' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'}`}>
                                {issue}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/edit-credential/${item.id}`)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95">
                        Fix Now
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Categories & Recent */}
          <div className="space-y-8">
            {/* Category Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold mb-6">Categories</h2>
              <div className="space-y-5">
                {loading ? (
                  [1, 2, 3].map(i => <SkeletonBar key={i} />)
                ) : categoryData.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">Categorize your items to see stats.</p>
                ) : (
                  categoryData.map(cat => (
                    <div key={cat.name} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-slate-600">{cat.name}</span>
                        <span className="text-slate-400">{cat.count}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                          style={{ width: `${(cat.count / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recently Added */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold mb-6">Recently Added</h2>
              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map(i => <SkeletonRowSmall key={i} />)
                ) : recent.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">Start adding credentials to see activity.</p>
                ) : (
                  recent.map(item => (
                    <div key={item.id} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {item.websiteName?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate text-slate-900">{item.websiteName}</p>
                        <p className="text-xs text-slate-400 truncate">{item.category || "General"}</p>
                      </div>
                      {item.favourite && <div className="text-amber-400"><Icons.Star fill="currentColor" /></div>}
                    </div>
                  ))
                )}
              </div>
              <Link to="/credentials" className="mt-6 block text-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                View All Vault Items →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Sub-components for UI elements
 */

function StatCard({ icon, label, value, loading, color = "text-slate-900" }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          {loading ? (
            <div className="h-8 w-12 bg-slate-100 animate-pulse rounded-md mt-1" />
          ) : (
            <h3 className={`text-2xl font-black mt-0.5 ${color}`}>{value}</h3>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="p-5 flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-100 rounded" />
          <div className="h-3 w-20 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="h-8 w-20 bg-slate-100 rounded-lg" />
    </div>
  );
}

function SkeletonRowSmall() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-slate-100" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 bg-slate-100 rounded" />
        <div className="h-2 w-16 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

function SkeletonBar() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="flex justify-between">
        <div className="h-3 w-20 bg-slate-100 rounded" />
        <div className="h-3 w-8 bg-slate-100 rounded" />
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full" />
    </div>
  );
}

export default Dashboard;

