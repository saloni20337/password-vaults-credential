import Navbar from "../components/Navbar";
import { useState } from "react";
import api from "../services/api";

function Profile() {

  const [name, setName] = useState(
    localStorage.getItem("name") || "User"
  );

  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("email") || "user@example.com"
  );

  const [edit, setEdit] = useState(false);

  const [newName, setNewName] = useState(name);

  const [newEmail, setNewEmail] = useState(userEmail);



const saveProfile = async()=>{

try{

await api.put(
"/user/profile/update",
{
  oldEmail:userEmail,
  name:newName,
  email:newEmail
},
{
  headers:{
    Authorization:`Bearer ${localStorage.getItem("token")}`
  }
}
);


setName(newName);
setUserEmail(newEmail);


localStorage.setItem("name",newName);
localStorage.setItem("email",newEmail);


setEdit(false);


alert("Profile Updated Successfully");


}
catch(error){

console.log(error.response);

alert(
error.response?.data || 
"Profile Update Failed"
);

}

};


  const cancelEdit = () => {

    setNewName(name);
    setNewEmail(userEmail);

    setEdit(false);
  };



  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 flex justify-center items-center px-4">

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-100 border-t-4 border-t-indigo-500 p-6">

          {/* Header */}

          <div className="text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-3xl font-bold">

              {name.charAt(0).toUpperCase()}

            </div>

            <h1 className="text-xl font-bold mt-4 text-slate-900">
              {name}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {userEmail}
            </p>

            <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              ● Active
            </span>

          </div>



          {/* Information */}

          <div className="mt-6 space-y-3">

            {/* Name */}

            <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-3">

              <p className="text-xs text-slate-500">
                Name
              </p>

              {
                edit ? (

                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full mt-2 border border-indigo-200 bg-white rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                ) : (

                  <p className="text-sm font-semibold mt-1 text-slate-900">
                    {name}
                  </p>

                )
              }

            </div>



            {/* Email */}

            <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-3">

              <p className="text-xs text-slate-500">
                Email Address
              </p>

              {
                edit ? (

                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full mt-2 border border-indigo-200 bg-white rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                ) : (

                  <p className="text-sm font-semibold mt-1 text-slate-900">
                    {userEmail}
                  </p>

                )
              }

            </div>



            {/* Security */}

            <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-3">

              <p className="text-xs text-slate-500">
                Security
              </p>

              <p className="text-sm font-semibold mt-1 text-slate-900">
                🔐 JWT Protected
              </p>

            </div>



            {/* Account Type */}

            <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-3">

              <p className="text-xs text-slate-500">
                Account Type
              </p>

              <p className="text-sm font-semibold mt-1 text-slate-900">
                Password Vault User
              </p>

            </div>

          </div>



          {/* Buttons */}

          {
            edit ? (

              <div className="flex gap-2 mt-6">

                <button
                  onClick={saveProfile}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3 rounded-xl text-sm font-semibold transition-all"
                >
                  Save Changes
                </button>

                <button
                  onClick={cancelEdit}
                  className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>

              </div>

            ) : (

              <button
                onClick={() => setEdit(true)}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-semibold transition-all"
              >
                Edit Profile
              </button>

            )
          }

        </div>

      </div>
    </>
  );
}

export default Profile;