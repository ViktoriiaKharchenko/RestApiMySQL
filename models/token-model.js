module.exports = (sequelize, Sequelize) => {
    const {DataTypes} = require('sequelize')
    const Token = sequelize.define("token", {
        tokenId: {
            type: DataTypes.STRING

        },
        userId: {
            type: DataTypes.INTEGER
        }

    });

    return Token;
};