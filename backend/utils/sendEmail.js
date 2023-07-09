import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

const sendMail = async (email, subject, text) => {
    try {
        const transport = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: process.env.EMAIL_PORT,
            secure: process.env.SECURE,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })

        await transport.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        })

        console.log("email sent successfully")
    } catch (error) {
        console.log(error.message)
    }
}

export default sendMail;