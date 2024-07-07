const sequelize = require('../config/db');
const User = require('./user');
const Organisation = require('./organisation');

User.belongsToMany(Organisation, { through: 'UserOrganisation', as: 'Organisations' });
Organisation.belongsToMany(User, { through: 'UserOrganisation', as: 'Users' });

module.exports = { sequelize, User, Organisation };
