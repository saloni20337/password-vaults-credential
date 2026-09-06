import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Register() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [showPopup,setShowPopup] = useState(false);
  const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  if (!name.trim() || !email.trim() || !password || !confirmPassword) {
    setError("Please fill all fields.");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(
      "http://localhost:8080/api/auth/register",
      {
        name,
        email,
        password
      }
    );

    if (response.data === "User Registered Successfully") {
      setShowPopup(true);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      setError(response.data);
    }
  } catch (error) {
    console.log(error);

    if (error.response) {
      setError(
        typeof error.response.data === "string"
          ? error.response.data
          : "Registration failed. Please try again."
      );
    } else {
      setError("Backend not connected. Please try again later.");
    }
  } finally {
    setLoading(false);
  }
};




  return (

    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative">


      {/* Back Arrow */}

      <button
        onClick={()=>navigate(-1)}
        className="absolute top-6 left-6 text-2xl text-slate-700 hover:text-black"
      >
        ←
      </button>




      <div className="w-full max-w-lg bg-white border rounded-2xl shadow-sm p-10">



        <h1 className="text-4xl font-bold text-slate-900 text-center">
          Create Account
        </h1>



        <p className="mt-3 text-slate-600 text-center">
          Register to manage your passwords securely.
        </p>




        <form onSubmit={handleRegister} className="mt-8 space-y-4">

{error && (
  <div
    role="alert"
    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
  >
    {error}
  </div>
)}

          {/* Name Field */}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />




          {/* Email Field */}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />





          {/* Password Field */}

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />


            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-600"
            >
              👁️
            </button>


          </div>






          {/* Confirm Password Field */}

          <div className="relative">


            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />


            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-600"
            >
              👁️
            </button>


          </div>






          {/* Create Account Button */}
          <button
  type="submit"
  disabled={loading}
  className="w-full rounded-lg bg-black py-3 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Creating Account..." : "Create Account"}
</button>

          



          {/* Login Redirect */}

          <p className="text-center text-slate-600 mt-5">

            Already have an account?{" "}

            <button
              type="button"
              onClick={()=>navigate("/login")}
              className="text-black font-semibold hover:underline"
            >
              Login
            </button>

          </p>



        </form>






        {/* Success Popup */}

        {
          showPopup && (

            <div className="fixed inset-0 bg-black/30 flex items-center justify-center">


              <div className="bg-white border rounded-2xl shadow-sm p-8 w-full max-w-sm text-center">



                <div className="text-5xl">
                  🎉
                </div>




                <h2 className="text-2xl font-bold text-slate-900 mt-4">
                  Account Created
                </h2>




                <p className="text-slate-600 mt-2">
                  Your Password Vault account is ready.
                </p>




                <button

                  onClick={()=>{

                    setShowPopup(false);
                    navigate("/login");

                  }}

                  className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-slate-800"

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