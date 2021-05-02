const router = require("express").Router();
const {promisify} = require("util");
const rename = promisify(require('fs').rename);
const multer = require("multer");   
const asyncHandler = require('express-async-handler');
const upload = multer({ storage: multer.memoryStorage() });
const Users = require('../models/User');

router.use((req, res, next) => {
    res.locals.title = 'Profile';
    next();
});

router.get("/profile", (req, res) => {
    if(!req.currentUser)
    {
        res.redirect("/");
    }
    else
    {
        res.render("profile/profile");  
    }
});

router.post("/profile", upload.single('picture') , asyncHandler(async (req, res) => {
    const user = req.currentUser;
    user.picture = req.file.buffer;
    await user.save();
    res.redirect('/admin');
}));    

router.get("/picture/:id", asyncHandler(async (req, res) =>{
    const user = await Users.finUserdById(req.params.id);
    if(!user || !user.picture)
    {
        res.render(404).send("File not found");
    }
    else
    {
        res.header('Content-Type', 'image/jpeg').send(user.picture);
    }
}));

module.exports = router;