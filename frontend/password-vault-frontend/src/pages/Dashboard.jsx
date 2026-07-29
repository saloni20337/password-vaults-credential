import { Link } from "react-router-dom";

function Dashboard() {

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-10 text-center">

        <h1 className="text-5xl font-bold text-slate-800 mb-5">
          🔐 Password Vault Manager
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          Securely store and manage your passwords and credentials.
        </p>


        <div className="grid md:grid-cols-3 gap-5 mb-10">

          <div className="bg-blue-100 p-5 rounded-xl">
            🔒
            <h3 className="font-bold mt-2">
              Secure Storage
            </h3>
          </div>


          <div className="bg-indigo-100 p-5 rounded-xl">
            🛡️
            <h3 className="font-bold mt-2">
              Authentication
            </h3>
          </div>


         

        </div>


        <div className="flex gap-5 justify-center">

          <Link to="/login">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold">
              Login
            </button>
          </Link>


          <Link to="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold">
              Register
            </button>
          </Link>

        </div>


      </div>

    </div>
  );
}

export default Dashboard;