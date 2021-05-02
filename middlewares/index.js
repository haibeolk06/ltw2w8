const Users = require("../models/User");

const middewareObj = {};

middewareObj.isNotVerified = async (req, res, next) => {
    try {
        const user = Users.findOne({ username: req.body.username });
        if(user.isVerified)
        {
            return next();
        }
        req.flash('error', 'your account has not been verified. Please check your email to verify your account');
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
};

module.exports = middewareObj;