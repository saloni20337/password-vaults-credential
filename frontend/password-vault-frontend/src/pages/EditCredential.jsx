import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";


function EditCredential() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    websiteName: "",
    username: "",
    password: "",
    category: "",
    favourite: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  useEffect(() => {
    fetchCredential();
  }, []);


  const fetchCredential = async () => {
    try {
      const response = await api.get(`/credentials/${id}`);

      setFormData({
        websiteName: response.data.websiteName || "",
        username: response.data.username || "",
        password: response.data.password || "",
        category: response.data.category || "",
        favourite: response.data.favourite || false
      });
    } catch (error) {
      console.log(error);
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.websiteName || !formData.username || !formData.password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/credentials/${id}`, formData);

      setShowSuccessModal(true);
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto mt-10 px-4">

        {/* Back Button — outside the card */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-4 text-sm font-medium"
        >
          <span className="text-lg leading-none">←</span>
          <span>Back</span>
        </button>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Update Credential
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Edit the details below and save your changes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

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
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 pr-12 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/80 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Category
              </label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Entertainment, Work, Social"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/80 focus:border-transparent transition"
              />
            </div>

            <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                name="favourite"
                checked={formData.favourite || false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    favourite: e.target.checked
                  })
                }
                className="w-4 h-4 accent-black rounded"
              />
              <span className="text-sm text-gray-700">Mark as favourite</span>
            </label>

            <div className="pt-3 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-medium px-5 py-3 rounded-lg hover:bg-gray-800 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Credential"}
              </button>
            </div>

          </form>

        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-xs text-center shadow-xl">

            <div className="text-4xl mb-3">✅</div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Credential Updated
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              Your changes have been saved successfully.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/credentials")}
                className="bg-black text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Go to Credentials
              </button>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-500 text-sm hover:text-black transition py-1"
              >
                Stay Here
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
}

export default EditCredential;