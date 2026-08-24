import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const username = "User";

  const fetchCredentials = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/credentials");

      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response");
      }

      const safeCredentials = response.data.map((credential) => {
        const {
          password,
          passwordStrength,
          isWeak,
          weakPassword,
          ...safeCredential
        } = credential;

        const weak =
          typeof weakPassword === "boolean"
            ? weakPassword
            : typeof isWeak === "boolean"
            ? isWeak
            : passwordStrength === "weak" ||
              (typeof password === "string" && password.length < 8);

        return {
          ...safeCredential,
          isWeak: weak,
          passwordStrength,
        };
      });

      setCredentials(safeCredentials);
    } catch (requestError) {
      console.error("Failed to fetch credentials:", requestError);

      if (requestError.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      setError("Unable to load your vault. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);


  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);


  const stats = useMemo(
    () => ({
      total: credentials.length,

      favorites: credentials.filter(
        (item) => item.favourite
      ).length,

      categories: new Set(
        credentials
          .map((item) => item.category)
          .filter(Boolean)
      ).size,

      weak: credentials.filter(
        (item) => item.isWeak
      ).length,
    }),
    [credentials]
  );


  const recent = useMemo(
    () =>
      [...credentials]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        )
        .slice(0, 5),
    [credentials]
  );


  const statItems = [
    ["Credentials", stats.total, "▣"],
    ["Favorites", stats.favorites, "★"],
    ["Categories", stats.categories, "◈"],
    ["Weak passwords", stats.weak, "!"],
  ];


  return (
    <div className="min-h-screen bg-[#0d1117] text-white">

      <Navbar />


      <main className="
        mx-auto max-w-6xl px-4 py-6 
        sm:px-6 lg:px-8 lg:py-10
      ">


        <header className="
          mb-8 flex flex-col gap-5 
          sm:flex-row sm:items-end 
          sm:justify-between
        ">


          <div>

            <div className="
              mb-4 flex items-center gap-2
              text-xs font-semibold uppercase
              tracking-wider text-slate-400
            ">

              <span className="
                h-2 w-2 rounded-full
                bg-emerald-400
              " />

              Private vault

            </div>



            <p className="text-sm text-slate-400">
              Welcome back
            </p>


            <h1 className="
              mt-1 text-3xl font-bold
              tracking-tight text-white
            ">
              {username}
            </h1>


            <p className="
              mt-2 text-sm text-slate-400
              sm:text-base
            ">
              Your credentials, organized and protected.
            </p>

          </div>



          <Link
            to="/add-credential"
            className="
              inline-flex items-center justify-center
              rounded-lg bg-emerald-600
              px-4 py-2.5 text-sm font-semibold
              text-white transition

              hover:bg-emerald-700

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-emerald-500
            "
          >

            <span className="
              mr-2 text-lg leading-none
            ">
              +
            </span>

            Add credential

          </Link>


        </header>



        {error && (

          <div
            className="
              mb-6 flex items-center
              justify-between gap-4
              rounded-lg border
              border-red-900
              bg-red-950/40
              px-4 py-3
              text-sm text-red-300
            "
          >

            <span>
              {error}
            </span>


            <button
              onClick={fetchCredentials}
              className="
                font-semibold underline
              "
            >
              Retry
            </button>


          </div>

        )}



        <div className="
          mb-6 grid grid-cols-2
          gap-3 lg:grid-cols-4
        ">

          {statItems.map(
            ([label, value, icon]) => (

              <StatCard
                key={label}
                label={label}
                value={value}
                icon={icon}
                loading={loading}
                warning={
                  label === "Weak passwords" &&
                  value > 0
                }
              />

            )
          )}

        </div>
              <div className="
        grid gap-6 
        lg:grid-cols-[1.55fr_1fr]
      ">


        <section className="space-y-6">


          {/* Security Status */}

          <div className="
            rounded-xl border
            border-[#30363d]
            bg-[#161b22]
            p-5 sm:p-6
            shadow-lg shadow-black/20
          ">


            <div className="
              flex items-start
              justify-between gap-4
            ">


              <div className="flex gap-3">


                <div
                  className={`
                    flex h-10 w-10
                    items-center justify-center
                    rounded-lg text-sm font-bold

                    ${
                      stats.weak
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }
                  `}
                >

                  {stats.weak ? "!" : "✓"}

                </div>



                <div>

                  <h2 className="
                    font-semibold text-white
                  ">
                    Security status
                  </h2>


                  <p className="
                    mt-1 text-sm text-slate-400
                  ">
                    A quick check of your saved credentials.
                  </p>


                </div>


              </div>



              <span
                className={`
                  rounded-full px-3 py-1
                  text-xs font-semibold

                  ${
                    stats.weak
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }
                `}
              >

                {stats.weak
                  ? "Review needed"
                  : "Protected"}

              </span>


            </div>




            <div className="
              mt-5 flex items-center
              justify-between

              border-t
              border-[#30363d]

              pt-4
            ">


              <div>

                <p className="
                  text-sm font-medium
                  text-white
                ">
                  Password health
                </p>


                <p className="
                  mt-1 text-xs
                  text-slate-400
                ">

                  {loading
                    ? "Checking vault..."
                    : stats.weak
                    ? `${stats.weak} weak password${
                        stats.weak > 1 ? "s" : ""
                      } detected.`
                    : "No weak passwords detected."
                  }

                </p>


              </div>



              {!loading && stats.weak > 0 && (

                <Link
                  to="/credentials"
                  className="
                    text-sm font-semibold
                    text-emerald-400
                    hover:text-emerald-300
                  "
                >
                  Review →
                </Link>

              )}


            </div>


          </div>





          {/* Recent Credentials */}


          <div className="
            overflow-hidden
            rounded-xl border
            border-[#30363d]
            bg-[#161b22]
            shadow-lg shadow-black/20
          ">


            <div className="
              flex items-center
              justify-between

              border-b
              border-[#30363d]

              px-5 py-5
              sm:px-6
            ">


              <div>

                <h2 className="
                  font-semibold text-white
                ">
                  Recently added
                </h2>


                <p className="
                  mt-1 text-sm
                  text-slate-400
                ">
                  Your latest credentials.
                </p>


              </div>



              <Link
                to="/credentials"
                className="
                  text-sm font-semibold
                  text-emerald-400
                  hover:text-emerald-300
                "
              >
                View all →
              </Link>


            </div>



            <div className="
              divide-y
              divide-[#30363d]
            ">


              {loading ? (

                <LoadingRows />

              ) : recent.length ? (

                recent.map((item)=>(
                  <VaultRow
                    key={item.id}
                    item={item}
                  />
                ))

              ) : (

                <EmptyState />

              )}


            </div>


          </div>



        </section>





        {/* Right Side */}


        <aside className="space-y-6">



          <div className="
            rounded-xl border
            border-[#30363d]
            bg-[#161b22]
            p-5 sm:p-6
            shadow-lg shadow-black/20
          ">


            <h2 className="
              font-semibold text-white
            ">
              Quick access
            </h2>


            <div className="mt-4 space-y-2">


              <QuickLink
                to="/credentials"
                label="View credentials"
                icon="▣"
              />


              <QuickLink
                to="/add-credential"
                label="Add credential"
                icon="+"
              />


              <QuickLink
                to="/login-activity"
                label="Login activity"
                icon="↗"
              />


            </div>


          </div>





          <div className="
            rounded-xl border
            border-[#30363d]
            bg-[#161b22]
            p-5 sm:p-6
            shadow-lg shadow-black/20
          ">


            <h2 className="
              font-semibold text-white
            ">
              Vault summary
            </h2>



            <div className="mt-5 space-y-4">


              <SummaryRow
                label="Credentials"
                value={loading ? "—" : stats.total}
              />


              <SummaryRow
                label="Favorites"
                value={loading ? "—" : stats.favorites}
              />


              <SummaryRow
                label="Categories"
                value={loading ? "—" : stats.categories}
              />


              <SummaryRow
                label="Weak passwords"
                value={loading ? "—" : stats.weak}
                warning={stats.weak > 0}
              />


            </div>


          </div>


        </aside>


      </div>


    </main>


  </div>

  );

}





function StatCard({
  label,
  value,
  icon,
  loading,
  warning
}) {

return (

<div className="
  rounded-xl border
  border-[#30363d]
  bg-[#161b22]
  p-4 sm:p-5
">


<div className="
  flex items-start
  justify-between gap-3
">


<div>


<p className="
 text-xs sm:text-sm
 text-slate-400
">
{label}
</p>


{
loading ? (

<div className="
mt-3 h-7 w-10
animate-pulse
rounded
bg-slate-700
"/>

) : (

<p className={`
mt-2 text-2xl
font-bold

${
warning
?"text-amber-400"
:"text-white"
}

`}>
{value}
</p>

)

}


</div>



<span className="
flex h-9 w-9
items-center justify-center
rounded-lg

bg-slate-800
text-slate-300
font-bold
">

{icon}

</span>


</div>


</div>

)

}




function VaultRow({item}){

return (

<div className="
flex items-center
justify-between gap-3

px-5 py-4

hover:bg-[#1c2128]
transition
sm:px-6
">


<div className="
flex items-center gap-3
">


<div className="
flex h-9 w-9
items-center justify-center

rounded-lg

bg-slate-800
text-slate-300
font-bold
">

{
item.websiteName?.[0]?.toUpperCase()
|| "?"
}

</div>


<div>

<p className="
text-sm font-medium text-white
">

{
item.websiteName ||
"Unnamed credential"
}

</p>


<p className="
text-xs text-slate-400
">

{
item.category ||
"General"
}

</p>


</div>


</div>



<div className="
flex gap-2 text-xs
">


{
item.isWeak && (

<span className="
rounded-full
bg-amber-500/10
px-2 py-1
text-amber-400
">

Weak

</span>

)
}


{
item.favourite && (

<span>
★
</span>

)
}


</div>


</div>

)

}





function QuickLink({to,label,icon}){

return (

<Link
to={to}

className="
flex items-center
justify-between

rounded-lg

border
border-[#30363d]

px-3 py-2.5

text-sm font-medium

text-slate-300

hover:bg-[#21262d]
hover:text-white

transition
"
>


<span className="
flex items-center gap-3
">

<span>
{icon}
</span>

{label}

</span>


<span>
→
</span>


</Link>

)

}





function SummaryRow({
label,
value,
warning
}){

return (

<div className="
flex justify-between

border-b
border-[#30363d]

pb-3

text-sm
">


<span className="
text-slate-400
">
{label}
</span>


<span className={
warning
?
"font-semibold text-amber-400"
:
"font-semibold text-white"
}>

{value}

</span>


</div>

)

}





function LoadingRows(){

return (

<div className="space-y-4 p-6">

{[1,2,3].map(item=>(

<div
key={item}
className="
flex items-center gap-3
"
>


<div className="
h-9 w-9
rounded-lg
bg-slate-700
animate-pulse
"/>


<div className="space-y-2">


<div className="
h-3 w-28
rounded
bg-slate-700
animate-pulse
"/>


<div className="
h-2.5 w-16
rounded
bg-slate-700
animate-pulse
"/>


</div>


</div>

))}


</div>

)

}





function EmptyState(){

return (

<div className="
px-6 py-10
text-center
">


<p className="
text-sm font-medium text-white
">
No credentials saved yet.
</p>


<p className="
mt-1 text-xs text-slate-400
">
Add your first credential to get started.
</p>


<Link
to="/add-credential"

className="
mt-4 inline-block

text-sm font-semibold

text-emerald-400

hover:underline
"
>

Add credential →

</Link>
  

</div>

)

}



export default Dashboard;