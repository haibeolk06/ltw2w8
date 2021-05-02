const ensure_loggin = function ensureLoggedIn(req, res, next)
{
    if(!req.currentUser)
    {
        res.redirect("/");
    }
    else
    {
        next();
    }
};

module.exports = ensure_loggin;