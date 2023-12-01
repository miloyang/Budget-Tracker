const router = require('express').Router();
const { User } = require('../../models');

// Create a post route to create a user
router.post('/', async (req, res) => {
    try {
       const userData = await User.create(req.body);

       req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.loggedIn = true;

        res.status(200).json(userData);
       });
    } catch (error) {
        console.log('userRoutes post error');
        res.status(500).json(error);
    }
});

// Create a post route to login a user
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (!userData) {
            res
            .status(400)
            .json({ message : 'Incorrect email or password. Please try again!'});
            return;
        }

        if (!validPassword) {
            res
            .status(400)
            .json({ message : 'Incorrect email or password. Please try again!'});
            return;
        }

        req.session.save(() => {
            req.session.loggedIn = true;

            res
            .status(200)
            .json({ user: userData, message: 'You are now logged in!'});
        })
    } catch (error) {
        console.error(' userRoutes post login error');
        res.status(500).json(error);
    }
});

// Create a post route to logout a user
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router; 