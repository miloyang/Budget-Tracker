const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');

User.hasMany(Project, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Project.belongsTo(User, {
  foreignKey: 'user_id'
});

Project.hasMany(Task, {
  foreignKey: 'project_id',
  onDelete: 'CASCADE'
});

module.exports = { User, Project, Task };
