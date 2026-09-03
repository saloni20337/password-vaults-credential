import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
  ArrowLeft,
  KeyRound,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import api from "../services/api";


function Reports() {

  const navigate = useNavigate();

  const [activeReport, setActiveReport] =
    useState("password");

  const [passwordReport, setPasswordReport] =
    useState(null);

  const [loginReport, setLoginReport] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const fetchReports = async () => {

      try {

        setLoading(true);

        const [
          passwordResponse,
          loginResponse,
        ] = await Promise.all([

          api.get("/reports/password-health"),

          api.get("/reports/login-activity"),

        ]);


        setPasswordReport(
          passwordResponse.data
        );


        setLoginReport(
          loginResponse.data
        );


      } catch (error) {

        console.error(
          "Failed to load reports:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchReports();

  }, []);


  return (

    <div className="min-h-screen bg-[#09090b] text-zinc-100">
        <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">


        {/* BACK BUTTON */}

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="
            mb-7
            flex
            items-center
            gap-2
            text-sm
            text-zinc-500
            transition
            hover:text-white
          "
        >

          <ArrowLeft className="size-4" />

          Back to Dashboard

        </button>


        {/* HEADER */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <ShieldCheck
              className="size-7 text-cyan-300"
            />


            <div>

              <h1
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                "
              >

                Security Reports

              </h1>


              <p
                className="
                  mt-1
                  text-sm
                  text-zinc-500
                "
              >

                Monitor password health
                and login activity.

              </p>

            </div>

          </div>

        </div>


        {/* MAIN REPORT LAYOUT */}

        <div
          className="
            grid
            gap-6
            lg:grid-cols-[240px_1fr]
          "
        >


          {/* LEFT SIDE REPORT MENU */}

          <aside
            className="
              h-fit
              border
              border-white/[0.08]
              bg-white/[0.025]
              p-3
            "
          >


            <p
              className="
                mb-3
                px-2
                pt-2
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-zinc-600
              "
            >

              Available Reports

            </p>


            {/* PASSWORD HEALTH BUTTON */}

            <button
              onClick={() =>
                setActiveReport("password")
              }
              className={`
                mb-2
                flex
                w-full
                items-center
                gap-3
                border
                p-4
                text-left
                transition

                ${
                  activeReport === "password"

                    ? "border-cyan-300/30 bg-cyan-300/[0.08]"

                    : "border-white/[0.06] bg-transparent hover:bg-white/[0.04]"
                }
              `}
            >

              <KeyRound
                className={`
                  size-5

                  ${
                    activeReport === "password"

                      ? "text-cyan-300"

                      : "text-zinc-500"
                  }
                `}
              />


              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-zinc-200
                  "
                >

                  Password Health

                </p>


                <p
                  className="
                    mt-1
                    text-[11px]
                    text-zinc-600
                  "
                >

                  Password strength report

                </p>

              </div>

            </button>


            {/* LOGIN ACTIVITY BUTTON */}

            <button
              onClick={() =>
                setActiveReport("login")
              }
              className={`
                flex
                w-full
                items-center
                gap-3
                border
                p-4
                text-left
                transition

                ${
                  activeReport === "login"

                    ? "border-cyan-300/30 bg-cyan-300/[0.08]"

                    : "border-white/[0.06] bg-transparent hover:bg-white/[0.04]"
                }
              `}
            >

              <Activity
                className={`
                  size-5

                  ${
                    activeReport === "login"

                      ? "text-cyan-300"

                      : "text-zinc-500"
                  }
                `}
              />


              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-zinc-200
                  "
                >

                  Login Activity Reports

                </p>


                <p
                  className="
                    mt-1
                    text-[11px]
                    text-zinc-600
                  "
                >

                  Login activity report

                </p>

              </div>

            </button>


          </aside>


          {/* RIGHT SIDE REPORT CONTENT */}

          <section
            className="
              border
              border-white/[0.08]
              bg-white/[0.025]
              p-6
            "
          >


            {/* PASSWORD HEALTH REPORT */}

            {activeReport === "password" && (

              <div>


                {/* REPORT TITLE */}

                <div className="mb-7">

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <KeyRound
                      className="
                        size-6
                        text-cyan-300
                      "
                    />


                    <div>

                      <h2
                        className="
                          text-xl
                          font-semibold
                        "
                      >

                        Password Health Report

                      </h2>


                      <p
                        className="
                          mt-1
                          text-sm
                          text-zinc-500
                        "
                      >

                        Overview of your
                        password strength.

                      </p>

                    </div>

                  </div>

                </div>


                {/* PASSWORD REPORT CARDS */}

                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                  "
                >


                  <ReportCard
                    label="Total Credentials"
                    value={
                      passwordReport?.totalCredentials
                    }
                    loading={loading}
                    icon={KeyRound}
                    accent="text-cyan-300"
                  />


                  <ReportCard
                    label="Strong Passwords"
                    value={
                      passwordReport?.strongPasswords
                    }
                    loading={loading}
                    icon={CheckCircle2}
                    accent="text-emerald-300"
                  />


                  <ReportCard
                    label="Medium Passwords"
                    value={
                      passwordReport?.mediumPasswords
                    }
                    loading={loading}
                    icon={AlertTriangle}
                    accent="text-amber-300"
                  />


                  <ReportCard
                    label="Weak Passwords"
                    value={
                      passwordReport?.weakPasswords
                    }
                    loading={loading}
                    icon={XCircle}
                    accent="text-red-300"
                  />


                </div>


                {/* HEALTH SCORE */}

                <div
                  className="
                    mt-6
                    border
                    border-cyan-300/[0.10]
                    bg-cyan-300/[0.025]
                    p-6
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      gap-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-sm
                          font-medium
                          text-zinc-300
                        "
                      >

                        Overall Password Health

                      </p>


                      <p
                        className="
                          mt-1
                          text-xs
                          text-zinc-600
                        "
                      >

                        Based on your saved
                        credential strength.

                      </p>

                    </div>


                    {loading ? (

                      <div
                        className="
                          h-10
                          w-20
                          animate-pulse
                          bg-white/[0.08]
                        "
                      />

                    ) : (

                      <span
                        className="
                          text-3xl
                          font-semibold
                          text-cyan-300
                        "
                      >

                        {
                          passwordReport?.healthScore ?? 0
                        }%

                      </span>

                    )}

                  </div>

                </div>


              </div>

            )}


            {/* LOGIN ACTIVITY REPORT */}

            {activeReport === "login" && (

              <div>


                {/* REPORT TITLE */}

                <div className="mb-7">

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <Activity
                      className="
                        size-6
                        text-cyan-300
                      "
                    />


                    <div>

                      <h2
                        className="
                          text-xl
                          font-semibold
                        "
                      >

                        Login Activity Report

                      </h2>


                      <p
                        className="
                          mt-1
                          text-sm
                          text-zinc-500
                        "
                      >

                        Summary of login attempts
                        and recent activity.

                      </p>

                    </div>

                  </div>

                </div>


                {/* LOGIN CARDS */}

                <div
                  className="
                    grid
                    gap-4
                    md:grid-cols-3
                  "
                >


                  <ReportCard
                    label="Total Attempts"
                    value={
                      loginReport?.totalAttempts
                    }
                    loading={loading}
                    icon={Activity}
                    accent="text-cyan-300"
                  />


                  <ReportCard
                    label="Successful"
                    value={
                      loginReport?.successfulLogins
                    }
                    loading={loading}
                    icon={CheckCircle2}
                    accent="text-emerald-300"
                  />


                  <ReportCard
                    label="Failed"
                    value={
                      loginReport?.failedLogins
                    }
                    loading={loading}
                    icon={XCircle}
                    accent="text-red-300"
                  />


                </div>


                {/* RECENT LOGIN TABLE */}

                <div
                  className="
                    mt-6
                    overflow-hidden
                    border
                    border-white/[0.08]
                  "
                >


                  <div
                    className="
                      border-b
                      border-white/[0.08]
                      p-5
                    "
                  >

                    <h3
                      className="
                        font-semibold
                      "
                    >

                      Recent Login Activities

                    </h3>

                  </div>


                  {/* TABLE HEADER */}

                  <div
                    className="
                      grid
                      grid-cols-3
                      border-b
                      border-white/[0.06]
                      bg-white/[0.02]
                      px-5
                      py-3
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-zinc-600
                    "
                  >

                    <span>User</span>

                    <span>Status</span>

                    <span>Time</span>

                  </div>


                  {/* TABLE DATA */}

                  {loading ? (

                    <div
                      className="
                        p-6
                        text-sm
                        text-zinc-500
                      "
                    >

                      Loading activities...

                    </div>

                  ) : loginReport?.recentActivities?.length > 0 ? (

                    loginReport.recentActivities.map(
                      (activity) => (

                        <div
                          key={activity.id}
                          className="
                            grid
                            grid-cols-3
                            border-b
                            border-white/[0.05]
                            px-5
                            py-4
                            text-sm
                            last:border-0
                          "
                        >


                          {/* USER */}

                          <span
                            className="
                              truncate
                              text-zinc-300
                            "
                          >

                            {activity.username}

                          </span>


                          {/* STATUS */}

                          <span>

                            <span
                              className={`
                                inline-flex
                                border
                                px-2
                                py-1
                                text-[10px]
                                font-medium

                                ${
                                  activity.status === "SUCCESS"

                                    ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"

                                    : "border-red-400/20 bg-red-400/[0.06] text-red-300"
                                }
                              `}
                            >

                              {activity.status}

                            </span>

                          </span>


                          {/* TIME */}

                          <span
                            className="
                              text-xs
                              text-zinc-500
                            "
                          >

                            {activity.loginTime

                              ? new Date(
                                  activity.loginTime
                                ).toLocaleString()

                              : "-"
                            }

                          </span>


                        </div>

                      )
                    )

                  ) : (

                    <div
                      className="
                        p-6
                        text-sm
                        text-zinc-500
                      "
                    >

                      No login activity found.

                    </div>

                  )}

                </div>


              </div>

            )}


          </section>


        </div>


      </main>

    </div>

  );

}


function ReportCard({

  label,
  value,
  icon: Icon,
  accent,
  loading,

}) {

  return (

    <div
      className="
        border
        border-white/[0.08]
        bg-white/[0.035]
        p-5
      "
    >


      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <span
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.13em]
            text-zinc-600
          "
        >

          {label}

        </span>


        <Icon
          className={`
            size-4
            ${accent}
          `}
          strokeWidth={1.8}
        />

      </div>


      {loading ? (

        <div
          className="
            mt-5
            h-8
            w-16
            animate-pulse
            bg-white/[0.08]
          "
        />

      ) : (

        <p
          className="
            mt-4
            text-3xl
            font-semibold
            tracking-tight
            text-zinc-100
          "
        >

          {value ?? 0}

        </p>

      )}


    </div>

  );

}


export default Reports;