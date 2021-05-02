const router = require("express").Router();
const Users = require("../models/User");
const asyncHandler = require('express-async-handler');

router.use((req, res, next) => {
    res.locals.title = 'Admin';
    next();
});

router.get("/admin",  asyncHandler(async (req, res) => {
    if(!req.currentUser)
    {
        res.redirect("/");
    }
    else
    {
        res.render("admin/admin", {data: req.currentUser});
    }
}));

module.exports = router;