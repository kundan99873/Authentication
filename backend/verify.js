import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const secret = process.env.SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.json({
            error: "Please authenticate with a valid token"
        })
    } else {
        try {
            const verify = jwt.verify(token, secret);
            req.User = verify
            next()
        } catch (error) {
            res.json({
                error: error.message,
            })
        }
    }

}

export default verifyToken;