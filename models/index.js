const sequelize = require('../config/db');
const User = require('./User');
const Organisation = require('./Organisation');

User.belongsToMany(Organisation, { through: 'UserOrganisation', as: 'Organisations' });
Organisation.belongsToMany(User, { through: 'UserOrganisation', as: 'Users' });

module.exports = { sequelize, User, Organisation };
