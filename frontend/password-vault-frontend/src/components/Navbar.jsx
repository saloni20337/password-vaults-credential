import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../services/api";

function Navbar(){

    const navigate = useNavigate();
    const [open,setOpen] = useState(false);
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [profile, setProfile] = useState(null);
    const dropdownRef = useRef();
    const profileHoverRef = useRef();
    const hoverTimeout = useRef(null);

    const logout = ()=>{

        localStorage.removeItem("token");
        navigate("/login");

    }

    const fetchProfile = async () => {
        try {
           const response = await api.get("/user/profile");
            setProfile(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {

    const handleClickOutside = (event) => {

        if(
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ){
            setOpen(false);
        }

        if(
            profileHoverRef.current &&
            !profileHoverRef.current.contains(event.target)
        ){
            setShowProfileCard(false);
        }

    };


    document.addEventListener(
        "mousedown",
        handleClickOutside
    );


    return () => {
        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );
    };


}, []);

    const handleMouseEnter = () => {
        clearTimeout(hoverTimeout.current);
        setShowProfileCard(true);
    };

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => {
            setShowProfileCard(false);
        }, 200);
    };

    const getInitials = (name) => {
        if(!name) return "U";
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };


    return(

        <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow">


            <Link to="/dashboard">
                <h1 className="text-xl font-bold">
                    Password Vault
                </h1>
            </Link>



            <div className="flex items-center gap-6">


                <Link 
                to="/dashboard"
                className="hover:text-gray-300">
                    Dashboard
                </Link>



                {/* Credential Dropdown */}

                  <div 
                  ref={dropdownRef}
                  className="relative">

  <button
    onClick={() => setOpen(!open)}
    className="hover:text-gray-300 flex items-center gap-1"
  >
    Credentials ▾
  </button>
  {open && (

    <div 
      className="absolute top-10 left-0 bg-white text-gray-800 rounded-xl shadow-lg w-48 p-2 z-50"
    >

      <Link
        to="/add-credential"
        onClick={() => setOpen(false)}
        className="block px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        Add Credential
      </Link>


      <Link
        to="/credentials"
        onClick={() => setOpen(false)}
        className="block px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        View Credentials
      </Link>
      <Link
  to="/manage-shared"
  onClick={() => setOpen(false)}
  className="block px-4 py-2 rounded-lg hover:bg-gray-100"
>
  Shared Credentials
</Link>

    </div>

  )}

</div>



                <Link
                to="/profile"
                className="hover:text-gray-300"
                >
                    Profile
                </Link>



                {/* Logout with hover Profile Card */}

                <div
                ref={profileHoverRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                >

                    <button
                    onClick={logout}
                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>


                    {showProfileCard && (

                        <div className="absolute top-11 right-0 bg-white text-gray-800 rounded-xl shadow-lg w-64 p-4 z-50">

                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">

                                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                                    {getInitials(profile?.name)}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold truncate">
                                        {profile?.name || "Loading..."}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {profile?.email || ""}
                                    </p>
                                </div>

                            </div>

                            <div className="flex flex-col gap-1 mt-3">

                                <Link
                                to="/profile"
                                onClick={() => setShowProfileCard(false)}
                                className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                                >
                                    ✏️ Update Profile
                                </Link>

                                <button
                                onClick={logout}
                                className="text-sm px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 text-left"
                                >
                                    🚪 Logout
                                </button>

                            </div>

                        </div>

                    )}

                </div>


            </div>


        </nav>

    )

}

export default Navbar;