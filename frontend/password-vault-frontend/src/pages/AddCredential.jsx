import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";


function AddCredential(){


const [formData,setFormData] = useState({

    websiteName:"",
    username:"",
    password:"",
    category:"",
    favourite:false

});



const [strength,setStrength] = useState("");



const handleChange=(e)=>{


const {name,value,type,checked}=e.target;


setFormData({

...formData,

[name]: type==="checkbox" ? checked : value

});



if(name==="password"){

checkStrength(value);

}


};




const checkStrength=(password)=>{


if(password.length < 5){

setStrength("Weak 🔴");

}

else if(password.length < 8){

setStrength("Medium 🟡");

}

else{

setStrength("Strong 🟢");

}


};





const handleSubmit=async(e)=>{


e.preventDefault();


try{


await api.post(
"/credentials/add",
formData
);


alert("Credential Saved");


setFormData({

websiteName:"",
username:"",
password:"",
category:"",
favourite:false

});


setStrength("");


}
catch(error){

console.log(error);

alert("Unable to save credential");

}


};





return(

<>

<Navbar/>


<div className="max-w-2xl mx-auto mt-10 bg-white border rounded-2xl p-8 shadow-sm">


<h2 className="text-2xl font-semibold mb-6">
Add Credential
</h2>



<form 
onSubmit={handleSubmit}
className="space-y-4"
>




<input

type="text"

name="websiteName"

placeholder="Website Name"

value={formData.websiteName}

onChange={handleChange}

className="w-full border p-3 rounded-xl"

/>




<input

type="text"

name="username"

placeholder="Username / Email"

value={formData.username}

onChange={handleChange}

className="w-full border p-3 rounded-xl"

/>





<input

type="password"

name="password"

placeholder="Password"

value={formData.password}

onChange={handleChange}

className="w-full border p-3 rounded-xl"

/>




{
strength &&

<p className="text-sm font-medium">
Password Strength: {strength}
</p>

}





<select

name="category"

value={formData.category}

onChange={handleChange}

className="w-full border p-3 rounded-xl"

>


<option value="">
Select Category
</option>


<option value="Social">
Social
</option>


<option value="Education">
Education
</option>


<option value="Banking">
Banking
</option>


<option value="Work">
Work
</option>


<option value="Shopping">
Shopping
</option>



</select>





<div className="flex items-center gap-2">


<input

type="checkbox"

name="favourite"

checked={formData.favourite}

onChange={handleChange}

/>


<label>
Mark as Favourite ⭐
</label>



</div>





<button

type="submit"

className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"

>

Save Credential

</button>



</form>



</div>


</>

)

}


export default AddCredential;