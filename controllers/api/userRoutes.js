const { Game, User } = require('../models');
const router = require('express').Router();

// login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const userData = await User.findOne({ where: { username: username } });

        switch (!userData || !userData.passwordCompare(password)) {
            case (false):
                // session save
                return req.session.save(() => {
                    req.session.user_id = userData.id;
                    // loggedIn
                    req.session.loggedIn = true;
                    return res.json('logged in');
                });
            default:
                return res.status(400).json('Please check your username / password and resubmit.');
        }
    } catch (error) { return res.status(400).json(error); }
});

// signup
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        const fnd = await User.findOne({ where: { username: username.toLowerCase() } });
        if (fnd) {
            return res.status(400).json("username exists - Please submit another username.");
        }

        await User.create({ username: username, password: password });

        const userData = User.findOne({ where: { username: username } });

        // session save
        return req.session.save(() => {
            req.session.user_id = userData.id;
            // loggedIn
            req.session.loggedIn = true;
            return res.json('signed up');
        })
    } catch (error) { return res.status(400).json(error); }
});

// logout
router.post('/logout', async (req, res) => {
    try {
        await req.session.destroy(() => {
            return res.end();
        });
    } catch (error) { return res.end(); }
});


// game create
router.post('/newgame', async (req, res) => {
    try {
        const { gameText } = req.body;

        const { user_id } = req.session;

        const newGame = await Game.create({game_text: gameText, user_id: user_id})
        return res.json(newGame);
    } catch (error) { return res.status(400).json(error); }
});

module.exports = router;