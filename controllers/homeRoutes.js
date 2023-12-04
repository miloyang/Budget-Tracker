const router = require("express").Router();
const { Project, User, Task } = require("../models");
const withAuth = require("../utils/auth");

router.get("/tasks/:projectId", async (req, res) => {
  try {
    const taskData = await Task.findAll({
      where: { project_id: req.params.projectId },
    });

    const projectData = await Project.findByPk(req.params.projectId);
    const project = projectData.get({ plain: true });
    // const tasks = taskData.get({ plain: true });
    console.log(project, taskData);
    res.render("tasks", {
      project,
      taskData,
      logged_in: req.session.logged_in,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a get route to show a project based on ID
router.get("/project/:id", async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const project = projectData.get({ plain: true });
    console.log(project);
    res.render("project", {
      project,
      logged_in: req.session.logged_in,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a get route to show user's profile
router.get("/profile", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });
    console.log("here", user);
    res.render("profile", {
      user,
      logged_in: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/profile");
    // return;
  }
  // res.render('login');
});

// Create a get route to show all projects
router.get("/", async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const projects = projectData.map((project) => project.get({ plain: true }));

    res.render("homepage", {
      projects,
      logged_in: req.session.logged_in,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
