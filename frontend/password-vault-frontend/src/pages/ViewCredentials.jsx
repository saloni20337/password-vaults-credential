import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ViewCredentials() {

  const navigate = useNavigate();

  const [credentials, setCredentials] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [decryptedPasswords, setDecryptedPasswords] = useState({});
  const [search, setSearch] = useState("");
  const [showFavourite, setShowFavourite] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // SHARE STATES
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [shareEmail, setShareEmail] = useState("");

  const [permission, setPermission] = useState("VIEW_ONLY");

  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    fetchCredentials();
  }, []);
  // FETCH CREDENTIALS
  const fetchCredentials = async () => {

    try {

      const res = await api.get("/credentials");

      console.log("Credentials:", res.data);

      setCredentials(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };
const viewPassword = async (id) => {

    try {

      const res = await api.get(
        `/credentials/${id}/password`
      );

      setDecryptedPasswords(prev => ({
        ...prev,
        [id]: res.data
      }));

      setShowPassword(prev => ({
        ...prev,
        [id]: true
      }));

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Unable to view password"
      );

    }
  };
  const copyPassword = (password) => {

    if (!password) {

      alert("First view password");

      return;
    }

    navigator.clipboard.writeText(password);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const deleteCredential = async (id) => {

    try {

      await api.delete(
        `/credentials/${id}`
      );

      fetchCredentials();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Unable to delete credential"
      );
    }
  };
  const openShare = (credential) => {

    setSelectedCredential(credential);

    setShareEmail("");
   
   setPermission("VIEW_ONLY");
    setShareError("");
    setShareSuccess(false);

    setShareOpen(true);
  };

  const handleShare = async (e) => {

    e.preventDefault();

    setShareError("");
    setShareSuccess(false);


    // Email validation
    if (!shareEmail.trim()) {

      setShareError(
        "Please enter employee email"
      );

      return;
    }

    try {

      setShareLoading(true);


  const requestBody = {
  email: shareEmail.trim(),
  permission: permission
};
      console.log(
        "Share Request:",
        requestBody
      );


      const response = await api.post(

        `/credentials/${selectedCredential.id}/share`,

        requestBody

      );


      console.log(
        "Share Response:",
        response.data
      );


      setShareSuccess(true);

      setShareError("");

      setShareEmail("");


    } catch (error) {

      console.log(
        "Share Error:",
        error
      );


      let message =
        "Unable to share credential";


      if (error.response?.data) {

        if (
          typeof error.response.data === "string"
        ) {

          message = error.response.data;

        } else if (
          error.response.data.message
        ) {

          message =
            error.response.data.message;
        }
      }


      setShareError(message);


    } finally {

      setShareLoading(false);

    }
  };
  // FILTER
  const filteredCredentials =
    credentials.filter((item) => {

      const searchMatch =

        item.websiteName
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        item.username
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        item.category
          ?.toLowerCase()
          .includes(search.toLowerCase());


      const favouriteMatch =

        showFavourite
          ? item.favourite
          : true;


      const categoryMatch =

        selectedCategory === "All"
          ||
          item.category === selectedCategory;


      return (
        searchMatch &&
        favouriteMatch &&
        categoryMatch
      );

    });


  return (

    <>

      {/* NAVBAR */}

      <Navbar />


      <div className="p-6 max-w-7xl mx-auto">


        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold">

            My Credentials

          </h1>


          <button
            onClick={() =>
              navigate("/add-credential")
            }
            className="bg-indigo-600 text-white px-5 py-3 rounded-xl"
          >

            + Add Credential

          </button>

        </div>


        {/* SEARCH + CATEGORY */}

        <div className="flex gap-3 mb-5">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search credentials..."
            className="flex-1 border rounded-xl px-4 py-3"
          />


          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
            className="border rounded-xl px-4 py-3"
          >

            <option value="All">
              All Categories
            </option>

            {
              [
                ...new Set(
                  credentials.map(
                    c => c.category
                  )
                )
              ]
              .filter(Boolean)
              .map(category => (

                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>

              ))
            }

          </select>


          <button
            onClick={() =>
              setShowFavourite(!showFavourite)
            }
            className="border rounded-xl px-5"
          >

            {
              showFavourite
                ? "Show All"
                : "⭐ Favourites"
            }

          </button>

        </div>


        {/* COPIED MESSAGE */}

        {
          copied && (

            <div className="mb-4 bg-green-100 text-green-700 px-4 py-3 rounded-xl">

              Password copied successfully!

            </div>

          )
        }


        {/* LOADING */}

        {
          loading && (

            <div className="text-center py-10">

              Loading credentials...

            </div>

          )
        }


        {/* EMPTY */}

        {
          !loading &&
          filteredCredentials.length === 0 && (

            <div className="text-center py-10 text-gray-500">

              No credentials found.

            </div>

          )
        }


        {/* CREDENTIAL CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {
            filteredCredentials.map(item => (

              <div
                key={item.id}
                className="border rounded-2xl p-5 shadow-sm bg-white"
              >

                {/* WEBSITE */}

                <div className="flex justify-between mb-2">

                  <h2 className="text-lg font-bold">

                    {item.websiteName}

                  </h2>


                  {
                    item.favourite && (

                      <span>
                        ⭐
                      </span>

                    )
                  }

                </div>


                {/* CATEGORY */}

                <p className="text-sm text-gray-500 mb-3">

                  {item.category}

                </p>


                {/* USERNAME */}

                <p className="text-sm mb-2">

                  <b>Username:</b>{" "}

                  {item.username}

                </p>


               {/* PASSWORD */}

<div className="flex gap-2 mb-4">

  <input
    readOnly
    type={
      showPassword[item.id]
        ? "text"
        : "password"
    }
    value={
      showPassword[item.id]
        ? decryptedPasswords[item.id] || ""
        : "********"
    }
    className="border rounded-lg px-3 py-2 flex-1"
  />

  {item.canView && (
    <>
      <button
        onClick={() => {
          showPassword[item.id]
            ? setShowPassword({
                ...showPassword,
                [item.id]: false
              })
            : viewPassword(item.id);
        }}
        className="border px-3 rounded-lg"
      >
        {showPassword[item.id] ? "🙈" : "👁"}
      </button>

      <button
        onClick={() =>
          copyPassword(
            decryptedPasswords[item.id]
          )
        }
        className="border px-3 rounded-lg"
      >
        📋
      </button>
    </>
  )}

</div>

               
       {/* BUTTONS */}

<div className="flex gap-2">

  {/* EDIT */}

  {item.canEdit && (
    <button
      onClick={() =>
        navigate(`/edit-credential/${item.id}`)
      }
      className="bg-indigo-600 text-white flex-1 py-2 rounded-lg"
    >
      Edit
    </button>
  )}


  {/* SHARE */}

 
{!item.shared && (
  <button
    onClick={() => openShare(item)}
    className="border flex-1 py-2 rounded-lg"
  >
    📤 Share
  </button>
)}

  {/* DELETE */}

  {item.canDelete && (
    <button
      onClick={() => {
        if (window.confirm("Delete credential?")) {
          deleteCredential(item.id);
        }
      }}
      className="border text-red-600 flex-1 py-2 rounded-lg"
    >
      Delete
    </button>
  )}

</div>

              </div>

            ))
          }

        </div>

      </div>
      {/* SHARE MODAL */}
      {
        shareOpen && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

               {/* MODAL HEADER */}
  <div className="flex justify-between items-center mb-2">

              <h2 className="text-xl font-bold mb-2">

                Share Credential

              </h2>
               {/* CLOSE BUTTON */}
    <button
      type="button"
      onClick={() => {
        setShareOpen(false);
        setShareEmail("");
        setShareError("");
        setShareSuccess(false);
      }}
      className="text-gray-500 hover:text-red-600 text-2xl font-bold"
    >
      ×
    </button>

  </div>

              <p className="text-gray-500 text-sm mb-5">

                Share{" "}

                <b>
                  {selectedCredential?.websiteName}
                </b>

                {" "}with another employee.

              </p>


              {/* EMAIL */}

              <label className="block text-sm font-medium mb-2">

                Employee Email

              </label>


              <input
                type="email"
                placeholder="employee@gmail.com"
                value={shareEmail}
                onChange={(e) =>
                  setShareEmail(e.target.value)
                }
                className="border rounded-xl px-4 py-3 w-full mb-5"
              />


              {/* PERMISSIONS */}
              <label className="block text-sm font-medium mb-3">
  Permission Level
</label>

<select
  value={permission}
  onChange={(e) =>
    setPermission(e.target.value)
  }
  className="border rounded-xl px-4 py-3 w-full mb-5"
>
  <option value="VIEW_ONLY">
    👁 View Only
  </option>

  <option value="EDIT_ACCESS">
    ✏️ Edit Access
  </option>

  <option value="FULL_MANAGEMENT">
    🔥 Full Management
  </option>
</select>

             

              {/* ERROR */}

              {
                shareError && (

                  <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-4">

                    {shareError}

                  </div>

                )
              }


              {/* SUCCESS */}

              {
                shareSuccess && (

                  <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-4">

                    Credential shared successfully! ✅

                  </div>

                )
              }


              {/* SHARE BUTTON */}

              <button
                onClick={handleShare}
                disabled={shareLoading}
                className="bg-indigo-600 text-white w-full py-3 rounded-xl disabled:opacity-50"
              >

                {
                  shareLoading
                    ? "Sharing..."
                    : "Share Credential"
                }

              </button>


              {/* CANCEL */}

              <button
                onClick={() => {

                  setShareOpen(false);
                  setShareEmail("");
                  setShareError("");
                  setShareSuccess(false);

                }}
                className="border w-full mt-3 py-3 rounded-xl"
              >

                Cancel

              </button>

            </div>

          </div>

        )

      }

    </>

  );

}

export default ViewCredentials;