import axios from 'axios';
import { loginFalsed, loginStart, loginSuccess, logoutFalsed, logoutStart, logoutSuccess, registerFalsed, registerStart, registerSuccess } from './authSlice';
import { deleteUserFailed, deleteUserStart, deleteUserSuccess, getUsersFailed, getUsersStart, getUsersSuccess } from './userSlice';

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("v1/auth/login", user);
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (err) {
        dispatch(loginFalsed());
    }
};

export const registerUser = async (registerUser, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        console.log('test ', registerUser);
        const res = await axios.post("v1/auth/register", registerUser);
        console.log('res.data: ', res.data);
        dispatch(registerSuccess(res.data));
        // navigate("/login");
    } catch (err) {
        dispatch(registerFalsed());
    }
};

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get("v1/user", {
            headers: { token: `Bearer ${accessToken}` },

        });
        dispatch(getUsersSuccess(res.data));
    } catch (err) {
        dispatch(getUsersFailed());
    }
};

export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete(`v1/user/${id}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteUserSuccess(res.data));
    } catch (err) {
        dispatch(deleteUserFailed(err.response.data));
    }
};

export const logOut = async (accessToken, dispatch, axiosJWT, navigate) => {
    dispatch(logoutStart());
    try {
        console.log('>>apiRequets.js Check accessToken logout', accessToken);
        const res = await axiosJWT.post(`v1/auth/logout`);

        console.log('>>apiRequets.js Check res', res);

        dispatch(logoutSuccess());
        navigate("/login");
    } catch (err) {
        dispatch(logoutFalsed());
    }
}