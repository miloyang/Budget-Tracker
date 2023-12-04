const router = require('express').Router();
const userRoutes = require('./userRoutes');
const projectRoutes = require('./projectRoutes');
const taskRoutes = require('./taskRoutes');
const uploadRoutes = require('./uploadRoutes')

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/upload', uploadRoutes);

module.exports = router; 