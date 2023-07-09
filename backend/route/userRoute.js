import express from "express";
import User from "../model/UserModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import verifyToken from "../verify.js";
import sendMail from "../utils/sendEmail.js";
import crypto from "crypto";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const secret = process.env.SECRET;

router.post("/register", async (req, res) => {
    try {
        const body = req.body;

        const existedUser = await User.findOne({ email: body.email })
        if (existedUser) {
            return res.json({
                error: "User already existed"
            })
        }

        const existedName = await User.findOne({ username: body.username })
        if (existedName) {
            return res.json({
                error: "Please try with another user name"
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(body.password, salt);
        const userToken = crypto.randomBytes(32).toString("hex");

        const data = new User({
            name: body.name,
            password: hashedPassword,
            username: body.username,
            email: body.email,
            verifiedToken: userToken,
        })
        const user = await User.create(data)

        const url = `http://localhost:3000/user/${user._id}/token/${userToken}`
        await sendMail(body.email, "VERIFY EMAIL ADDRESS", url)

        return res.json({
            message: "User created Successfully",
            mailMsg: "Verifing Mail sent to your email address, Please Verify",
            success: true
        })
    } catch (error) {
        res.json({ error: error.message })
    }
})

router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const existedUser = await User.findOne({ email })
        if (!existedUser) {
            return res.json({
                error: "Please login with correct credentials"
            })
        }

        const validatePassword = await bcryptjs.compare(password, existedUser.password)
        if (!validatePassword) {
            return res.json({
                error: "Please login with correct credentials"
            })
        }

        if (!existedUser.verified) {
            const userVerifyToken = crypto.randomBytes(32).toString("hex");
            await User.updateOne(
                { email: email },
                {
                    $set: {
                        verifiedToken: userVerifyToken,
                        verifiedTokenExpiry: Date.now() + 3600000
                    }
                }
            )
            const url = `http://localhost:3000/user/${existedUser._id}/verify/${userVerifyToken}`

            sendMail(email, "VERIFY EMAIL ADDRESS", url)

            return res.json({
                error: "Verifing Mail sent to your email address, Please Verify"
            })
        }

        const data = {
            id: existedUser._id
        }

        const token = jwt.sign(data, secret)
        return res.json({
            message: "Login Successful",
            token,
            success: true
        })

    } catch (error) {
        res.json({ error: error.message })
    }
})

router.get("/getUser", verifyToken, async (req, res) => {
    try {

        const { id } = req.User;
        const user = await User.findById(id)
        return res.json(user)
    } catch (error) {
        return res.json({ error: error.message })
    }
})

router.get("/getUser/:id", async (req, res) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            const user = await User.findOne({ _id: req.params.id })
            return res.json(user)
        }
        else {
            return res.json({
                error: "invalid id"
            })
        }
    } catch (error) {
        return res.json({ error: error.message })
    }
})

router.put("/:id/verify/:token", async (req, res) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {

            const user = await User.findById(req.params.id)
            if (!user) {
                return res.json({
                    error: "Invalid link"
                })
            }

            if (req.params.token !== user.verifiedToken) {
                return res.json({
                    error: "Invalid link"
                })
            }

            if (user.verifiedTokenExpiry < Date.now()) {
                return res.json({
                    error: "Link Expired"
                })
            }

            await User.updateOne({ _id: req.params.id }, { $set: { verified: true } })
            res.json({
                message: "Email verified successfully",
                success: true
            })
        } else {
            return res.json({
                error: "Invalid Link"
            })
        }
    } catch (error) {
        return res.json({ error: error.message, errors: error })
    }
})

router.put("/forgot", async (req, res) => {
    try {


        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.json({
                error: "Email Id not exist"
            })
        }

        const forgotToken = crypto.randomBytes(32).toString("hex")
        await User.updateOne({ email: user.email },
            {
                $set: {
                    forgotToken: forgotToken,
                    forgotTokenExpiry: Date.now() + 3600000
                }
            })

        const url = `http://localhost:3000/user/${user._id}/reset/${forgotToken}`

        sendMail(user.email, "RESET YOUR PASSWORD", url)

        return res.json({
            message: "Reset Password link send to your mail",
            success: true
        })

    } catch (error) {
        return res.json({ error: error.message })
    }
})

router.get("/:id/forgot/:token", async (req, res) => {
    try {

        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            const user = await User.findById(req.params.id);

            if (user.forgotToken !== req.params.token) {
                return res.json({
                    error: "Invalid Link"
                })
            }

            if (user.forgotTokenExpiry < Date.now()) {
                return res.json({
                    error: "Link Expired"
                })
            }

            return res.json({
                success: true
            })

        } else {
            return res.json({
                error: "Invalid Link"
            })
        }
    } catch (error) {
        return res.json({ error: error.message })
    }
})
router.put("/reset/:id", async (req, res) => {
    try {

        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            const user = await User.findById(req.params.id);

            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(req.body.password, salt);

            await User.updateOne(
                { email: user.email },
                { $set: { password: hashedPassword } }
            )

            console.log(req.body.password)

            return res.json({
                message: "Your Password change successfully",
                success: true
            })
        } else {
            return res.json({
                error: "Invalid Link"
            })
        }
    } catch (error) {
        return res.json({ error: error.message })
    }
})


export default router;