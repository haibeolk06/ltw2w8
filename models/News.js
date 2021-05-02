const { DataTypes } = require('sequelize');
const db = require("./db");

const News = db.define("News", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contentSnippet: {
        type: DataTypes.STRING
    }
});

module.exports = News;