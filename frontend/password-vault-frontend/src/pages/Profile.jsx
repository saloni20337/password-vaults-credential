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

      <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

          {/* Header */}

          <div className="text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">

              {name.charAt(0).toUpperCase()}

            </div>

            <h1 className="text-xl font-bold mt-4 text-gray-900">
              {name}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {userEmail}
            </p>

            <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              ● Active
            </span>

          </div>



          {/* Information */}

          <div className="mt-6 space-y-3">

            {/* Name */}

            <div className="border rounded-xl p-3">

              <p className="text-xs text-gray-500">
                Name
              </p>

              {
                edit ? (

                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full mt-2 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />

                ) : (

                  <p className="text-sm font-semibold mt-1">
                    {name}
                  </p>

                )
              }

            </div>



            {/* Email */}

            <div className="border rounded-xl p-3">

              <p className="text-xs text-gray-500">
                Email Address
              </p>

              {
                edit ? (

                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full mt-2 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />

                ) : (

                  <p className="text-sm font-semibold mt-1">
                    {userEmail}
                  </p>

                )
              }

            </div>



            {/* Security */}

            <div className="border rounded-xl p-3">

              <p className="text-xs text-gray-500">
                Security
              </p>

              <p className="text-sm font-semibold mt-1">
                🔐 JWT Protected
              </p>

            </div>



            {/* Account Type */}

            <div className="border rounded-xl p-3">

              <p className="text-xs text-gray-500">
                Account Type
              </p>

              <p className="text-sm font-semibold mt-1">
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
                  className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-medium"
                >
                  Save Changes
                </button>

                <button
                  onClick={cancelEdit}
                  className="flex-1 border py-3 rounded-xl text-sm font-medium"
                >
                  Cancel
                </button>

              </div>

            ) : (

              <button
                onClick={() => setEdit(true)}
                className="mt-6 w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800"
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