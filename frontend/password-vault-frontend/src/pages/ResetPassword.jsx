import {useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import axios from "axios";


function ResetPassword(){


const [password,setPassword]=useState("");
const [confirmPassword,setConfirmPassword]=useState("");

const [showPassword,setShowPassword]=useState(false);
const [showConfirmPassword,setShowConfirmPassword]=useState(false);

const [showPopup,setShowPopup]=useState(false);

const [error,setError]=useState("");

const [loading,setLoading]=useState(false);



const location=useLocation();

const navigate=useNavigate();



const email=location.state?.email;



// Password Strength

const getPasswordStrength=()=>{


if(password.length===0){

return "";

}


if(password.length < 6){

return "Weak";

}


if(
password.length >= 8 &&
/[A-Z]/.test(password) &&
/[0-9]/.test(password)
){

return "Strong";

}


return "Medium";


};






const reset=async(e)=>{


e.preventDefault();



if(password !== confirmPassword){

setError("Passwords do not match");

return;

}



if(password.length < 6){

setError("Password must be at least 6 characters");

return;

}




try{


setLoading(true);

setError("");



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


console.log(error);


setError(
error.response?.data ||
"Password reset failed"
);


}

finally{


setLoading(false);


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

Create a strong new password.

</p>








<form

onSubmit={reset}

className="mt-8 space-y-4"

>







{/* New Password */}

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








{/* Password Strength */}

{

password && (

<p className="text-sm text-gray-600">

Password Strength:

<span className="font-semibold ml-1">

{getPasswordStrength()}

</span>

</p>

)

}










{/* Confirm Password */}


<div className="relative">


<input

type={showConfirmPassword ? "text":"password"}

placeholder="Confirm Password"

value={confirmPassword}

onChange={(e)=>setConfirmPassword(e.target.value)}

className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"

/>



<button

type="button"

onClick={()=>setShowConfirmPassword(!showConfirmPassword)}

className="absolute right-3 top-3"

>

👁️

</button>



</div>








{

error && (

<p className="text-red-500 text-sm text-center">

{error}

</p>

)

}








<button

disabled={loading}

className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"

>


{

loading

?

"Resetting..."

:

"Reset Password"

}


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

Your password has been updated successfully.

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