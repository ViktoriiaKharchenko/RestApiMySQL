module.exports = (sequelize, Sequelize) => {
    const {DataTypes} = require('sequelize')
    const PostSlider = sequelize.define("postslider", {
        title: {
            type: DataTypes.TEXT

        },
        text: {
            type: DataTypes.TEXT
        },
        alltext: {
            type: DataTypes.TEXT
        }

    });

    return PostSlider;
};