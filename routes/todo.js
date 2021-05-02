const router = require("express").Router();
const Todos = require('../models/Todo');
const asyncHandler = require('express-async-handler');

router.post("/addTodo", asyncHandler(async(req, res) => {
    const { todo } = req.body;
    let errors = [];
    if (!todo) {
        errors.push({ mgs: 'todo required' })
    }
    if (errors.length > 0) {
        res.render("todoList/todo", { todo })
    } else {
        const data = await Todos.create({ content: todo, done: false });
        if(data!=undefined)
        {
            console.log("insert successfully");
            res.redirect("/todo");
        }
        else{
            console.log("insert failed");
            res.redirect("/todo");
        }
    }
 }));

router.get("/delete/todo/:id", asyncHandler(async(req, res) => {
    const deletedRecord  = await Todos.destroy({
        where: {
            id: req.params.id
        }
    });
    if(deletedRecord===1)
    {
        console.log("deleted");
        res.redirect("/todo");
    }
    else
    {
        console.log("can't delete");
        res.redirect("/todo");
    }
}));

module.exports = router;