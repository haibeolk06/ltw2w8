const router = require('express').Router();
const News = require('../models/News');
const asyncHandler = require('express-async-handler');

router.use((req, res, next) => {
    res.locals.title = 'News about covid 19';
    next();
});

router.get("/news", asyncHandler(async (req, res) => {
    if(!req.currentUser)
    {
        res.redirect("/");
    }
    else
    {
        const data = await News.findAll();
        res.render("news/news", { news: data }); 
    }
}));

module.exports = router;