const router = require('express').Router();
const userRoutes = require('./userRoutes');

router.use('/user', userRoutes);
router.use('/project', projectRoutes);
router.use('/task', taskRoutes);

module.exports = router; 