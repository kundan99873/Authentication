import mongoose from "mongoose";

const userModal = new mongoose.Schema({
    email : {
        type : String,
        required : [true, "Please provide your email"],
        unique : true
    },
    username : {
        type : String,
        required : [true, "Please provide your username"],
        unique : true
    },
    name : {
        type : String,
        required : [true, "Please provide your name"],
    },
    password : {
        type : String,
        required : [true, "Please provide a password"],
    },
    verified : {
        type : Boolean,
        default : false
    },
    verifiedToken : {
        type : String
    },
    verifiedTokenExpiry : {
        type : Date,
        default : Date.now() + 3600000
    },
    forgotToken : {
        type : String
    },
    forgotTokenExpiry : {
        type : Date
    }
},{
    timestamps : true
})

const User = mongoose.model("Users", userModal)
export default User;