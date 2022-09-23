import axios from 'axios';
import jwt_decode from 'jwt-decode';

const refreshToken = async () => {
    try {
        const res = await axios.post("/v1/auth/refreshToken", {
            withCredentials: true,
        })
        console.log('>>Check refreshToken res.data', res.data);
        return res.data;
    } catch (err) {
        console.log('refreshToken() function: ', err);
    }
};

export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = new axios.create();
    newInstance.interceptors.request.use(
        async (config) => {
            const decodedToken = jwt_decode(user?.accessToken);
            console.log('>>Check decoded Token', decodedToken);
            if (decodedToken.exp < new Date().getTime() / 1000) {
                const data = await refreshToken();
                const refreshUser = {
                    ...user,
                    accessToken: data,
                    // refreshToken: data.refreshToken
                };
                dispatch(stateSuccess(refreshUser));
                config.headers["token"] = `Bearer ${data}`;
                console.log('createInstance.js check config', config);
            } else {
                config.headers["token"] = `Bearer ${user?.accessToken}`;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );
    return newInstance;
}