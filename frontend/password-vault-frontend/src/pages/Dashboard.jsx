import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";


function Dashboard(){

  const [credentials,setCredentials] = useState([]);


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

  };



  const totalCredentials = credentials.length;


  const favouriteCount = credentials.filter(
    item=>item.favourite
  ).length;



  const categories = [
    ...new Set(
      credentials.map(item=>item.category)
    )
  ].filter(Boolean).length;



return(

<>

<Navbar/>


<div className="min-h-screen bg-gray-50 p-6">


<div className="max-w-5xl mx-auto">


<h1 className="text-3xl font-bold text-gray-900">

Welcome to Password Vault 👋

</h1>


<p className="text-gray-600 mt-2">

Manage your credentials securely in one place.

</p>




{/* Statistics */}


<div className="grid md:grid-cols-3 gap-6 mt-8">



<div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">

<p className="text-gray-500">
Total Credentials
</p>

<h2 className="text-3xl font-bold mt-2">
{totalCredentials}
</h2>

</div>




<div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">

<p className="text-gray-500">
Favourite Credentials
</p>

<h2 className="text-3xl font-bold mt-2">
{favouriteCount}
</h2>

</div>




<div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">

<p className="text-gray-500">
Categories
</p>

<h2 className="text-3xl font-bold mt-2">
{categories}
</h2>

</div>



</div>





{/* Actions */}


<div className="bg-white border rounded-2xl p-8 mt-8 shadow-sm">


<h2 className="text-xl font-semibold">
Quick Actions
</h2>



<div className="flex gap-4 mt-5">


<Link
to="/add-credential"
className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
>

+ Add Credential

</Link>



<Link
to="/credentials"
className="border px-5 py-3 rounded-xl hover:bg-gray-100 transition"
>

View Credentials

</Link>


</div>


</div>



</div>


</div>


</>

)

}


export default Dashboard;