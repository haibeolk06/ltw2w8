const { DataTypes } = require('sequelize');
const db = require("./db");

const Users = db.define("Users", {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    emailToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    picture: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

Users.findUserByUserName = async function (username) {
    return Users.findOne({
        where:{
            username,
        }
    })
};

Users.finUserdById = async function (id) {
    return Users.findByPk(id);  
};

module.exports = Users;
