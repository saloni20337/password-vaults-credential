import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";


function Dashboard(){

  const [credentials,setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("name") || "User";
  const navigate = useNavigate();


  useEffect(()=>{

    fetchData();

  },[]);



  const fetchData = async()=>{

    try{

      const response = await api.get("/credentials");

      setCredentials(response.data);

    }
    catch(error){

      console.log(error);

    }
    finally {
      setLoading(false);
    }

  };


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };


  const totalCredentials = credentials.length;


  const favouriteCount = credentials.filter(
    item=>item.favourite
  ).length;


  const categoryList = [
    ...new Set(
      credentials.map(item=>item.category)
    )
  ].filter(Boolean);

  const categories = categoryList.length;


  const weakCount = credentials.filter(
    item => item.password && item.password.length < 8
  ).length;


  // Detect reused / duplicate passwords across credentials
  const passwordUsage = {};
  credentials.forEach((item) => {
    if (item.password) {
      passwordUsage[item.password] = (passwordUsage[item.password] || 0) + 1;
    }
  });

  const reusedCredentials = credentials.filter(
    (item) => item.password && passwordUsage[item.password] > 1
  );

  const reusedCount = reusedCredentials.length;


  const securityScore = totalCredentials === 0
    ? 100
    : Math.round(
        ((totalCredentials - weakCount - reusedCount) / totalCredentials) * 100
      );

  const clampedScore = Math.max(0, Math.min(100, securityScore));


  const scoreColor =
    clampedScore >= 80 ? "text-green-600" :
    clampedScore >= 50 ? "text-yellow-600" :
    "text-red-600";

  const scoreBarColor =
    clampedScore >= 80 ? "bg-green-500" :
    clampedScore >= 50 ? "bg-yellow-500" :
    "bg-red-500";


  const categoryCounts = categoryList.map((cat) => ({
    name: cat,
    count: credentials.filter((item) => item.category === cat).length
  })).sort((a, b) => b.count - a.count);


  const recentCredentials = [...credentials]
    .slice(-5)
    .reverse();


  // Build a combined, de-duplicated list of at-risk credentials for the insights panel
  const riskMap = new Map();

  credentials.forEach((item) => {
    const issues = [];
    if (item.password && item.password.length < 8) issues.push("Weak");
    if (item.password && passwordUsage[item.password] > 1) issues.push("Reused");

    if (issues.length > 0) {
      riskMap.set(item.id, { ...item, issues });
    }
  });

  const riskyCredentials = [...riskMap.values()].slice(0, 5);


return(

<>

<Navbar/>


<div className="min-h-screen bg-gray-50 p-6">


<div className="max-w-5xl mx-auto">


<h1 className="text-3xl font-bold text-gray-900">

{getGreeting()}, {username} 👋

</h1>


<p className="text-gray-600 mt-2">

Manage your credentials securely in one place.

</p>




{/* Statistics */}


<div className="grid md:grid-cols-4 gap-5 mt-8">



<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

<p className="text-gray-500 text-sm">
Total Credentials
</p>

<h2 className="text-3xl font-bold mt-2 text-gray-900">
{totalCredentials}
</h2>

</div>




<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

<p className="text-gray-500 text-sm">
Favourites
</p>

<h2 className="text-3xl font-bold mt-2 text-gray-900">
{favouriteCount} ⭐
</h2>

</div>




<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

<p className="text-gray-500 text-sm">
Categories
</p>

<h2 className="text-3xl font-bold mt-2 text-gray-900">
{categories}
</h2>

</div>



<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

<p className="text-gray-500 text-sm">
Weak Passwords
</p>

<h2 className={`text-3xl font-bold mt-2 ${weakCount > 0 ? "text-red-500" : "text-gray-900"}`}>
{weakCount}
</h2>

</div>



</div>




{/* Security Score */}

<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-6">

  <div className="flex items-center justify-between flex-wrap gap-3">
    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Vault Security Score
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        {weakCount === 0 && reusedCount === 0
          ? "All your passwords look strong and unique"
          : `${weakCount} weak, ${reusedCount} reused — worth a quick fix`}
      </p>
    </div>

    <span className={`text-2xl font-bold ${scoreColor}`}>
      {clampedScore}%
    </span>
  </div>

  <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
    <div
      className={`h-2.5 rounded-full transition-all ${scoreBarColor}`}
      style={{ width: `${clampedScore}%` }}
    />
  </div>

</div>




{/* Security Insights */}

{riskyCredentials.length > 0 && (

<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mt-6">

  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold text-gray-900">
      Security Insights
    </h2>
    <span className="text-xs font-medium text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
      {riskyCredentials.length} need{riskyCredentials.length === 1 ? "s" : ""} attention
    </span>
  </div>

  <div className="mt-5 divide-y divide-gray-100">
    {riskyCredentials.map((item) => (
      <div key={item.id} className="flex items-center justify-between py-3 gap-3">

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
            {item.websiteName?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.websiteName}
            </p>
            <div className="flex gap-1.5 mt-1">
              {item.issues.map((issue) => (
                <span
                  key={issue}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    issue === "Weak"
                      ? "bg-red-50 text-red-600"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {issue}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/edit-credential/${item.id}`)}
          className="shrink-0 text-xs font-medium bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition"
        >
          Fix now
        </button>

      </div>
    ))}
  </div>

</div>

)}




{/* Quick Actions + Category Breakdown */}

<div className="grid md:grid-cols-2 gap-6 mt-6">

<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">


<h2 className="text-xl font-semibold text-gray-900">
Quick Actions
</h2>



<div className="flex flex-col gap-3 mt-5">


<Link
to="/add-credential"
className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition text-center"
>

+ Add Credential

</Link>



<Link
to="/credentials"
className="border border-gray-300 px-5 py-3 rounded-xl hover:bg-gray-50 transition text-center"
>

View Credentials

</Link>


</div>


</div>


<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

  <h2 className="text-xl font-semibold text-gray-900">
    Category Breakdown
  </h2>

  {categoryCounts.length === 0 ? (
    <p className="text-sm text-gray-400 mt-5">
      No categories yet. Add a credential to see stats here.
    </p>
  ) : (
    <div className="flex flex-col gap-3 mt-5">
      {categoryCounts.map((cat) => (
        <div key={cat.name} className="flex items-center justify-between">
          <span className="text-sm text-gray-700">{cat.name}</span>
          <div className="flex items-center gap-3 flex-1 ml-4">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-gray-900 h-2 rounded-full"
                style={{ width: `${(cat.count / totalCredentials) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-5 text-right">{cat.count}</span>
          </div>
        </div>
      ))}
    </div>
  )}

</div>

</div>




{/* Recent Activity */}

<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mt-6">

  <h2 className="text-xl font-semibold text-gray-900">
    Recently Added
  </h2>

  {loading ? (
    <p className="text-sm text-gray-400 mt-5">Loading...</p>
  ) : recentCredentials.length === 0 ? (
    <p className="text-sm text-gray-400 mt-5">
      Nothing here yet — your recently added credentials will show up in this list.
    </p>
  ) : (
    <div className="mt-5 divide-y divide-gray-100">
      {recentCredentials.map((item) => (
        <div key={item.id} className="flex items-center justify-between py-3">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {item.websiteName?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {item.websiteName}
              </p>
              <p className="text-xs text-gray-500">
                {item.category || "Uncategorized"}
              </p>
            </div>
          </div>

          {item.favourite && <span>⭐</span>}

        </div>
      ))}
    </div>
  )}

</div>



</div>


</div>


</>

)

}


export default Dashboard;