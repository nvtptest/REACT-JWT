import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
const Login = () => {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOnchange = (e) => {
        const copyUser = { ...user };

        copyUser[e.target.name] = e.target.value;
        setUser(copyUser);
    }

    const handleLogin = (e) => {
        e.preventDefault()
        loginUser(user, dispatch, navigate);

    }

    return (
        <section className="login-container">
            <div className="login-title"> Log in</div>
            <form onSubmit={(e) => handleLogin(e)}>
                <label>USERNAME</label>
                <input name="username" type="text" placeholder="Enter your username" value={user.username} onChange={(e) => handleOnchange(e)} />
                <label>PASSWORD</label>
                <input name="password" type="password" placeholder="Enter your password" value={user.password} onChange={(e) => handleOnchange(e)} />
                <button type="submit"> Continue </button>
            </form>
            <div className="login-register"> Don't have an account yet? </div>
            <Link className="login-register-link" to="/register">Register one for free </Link>
        </section>
    );
}

export default Login;