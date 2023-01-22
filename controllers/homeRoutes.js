const { Games, Users } = require('../models');
const router = require('express').Router();
const authReq = require('../utils/auth');
const sequelize = require('../config/connection');

//about
router.get('/about', (req, res) => {
    const { loggedIn } = req.session;

    return res.render('about', { loggedIn: loggedIn });
});
// login
router.get('/', (req, res) => {
    const { loggedIn } = req.session;
    switch (true) {
        case (!loggedIn):
            return res.render('login');
        default:
            return res.redirect('/dashboard');
    }
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

function sqlLiterals(user_id) {
    return [
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
                '(SELECT ((SELECT COUNT(win) from game WHERE win = true AND user_id = ' + user_id + ')/COUNT(id))*100 FROM game WHERE user_id = ' + user_id + ')'), 'win_percentage',
        ]
    ]
}

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
                include: sqlLiterals(user_id)
            }
        });

        const user = userData.get({ plain: true });

        const allGames = await Games.findAll({
            where: { user_id: user_id },
            include: [
                { model: Users, attributes: { exclude: ['password'] } }
            ],
            order: [
                ['gameDate', 'DESC']
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
            include: [
                { model: Users, attributes: { exclude: ['password'] } }
            ],
            order: [
                ['gameDate', 'DESC']
            ]
        });

        let recent = [];
        for (let i = 0; i < recentEntries.length; i++) {
            const game = recentEntries[i];
            const getgame = game.get({ plain: true });
            const gameSelect = getgame.gameDate + " " + getgame.score;
            
            if (!recent.includes(gameSelect)) {
                recent.push(gameSelect);
            }
        }
        return res.render('dashboard', { user, games, recent, loggedIn: loggedIn });

    } catch (error) {
        return res.status(500).json(error);
    }
});

// All games
router.get('/allgames', authReq, async (req, res) => {
    try {
        const { loggedIn, user_id } = req.session;

        const allGames = await Games.findAll({
            include: [
                { model: Users, attributes: { exclude: ['password'] } }
            ],
            order: [
                ['gameDate', 'DESC']
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

        return res.render('allgames', { games, loggedIn: loggedIn });

    } catch (error) {
        return res.status(500).json(error);
    }
});

// game by id && players that played that day
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

        const { loggedIn, user_id } = req.session;
        const game = gameData.get({ plain: true });
        const { gameDate } = game;
        const gamePlayers = await Games.findAll({
            where: { gameDate: gameDate },
            include: [
                { model: Users, attributes: { exclude: ['password'] } }
            ]
        });

        let players = [];
        for (let i = 0; i < gamePlayers.length; i++) {
            const player = gamePlayers[i];

            if (player.id != game.id) {
                players.push(player.get({ plain: true }));
            }
        }

        res.render('game', { game, players, user_id, loggedIn: loggedIn });

    } catch (error) {
        return res.status(500).json(error);
    }
});

router.get('/players/:id', authReq, async (req, res) => {
    const user_id = req.params.id;
    try {

        const { loggedIn } = req.session;

        const userData = await Users.findByPk(user_id, {
            include: [
                { model: Games }
            ],
            attributes: {
                exclude: ['password'],
                include: sqlLiterals(user_id)
            }
        });

        const user = userData.get({ plain: true });

        const allGames = await Games.findAll({
            where: { user_id: user_id },
            include: [
                { model: Users, attributes: { exclude: ['password'] } }
            ],
            order: [
                ['gameDate', 'DESC']
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

        console.log("player route", user, games);

        return res.render('player', { user, games, loggedIn: loggedIn });

    } catch (error) {
        return res.status(500).json(error);
    }
});

router.get('/compare/:id', authReq, async (req, res) => {
    const player_id = req.params.id;
    try {

        const { loggedIn, user_id } = req.session;

        const userData = await Users.findByPk(user_id, {
            include: [
                { model: Games }
            ],
            attributes: {
                exclude: ['password'],
                include: sqlLiterals(user_id)
            }
        });

        const user = userData.get({ plain: true });

        const allUserGames = await Games.findAll({
            where: { user_id: user_id },
            include: [
                { model: Users, attributes: { exclude: ['password'] } }
            ]
        });

        let userGames = [];
        switch (true) {
            case (!allUserGames):
                return res.render('dashboard');
            default:
                for (let i = 0; i < allUserGames.length; i++) {
                    const eachGame = allUserGames[i];
                    userGames.push(eachGame.get({ plain: true }));
                }
        }

        const playerData = await Users.findByPk(player_id, {
            include: [
                { model: Games }
            ],
            attributes: {
                exclude: ['password'],
                include: sqlLiterals(player_id)
            }
        });

        const player = playerData.get({ plain: true });

        const allPlayerGames = await Games.findAll({
            where: { user_id: player_id },
            include: [
                { model: Users, attributes: { exclude: ['password'] } }
            ]
        });

        let playerGames = [];
        switch (true) {
            case (!allPlayerGames):
                return res.render('dashboard');
            default:
                for (let i = 0; i < allPlayerGames.length; i++) {
                    const eachGame = allPlayerGames[i];
                    playerGames.push(eachGame.get({ plain: true }));
                }
        }


        return res.render('compare', { user, userGames, player, playerGames, loggedIn: loggedIn });

    } catch (error) {
        return res.status(500).json(error);
    }
});

// Anyother routes to dashboard or logIn
router.get('*', (req, res) => {
    const { loggedIn } = req.session;
    switch (true) {
        case (!loggedIn):
            return res.render('login');
        default:
            return res.redirect('/dashboard');
    }
});

module.exports = router;