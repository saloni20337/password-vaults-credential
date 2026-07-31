import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function ForgotPassword(){

const [email,setEmail] = useState("");
const[message,setMessage]=useState("");
const[error,setError]=useState("");

const navigate = useNavigate();


const handleSubmit = async(e)=>{

e.preventDefault();


try{

await axios.post(
"http://localhost:8080/api/auth/forgot-password",
{
email
}
);
setMessage("OTP sent successfully");
setTimeout(()=>{
navigate("/verify-otp",{
state:{email}
});
},2000);


}
catch(error){

setError(error.response?.data?.message||"Something went wrong");




}

};



return(

<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">


{/* Back Arrow */}

<button
onClick={()=>navigate(-1)}
className="absolute top-6 left-6 text-2xl text-gray-700 hover:text-black"
>
←
</button>



<div className="w-full max-w-lg bg-white border rounded-2xl shadow-sm p-10">



<h1 className="text-4xl font-bold text-gray-900 text-center">
Forgot Password
</h1>


<p className="mt-3 text-gray-600 text-center">
Enter your registered email
</p>



<form 
onSubmit={handleSubmit}
className="mt-8 space-y-4"
>


<input

type="email"

placeholder="Email Address"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"

/>



<button

className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"

>
Send OTP
</button>
{
    message&&(
        <p className="text-green-600 text-sm mt-2 text-center">
            ✓{message}
        </p>
    )
}
{
    error&&(
        <p className="text-red-500 text-sm mt-3 text-center">
            {error}
        </p>
    )
}

</form>


</div>


</div>


)

}


export default ForgotPassword;