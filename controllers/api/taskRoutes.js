const router = require('express').Router();
const { Tasks } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a post route to create a new task
router.post('/', withAuth, async (req, res) => {
    try {
        const newTask = await Tasks.create({
            ...req.body,
            user_id: req.session.user_id
        })

        res.status(200).json(newTask);
    } catch (error) {
        res.status(400).json(error);
    }
});


// Create a get route to show all tasks
router.get('/', async (req, res) => {
    try {
        // Get all tasks and JOIN with user data
        const taskData = await Tasks.findAll({
            include: [
                {
                    model: Project,
                    attributes: ['name'],
                },
            ],
        });

        const tasks = taskData.map((task) => task.get({ plain: true }));

        res.render('homepage', {
            tasks,
            logged_in: req.session.logged_in
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Create a get route to show a task based on ID
router.get('/tasks/:id', async (req, res) => {
    try {
        const taskData = await Tasks.findByPk(req.params.id, {
            include: [
                {
                    model: Project,
                    attributes: ['name'],
                },
            ],
        });

        const tasks = taskData.get({ plain: true });

        res.render('tasks', {
            tasks,
            logged_in: req.session.logged_in
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Create a post route to delete a project
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const taskData = await Tasks.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!taskData) {
            res.status(404).json({ message: 'No task found!'});
            return;
        }

        res.status(200).json(taskData);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;