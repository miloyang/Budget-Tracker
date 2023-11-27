const router = require('express').Router();
const { Tasks } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {
        const newTask = await Tasks.create({
            req.body,
            user_id: req.session.user_id
        })

        res.status(200).json(newTask);
    } catch (error) {
        res.status(400).json(error);
    }
});

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