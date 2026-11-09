const jwt = require('jsonwebtoken');

const authadminMiddleware = (req, res, next) => {

    const token = req.headers.authorization;
    
    if(!token) {
        return res.status(401).json({
            message: "No token"
        });
    }

    try {
        const verify = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verify;
        next();
    } catch(error){
        res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = authadminMiddleware;


// Note: Where next() Happens
// req.user = verify;

// next();

// This part only runs when:

// ✅ token exists
// ✅ token is valid
// ✅ token is not expired

// What next() Does Here

// Suppose you have this route:

// const authadminMiddleware = require('./middleware/auth');

// app.get(
//     '/dashboard',
//     authadminMiddleware,
//     (req, res) => {

//         res.json({
//             message: "Welcome Admin",
//             user: req.user
//         });

//     }
// );