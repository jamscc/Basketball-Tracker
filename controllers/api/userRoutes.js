const { Games, Users } = require('../../models');
const router = require('express').Router();

// login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const userData = await Users.findOne({ where: { username: username } });

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
        const { username, email, password } = req.body;

        const fndUsername = await Users.findOne({ where: { username: username.toLowerCase() } });
        if (fndUsername) {
            return res.status(400).json("username exists - Please submit another username.");
        }

        const fndEmail = await Users.findOne({ where: { email: email.toLowerCase() } });
        if (fndEmail) {
            return res.status(400).json("email exists - Please submit another email.");
        }

        await Users.create({ username: username, email: email, password: password });

        const userData = await Users.findOne({ where: { username: username } });

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
router.post('/logout', (req, res) => {
    try {
        req.session.destroy(() => {
            return res.end();
        });
    } catch (error) { return res.end(); }
});


// game create
router.post('/newgame', async (req, res) => {
    try {
        const { user_id } = req.session;

        const newGame = await Games.create({
            gameDate: req.body.gameDate, 
            notes: req.body.notes,
            win: req.body.win,
            score: req.body.score,
            assists: req.body.assists,
            rebounds: req.body.rebounds,
            points: req.body.points, 
            user_id: user_id})
        return res.json(newGame);
    } catch (error) { return res.status(400).json(error); }
});

module.exports = router;