import { useState } from "react";
import "./register.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/apiRequest";
const Register = () => {
    const [userRegister, setUserRegister] = useState({
        username: "",
        password: "",
        email: "",
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOnchange = (e) => {
        const copyUser = { ...userRegister };

        copyUser[e.target.name] = e.target.value;
        setUserRegister(copyUser);
    }

    const handleRegister = (e) => {
        e.preventDefault();
        registerUser(userRegister, dispatch, navigate);
    }

    return (
        <section className="register-container">
            <div className="register-title"> Sign up </div>
            <form onSubmit={(e) => handleRegister(e)}>
                <label>EMAIL</label>
                <input name="email" type="text" placeholder="Enter your email" value={userRegister.email} onChange={(e) => handleOnchange(e)} />
                <label>USERNAME</label>
                <input name="username" type="text" placeholder="Enter your username" value={userRegister.username} onChange={(e) => handleOnchange(e)} />
                <label>PASSWORD</label>
                <input name="password" type="password" placeholder="Enter your password" value={userRegister.password} onChange={(e) => handleOnchange(e)} />
                <button type="submit"> Create account </button>
            </form>
        </section>

    );
}

export default Register;