const {mysqlpass} = require('../config/app')
const Sequelize = require("sequelize");
const sequelize = new Sequelize("EntSiteDatabase", "root", mysqlpass, {
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: false,

});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.questions = require('../models/question-model')(sequelize, Sequelize);
db.posts = require('../models/post-model')(sequelize, Sequelize);
db.contacts = require('../models/contact-model')(sequelize, Sequelize);
db.admins = require('../models/admin-model')(sequelize, Sequelize);
db.tokens = require('../models/token-model')(sequelize, Sequelize);
db.postsliders = require('../models/postSlider-model')(sequelize, Sequelize);

module.exports = db;

