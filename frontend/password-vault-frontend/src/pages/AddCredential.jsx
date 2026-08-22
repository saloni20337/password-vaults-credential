import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const categories = [
  ["Social", "Social Media"],
  ["Education", "Education"],
  ["Banking", "Banking & Finance"],
  ["Work", "Work & Professional"],
  ["Shopping", "Shopping & Retail"],
  ["Entertainment", "Entertainment"],
  ["Other", "Other"],
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100";

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
  const [strength, setStrength] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkStrength = useCallback((password) => {
    if (!password) {
      setStrength("");
      return;
    }

    const score = [
      password.length >= 8,
      password.length >= 12,
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
      /[a-z]/.test(password) && /[A-Z]/.test(password),
    ].filter(Boolean).length;

    setStrength(
      password.length < 5 || score <= 1
        ? "weak"
        : score <= 3
          ? "medium"
          : "strong"
    );
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;

    setError("");
    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));

    if (name === "password") checkStrength(value);
  };

  const generatePassword = () => {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghijkmnpqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#$%^&*()-_=+?";
    const all = upper + lower + numbers + symbols;

    const random = (chars) =>
      chars[Math.floor(Math.random() * chars.length)];

    const required = [
      random(upper),
      random(lower),
      random(numbers),
      random(symbols),
    ];

    while (required.length < 16) {
      required.push(random(all));
    }

    const password = required
      .sort(() => Math.random() - 0.5)
      .join("");

    setFormData((current) => ({
      ...current,
      password,
    }));

    checkStrength(password);
    setShowPassword(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.websiteName.trim()) {
      return setError("Website name is required.");
    }

    if (!formData.username.trim()) {
      return setError("Username or email is required.");
    }

    if (!formData.password) {
      return setError("Password is required.");
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);

      await api.post("/credentials/add", formData);

      setSuccess(true);
      setFormData({
        websiteName: "",
        username: "",
        password: "",
        category: "",
        favourite: false,
      });
      setStrength("");

      setTimeout(() => navigate("/credentials"), 1500);
    } catch (requestError) {
      console.error("Failed to save credential:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Failed to save credential. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const strengthStyles = {
    weak: {
      label: "Weak password",
      color: "bg-rose-500",
      text: "text-rose-600",
      width: "33%",
    },
    medium: {
      label: "Medium password",
      color: "bg-amber-500",
      text: "text-amber-600",
      width: "66%",
    },
    strong: {
      label: "Strong password",
      color: "bg-emerald-500",
      text: "text-emerald-600",
      width: "100%",
    },
  };

  const currentStrength = strengthStyles[strength];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
        >
          <ArrowLeft size={18} />
          Back to Vault
        </button>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-950 to-slate-800 px-6 py-7 text-white sm:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <KeyRound size={24} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Secure vault
                  </p>

                  <h1 className="mt-1 text-2xl font-bold">
                    Add Credential
                  </h1>

                  <p className="mt-1 text-sm text-slate-300">
                    Save your account securely in the vault.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/credentials")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <Eye size={17} />
                View Credentials
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {success && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                <Check size={20} />

                <div>
                  <p className="text-sm font-semibold">
                    Credential saved successfully.
                  </p>

                  <p className="mt-0.5 text-xs">
                    Redirecting to your vault...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Website Name" required>
                <input
                  name="websiteName"
                  type="text"
                  placeholder="e.g. Netflix, Gmail, Amazon"
                  value={formData.websiteName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>

              <Field label="Username / Email" required>
                <input
                  name="username"
                  type="text"
                  placeholder="e.g. name@example.com"
                  value={formData.username}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-slate-700">
                    Password<span className="ml-1 text-rose-500">*</span>
                  </label>

                  <button
                    type="button"
                    onClick={generatePassword}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                  >
                    <Zap size={14} />
                    Generate
                  </button>
                </div>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-12 font-mono`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-950"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {currentStrength && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className={`font-semibold ${currentStrength.text}`}>
                        {currentStrength.label}
                      </span>

                      <span className="text-slate-400">
                        {formData.password.length} characters
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full transition-all ${currentStrength.color}`}
                        style={{ width: currentStrength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Field label="Category">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">Select a category...</option>

                  {categories.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <input
                  name="favourite"
                  type="checkbox"
                  checked={formData.favourite}
                  onChange={handleChange}
                  className="h-4 w-4 accent-amber-500"
                />

                <span className="text-sm font-semibold text-amber-700">
                  Mark as favorite ⭐
                </span>
              </label>

              <div className="border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    "Saving credential..."
                  ) : success ? (
                    <>
                      <Check size={17} />
                      Saved Successfully
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />
                      Save Credential
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      {children}
    </div>
  );
}

export default AddCredential;
