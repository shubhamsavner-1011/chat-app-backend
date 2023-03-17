const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password : String,
    },
    { timestamps: true }
)

userSchema.methods.getJWTToken = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,
    });
}



module.exports = mongoose.model("User", userSchema)


