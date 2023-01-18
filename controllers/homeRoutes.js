const { Games, Users } = require('../models');
const router = require('express').Router();
const authReq = require('../utils/auth');
const sequelize = require('../config/connection');

// login
router.get('/', (req, res) => {
    return res.render('login');
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

// getGames
router.get('/getGames', authReq, async (req, res) => {
    const { user_id } = req.session;

    const allGames = await Games.findAll({
        where: { user_id: user_id },
        include: [
            { model: Users, attributes: { exclude: ['password'] } }
        ]
    });

    let games = [];
    switch (true) {
        case (!allGames):
            return res.render('dashboard');
        default:
            for (let i = 0; i < allGames.length; i++) {
                const eachGame = allGames[i];
                games.push(eachGame.get({ plain: true }));
            }
    }
    res.json(games)
})

// dashboard
router.get('/dashboard', authReq, async (req, res) => {
    try {
        const { loggedIn, user_id } = req.session;

        const userData = await Users.findByPk(user_id, {
            include: [
                { model: Games }
            ],
            attributes: {
                exclude: ['password'],
                include: [
                    [
                        sequelize.literal(
                            '(SELECT SUM(points) FROM game WHERE user_id = ' + user_id + ')'), 'total_points',
                    ],
                    [
                        sequelize.literal(
                            '(SELECT SUM(assists) FROM game WHERE user_id = ' + user_id + ')'), 'total_assists',
                    ],
                    [
                        sequelize.literal(
                            '(SELECT SUM(rebounds) FROM game WHERE user_id = ' + user_id + ')'), 'total_rebounds',
                    ],
                    [
                        sequelize.literal(
                            '(SELECT COUNT(win) FROM game WHERE win = true AND user_id = ' + user_id + ')'), 'total_wins',
                    ],
                    [
                        sequelize.literal(
                            '(SELECT COUNT(id) FROM game WHERE user_id = ' + user_id + ')'), 'total_games',
                    ],
                    [
                        sequelize.literal(
                            '(SELECT (SUM(points)/COUNT(id)) FROM game WHERE user_id = ' + user_id + ')'), 'avg_points_per_game',
                    ],
                    [
                        sequelize.literal(
                            '(SELECT (SUM(assists)/COUNT(id)) FROM game WHERE user_id = ' + user_id + ')'), 'avg_assists_per_game',
                    ],
                    [
                        sequelize.literal(
                            '(SELECT (SUM(rebounds)/COUNT(id)) FROM game WHERE user_id = ' + user_id + ')'), 'avg_rebounds_per_game',
                    ],
                    [
                        sequelize.literal(
                            '(SELECT (SELECT COUNT(win) from game WHERE win = true AND user_id = ' + user_id + ')/COUNT(id) FROM game WHERE user_id = ' + user_id+ ')'), 'win_percentage',
                    ]
                ]
            }
        });

        const user = userData.get({ plain: true });

        const allGames = await Games.findAll({
            where: { user_id: user_id },
            include: [
                { model: Users, attributes: { exclude: ['password'] } }
            ]
        });

        let games = [];
        switch (true) {
            case (!allGames):
                return res.render('dashboard');
            default:
                for (let i = 0; i < allGames.length; i++) {
                    const eachGame = allGames[i];
                    games.push(eachGame.get({ plain: true }));
                }
        }

        const recentEntries = await Games.findAll({
            where: { user_id: user_id },
            include: [
                { model: Users, attributes: { exclude: ['password'] } }
            ],
            order: [
                ['id', 'DESC']
            ],
            limit: 3
        });

        let recent = [];
        for (let i = 0; i < recentEntries.length; i++) {
            const game = recentEntries[i];
            recent.push(game.get({ plain: true }));
        }
            console.log(games);

        return res.render('dashboard', { user, games, recent, loggedIn: loggedIn });

    } catch (error) {
        return res.status(500).json(error);
    }
});

// game by id
router.get('/games/:id', authReq, async (req, res) => {
    const { id } = req.params
    try {
        const gameData = await Games.findByPk(id, {
            include: [
                { model: Users, attributes: { exclude: ['password'] } }
            ]
        });

        if (!gameData) {
            return res.redirect('/dashboard');
        };

        const { loggedIn } = req.session;
        const game = gameData.get({ plain: true });

        res.render('game', { game, loggedIn: loggedIn });

    } catch (error) {
        return res.status(500).json(error);
    }
});

module.exports = router;