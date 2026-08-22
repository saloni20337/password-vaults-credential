import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Profile() {
  const [profile, setProfile] = useState({
    name: localStorage.getItem("name") || "User",
    email: localStorage.getItem("email") || "user@example.com",
  });

  const [form, setForm] = useState(profile);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      await api.put(
        "/user/profile/update",
        {
          oldEmail: profile.email,
          name: form.name,
          email: form.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProfile(form);
      localStorage.setItem("name", form.name);
      localStorage.setItem("email", form.email);
      setEdit(false);

      alert("Profile Updated Successfully");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert(error.response?.data || "Profile Update Failed");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setForm(profile);
    setEdit(false);
  };

  const infoItems = [
    ["Security", "🔐 JWT Protected"],
    ["Account Type", "Password Vault User"],
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <main className="mx-auto flex max-w-5xl justify-center px-4 py-8 sm:px-6 lg:py-12">
        <section className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 to-slate-800 px-6 py-8 text-center text-white sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-slate-950 shadow-lg">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            <h1 className="mt-4 text-2xl font-bold">
              {profile.name}
            </h1>

            <p className="mt-1 text-sm text-slate-300">
              {profile.email}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Active Account
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold">Profile Information</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your account details and security information.
              </p>
            </div>

            <div className="space-y-4">
              <ProfileField
                label="Name"
                value={form.name}
                edit={edit}
                type="text"
                onChange={(value) => updateField("name", value)}
              />

              <ProfileField
                label="Email Address"
                value={form.email}
                edit={edit}
                type="email"
                onChange={(value) => updateField("email", value)}
              />

              {infoItems.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {label}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {edit ? (
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEdit(true)}
                className="mt-7 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Edit Profile
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ProfileField({
  label,
  value,
  type,
  edit,
  onChange,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      {edit ? (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
        />
      ) : (
        <p className="mt-2 text-sm font-semibold text-slate-900">
          {value}
        </p>
      )}
    </div>
  );
}

export default Profile;
