const router = require("express").Router();
const bcrypt = require("bcrypt");
const Users = require("../models/User");
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

router.use((req, res, next) => {
    res.locals.title = 'Log In';
    next();
});

//log in
router.get("/login", (req, res) => {
    const msg = req.query.valid;
    const msgErr = req.query.validErr;
    res.render("auth/login", {message: msg, messageErr: msgErr});
});

router.post("/login", asyncHandler(async (req, res) => {
    const {username, password} = req.body;
    const user = await Users.findUserByUserName(username);
    if(user.isVerified)
    {
        if(user && bcrypt.compareSync(password, user.password))
        {
            req.session.userId = user.id;
            res.redirect("/");
        }
        else
        { 
            const string = encodeURIComponent('password is not match');
            return res.redirect('/login/?validErr=' + string);   
        }   
    }
    else
    {
        const string = encodeURIComponent('Your account has not been verified');
        return res.redirect('/login/?validErr=' + string);     
    }
    
}));

//log out
router.get("/logout", (req, res) => {
    delete req.session.userId;
    res.redirect("/");
});

//register
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL || 'ltw218ck1@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'ltw218ck118600100'
    }
});

router.get("/register", (req, res) => {
    res.locals.title = 'Register';
    res.render("auth/register");
});

//handle sign up logic
router.post("/register", asyncHandler(async(req, res) => {
    const { username, email, password } = req.body;
    let errors = [];
    if (!username) {
        errors.push({ mgs: 'username required' })
    }
    if (!email) {
        errors.push({ mgs: 'email required' })
    }
    if (!password) {
        errors.push({ mgs: 'password required' })
    }
    if (errors.length > 0) {
        res.render("auth/register", { errors })
    } 
    else {
        const data = await Users.create({ 
            username: username, 
            email: email, 
            password: bcrypt.hashSync(password, 10),
            emailToken: crypto.randomBytes(64).toString('hex'),
            isVerified: false,
            isPaid: false});
        if(data != undefined)
        {
            const msg = {
                to: email,
                from: process.env.EMAIL || 'ltw218ck1@gmail.com',              
                subject: 'verification your email',
                text: `
                    Hello, thanks for registering to our site
                    Please copy and paste the address below to verify your account.
                    http://${req.headers.host}/verify-email?token=${data.emailToken}
                `,
                html: `
                    <h1>Hello</h1>
                    <p>Thanks for registering on our site</p>
                    <p>Please click the link below to verify your account</p>
                    <a href="http://${req.headers.host}/verify-email?token=${data.emailToken}">Verify your account</a>
                `
            };
            try{
                transporter.sendMail(msg, (error, info) => {
                    if(error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        console.log("email send" + info.response);
                    }
                })
                const string = encodeURIComponent('Thank for registering. Please check your email to verify your account');
                return res.redirect('/?valid=' + string);
            }
            catch(error){
                console.log(error);                
                res.redirect("/");
            }
        }
        else{
            res.redirect("/register");
        }
    }
}));

router.get("/verify-email", async(req, res) => {
    try{
        const user = await Users.findOne({ emailToken: req.query.emailToken });
        if(!user)
        {
            return res.redirect("/register");
        }
        const userFind = await Users.findAll();
        const u = userFind[0];
        u.emailToken = null;
        u.isVerified = true;
        u.save();
        var string = encodeURIComponent('Please enter username and password you just registed');
        res.redirect("/login/?valid=" + string);
    }
    catch(error)
    {
        console.log(error);
        res.redirect("/");
    }
});

module.exports = router;