import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import "./home.css";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../createInstance";

const HomePage = () => {
  //DUMMY DATA
  // const userData = [

  // ];
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const msg = useSelector((state) => state.users?.msg);


  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const handleDelete = (zuser) => {
    console.log('check id delete', user, user?.accessToken);
    deleteUser(user?.accessToken, dispatch, zuser._id, axiosJWT);
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.accessToken) {

      getAllUsers(user?.accessToken, dispatch, axiosJWT);
    }
  }, [])

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">
        {`Your role: ${user?.admin ? `Admin` : `User`}`}
      </div>
      <div className="home-userlist">
        {userList && userList.map((user) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div className="delete-user" onClick={() => handleDelete(user)}> Delete </div>
            </div>
          );
        })}
      </div>
      <div className="errorMsg">{msg}</div>

    </main>
  );
};

export default HomePage;
