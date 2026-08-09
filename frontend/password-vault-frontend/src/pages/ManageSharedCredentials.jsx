import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ManageSharedCredentials() {

  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    fetchShares();

  }, []);


  const fetchShares = async () => {

    try {

      const res =
        await api.get("/credentials/shared");

      console.log("Shared Credentials:", res.data);

      setShares(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };


  const revokeAccess = async (shareId) => {

    const confirmRevoke =
      window.confirm(
        "Are you sure you want to revoke access?"
      );

    if (!confirmRevoke) {
      return;
    }


    try {

      await api.delete(
        `/credentials/shared/${shareId}`
      );


      fetchShares();


    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Unable to revoke access"
      );
    }
  };


  return (

    <>

      <Navbar />


      <div className="p-6 max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold">

            Shared Credentials

          </h1>

        </div>


        {loading && (

          <div className="text-center py-10">

            Loading...

          </div>

        )}


        {!loading && shares.length === 0 && (

          <div className="text-center py-10 text-gray-500">

            You haven't shared any credentials yet.

          </div>

        )}


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">


          {shares.map((share) => (

            <div
              key={share.shareId}
              className="border rounded-2xl p-5 shadow-sm bg-white"
            >


              <h2 className="text-lg font-bold mb-2">

                {share.websiteName}

              </h2>


              <p className="text-sm text-gray-500 mb-4">

                Shared with:

              </p>


              <p className="font-medium mb-4">

                {share.sharedWithEmail}

              </p>


              {/* PERMISSIONS */}

              <div className="space-y-2 mb-5">

                <p>

                  {share.canView
                    ? "✅"
                    : "❌"} View

                </p>


                <p>

                  {share.canEdit
                    ? "✅"
                    : "❌"} Edit

                </p>


                <p>

                  {share.canDelete
                    ? "✅"
                    : "❌"} Delete

                </p>

              </div>


              {/* REVOKE */}

              <button
                onClick={() =>
                  revokeAccess(
                    share.shareId
                  )
                }
                className="w-full bg-red-600 text-white py-2 rounded-xl"
              >

                Revoke Access

              </button>


            </div>

          ))}

        </div>

      </div>

    </>

  );
}

export default ManageSharedCredentials;