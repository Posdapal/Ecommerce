const db = require("../config/db")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const register = async (req, res) => {

    const { username, email, password, phone } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users(username, email, password, phone) VALUES(?, ?, ?, ?)";

    const param = [username, email, hashedPassword, phone];

    db.query(sql, param, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Register Success"
        });

    }
    );
};

// Login User
const login = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if(err){
            return res.status(500).json(err);
        }

        if(result.length === 0){
            return res.status(404).json({
                message: "Email not founded"
            });
        }

        const user = result[0];

        const checkPassword = await bcrypt.compare(
            password,
            user.password
        );

        if(!checkPassword){
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login Success",
            token,
            username: user.username   // 👈 add this
        });
    });
};

// PROTECTED ROUTE
const profile = (req, res) => {
    res.json({
        message: "Welcome User Website"
    });
};

module.exports = {
    register,
    login,
    profile
}