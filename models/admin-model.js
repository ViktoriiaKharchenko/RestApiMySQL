
module.exports = (sequelize, Sequelize) => {
    const {DataTypes} = require('sequelize')
    const Admin = sequelize.define("admin", {
        email: {
            type: DataTypes.STRING

        },
        password: {
            type: DataTypes.STRING
        }

    });

    return Admin;
};