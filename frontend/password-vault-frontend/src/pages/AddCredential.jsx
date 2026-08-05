import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";


function AddCredential(){

  const navigate = useNavigate();

  const [formData,setFormData] = useState({

      websiteName:"",
      username:"",
      password:"",
      category:"",
      favourite:false

  });


  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

    if(!password){
      setStrength("");
      return;
    }

    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);

    let score = 0;
    if(password.length >= 8) score++;
    if(password.length >= 12) score++;
    if(hasNumber) score++;
    if(hasSymbol) score++;
    if(hasUpperLower) score++;

    if(password.length < 5 || score <= 1){
      setStrength("weak");
    }
    else if(score <= 3){
      setStrength("medium");
    }
    else{
      setStrength("strong");
    }

  };


  const strengthConfig = {
    weak: { label: "Weak", color: "bg-red-500", text: "text-red-500", width: "33%" },
    medium: { label: "Medium", color: "bg-yellow-500", text: "text-yellow-600", width: "66%" },
    strong: { label: "Strong", color: "bg-green-500", text: "text-green-600", width: "100%" }
  };


  const generatePassword = () => {

    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghijkmnpqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#$%^&*()-_=+?";

    const allChars = upper + lower + numbers + symbols;
    const length = 14;

    // Guarantee at least one of each character type, then fill the rest randomly
    let password = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];

    for (let i = password.length; i < length; i++) {
      password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle so the guaranteed characters aren't always at the start
    password = password.sort(() => Math.random() - 0.5).join("");

    setFormData((prev) => ({
      ...prev,
      password
    }));

    checkStrength(password);
    setShowPassword(true);

  };


  const handleSubmit=async(e)=>{

    e.preventDefault();

    if(!formData.websiteName || !formData.username || !formData.password){
      alert("Please fill all required fields");
      return;
    }

    try{

      setLoading(true);

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
    finally {
      setLoading(false);
    }

  };


  return(

    <>

      <Navbar/>

      <div className="max-w-2xl mx-auto mt-10 px-4">

        {/* Back Button — outside the card */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-4 text-sm font-medium"
        >
          <span className="text-lg leading-none">←</span>
          <span>Back</span>
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Add Credential
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Save a new website, app, or account to your vault.
            </p>
          </div>

          <form
          onSubmit={handleSubmit}
          className="space-y-5"
          >

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Website Name
              </label>
              <input
                type="text"
                name="websiteName"
                placeholder="e.g. Netflix"
                value={formData.websiteName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/80 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Username / Email
              </label>
              <input
                type="text"
                name="username"
                placeholder="e.g. name@example.com"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/80 focus:border-transparent transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Password
                </label>

                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-xs font-medium text-gray-600 hover:text-black transition flex items-center gap-1"
                >
                  🎲 Generate password
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password or generate one"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 pr-12 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/80 focus:border-transparent transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-1.5">
                Generated passwords are fully editable — tweak it if you like.
              </p>

              {strength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${strengthConfig[strength].text}`}>
                      {strengthConfig[strength].label} password
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${strengthConfig[strength].color}`}
                      style={{ width: strengthConfig[strength].width }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/80 focus:border-transparent transition bg-white"
              >
                <option value="">Select Category</option>
                <option value="Social">Social</option>
                <option value="Education">Education</option>
                <option value="Banking">Banking</option>
                <option value="Work">Work</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                name="favourite"
                checked={formData.favourite}
                onChange={handleChange}
                className="w-4 h-4 accent-black rounded"
              />
              <span className="text-sm text-gray-700">Mark as favourite ⭐</span>
            </label>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-medium px-5 py-3 rounded-lg hover:bg-gray-800 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Credential"}
              </button>
            </div>

          </form>

        </div>

      </div>

    </>

  )

}


export default AddCredential;