import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SuspiciousActivity = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    api.get("/security/suspicious-activities")
      .then((res) => setActivities(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-5 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        ← Back to Dashboard
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Suspicious Activity
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor unusual activities detected by the security system.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Activities</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {activities.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Flagged Activities</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {activities.filter((a) => a.status === "FLAGGED").length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Recent Suspicious Activities
          </h2>
        </div>

        {activities.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">
            No suspicious activity detected.
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b px-5 py-4"
            >
              <div>
                <p className="font-medium text-slate-900">
                  Multiple Failed Login Attempts
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {activity.description}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(activity.detectedAt).toLocaleString()}
                </p>
              </div>

              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                {activity.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuspiciousActivity;