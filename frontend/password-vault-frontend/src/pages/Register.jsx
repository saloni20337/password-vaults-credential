import { useState } from "react";
import axios from "axios";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name: name,
          email: email,
          password: password
        }
      );

      console.log(response.data);

      alert("Registration Successful");

      // clear form
      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {

      console.log(error.response);

      if(error.response){
        alert(error.response.data);
      }
      else{
        alert("Backend not connected");
      }

    }
  };


  return (
     <div className="min-h-screen flex items-center justify-center bg-slate-100">

    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

      <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
        Register
      </h2>

      <form onSubmit={handleRegister} className="space-y-4">

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          Create Account
        </button>

      </form>

    </div>

  </div>
  );
}

export default Register;