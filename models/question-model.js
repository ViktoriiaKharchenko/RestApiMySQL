
module.exports = (sequelize, Sequelize) => {
    const {DataTypes} = require('sequelize')
    const Question = sequelize.define("question", {
        title: {
            type: DataTypes.STRING
        },
        text: {
            type: DataTypes.TEXT
        },
        age: {
            type: DataTypes.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        answer: {
            type: DataTypes.TEXT
        }
    });

    return Question;
};