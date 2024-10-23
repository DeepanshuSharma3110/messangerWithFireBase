import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import app from "../../Middleware/firebase.js";
import style from "./NavBar.module.css";
import { Link } from "react-router-dom";
import useNav from "../Hooks/useNav.js";

const NavBar = () => {
  // Directly accessing the user's accessToken from the Redux state
  const accessToken = localStorage.getItem('user');
  const navigate = useNav();

  const [isOpen, setIsOpen] = useState(true);
  const auth = getAuth(app);
  
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logout successful");
        localStorage.removeItem('user');
        navigate('/login', 0);
      })
      .catch((error) => {
        toast.error("Error in logout");
      });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={style.NavBar}>
        <div className={style.logo}>
          <Link to="/">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRUOe56IzOW5vs6jIANON7wjhEzP8zm1lGQg&s"
              alt="Logo"
            />
          </Link>
        </div>

        <button className={style.hamburger} onClick={toggleMenu}>
          ☰
        </button>

        <div className={`${style.options} ${isOpen ? style.show : style.hide}`}>
          <ul>
            <li>
              <Link to="/update-profile-pic">Update Profile Picture</Link>
            </li>
            <li>
              <Link to="/messenger">Messenger</Link>
            </li>
            <li>
              {!accessToken && <Link to="/login">Login</Link>}
            </li>
            <li>
              {accessToken && (
                <button onClick={handleLogout}>Logout</button>
              )}
            </li>
          </ul>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default NavBar;
