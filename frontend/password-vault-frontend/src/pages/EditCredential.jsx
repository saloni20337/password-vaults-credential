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


  useEffect(() => {

    fetchCredential();

  }, []);


 const fetchCredential = async () => {

  try {

    const response = await api.get(
      `/credentials/${id}`
    );

    setFormData({
      websiteName: response.data.websiteName || "",
      username: response.data.username || "",
      password: response.data.password || "",
      category: response.data.category || "",
      favourite: response.data.favourite || false
    });

  } catch(error) {

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


    try {

      await api.put(
        `/credentials/${id}`,
        formData
      );


      alert("Credential Updated");

      navigate("/credentials");


    } catch(error) {

      console.log(error);

      alert("Update Failed");

    }

  };


  return (

    <>
      <Navbar />


      <div className="max-w-2xl mx-auto mt-10 bg-white border rounded-lg p-8">


        <h2 className="text-2xl font-semibold mb-6">
          Update Credential
        </h2>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >


          <input
            type="text"
            name="websiteName"
            placeholder="Website Name"
            value={formData.websiteName}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />


          <input
            type="text"
            name="username"
            placeholder="Username / Email"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />


          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />


          <div className="flex items-center gap-2">

            <input
              type="checkbox"
              name="favourite"
              checked={formData.favourite || false}
              onChange={(e)=>
                setFormData({
                  ...formData,
                  favourite:e.target.checked
                })
              }
            />

            <label>
              Favourite
            </label>

          </div>


          <button
            type="submit"
            className="bg-black text-white px-5 py-3 rounded"
          >
            Update Credential
          </button>


        </form>


      </div>

    </>
  );

}


export default EditCredential;