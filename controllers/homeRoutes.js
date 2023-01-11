const { Game, User } = require('../models');
const router = require('express').Router();
const authReq = require('../utils/auth');
const sequelize = require('../config/connection');

// homepage
router.get('/', (req, res) => {
    return res.render('homepage');
});

// login
router.get('/login', (req, res) => {
    const { loggedIn } = req.session;
    switch (true) {
        case (!loggedIn):
            return res.render('login');
        default:
            return res.redirect('/dashboard');
    }
});

// signup
router.get('/signup', (req, res) => {
    const { loggedIn } = req.session;
    switch (true) {
        case (!loggedIn):
            return res.render('signup');
        default:
            return res.redirect('/dashboard');
    }
});

// dashboard
router.get('/dashboard', authReq, async (req, res) => {
    try {
        const { loggedIn, user_id } = req.session;
        const userGames = await Game.findAll({ where: { user_id: user_id } })

        switch (true) {
            case (!userGames):
                return res.render('dashboard');
            default:
                let games = [];
                for (let i = 0; i < userGames.length; i++) {
                    const eachGame = userGames[i];
                    games.push(eachGame.get({ plain: true }));
                }
                return res.render('dashboard', { games, loggedIn: loggedIn });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});

// game by id
router.get('/games/:id', authReq, (req, res) => {
    const { id } = req.params
    try {
        const gameData = Game.findByPk(id, {
            include: [
                { model: User, attributes: { exclude: ['password'] } }
            ]
        });

        if (!gameData) {
            return res.redirect('/dashboard');
        };

        const { loggedIn } = req.session;
        const game = gameData.get({ plain: true })

        res.render('game', { game, loggedIn: loggedIn });

    } catch (error) {
        return res.status(500).json(error);
    }
});

module.exports = router;