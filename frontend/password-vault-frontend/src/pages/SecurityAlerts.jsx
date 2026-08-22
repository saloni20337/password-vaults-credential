import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function SecurityAlerts() {
    const [alerts, setAlerts] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await api.get("/security-alerts");
                setAlerts(response.data);
            } catch (error) {
                console.error("Failed to fetch security alerts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "-";

        return new Date(dateTime).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">

            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">
              <button
        onClick={() => navigate("/dashboard")}
        className="mb-5 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        ← Back to Dashboard
      </button>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Security Alerts
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Monitor important security alerts detected in your account.
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                    <div className="px-6 py-5 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900">
                            Alert History
                        </h2>
                    </div>

                    {loading ? (

                        <div className="p-10 text-center text-slate-500">
                            Loading security alerts...
                        </div>

                    ) : alerts.length === 0 ? (

                        <div className="p-10 text-center text-slate-500">
                            No security alerts found.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-slate-50">
                                    <tr>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Alert Type
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Message
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Severity
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Date & Time
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Status
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {alerts.map((alert) => (

                                        <tr
                                            key={alert.id}
                                            className="hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-4 text-sm text-slate-700">
                                                {alert.alertType || "-"}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {alert.message || "-"}
                                            </td>

                                            <td className="px-6 py-4">

                                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                    {alert.severity || "HIGH"}
                                                </span>

                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {formatDateTime(alert.createdAt)}
                                            </td>

                                            <td className="px-6 py-4">

                                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                                    {alert.status || "UNREAD"}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default SecurityAlerts;