import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";


function ViewCredentials(){

const [credentials,setCredentials] = useState([]);
const [showPassword,setShowPassword] = useState({});
const [decryptedPasswords,setDecryptedPasswords] = useState({});
const [search,setSearch] = useState("");
const [showFavourite,setShowFavourite] = useState(false);
const [selectedCategory,setSelectedCategory] = useState("All");
const [copied,setCopied] = useState(false);
const [loading,setLoading] = useState(true);

const navigate = useNavigate();



useEffect(()=>{

fetchCredentials();

},[]);



const fetchCredentials = async()=>{

try{

const response = await api.get("/credentials");

setCredentials(response.data);

}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}

};





const viewPassword = async(id)=>{

try{

const response = await api.get(
`/credentials/${id}/password`
);


setDecryptedPasswords(prev=>({

...prev,

[id]:response.data

}));


setShowPassword(prev=>({

...prev,

[id]:true

}));


}
catch(error){

console.log(error);

alert("Unable to view password");

}

};






const copyPassword=(password)=>{


if(!password){

alert("First view password");

return;

}


navigator.clipboard.writeText(password);


setCopied(true);


setTimeout(()=>{

setCopied(false);

},2000);


};





const deleteCredential = async(id)=>{


try{

await api.delete(
`/credentials/${id}`
);


fetchCredentials();


}
catch(error){

console.log(error);

}


};






const filteredCredentials = credentials.filter((item)=>{


const matchesSearch =

item.websiteName
?.toLowerCase()
.includes(search.toLowerCase())

||

item.username
?.toLowerCase()
.includes(search.toLowerCase())

||

item.category
?.toLowerCase()
.includes(search.toLowerCase());



const matchesFavourite =
showFavourite
?
item.favourite
:
true;



const matchesCategory =

selectedCategory==="All"

||

item.category===selectedCategory;



return (

matchesSearch &&

matchesFavourite &&

matchesCategory

);


});



return(

<>

<Navbar/>


<div className="min-h-screen bg-gray-50 py-10 px-4">

<div className="max-w-6xl mx-auto">



<div className="mb-8 flex justify-between flex-wrap gap-4">


<div>

<h1 className="text-3xl font-bold text-gray-900">

Your vault

</h1>


<p className="text-gray-500 mt-1 text-sm">

{credentials.length} credentials saved securely

</p>


</div>



<button

onClick={()=>navigate("/add-credential")}

className="bg-black text-white px-5 py-3 rounded-xl"

>

+ Add Credential

</button>


</div>





<div className="bg-white border rounded-2xl p-4 mb-6">


<div className="flex flex-wrap gap-3">


<input

type="text"

placeholder="Search website, username or category..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="flex-1 min-w-[260px] border rounded-xl px-4 py-3"

/>



<select

value={selectedCategory}

onChange={(e)=>setSelectedCategory(e.target.value)}

className="border rounded-xl px-4 py-3"

>


<option value="All">

All categories

</option>


{

[...new Set(
credentials.map(item=>item.category)
)]

.filter(Boolean)

.map(category=>(


<option key={category} value={category}>

{category}

</option>


))

}



</select>




<button

onClick={()=>setShowFavourite(!showFavourite)}

className="border px-5 py-3 rounded-xl"

>

{

showFavourite
?
"Show All"
:
"⭐ Favourites"

}

</button>



</div>
</div>
{
copied &&

<div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">

✓ Password copied to clipboard

</div>

}



{
loading ?

(

<div className="bg-white p-10 rounded-2xl border text-center">

<p className="text-gray-400">

Loading your vault...

</p>

</div>

)

:

(

<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">


{

filteredCredentials.length > 0

?

filteredCredentials.map((item)=>(


<div

key={item.id}

className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"

>


{/* Header */}

<div className="flex justify-between items-center mb-5">


<div className="flex items-center gap-3">


<div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">


{

item.websiteName

?

item.websiteName.charAt(0).toUpperCase()

:

"?"

}


</div>



<div>


<h2 className="font-semibold text-gray-900">

{item.websiteName}

</h2>


<p className="text-xs text-gray-500">

{item.category || "Other"}

</p>


</div>


</div>



{

item.favourite &&

<span>

⭐

</span>

}


</div>





{/* Username */}

<p className="text-xs font-medium text-gray-400 uppercase">

Username

</p>


<p className="text-sm text-gray-900 mt-1 mb-4 truncate">

{item.username}

</p>





{/* Password */}

<p className="text-xs font-medium text-gray-400 uppercase">

Password

</p>



<div className="relative mt-2">


<input


type={

showPassword[item.id]

?

"text"

:

"password"

}


value={

decryptedPasswords[item.id]

?

decryptedPasswords[item.id]

:

"********"

}


readOnly


className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-20 text-sm font-mono"





/>





<div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">





{/* Eye Button */}

<button


onClick={()=>{


if(showPassword[item.id]){


setShowPassword(prev=>({

...prev,

[item.id]:false


}));


}

else{


viewPassword(item.id);


}


}}



className="p-1.5 text-gray-400 hover:text-gray-700"


>


{

showPassword[item.id]

?

"🙈"

:

"👁"

}


</button>





{/* Copy Button */}

<button


onClick={()=>copyPassword(
decryptedPasswords[item.id]
)}


className="p-1.5 text-gray-400 hover:text-gray-700"


>


📋


</button>



</div>


</div>






{/* Password Strength */}


<span


className={


decryptedPasswords[item.id] &&

decryptedPasswords[item.id].length >= 8


?


"inline-block mt-3 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium"


:

"inline-block mt-3 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium"


}


>


{

decryptedPasswords[item.id]

?

(

decryptedPasswords[item.id].length >=8

?

"Strong password"

:

"Weak password"

)

:

"Click 👁 to check password strength"

}



</span>







{/* Buttons */}

<div className="flex gap-2 mt-5 pt-4 border-t">



<button


onClick={()=>navigate(`/edit-credential/${item.id}`)}


className="flex-1 bg-black text-white py-2.5 rounded-lg"


>


Update


</button>





<button


onClick={()=>{


if(window.confirm("Delete this credential?"))

deleteCredential(item.id);


}}



className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-lg"


>


Delete


</button>



</div>



</div>


))


:



<div className="col-span-full bg-white p-10 rounded-2xl border text-center">


<p className="text-gray-500">

No credentials found

</p>


</div>


}



</div>


)


}



</div>

</div>


</>

)

}


export default ViewCredentials;