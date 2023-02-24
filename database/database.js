const Sequelize = require('sequelize');
const connection = new Sequelize('questions_guide', 'root', '197697', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = connection;
