import Navbar from "../components/Navbar";


function Profile(){

  const email = localStorage.getItem("email") || "user@example.com";


  return (

    <>
      <Navbar />


      <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">


        <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-8 hover:shadow-lg transition">


          {/* Profile Header */}

          <div className="text-center">


            <div className="w-24 h-24 mx-auto rounded-full bg-black text-white flex items-center justify-center text-4xl font-bold">
              U
            </div>


            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              User Profile
            </h1>


            <p className="text-gray-500 mt-1">
              Password Vault Account
            </p>


          </div>




          {/* Details */}


          <div className="mt-8 space-y-5">


            <div className="border rounded-xl p-4 hover:bg-gray-50 transition">

              <p className="text-sm text-gray-500">
                Email Address
              </p>

              <p className="font-medium text-gray-900 mt-1">
                {email}
              </p>

            </div>



            <div className="border rounded-xl p-4 hover:bg-gray-50 transition">

              <p className="text-sm text-gray-500">
                Account Status
              </p>

              <p className="font-medium text-green-600 mt-1">
                Active
              </p>

            </div>



            <div className="border rounded-xl p-4 hover:bg-gray-50 transition">

              <p className="text-sm text-gray-500">
                Security
              </p>

              <p className="font-medium text-gray-900 mt-1">
                JWT Protected Account
              </p>

            </div>


          </div>




          {/* Button */}


          <button
          className="mt-8 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Edit Profile
          </button>


        </div>


      </div>

    </>

  );

}


export default Profile;