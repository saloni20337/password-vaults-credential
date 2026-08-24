import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const SuspiciousActivity = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    api
      .get("/security/suspicious-activities")
      .then((res) => setActivities(res.data))
      .catch(console.error);
  }, []);


  const flagged = activities.filter(
    (a) => a.status === "FLAGGED"
  ).length;


  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">

      <Navbar />

      <main className="
        mx-auto max-w-6xl
        px-4 py-6
        sm:px-6 lg:px-8
      ">


        <button
          onClick={() => navigate("/dashboard")}
          className="
            mb-5 text-sm font-medium
            text-slate-600 hover:text-slate-950
          "
        >
          ← Back to Dashboard
        </button>


<div className="mb-6">

  <div className="
    mb-3 flex items-center gap-2
    text-xs font-semibold
    uppercase tracking-wider
    text-slate-500
  ">
    <span className="
      h-2 w-2 rounded-full
      bg-red-500
    " />

    Security Monitor
  </div>


  <h1 className="
    text-3xl font-bold
  ">
    Suspicious Activity
  </h1>


  <p className="
    mt-1 text-sm text-slate-500
  ">
    Monitor unusual activities detected by security system.
  </p>

</div>
        





        <div className="
          mb-6 grid gap-4
          sm:grid-cols-2
        ">


          <div className="
            rounded-xl
            border border-slate-200
            bg-white
            p-5
            shadow-sm
          ">

            <p className="text-sm text-slate-500">
              Total Activities
            </p>

            <p className="
              mt-2 text-2xl font-bold
            ">
              {activities.length}
            </p>

          </div>





          <div className="
            rounded-xl
            border border-red-200
            bg-white
            p-5
            shadow-sm
          ">

            <p className="text-sm text-slate-500">
              Flagged Activities
            </p>

            <p className="
              mt-2 text-2xl
              font-bold text-red-600
            ">
              {flagged}
            </p>

          </div>


        </div>





        <div className="
          rounded-xl
          border border-slate-200
          bg-white
          shadow-sm
        ">


          <div className="
            border-b
            border-slate-100
            px-5 py-4
          ">

            <h2 className="font-semibold">
              Recent Suspicious Activities
            </h2>

          </div>





          {
            activities.length === 0 ? (

              <p className="
                p-6 text-center
                text-sm text-slate-500
              ">
                No suspicious activity detected.
              </p>

            ) : (

              activities.map((activity)=>(

                <div
                  key={activity.id}
                  className="
                    flex justify-between
                    gap-4
                    border-b
                    border-slate-100
                    px-5 py-4
                    hover:bg-slate-50
                  "
                >

                  <div>

                    <p className="font-medium">
                      Multiple Failed Login Attempts
                    </p>


                    <p className="
                      mt-1 text-sm
                      text-slate-500
                    ">
                      {activity.description}
                    </p>


                    <p className="
                      mt-1 text-xs
                      text-slate-400
                    ">
                      {new Date(
                        activity.detectedAt
                      ).toLocaleString()}
                    </p>


                  </div>



                  <span className="
                    h-fit
                    rounded-full
                    bg-red-100
                    px-3 py-1
                    text-xs
                    font-semibold
                    text-red-600
                  ">
                    {activity.status}
                  </span>


                </div>

              ))

            )
          }


        </div>


      </main>

    </div>
  );
};


export default SuspiciousActivity;