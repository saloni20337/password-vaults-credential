import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuditLogs = async () => {
            try {
                const response = await api.get("/audit-logs");
                setLogs(response.data);
            } catch (error) {
                console.error("Failed to fetch audit logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuditLogs();
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

                <div className="mb-8">
                    <button
        onClick={() => navigate("/dashboard")}
        className="mb-5 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        ← Back to Dashboard
      </button>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Audit Logs
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Review important security events and activities in your account.
                    </p>

                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                    <div className="px-6 py-5 border-b border-slate-100">

                        <h2 className="text-lg font-bold text-slate-900">
                            Security History
                        </h2>

                    </div>

                    {loading ? (

                        <div className="p-10 text-center text-slate-500">
                            Loading audit logs...
                        </div>

                    ) : logs.length === 0 ? (

                        <div className="p-10 text-center text-slate-500">
                            No audit logs found.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Action
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Description
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Date & Time
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {logs.map((log) => (

                                        <tr
                                            key={log.id}
                                            className="hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                                {log.action || "-"}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {log.description || "-"}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {formatDateTime(log.timestamp)}
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

export default AuditLogs;