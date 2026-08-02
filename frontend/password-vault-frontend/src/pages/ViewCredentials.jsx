import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";


function ViewCredentials() {

  const [credentials, setCredentials] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [search, setSearch] = useState("");
  const [showFavourite, setShowFavourite] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    fetchCredentials();
  }, []);



  const fetchCredentials = async () => {

    try {

      const response = await api.get("/credentials");

      setCredentials(response.data);

    } catch(error) {

      console.log(error);

    }

  };



  const deleteCredential = async(id)=>{

    try{

      await api.delete(`/credentials/${id}`);

      fetchCredentials();

    }
    catch(error){

      console.log(error);

    }

  };



  const copyPassword = (password)=>{

    navigator.clipboard.writeText(password);

    alert("Password copied");

  };

const filteredCredentials = credentials.filter((item)=>{


const matchesSearch =
item.websiteName?.toLowerCase()
.includes(search.toLowerCase())
||
item.category?.toLowerCase()
.includes(search.toLowerCase());


const matchesFavourite =
showFavourite ? item.favourite : true;


return matchesSearch && matchesFavourite;


});

 

return(

<>

<Navbar/>


<div className="max-w-4xl mx-auto mt-10 px-4">


<h2 className="text-2xl font-semibold mb-5">
Saved Credentials
</h2>
<input

type="text"

placeholder="Search by website or category..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="w-full border p-3 rounded-xl mb-4"

/>


<button

onClick={()=>setShowFavourite(!showFavourite)}

className="bg-yellow-400 px-4 py-2 rounded-xl mb-6"

>

{
showFavourite
?
"Show All Credentials"
:
"⭐ Favourite Only"
}


</button>



<div className="space-y-5">


{
filteredCredentials.map((item)=>(


<div
key={item.id}
className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
>



<div className="flex justify-between">


<h3 className="text-xl font-semibold">

{item.websiteName}

</h3>


{
item.favourite &&
<span>
⭐
</span>
}


</div>




<p className="text-gray-600 mt-2">
Username: {item.username}
</p>


<p className="text-gray-600">
Category: {item.category}
</p>



<div className="flex items-center gap-3 mt-2">


<p className="text-gray-600">

Password:

{
showPassword[item.id]
?
item.password
:
"********"
}

</p>


<button

onClick={()=>setShowPassword({

...showPassword,

[item.id]:!showPassword[item.id]

})}

className="text-blue-600"
>

👁

</button>



<button

onClick={()=>copyPassword(item.password)}

className="text-sm bg-gray-200 px-3 py-1 rounded-lg"

>

Copy

</button>



</div>




<div className="mt-5 flex gap-3">


<button

onClick={()=>navigate(`/edit-credential/${item.id}`)}

className="bg-black text-white px-4 py-2 rounded-lg"

>

Update

</button>




<button

onClick={()=>deleteCredential(item.id)}

className="bg-red-500 text-white px-4 py-2 rounded-lg"

>

Delete

</button>


</div>



</div>


))

}


</div>


</div>


</>

)

}


export default ViewCredentials;