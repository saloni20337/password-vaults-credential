import {useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import axios from "axios";


function ResetPassword(){


const [password,setPassword]=useState("");

const [showPassword,setShowPassword]=useState(false);

const [showPopup,setShowPopup]=useState(false);


const location=useLocation();

const navigate=useNavigate();


const email=location.state.email;



const reset=async(e)=>{

e.preventDefault();


try{


await axios.post(
"http://localhost:8080/api/auth/reset-password",
{
email,
newPassword:password
}
);


setShowPopup(true);


}
catch(error){

alert("Reset Failed");

}


};



return(

<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">


<button
onClick={()=>navigate(-1)}
className="absolute top-6 left-6 text-2xl text-gray-700 hover:text-black"
>
←
</button>



<div className="w-full max-w-lg bg-white border rounded-2xl shadow-sm p-10">


<h1 className="text-4xl font-bold text-gray-900 text-center">
Reset Password
</h1>


<p className="mt-3 text-gray-600 text-center">
Create your new password
</p>



<form
onSubmit={reset}
className="mt-8 space-y-4"
>


<div className="relative">


<input

type={showPassword ? "text":"password"}

placeholder="New Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"

/>


<button

type="button"

onClick={()=>setShowPassword(!showPassword)}

className="absolute right-3 top-3"

>
👁️
</button>


</div>



<button

className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"

>
Reset Password
</button>


</form>


</div>



{
showPopup && (

<div className="fixed inset-0 bg-black/30 flex items-center justify-center">


<div className="bg-white border rounded-2xl shadow-sm p-8 w-full max-w-sm text-center">


<div className="text-5xl">
🎉
</div>


<h2 className="text-2xl font-bold text-gray-900 mt-4">
Password Reset
</h2>


<p className="text-gray-600 mt-2">
You can login with your new password.
</p>


<button

onClick={()=>navigate("/login")}

className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"

>
Login Now
</button>


</div>


</div>

)
}


</div>


)

}


export default ResetPassword; 