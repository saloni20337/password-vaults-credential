import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function LoginActivity() {

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchLoginActivity = async () => {

            try {

                const response =
                    await api.get("/login-activity");

                setActivities(response.data);

            } catch (error) {

                console.error(
                    "Failed to fetch login activity:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchLoginActivity();

    }, []);


    const formatDateTime = (dateTime) => {

        if (!dateTime) return "-";

        const date = new Date(dateTime);

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };


    return (

        <div className="min-h-screen bg-[#F8FAFC]">

            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-slate-900">
                        Login Activity
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Monitor your recent login attempts and security activity.
                    </p>

                </div>


                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                    <div className="px-6 py-5 border-b border-slate-100">

                        <h2 className="text-lg font-bold text-slate-900">
                            Login History
                        </h2>

                    </div>


                    {loading ? (

                        <div className="p-10 text-center text-slate-500">
                            Loading login activity...
                        </div>

                    ) : activities.length === 0 ? (

                        <div className="p-10 text-center text-slate-500">
                            No login activity found.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Username
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

                                    {activities.map((activity) => (

                                        <tr
                                            key={activity.id}
                                            className="hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-4 text-sm text-slate-700">
                                                {activity.username}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {formatDateTime(
                                                    activity.loginTime
                                                )}
                                            </td>

                                            <td className="px-6 py-4">

                                                {activity.status === "SUCCESS" ? (

                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                        SUCCESS
                                                    </span>

                                                ) : (

                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                        FAILED
                                                    </span>

                                                )}

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

export default LoginActivity;