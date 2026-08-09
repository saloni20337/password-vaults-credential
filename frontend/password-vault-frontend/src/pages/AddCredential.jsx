import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Icons = {
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  Key: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3L15.5 7.5z"/></svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  EyeOff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  ),
  Zap: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Share: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
};

const CATEGORIES = [
  { value: "Social", label: "Social Media" },
  { value: "Education", label: "Education" },
  { value: "Banking", label: "Banking & Finance" },
  { value: "Work", label: "Work & Professional" },
  { value: "Shopping", label: "Shopping & Retail" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Other", label: "Other" },
];

function AddCredential() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    websiteName: "",
    username: "",
    password: "",
    category: "",
    favourite: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setError("");
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "password") checkStrength(value);
  }, []);

  const checkStrength = useCallback((password) => {
    if (!password) {
      setStrength("");
      return;
    }
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;
    if (hasUpperLower) score++;

    if (password.length < 5 || score <= 1) setStrength("weak");
    else if (score <= 3) setStrength("medium");
    else setStrength("strong");
  }, []);

  const generatePassword = useCallback(() => {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghijkmnpqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#$%^&*()-_=+?";
    const allChars = upper + lower + numbers + symbols;
    const length = 16;

    let password = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];
    for (let i = password.length; i < length; i++) {
      password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }
    password = password.sort(() => Math.random() - 0.5).join("");

    setFormData((prev) => ({ ...prev, password }));
    checkStrength(password);
    setShowPassword(true);
  }, [checkStrength]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.websiteName.trim()) return setError("Website name is required");
    if (!formData.username.trim()) return setError("Username or email is required");
    if (!formData.password) return setError("Password is required");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters");

    try {
      setLoading(true);
      await api.post("/credentials/add", formData);
      setSuccess(true);
      setFormData({ websiteName: "", username: "", password: "", category: "", favourite: false });
      setStrength("");
      setTimeout(() => navigate("/credentials"), 1500);
    } catch (error) {
      console.error("Failed to save credential:", error);
      setError(error.response?.data?.message || "Failed to save credential. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const strengthConfig = {
    weak: { label: "Weak", color: "bg-rose-500", text: "text-rose-600", width: "33%" },
    medium: { label: "Medium", color: "bg-amber-500", text: "text-amber-600", width: "66%" },
    strong: { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600", width: "100%" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-semibold"
        >
          <Icons.ArrowLeft />
          <span>Back to Vault</span>
        </button>

        {/* Form Card */}
        <div className="bg-white border border-slate-100 border-t-4 border-t-indigo-500 rounded-3xl shadow-xl shadow-indigo-100/50 p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                <Icons.Key />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Add New Credential</h1>
                <p className="text-slate-500 mt-0.5 text-sm">Save a new account to your vault</p>
              </div>
            </div>
            <button
  type="button"
  onClick={() => navigate("/credentials")}
  className="flex items-center gap-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
>
  <Icons.Eye />
<span>View Credentials</span>
</button>

          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
              <div className="text-emerald-500"><Icons.Check /></div>
              <div>
                <p className="font-semibold text-emerald-700 text-sm">Credential saved successfully!</p>
                <p className="text-xs text-emerald-600">Redirecting to vault...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl">
              <p className="font-semibold text-rose-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Website Name */}
            <FormField label="Website Name" required>
              <input
                type="text"
                name="websiteName"
                placeholder="e.g. Netflix, Gmail, Amazon"
                value={formData.websiteName}
                onChange={handleChange}
                className="w-full bg-indigo-50/40 border border-indigo-100 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              />
            </FormField>

            {/* Username / Email */}
            <FormField label="Username / Email" required>
              <input
                type="text"
                name="username"
                placeholder="e.g. name@example.com"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-indigo-50/40 border border-indigo-100 text-slate-900 placeholder-slate-400 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              />
            </FormField>

            {/* Password */}
            <div>
              {/* Label row with Generate button OUTSIDE the input, top-right */}
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">
                  Password<span className="text-rose-500 ml-0.5">*</span>
                </label>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-semibold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Icons.Zap />
                  Generate Password
                </button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-indigo-50/40 border border-indigo-100 text-slate-900 placeholder-slate-400 px-4 py-2.5 pr-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>

                {strength && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${strengthConfig[strength].text}`}>
                        {strengthConfig[strength].label} password
                      </span>
                      <span className="text-xs text-slate-400">{formData.password.length} characters</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strengthConfig[strength].color}`}
                        style={{ width: strengthConfig[strength].width }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <FormField label="Category">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-indigo-50/40 border border-indigo-100 text-slate-900 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer text-sm"
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </FormField>

            {/* Favorite Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <input
                type="checkbox"
                name="favourite"
                checked={formData.favourite}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
              <span className="text-amber-700 text-sm font-medium">Mark as favorite ⭐</span>
            </label>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-200 active:scale-[0.98] disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : success ? "Saved! Redirecting..." : "Save Credential"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default AddCredential;