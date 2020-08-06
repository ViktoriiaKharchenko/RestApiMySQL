
module.exports = (sequelize, Sequelize) => {
        const {DataTypes} = require('sequelize')
        const Post = sequelize.define("post", {
                title: {
                        type: DataTypes.STRING
                },
                text: {
                        type: DataTypes.TEXT
                },
                disease: {
                        type: DataTypes.TEXT
                },
                classification: {
                        type: DataTypes.TEXT
                },
                practice: {
                        type: DataTypes.TEXT
                },
                important: {
                        type: DataTypes.TEXT
                },
                recommendation: {
                        type: DataTypes.TEXT
                }

        });

        return Post;
};