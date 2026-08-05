import {useState, useEffect, useRef} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import axios from "axios";


function VerifyOtp(){


const [otp,setOtp] = useState(["","","","","",""]);

const [error,setError] = useState("");
const [resendMsg,setResendMsg] = useState("");

const [showPopup,setShowPopup] = useState(false);

const [timer,setTimer] = useState(120);
const [resendTimer,setResendTimer] = useState(30);

const [loading,setLoading] = useState(false);


const inputRefs = useRef([]);


const location = useLocation();
const navigate = useNavigate();


const email = location.state?.email;





useEffect(()=>{


const interval = setInterval(()=>{


setTimer(prev => prev > 0 ? prev-1 : 0);

setResendTimer(prev => prev > 0 ? prev-1 : 0);


},1000);



return ()=>clearInterval(interval);



},[]);







if(!email){

return(

<h2 className="text-center mt-10">

Email not found. Please request OTP again.

</h2>

)

}






// Mask Email

const maskEmail=(email)=>{


const [name,domain] = email.split("@");


return (

name.substring(0,2)
+
"****@"
+
domain

);


};









// OTP Input Change

const handleOtpChange=(value,index)=>{


if(!/^[0-9]?$/.test(value)) return;



const newOtp=[...otp];

newOtp[index]=value;


setOtp(newOtp);



// Move next

if(value && index < 5){

inputRefs.current[index+1].focus();

}



};









// Backspace handling

const handleKeyDown=(e,index)=>{


if(e.key==="Backspace" && !otp[index] && index>0){

inputRefs.current[index-1].focus();

}



};









const verify = async(e)=>{


e.preventDefault();


const otpValue = otp.join("");



if(otpValue.length !== 6){

setError("Please enter complete 6-digit OTP");

return;

}



if(timer===0){

setError("OTP expired. Please request a new OTP");

return;

}



try{


setLoading(true);

setError("");



await axios.post(

"http://localhost:8080/api/auth/verify-otp",

{

email,

otp:otpValue

}

);



setShowPopup(true);



}

catch(err){


setError(

err.response?.data?.message ||

"OTP verification failed"

);


}

finally{


setLoading(false);


}


};









const resendOtp=async()=>{


if(resendTimer>0){

return;

}



try{


await axios.post(

"http://localhost:8080/api/auth/forgot-password",

{

email

}

);



setResendMsg("OTP sent again successfully");


setTimer(120);

setResendTimer(30);


setOtp(["","","","","",""]);


}

catch(err){


setResendMsg("Failed to resend OTP");


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

Verify OTP

</h1>







<p className="mt-3 text-gray-600 text-center">

OTP sent to {maskEmail(email)}

</p>







<p className="text-center text-sm text-gray-500 mt-2">

OTP expires in{" "}

<span className="font-semibold text-black">

{Math.floor(timer/60)}:

{String(timer%60).padStart(2,"0")}

</span>

</p>







<form

onSubmit={verify}

className="mt-8 space-y-5"

>






{/* OTP Boxes */}

<div className="flex justify-center gap-3">


{

otp.map((digit,index)=>(


<input


key={index}


ref={(el)=>(inputRefs.current[index]=el)}


type="text"


maxLength="1"


value={digit}


onChange={(e)=>handleOtpChange(e.target.value,index)}


onKeyDown={(e)=>handleKeyDown(e,index)}


className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"


/>


))


}



</div>







{

error && (

<p className="text-red-500 text-sm text-center">

{error}

</p>

)

}







<p className="text-center text-sm text-gray-600">


Didn't get the OTP?{" "}


<button

type="button"

disabled={resendTimer>0}


onClick={resendOtp}


className={`font-medium hover:underline ${
resendTimer>0
?
"text-gray-400 cursor-not-allowed"
:
"text-blue-600"
}`}


>


{

resendTimer>0

?

`Resend OTP in ${resendTimer}s`

:

"Resend OTP"

}


</button>


</p>








{

resendMsg && (

<p className="text-green-600 text-sm text-center">

✓ {resendMsg}

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

"Verifying..."

:

"Verify"

}


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