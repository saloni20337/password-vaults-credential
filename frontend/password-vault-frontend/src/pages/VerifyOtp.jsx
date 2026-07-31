import {useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import axios from "axios";


function VerifyOtp(){

const [otp, setOtp] = useState("");
const [error, setError] = useState("");
const [resendMsg,setResendMsg] = useState("");
const [showPopup,setShowPopup]=useState(false);

const location=useLocation();

const navigate=useNavigate();


const email=location.state?.email;
console.log(email);
console.log(otp);
if(!email){
  return (
    <h2 className="text-center mt-10">
      Email not found. Please request OTP again.
    </h2>
  )
}

const verify = async (e) => {
    e.preventDefault();
  try {
    setError("");

    await axios.post(
      "http://localhost:8080/api/auth/verify-otp",
      {
        email,
        otp
      }
    );
   setShowPopup(true);
  } catch (err) {
    setError(
      err.response?.data?.message ||
      "OTP verification failed"
    );
  }
};
const resendOtp = async()=>{

try{

await axios.post(
"http://localhost:8080/api/auth/forgot-password",
{
email
}
);

setResendMsg("OTP sent again successfully");

}
catch(err){

setResendMsg("Failed to resend OTP");

}

}



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
Verify OTP
</h1>


<p className="mt-3 text-gray-600 text-center">
Enter OTP sent to your email
</p>



<form
onSubmit={verify}
className="mt-8 space-y-4"
>


<input

type="text"

placeholder="Enter 6-digit OTP"
maxLength={6}
required
value={otp}

onChange={(e)=>setOtp(e.target.value)}

className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"

/>

{
error && (
<p className="text-red-500 text-sm mt-2">
{error}
</p>
)
}
<p className="text-sm text-gray-600 mt-3">Didn't get the OTP?{" "}
<button
type="button"
onClick={resendOtp}
className="text-blue text-blue-600 mt-3 font-medium hover:underline"
>
Resend OTP
</button>
</p>

{
resendMsg && (
<p className="text-green-600 text-sm mt-2">
✓{resendMsg}
</p>
)
}

<button
className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
>
Verify
</button>


</form>


</div>



{
showPopup && (

<div className="fixed inset-0 bg-black/30 flex items-center justify-center">


<div className="bg-white border rounded-2xl shadow-sm p-8 w-full max-w-sm text-center">


<div className="text-5xl">
✅
</div>


<h2 className="text-2xl font-bold text-gray-900 mt-4">
OTP Verified
</h2>


<p className="text-gray-600 mt-2">
Create your new password.
</p>


<button

onClick={()=>navigate("/reset-password",{state:{email}})}

className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"

>
Continue
</button>


</div>


</div>

)
}


</div>

)

}


export default VerifyOtp;