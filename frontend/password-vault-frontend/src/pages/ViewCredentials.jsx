import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Copy,
  Edit3,
  Eye,
  EyeOff,
  Heart,
  Plus,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ViewCredentials() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [visible, setVisible] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [favouritesOnly, setFavouritesOnly] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const [share, setShare] = useState({
    open: false,
    credential: null,
    email: "",
    permission: "VIEW_ONLY",
    loading: false,
    error: "",
    success: false,
  });

  const fetchCredentials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/credentials");
      setCredentials(response.data);
    } catch (error) {
      console.error("Failed to fetch credentials:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const categories = useMemo(
    () => [
      "All",
      ...new Set(credentials.map((item) => item.category).filter(Boolean)),
    ],
    [credentials]
  );

  const filteredCredentials = useMemo(() => {
    const query = search.toLowerCase();

    return credentials.filter((item) => {
      const matchesSearch = [
        item.websiteName,
        item.username,
        item.category,
      ].some((value) => value?.toLowerCase().includes(query));

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesFavourite =
        !favouritesOnly || item.favourite;

      return matchesSearch && matchesCategory && matchesFavourite;
    });
  }, [credentials, search, category, favouritesOnly]);

  const viewPassword = async (id) => {
    try {
      const response = await api.get(`/credentials/${id}/password`);

      setPasswords((current) => ({
        ...current,
        [id]: response.data,
      }));

      setVisible((current) => ({
        ...current,
        [id]: true,
      }));
    } catch (error) {
      alert(error.response?.data || "Unable to view password");
    }
  };

  const copyPassword = async (password) => {
    if (!password) {
      alert("First view password");
      return;
    }

    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteCredential = async (id) => {
    try {
      await api.delete(`/credentials/${id}`);
      fetchCredentials();
    } catch (error) {
      alert(error.response?.data || "Unable to delete credential");
    }
  };

  const openShare = (credential) => {
    setShare({
      open: true,
      credential,
      email: "",
      permission: "VIEW_ONLY",
      loading: false,
      error: "",
      success: false,
    });
  };

  const closeShare = () => {
    setShare((current) => ({
      ...current,
      open: false,
      email: "",
      error: "",
      success: false,
    }));
  };

  const handleShare = async (event) => {
    event.preventDefault();

    if (!share.email.trim()) {
      setShare((current) => ({
        ...current,
        error: "Please enter employee email",
      }));
      return;
    }

    try {
      setShare((current) => ({
        ...current,
        loading: true,
        error: "",
      }));

      await api.post(
        `/credentials/${share.credential.id}/share`,
        {
          email: share.email.trim(),
          permission: share.permission,
        }
      );

      setShare((current) => ({
        ...current,
        loading: false,
        email: "",
        success: true,
      }));
    } catch (error) {
      setShare((current) => ({
        ...current,
        loading: false,
        error:
          error.response?.data?.message ||
          error.response?.data ||
          "Unable to share credential",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Secure vault
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              My Credentials
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage and securely access your saved accounts.
            </p>
          </div>

          <button
            onClick={() => navigate("/add-credential")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Add Credential
          </button>
        </header>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by website, username or category..."
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-950"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Categories" : item}
                </option>
              ))}
            </select>

            <button
              onClick={() => setFavouritesOnly((value) => !value)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                favouritesOnly
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Heart size={15} className="mr-2 inline" />
              {favouritesOnly ? "Show All" : "Favourites"}
            </button>
          </div>
        </div>

        {copied && (
          <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Password copied successfully.
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Loading credentials...
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
            <p className="font-semibold text-slate-800">
              No credentials found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCredentials.map((item) => (
              <CredentialCard
                key={item.id}
                item={item}
                visible={visible[item.id]}
                password={passwords[item.id]}
                onView={() =>
                  visible[item.id]
                    ? setVisible((current) => ({
                        ...current,
                        [item.id]: false,
                      }))
                    : viewPassword(item.id)
                }
                onCopy={() => copyPassword(passwords[item.id])}
                onEdit={() =>
                  navigate(`/edit-credential/${item.id}`)
                }
                onShare={() => openShare(item)}
                onDelete={() => {
                  if (window.confirm("Delete credential?")) {
                    deleteCredential(item.id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>

      {share.open && (
        <ShareModal
          share={share}
          setShare={setShare}
          onClose={closeShare}
          onSubmit={handleShare}
        />
      )}
    </div>
  );
}

function CredentialCard({
  item,
  visible,
  password,
  onView,
  onCopy,
  onEdit,
  onShare,
  onDelete,
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700">
            {item.websiteName?.[0]?.toUpperCase() || "?"}
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-bold text-slate-900">
              {item.websiteName}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {item.category || "General"}
            </p>
          </div>
        </div>

        {item.favourite && (
          <Heart size={17} fill="currentColor" className="shrink-0 text-rose-500" />
        )}
      </div>

      <div className="space-y-3">
        <InfoRow label="Username" value={item.username} />

        {item.canView ? (
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">
              Password
            </p>

            <div className="flex gap-2">
              <input
                readOnly
                type={visible ? "text" : "password"}
                value={visible ? password || "" : "••••••••"}
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />

              <IconButton onClick={onView}>
                {visible ? <EyeOff size={16} /> : <Eye size={16} />}
              </IconButton>

              <IconButton onClick={onCopy}>
                <Copy size={16} />
              </IconButton>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            Password viewing is not permitted.
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        {item.canEdit && (
          <ActionButton onClick={onEdit} primary>
            <Edit3 size={15} />
            Edit
          </ActionButton>
        )}

        {!item.shared && (
          <ActionButton onClick={onShare}>
            <Share2 size={15} />
            Share
          </ActionButton>
        )}

        {item.canDelete && (
          <ActionButton onClick={onDelete} danger>
            <Trash2 size={15} />
          </ActionButton>
        )}
      </div>
    </article>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
        {value || "Not available"}
      </p>
    </div>
  );
}

function IconButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-slate-200 px-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
    >
      {children}
    </button>
  );
}

function ActionButton({ onClick, children, primary, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
        primary
          ? "bg-slate-950 text-white hover:bg-slate-800"
          : danger
            ? "border border-red-200 text-red-600 hover:bg-red-50"
            : "border border-slate-200 text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function ShareModal({ share, setShare, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="font-bold text-slate-950">Share Credential</h2>
            <p className="mt-1 text-xs text-slate-500">
              Share {share.credential?.websiteName} securely.
            </p>
          </div>

          <button type="button" onClick={onClose}>
            <X className="text-slate-400 hover:text-slate-950" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <input
            type="email"
            placeholder="employee@gmail.com"
            value={share.email}
            onChange={(event) =>
              setShare((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
          />

          <select
            value={share.permission}
            onChange={(event) =>
              setShare((current) => ({
                ...current,
                permission: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-950"
          >
            <option value="VIEW_ONLY">👁 View Only</option>
            <option value="EDIT_ACCESS">✏️ Edit Access</option>
            <option value="FULL_MANAGEMENT">🔥 Full Management</option>
          </select>

          {share.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {share.error}
            </div>
          )}

          {share.success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Credential shared successfully.
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-slate-100 bg-slate-50 p-6">
          <button
            type="submit"
            disabled={share.loading}
            className="flex-1 rounded-lg bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {share.loading ? "Sharing..." : "Share Credential"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ViewCredentials;
