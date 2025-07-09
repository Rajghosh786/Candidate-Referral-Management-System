import React, { useContext,useEffect,useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from "axios"

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, userData, setUserData } = useContext(AuthContext);
  const [currentUser, setcurrentUser] = useState(null)
  const navigate = useNavigate();

  function handleLogout() {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem('token');
    setcurrentUser(null)
    navigate('/login');
  }
   useEffect(()=>{
    let user = JSON.parse(localStorage.getItem("user"))
    if(user){
      setcurrentUser(user)
    }
 },[])
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">ReferMe</span>
          </div>

          {/* Links */}
          <div className="flex space-x-4">
            {/* {isLoggedIn && ( */}
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'text-white bg-blue-500' : 'text-blue-600 hover:bg-blue-100'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/refer"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'text-white bg-blue-500' : 'text-blue-600 hover:bg-blue-100'
                    }`
                  }
                >
                  Refer a Candidate
                </NavLink>
                  <NavLink
                  to="/metrics"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'text-white bg-blue-500' : 'text-blue-600 hover:bg-blue-100'
                    }`
                  }
                >
                  Metrics
                </NavLink>
              </>
            {/* )} */}
            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'text-white bg-blue-500' : 'text-blue-600 hover:bg-blue-100'
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? 'text-white bg-blue-500' : 'text-blue-600 hover:bg-blue-100'
                    }`
                  }
                >
                  Register
                </NavLink>
              </>
            ) : (
              <div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-100"
              >
                Logout
              </button>
              {/* <span>{currentUser.firstName}{currentUser.lastName}</span> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
