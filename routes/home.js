const router = require("express").Router();

router.get("/", (req, res) => {
    const passedVariable = req.query.valid;
    res.render("home", {title: "Home", message: passedVariable});
});

module.exports = router;