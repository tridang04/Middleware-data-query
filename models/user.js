const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://user:pass@localhost:3306/database');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING
    },
    phoneNumber: {
        type: DataTypes.STRING,
    },
    avatar: {
        type: DataTypes.STRING,
    }
});

module.exports = User;