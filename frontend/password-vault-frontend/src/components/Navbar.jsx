import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Navbar(){

    const navigate = useNavigate();
    const [open,setOpen] = useState(false);
    const dropdownRef = useRef();

    const logout = ()=>{

        localStorage.removeItem("token");
        navigate("/login");

    }
    useEffect(() => {

    const handleClickOutside = (event) => {

        if(
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ){
            setOpen(false);
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


    </div>

  )}

</div>



                <Link
                to="/profile"
                className="hover:text-gray-300"
                >
                    Profile
                </Link>



                <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>


            </div>


        </nav>

    )

}

export default Navbar;