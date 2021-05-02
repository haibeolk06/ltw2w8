const { DataTypes } = require('sequelize');
const db = require("./db");

const Todo = db.define("Todo", {
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    done:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
});

module.exports = Todo;