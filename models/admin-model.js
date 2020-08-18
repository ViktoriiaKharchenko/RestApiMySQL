
module.exports = (sequelize, Sequelize) => {
    const {DataTypes} = require('sequelize')
    const Admin = sequelize.define("admin", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail:true
            },
            unique: {
                args: true,
                msg: 'Email address already in use!'
            }

        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        resetLink:{
            type:DataTypes.STRING
        }

    });

    return Admin;
};