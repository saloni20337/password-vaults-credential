import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        form
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", form.email);

      setShowPopup(true);
    } catch (requestError) {
      console.error("Login failed:", requestError);
      setError("Incorrect email or password. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-5 top-5 rounded-lg px-3 py-2 text-2xl text-slate-500 transition hover:bg-white hover:text-slate-950"
      >
        ←
      </button>

      <main className="flex min-h-screen items-center justify-center">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white">
              <ShieldCheck size={25} />
            </div>

            <h1 className="mt-4 text-2xl font-bold text-slate-950">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Access your Password Vault securely.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              error={error}
              onChange={(value) => updateField("email", value)}
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  className={`w-full rounded-lg border bg-white px-3 py-3 pr-11 text-sm outline-none transition focus:ring-2 focus:ring-slate-200 ${
                    error ? "border-red-300" : "border-slate-300"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-950"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                <p className="text-xs font-semibold text-red-800">
                  Login failed
                </p>
                <p className="mt-0.5 text-xs text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-slate-600 hover:text-slate-950 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <p className="pt-3 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-slate-950 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </form>
        </section>
      </main>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  ✓
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Login Successful
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    You have successfully logged in to your Password Vault.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Account</span>
                  <span className="truncate font-medium text-slate-800">
                    {form.email}
                  </span>
                </div>

                <div className="border-t border-slate-200" />

                <div className="flex justify-between">
                  <span className="text-slate-500">Login status</span>
                  <span className="font-medium text-emerald-600">
                    ● Successful
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Login details recorded.
              </p>
            </div>

            <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, type, placeholder, value, error, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition focus:ring-2 focus:ring-slate-200 ${
          error ? "border-red-300" : "border-slate-300"
        }`}
      />
    </div>
  );
}

export default Login;
