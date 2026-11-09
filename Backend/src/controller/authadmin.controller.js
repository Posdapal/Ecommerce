const db = require("../config/db")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Admin
const register = async (req, res) => {

    const { username, email, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO admin(username, email, password) VALUES(?, ?, ?)";

    const param = [username, email, hashedPassword];

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

// Login Admin
const login = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM admin WHERE email = ?";

    const param = [email];

    db.query(sql, param, async (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Email not found"
            });
        }

        // Gets first user object.
        const user = result[0];

        // compare password
        // Note: What Happens

        // User enters:

        // 123456

        // Database stores:

        // $2b$10$askdjaks...

        // bcrypt compares them securely.
        const checkPassword = await bcrypt.compare(
        password,
        user.password
        );



    if (!checkPassword) {
        return res.status(400).json({
            message: "Wrong password"
        });
    }

    // create authentication token 
    const token = jwt.sign(
        // Data stored inside token.
        {
            id: user.id,
            email: user.email
        },
        // Secret Key used to secure/sign token.
        // From .env:

        // JWT_SECRET=mysecretkey
        process.env.JWT_SECRET,
        {
            // Token expires after 1 day.
            expiresIn: "1d"
        }
    );

    res.json({
        message: "Login Success",
        token
    });
});
};

// PROTECTED 
const profile = (req, res) => {
    res.json({
        message: "Welcome Admin",
        user: req.user
    });
};

module.exports = {
    register,
    login,
    profile
};


// Note:
// 1. Encryption

// Encryption means:

// convert data into secret code AND can convert back to original.

// Example:

// Hello
// ↓
// Encrypted
// ↓
// xYz123@

// Later you can decrypt:

// xYz123@
// ↓
// Decrypt
// ↓
// Hello

// So encryption is:

// ✅ reversible

// Encryption Uses

// Used for:

// bank data
// messages
// files
// HTTPS
// credit cards

// because system may need original data later.

// 2. Hashing

// Hashing means:

// convert data into fixed secret value that CANNOT be reversed.

// Example:

// 123456
// ↓
// Hash
// ↓
// $2b$10$asdjkasjdk...

// You CANNOT get:

// 123456

// back from hash.

// So hashing is:

// ❌ NOT reversible

// Hashing Uses

// Used for:

// passwords
// authentication
// login systems

// because system should NEVER know real password.

// Main Difference
// Feature	Encryption	Hashing
// Can reverse?	✅ Yes	❌ No
// Purpose	Protect data	Verify data
// Used for	Files/messages	Passwords
// Key needed?	✅ Yes	❌ No
// Example	AES	bcrypt
// Password Example

// User password:

// 123456
// Bad Practice

// Store directly:

// password
// 123456

// Very dangerous ❌

// Good Practice

// Hash password:

// bcrypt.hash(password, 10)

// Database stores:

// password
// $2b$10$kjashdkj...

// Very secure ✅

// Login Example

// User enters:

// 123456

// System uses:

// bcrypt.compare(password, hash)

// It checks if password matches hash.

// Important

// Hash is NOT decrypted.

// Instead:

// compare hash result

// This is safer.

// Easy Analogy
// Encryption

// Like:

// Lock + Key

// You can unlock later.

// Hashing

// Like:

// Blend fruit into smoothie

// You cannot turn smoothie back into original fruit.

// In Express.js Authentication

// Usually:

// Security	Used
// Encryption	JWT secret, HTTPS
// Hashing	Passwords
// JWT Example

// JWT token is signed/encrypted using:

// JWT_SECRET
// Password Example

// Password is hashed using:

// bcrypt.hash()
// Flow
// User Password
//    ↓
// Hash Password
//    ↓
// Save Hash to Database
//    ↓
// Login
//    ↓
// Compare Password with Hash
// Very Important Rule

// ✅ Passwords → HASH
// ❌ Passwords → NEVER encrypt only

// Because hashed passwords are much safer.


// Note:
