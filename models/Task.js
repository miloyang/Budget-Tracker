const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Task extends Model {}

Task.init(
    {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        status: {
          type: DataTypes.ENUM('new', 'urgent', 'in progress', 'completed'),
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          references: {
        model: 'user',
        key: 'id',
        },
        project_id: {
          type: DataTypes.INTEGER,
          references: {
        model: 'project',
        key: 'id',
        },
      },
    },
  },
{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'task',
  }
);

module.exports = Task;