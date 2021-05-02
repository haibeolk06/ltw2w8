const asyncHandler = require('express-async-handler');
const router = require("express").Router();
const Todo = require("../models/Todo");

router.use((req,res,next) => {
    res.locals.title = 'Todos';
    next();
});

router.get("/todo", asyncHandler(async (req, res) => {
    if(!req.currentUser)
    {
        res.redirect("/");
    }
    else
    {
        const data = await Todo.findAll();
        res.render("todoList/todo", { todos: data });
    }
}));

module.exports = router;