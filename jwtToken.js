// create token and saving cookie
const sendToken = (users, statusCode, res) => {
    const token = users.getJWTToken();
    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    return res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message: "login Successfull",
        token,
        users
    });
}
module.exports = sendToken;