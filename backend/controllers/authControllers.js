const { model } = require("mongoose")
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const authController = {
    //REGISTER
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed
            })

            //Save to DB
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    generateToken: (user) => {
        return jwt.sign({
            id: user.id,
            username: user.username,
            admin: user.admin
        },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "30s" }
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            username: user.username,
            admin: user.admin
        },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "30d" }
        );
    },

    //LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                res.status(404).json("Wrong username!");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if (!validPassword) {
                res.status(404).json("Wrong password!");
            }
            if (user && validPassword) {
                const accessToken = authController.generateToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    path: '/',
                    sameSite: "strict", //cùng trang mới được dùng
                    secure: false, //Thực tế để true
                })

                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken });
            }

        } catch (err) {
            res.status(500).json(err);
        }
    },

    requestRefreshToken: async (req, res) => {
        //Take refreshToken from user
        const refreshToken = req.cookies.refreshToken;

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                res.status(403).json("RefreshToken is not valid");
            }
            const newAccessToken = authController.generateToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                path: '/',
                secure: false,
                sameSite: 'strict',
            });
            res.status(200).json(newAccessToken);
        })
    },

    userLogout: async (req, res) => {
        res.clearCookie("refreshToken");
        res.status(200).json("Logged out!");
    }
}

//STORE TOKEN
//1.LOCAL Storage => Bug XSS
//2. HTTPONLY Cookies => Thường ít bị ảnh hưởng bug XSS
//Tấn công CSRF -> đc bảo vệ bởi SAMESITE
//3. REDUX STORE => ACCESSTOKEN
//HTTPPONLY => lưu REFRESHTOKEN

//Tối ưu nhất: BFF PATTERN (BACKEND FOR FRONTEND) : dựng backend ảo cho frontend => dựng hơi cực

module.exports = authController;