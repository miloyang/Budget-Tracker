const sequelize = require('../config/connection');
const { User, Project, Task } = require('../models');

const userData = require('./userData.json');
const projectData = require('./projectData.json');
const taskData = require('./taskData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    const projects = await Project.bulkCreate(projectData);

    const tasks = await Task.bulkCreate(taskData);

    process.exit(0);
};

seedDatabase();