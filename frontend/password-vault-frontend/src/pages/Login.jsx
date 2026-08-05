import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";


function Login() {


  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [showPopup,setShowPopup] = useState(false);


  const navigate = useNavigate();



  const handleLogin = async(e)=>{


    e.preventDefault();


    try{


      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password
        }
      );



      localStorage.setItem(
        "token",
        response.data.token
      );


      localStorage.setItem(
        "email",
        email
      );



      setShowPopup(true);



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



      {/* Back Button */}

      <button
        onClick={()=>navigate(-1)}
        className="absolute top-6 left-6 text-2xl text-gray-700 hover:text-black"
      >
        ←
      </button>





      <div className="w-full max-w-lg bg-white border rounded-2xl shadow-sm p-10">





        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Login
        </h1>




        <p className="mt-3 text-gray-600 text-center">
          Access your password vault securely.
        </p>







        <form onSubmit={handleLogin} className="mt-8 space-y-4">





          {/* Email */}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />







          {/* Password */}

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







          {/* Login Button */}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Login
          </button>







          {/* Forgot Password */}

          <div className="text-right">


            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Forgot your password?
            </Link>


          </div>







          {/* Create Account */}

          <p className="text-center text-gray-600 mt-5">


            Don't have an account?{" "}


            <Link
              to="/register"
              className="text-black font-semibold hover:underline"
            >
              Create Account
            </Link>



          </p>






        </form>









        {/* Login Success Popup */}


        {
          showPopup && (


            <div className="fixed inset-0 bg-black/30 flex items-center justify-center">



              <div className="bg-white border rounded-2xl shadow-sm p-8 w-full max-w-sm text-center">





                <div className="text-5xl">
                  ✅
                </div>





                <h2 className="text-2xl font-bold text-gray-900 mt-4">
                  Login Successful
                </h2>





                <p className="text-gray-600 mt-2">
                  Welcome back to Password Vault.
                </p>





                <button
                  onClick={()=>navigate("/dashboard")}
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


export default Login;