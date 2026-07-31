import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Register() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [showPopup,setShowPopup] = useState(false);

  const navigate = useNavigate();



  const handleRegister = async(e)=>{

  e.preventDefault();


  try{

    const response = await axios.post(
      "http://localhost:8080/api/auth/register",
      {
        name,
        email,
        password
      }
    );


    if(response.data === "User Registered Successfully"){

      setShowPopup(true);

      setName("");
      setEmail("");
      setPassword("");

    }
    else{

      alert(response.data);

    }


  }
  catch(error){

    console.log(error);

    if(error.response){

      alert(error.response.data);

    }
    else{

      alert("Backend not connected");

    }

  }

};



  return (

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
          Create Account
        </h1>


        <p className="mt-3 text-gray-600 text-center">
          Register to manage your passwords securely.
        </p>



        <form onSubmit={handleRegister} className="mt-8 space-y-4">



          {/* Name Field */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />



          {/* Email Field */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />



          {/* Password Field */}
          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />


            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              👁️
            </button>


          </div>



          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Create Account
          </button>



        </form>




        {
          showPopup && (

            <div className="fixed inset-0 bg-black/30 flex items-center justify-center">


              <div className="bg-white border rounded-2xl shadow-sm p-8 w-full max-w-sm text-center">


                <div className="text-5xl">
                  🎉
                </div>


                <h2 className="text-2xl font-bold text-gray-900 mt-4">
                  Account Created
                </h2>


                <p className="text-gray-600 mt-2">
                  Your Password Vault account is ready.
                </p>


                <button
                  onClick={()=>setShowPopup(false)}
                  className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
                >
                  Continue
                </button>


              </div>


            </div>

          )
        }



      </div>


    </div>

  );

}


export default Register;