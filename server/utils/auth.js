const jwt = require("jsonwebtoken");

exports.createJWT = (email, userId, duration) => {
    const payload = {
        email,
        userId,
        duration
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: duration,
    });
};

exports.verifyJWT = (req, res, next) => {
    // removes 'Bearer` from token
    // const token = req.headers["x-access-token"]?.split(' ')[1]
    const token = req.headers["x-access-token"];

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {

            if (err) 
                return res.status(500).json({isLoggedIn: false, message: "Failed To Authenticate"})
                
            req.user = {};
            // req.user.id = decoded.id
            req.user.userId = decoded.userId;
            req.user.email = decoded.email;

            // req.user.pfp = decoded.pfp
            next()
        })
    } else {
        return res.status(401).json({message: "Incorrect Token Given", isLoggedIn: false})
    }
}