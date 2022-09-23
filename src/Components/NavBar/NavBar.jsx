import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { logOut } from "../../redux/apiRequest";
import { loginSuccess, logoutSuccess } from "../../redux/authSlice";
import "./navbar.css";
const NavBar = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let axiosJWT = createAxios(currentUser, dispatch, logoutSuccess);

  const handleLogout = () => {
    logOut(currentUser?.accessToken, dispatch, axiosJWT, navigate)
  }
  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-home"> Home </Link>
      {currentUser ? (
        <>
          <p className="navbar-user">Hi, <span> {currentUser.username}  </span> </p>
          <Link to="/logout" className="navbar-logout" onClick={handleLogout}> Log out</Link>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-login"> Login </Link>
          <Link to="/register" className="navbar-register"> Register</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
