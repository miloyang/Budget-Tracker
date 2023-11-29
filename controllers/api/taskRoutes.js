const router = require('express').Router();
const { Task, Project } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a post route to create a new task
router.post('/', withAuth, async (req, res) => {
    try {
        const newTask = await Task.create({
            ...req.body,
            user_id: req.session.user_id
        })

        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create a new task.'});
    }
});


// Create a get route to show all tasks
router.get('/', async (req, res) => {
    try {
        // Get all tasks and JOIN with user data
        const taskData = await Task.findAll({
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
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Create a get route to show a task based on ID
router.get('/:id', async (req, res) => {
    try {
        const taskData = await Task.findByPk(req.params.id, {
            include: [
                {
                    model: Project,
                    attributes: ['name'],
                },
            ],
        });

        if (!taskData) {
            res.status(404).json({ message: 'Task not found.' });
            return;
        }

        const task = taskData.get({ plain: true });

        res.render('tasks', {
            task,
            logged_in: req.session.logged_in
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Create a delete route to delete a project
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const taskData = await Task.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!taskData) {
            res.status(404).json({ message: 'Task not found!'});
            return;
        }

        res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;