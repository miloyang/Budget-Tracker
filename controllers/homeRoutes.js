const router = require('express').Router();
const { Project, User, Tasks } = require('../models');
const withAuth = require('../utils/auth');

// Create a get route to show all projects
router.get('/', async (req, res) => {
    try {
        // Get all projects and JOIN with user data
        const projectData = await Project.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const projects = projectData.map((project) => project.get({ plain: true }));

        res.render('homepage', {
            projects,
            logged_in: req.session.logged_in
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Create a get route to show a project based on ID
router.get('/projects/:id', async (req, res) => {
    try {
        const projectData = await Project.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const project = projectData.get({ plain: true });

        res.render('project', {
            project,
            logged_in: req.session.logged_in
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Create a get route to show user's profile
router.get('/profile', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Project }],
        });

        const user = userData.get({ plain: true });

        res.render('profile', {
            user,
            logged_in: true
        });
    } catch (error) {
        res.redirect('/profile');
        return;
    }

    res.render('login');
});

module.exports = router;