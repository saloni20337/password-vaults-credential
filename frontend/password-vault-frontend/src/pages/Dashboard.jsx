import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-lg bg-white border rounded-2xl shadow-sm p-10">

        <h1 className="text-4xl font-bold text-gray-900">
          Password Vault
        </h1>

        <p className="mt-3 text-gray-600">
          Securely store and manage your credentials in one place.
        </p>

        <div className="mt-8 space-y-3">

          <Link to="/login">
            <button className="w-full bg-black text-white py-3 rounded-lg font-medium">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="w-full border border-gray-300 py-3 rounded-lg font-medium">
              Create Account
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;