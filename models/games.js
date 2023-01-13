const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Game extends Model {}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    gameDate: {
      type: DataTypes.STRING,
      // type: DataTypes.DATE,
      // defaultValue: DataTypes.NOW,
    },
    notes: {
      type: DataTypes.STRING,
      validate: {
        len: [0,500],
      },
    },
    win: { 
      type: DataTypes.BOOLEAN,
    },
    score: {
      type: DataTypes.STRING,
    },
    assists: {
      type: DataTypes.INTEGER,
    },
    rebounds: {
      type: DataTypes.INTEGER,
    },
    points: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'game',
  }
);

module.exports = Game;