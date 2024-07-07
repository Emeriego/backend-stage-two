// This file contains the User model which is used to interact
// with the User table in the database.
const { DataTypes } = require('sequelize');
// the above line brings in the DataTypes object from
// sequelize to define the data types
//bring in the sequelize instance for the database connection
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
});

module.exports = User;
