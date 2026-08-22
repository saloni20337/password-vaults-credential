import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const credentialItems = [
  ["/add-credential", "Add Credential"],
  ["/credentials", "View Credentials"],
  ["/manage-shared", "Shared Credentials"],
];

const securityItems = [
  ["/login-activity", "Login Activity"],
  ["/suspicious-activity", "Suspicious Activity"],
    ["/security-alerts", "Security Alerts"],
  ["/audit-logs", "Audit Logs"],
];

function Navbar() {
  const navigate = useNavigate();
  const navRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      await api.get("/user/profile");
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    const closeMenus = (event) => {
      if (!navRef.current?.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, [fetchProfile]);

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const toggleMenu = (menu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/login", { replace: true });
  };

  const openLogout = () => {
    closeAll();
    setShowLogoutPopup(true);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950 text-white shadow-lg"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/dashboard"
            onClick={closeAll}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-950 shadow-sm">
              PV
            </div>

            <div className="hidden sm:block">
              <h1 className="text-sm font-bold tracking-wide">
                Password Vault
              </h1>
              <p className="text-[10px] text-slate-400">
                Secure your digital life
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/dashboard" onClick={closeAll}>
              Dashboard
            </NavLink>

            <Dropdown
              label="Credentials"
              open={openMenu === "credentials"}
              onClick={() => toggleMenu("credentials")}
            >
              {credentialItems.map(([to, label]) => (
                <DropdownLink key={to} to={to} onClick={closeAll}>
                  {label}
                </DropdownLink>
              ))}
            </Dropdown>

            <Dropdown
              label="Security"
              open={openMenu === "security"}
              onClick={() => toggleMenu("security")}
            >
              {securityItems.map(([to, label]) => (
                <DropdownLink key={to} to={to} onClick={closeAll}>
                  {label}
                </DropdownLink>
              ))}
            </Dropdown>

            <NavLink to="/profile" onClick={closeAll}>
              Profile
            </NavLink>

            <button
              type="button"
              onClick={openLogout}
              className="ml-3 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:border-red-400/50 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Logout
            </button>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen((value) => !value);
              setOpenMenu(null);
            }}
            className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 md:hidden"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
            <div className="space-y-1">
              <MobileLink to="/dashboard" onClick={closeAll}>
                Dashboard
              </MobileLink>

              <MobileDropdown
                label="Credentials"
                open={openMenu === "credentials"}
                onClick={() => toggleMenu("credentials")}
              >
                {credentialItems.map(([to, label]) => (
                  <MobileDropdownLink key={to} to={to} onClick={closeAll}>
                    {label}
                  </MobileDropdownLink>
                ))}
              </MobileDropdown>

              <MobileDropdown
                label="Security"
                open={openMenu === "security"}
                onClick={() => toggleMenu("security")}
              >
                {securityItems.map(([to, label]) => (
                  <MobileDropdownLink key={to} to={to} onClick={closeAll}>
                    {label}
                  </MobileDropdownLink>
                ))}
              </MobileDropdown>

              <MobileLink to="/profile" onClick={closeAll}>
                Profile
              </MobileLink>

              <button
                type="button"
                onClick={openLogout}
                className="mt-3 w-full rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-left text-sm font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {showLogoutPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-lg text-red-600">
                !
              </div>

              <h2 id="logout-title" className="text-lg font-bold text-slate-950">
                Log out?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to log out of your Password Vault?
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowLogoutPopup(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
    >
      {children}
    </Link>
  );
}

function Dropdown({ label, open, onClick, children }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-500 ${
          open
            ? "bg-white/10 text-white"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        {label}
        <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-slate-900 shadow-xl">
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
    >
      {children}
    </Link>
  );
}

function MobileLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}

function MobileDropdown({ label, open, onClick, children }) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        {label}
        <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="ml-3 border-l border-slate-700 pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

function MobileDropdownLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}

export default Navbar;

